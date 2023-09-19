import React from 'react'
import { KeepAlive, useParams } from 'umi'
import { ServerPath } from '@/pages/settings/path';
import ApiTest from '@/pages/component/app/ComponentList/apiTest';
const Test: React.FC = () => {
  const params = useParams<{id:string}>()
  return (
    <KeepAlive name={`${ServerPath.TEST}/${params.id}`} id={params.id}>
      <div>
        <ApiTest/>
      </div>
   </KeepAlive>
  )
}

export default Test