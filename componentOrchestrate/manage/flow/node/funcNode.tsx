// 执行组件
import React from 'react'
import NodeUi, { NodeUIProps } from './nodeUi'
import { NodeData } from '@/@types/orchestrate';
import ContainerNode from './containerNode'
type FuncNodeProps = {
  data: NodeData
} & NodeUIProps

const FuncNode: React.FC<FuncNodeProps> = ({ data, ...otherProps }) => {
  const { title, actionTitle, icon, configTitle } = data
  const actionChoose = title ? <>
    <span className='text-gray'>请选择:</span><span>触发行为</span>
  </> :
    <>
      <span className='text-gray mr-2'>并</span><span>完成操作配置</span>
    </>
  return (

    <ContainerNode data={data}>
      <NodeUi
        {...otherProps}
        icon='default-node-choose'
        src={icon}
      >
        {
          title ? <h3>{title}</h3> : <><span className='text-gray mr-2'>请选择</span><span className='mr-2'>一个组件</span></>
        }
        {
          actionTitle ?
            <><b>触发: </b><span className='text-gray' title='actionTitle'>{actionTitle}</span><span className='pl-4 text-gray text-xs text-gray-300 italic'>{configTitle}</span></>
            : actionChoose
        }
      </NodeUi></ContainerNode>
  )
}

export default FuncNode