import React from 'react'
import { KeepAlive } from 'umi'
import styles from './index.less';

const Help: React.FC = () => {
  return (
    <KeepAlive name={`/settings/help`}>
      <div className='flex'>
        <div className={styles.content}>
          <div>帮助中心，敬请期待</div>
        </div>
      </div>
    </KeepAlive>
  )
}

export default Help