// 触发组件
import React from 'react'
import NodeUi, { NodeUIProps } from './nodeUi'
import { NodeData } from '@/@types/orchestrate';
type triggerNodeProps = {
  data:NodeData
} & NodeUIProps

const triggerNode: React.FC<triggerNodeProps> = ({ data, ...otherProps }) => {
  const { title, actionTitle, icon,configTitle } = data
  const actionChoose = <>
    { title ? <span className='text-gray'>请选择:</span> : <span className='text-gray mr-2'>和</span>}
    <span>触发行为</span>
  </>

  return (
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
    </NodeUi>
  )
}

export default triggerNode