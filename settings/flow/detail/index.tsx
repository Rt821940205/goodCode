import React from 'react'
import { KeepAlive, useParams } from 'umi'
import {FlowPath} from "@/pages/settings/path";
import FlowDesigner from "@/pages/flow/manage/Designer";
const FlowDetail: React.FC = () => {
  const params = useParams<{id:string, appId: string}>()
  return (
    <KeepAlive name={`${FlowPath.DETAIL}/${params.id}`} id={params.id}>
       <FlowDesigner></FlowDesigner>
    </KeepAlive>
  )
}

export default FlowDetail