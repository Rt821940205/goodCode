import React from 'react'
import NodeUi, { NodeUIProps } from './nodeUi'
import {Space,Tooltip} from 'antd';
import { NodeData ,EndNodeConfig} from '@/@types/orchestrate';
import Tag from '../component/tag';

type EndNodeProps = {
  data:NodeData,
  error?: boolean,
  errorMsg?:string
} & NodeUIProps

const EndNode: React.FC<EndNodeProps> = ({ data, ...otherProps }) => {
  const { status, message } = (data.nodeConfig as EndNodeConfig) ?.properties || {}
  const isError = status?.value === 'fail'
  const isSuccess = status?.value === 'success'
  const errorMsg = message?.value
  return (
    <div style={{ paddingBottom: '1.25rem' }}>
      <NodeUi
        {...otherProps}
        icon="excute-square-stop"
        iconStyle={{ fontSize: '2.75rem' }}
        style={{alignItems:'flex-start'}}
      >
        <div className='mt-4'>
          <span className='text-gray  mr-4'>执行终止</span><Tag>{isError ? '失败':'成功'}</Tag>
        </div>
        {
          isError &&
          <Space className='mt-4'>
              <span className='text-danger white-space-nowrap'>流程失败,</span>
              <Tooltip placement='top' title={errorMsg}>
                <span className='overflow-line-1'>失败原因: { errorMsg || '暂无'}</span>
              </Tooltip>
          </Space> 
        }

        {isSuccess && <div className=' text-primary mt-4'>流程终止</div>}
     
        </NodeUi>
    </div>
  )
}

export default EndNode