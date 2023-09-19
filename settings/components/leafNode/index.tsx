
import React from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { FileOutlined} from '@ant-design/icons'
type LeafNodeProps = {
  title: string,
  rightContent?:React.ReactNode
}
const LeafNode:React.FC<LeafNodeProps>= ({ title ,rightContent}) => { 
  return <div className={classNames('flex justify-between items-center py-1',styles.leaf)}>
    <span className='flex-1'><FileOutlined className='mr-1' />{title}</span>
    <div className={styles.operate}>
      {
        rightContent
      }
    </div>
  </div>
}

export default LeafNode