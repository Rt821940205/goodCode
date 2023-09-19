import React from 'react'
import { KeepAlive } from 'umi'
import {FlowPath} from "@/pages/settings/path";
import styles from './index.less';
const FlowBoard:React.FC = () => {
  return (
    <KeepAlive name={FlowPath.BOARD}>
      <div className={styles.content}>
        请选择流程
      </div>
    </KeepAlive>
  )
}

export default FlowBoard