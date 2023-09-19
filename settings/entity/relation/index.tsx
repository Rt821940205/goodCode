import React from 'react'
import { KeepAlive } from 'umi'
import { EntityPath } from '@/pages/settings/path';
import styles from './index.less';
const EntityDetail: React.FC = () => {
  return (
    <KeepAlive name={EntityPath.RELATION}>
      <div className={styles.relation}>
        <div className={styles.block} style={{background:'#d6e8d4'}}>
          <h4 className={styles['block-title']}>测试实体</h4>
          <div className={styles['block-fields']}>
            <p>ID:init</p>
            <p>产品名称:varchar(255)</p>
            <p>生产地址:varchar(255)</p>
          </div>
        </div>
      </div>
   </KeepAlive>
  )
}

export default EntityDetail