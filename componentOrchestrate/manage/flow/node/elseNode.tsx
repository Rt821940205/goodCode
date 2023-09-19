

import React from 'react'
import NodeUi,{NodeUIProps} from './nodeUi'
import { Space } from 'antd';
import ConditionNode from './conditionNode'
import { NodeData } from '@/@types/orchestrate';
import Tag from '../component/tag'
type ElseNodeProps = {
  data: NodeData
} & NodeUIProps

const ElseNode: React.FC<ElseNodeProps> = ({ data, ...otherProps }) => {
  return (
    <ConditionNode data={data} type='else'>
      <NodeUi
          {...otherProps}
          icon="excute-square-if"
          iconStyle={{ fontSize: '2.75rem' }}
          style={{alignItems:'flex-start'}}
         >
          <Space className='mt-4'>
            <span className='text-gray'>执行分支</span>
            <span>配置触发后续流程的执行条件</span>
          </Space>

          <Space className='mt-4'>
            <Tag>否则</Tag><span>执行如下操作</span>
          </Space>
      </NodeUi>
    </ConditionNode>
  )
}

export default ElseNode