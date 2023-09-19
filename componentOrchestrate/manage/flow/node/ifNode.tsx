import React from 'react'
import NodeUi,{NodeUIProps} from './nodeUi'
import { Space} from 'antd';
import ConditionNode from './conditionNode'
import Tag from '../component/tag';
import { NodeData ,IfConditionItem} from '@/@types/orchestrate';

type IfNodeProps = {
  data: NodeData
} & NodeUIProps

const IfNode: React.FC<IfNodeProps> = ({ data, ...otherProps }) => {
  const conditionItems:IfConditionItem[][] = data?.nodeConfig?.properties?.if?.items || []
  return (
    <ConditionNode data={data} type='if'>
      <NodeUi
        {...otherProps}
        icon="excute-square-if"
      >
        {
          conditionItems.length ? (
            <div style={{maxHeight:'9.6rem',overflowY:'scroll'}}>
              <div className='text-black mb-2'>执行条件: </div>
              {
                conditionItems.map((conditions, idx1) => {
                 return conditions.map((item, idx2) => {
                   const { value, uiData ,query} = item
                   const varString = (query || []).map(i => i.key).join(',')
                   const condition = idx1 === 0 && idx2 === 0 ?'如果' :(idx2 === 0 ?'或者':"并且")
                   return <div className='mb-2' key={idx1 + idx2}>
                        <Tag>{condition}</Tag>
                        <span>{ varString}</span>
                        <span className='text-primary mx-2'>{uiData.operator.label }</span>
                        <span>{ value }</span>
                      </div>
                  })
                })
              }
             </div>
          ):  <Space>
          <span className='text-gray'>执行条件</span>
          <span>配置触发后续流程的执行条件</span>
        </Space>
        }
      </NodeUi>
    </ConditionNode>
  )
}

export default IfNode