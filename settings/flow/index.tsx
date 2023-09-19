import React from 'react'
import { KeepAlive } from 'umi'
import FlowList from "@/pages/settings/flow/flowList";
import styles from "@/pages/settings/flow/index.less";
const Flow:React.FC = ( { children }) => {
  return (
    <KeepAlive name={`/settings/flow`}>
      <div className='flex'>
        <FlowList />
        <div className={styles.content}>
          { children }
        </div>
      </div>
    </KeepAlive>
  )
}

export default Flow