import React from 'react'
import { KeepAlive, useParams } from 'umi'
import EntityData from '@/pages/app/model/data/List';
import {EntityPath} from '@/pages/settings/path';
const EntityDetail: React.FC = () => {
  const params = useParams<{id:string}>()
  return (
    <KeepAlive name={`${EntityPath.DATA}/${params.id}`} id={params.id}>
      <div>
        <EntityData/>
      </div>
   </KeepAlive>
  )
}

export default EntityDetail