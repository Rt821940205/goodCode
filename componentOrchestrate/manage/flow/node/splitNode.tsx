import React from 'react'
import NodeUi, { NodeUIProps } from './nodeUi'
import { Space } from 'antd';
import ConditionNode from './conditionNode'
import { NodeData, SplitNodeConfig } from '@/@types/orchestrate';
import Tag from '../component/tag';
type SplitNodeProps = {
  data: NodeData,
  error?: boolean,
  errorMsg?: string
} & NodeUIProps

const SplitNode: React.FC<SplitNodeProps> = ({ data, ...otherProps }) => {
  const { source } = (data.nodeConfig as SplitNodeConfig)?.properties || {}
  const { description } = (data.nodeConfig as SplitNodeConfig)


  console.debug('data.nodeConfig', data.nodeConfig);

  return (
    <ConditionNode data={data} type='split'>
      <NodeUi
        {...otherProps}
        icon="excute-square-split"
      >
        {
          source?.value ? (
            <div style={{ maxHeight: '9.6rem', overflowY: 'scroll' }}>
              <div className='text-black mb-2'>循环执行 </div><Tag>循环</Tag>
              {description}
            </div>
          ) :
            <Space>
              <span className='text-gray'>循环执行</span>
              <span>请配置要循环处理数据集</span>
            </Space>
        }
      </NodeUi>
    </ConditionNode>
  )
}

export default SplitNode