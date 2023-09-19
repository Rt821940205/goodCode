import React from 'react'
import { KeepAlive, useParams, MicroApp } from 'umi'
import {PagePath} from "@/pages/settings/path";
import styles from './index.less';

const PageDetail: React.FC = () => {
  const params = useParams<{id:string, appId: string}>()
  return (
    <KeepAlive name={`${PagePath.DETAIL}/${params.id}`} id={params.id}>
      <div className={styles.content}>
        <MicroApp name="page-designer" autoSetLoading></MicroApp>
      </div>
    </KeepAlive>
  )
}

export default PageDetail