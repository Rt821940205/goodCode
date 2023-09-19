import React from 'react'
import { KeepAlive, useParams } from 'umi'
import EntityInfo from '@/pages/app/entityMange/entityInfo';
import {EntityPath} from '@/pages/settings/path';
const EntityDetail: React.FC = () => {
  const params = useParams<{id:string}>()
  return (
    <KeepAlive name={`${EntityPath.DETAIL}/${params.id}`} id={params.id}>
       <EntityInfo/>
    </KeepAlive>
  )
}

export default EntityDetail