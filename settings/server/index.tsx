//组件相关
import React from 'react'
import { KeepAlive} from 'umi'
import TreeList from './treeList';
import styles from './index.less';
const Server: React.FC = ({ children }) => {

  return (
    <KeepAlive name='/settings/server'>
       <div className='flex'>
        <TreeList />
        <div className={styles.content}>
          { children }
        </div>
      </div>
   </KeepAlive>
  )
}

export default Server