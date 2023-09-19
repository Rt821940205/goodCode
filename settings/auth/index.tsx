import React from 'react'
import { KeepAlive } from 'umi'
import styles from './index.less';

const Auth: React.FC = () => {
  return (
    <KeepAlive name={`/settings/auth`}>
      <div className='flex'>
        <div className={styles.content}>
          <div>开发者授权建设中...</div>
        </div>
      </div>
    </KeepAlive>
  )
}

export default Auth