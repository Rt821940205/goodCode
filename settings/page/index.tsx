import React from 'react'
import { KeepAlive } from 'umi'
import PageList from "@/pages/settings/page/pageList";
import styles from './index.less';
const Page:React.FC = ({ children }) => {
  return (
    <KeepAlive name={`/settings/page`}>
      <div className='flex'>
        <PageList />
        <div className={styles.content}>
          { children }
        </div>
      </div>
    </KeepAlive>
  )
}

export default Page