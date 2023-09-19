import React from 'react'
import { KeepAlive } from 'umi'
import {PagePath} from "@/pages/settings/path";
import styles from './index.less';

const PageBoard:React.FC = () => {
  return (
    <KeepAlive name={PagePath.BOARD}>
      <div className={styles.content}>
        请选择页面
      </div>
    </KeepAlive>
  )
}

export default PageBoard