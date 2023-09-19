import React from 'react'
import { KeepAlive } from 'umi'
import styles from './index.less';
import BaseSetting from "./base";

const Config: React.FC = () => {
  return (
    <KeepAlive name={`/settings/config`}>
      <div className='flex'>
        <div className={styles.content}>
          <BaseSetting/>
        </div>
      </div>
    </KeepAlive>
  )
}

export default Config