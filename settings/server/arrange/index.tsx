import React from 'react'
import { KeepAlive, useParams } from 'umi'
import { ServerPath } from '@/pages/settings/path';
import Arrage from '@/pages/componentOrchestrate/manage/flow/index';
import styles from './index.less';
const Arrange: React.FC = () => {
  const params = useParams<{id:string}>()
  return (
    <KeepAlive name={`${ServerPath.ARRANGE}/${params.id}`} id={params.id}>
      <div className={styles.wrapper}>
        <Arrage/>
      </div>
   </KeepAlive>
  )
}

export default Arrange