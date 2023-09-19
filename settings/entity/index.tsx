import React from 'react'
import { KeepAlive} from 'umi'
import TreeList from './treeList';
import styles from './index.less';
const Entity: React.FC = ({ children }) => {

  return (
    <KeepAlive name='/settings/entity'>
       <div className='flex'>
        <TreeList />
        <div className={styles.content}>
          { children }
        </div>
      </div>
   </KeepAlive>
  )
}

export default Entity