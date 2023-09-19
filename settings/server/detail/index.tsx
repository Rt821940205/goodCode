import React from 'react'
import { KeepAlive, useParams } from 'umi'
import {ServerPath} from '@/pages/settings/path';
import ComponentSetting from "@/pages/component/Setting/index2";
const Detail: React.FC = () => {
  const params = useParams<{id:string}>()
  return (
    <KeepAlive name={`${ServerPath.DETAIL}/${params.id}`} id={params.id}>
      <ComponentSetting></ComponentSetting>
   </KeepAlive>
  )
}

export default Detail