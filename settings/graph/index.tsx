import React from 'react'
import { KeepAlive } from 'umi'
import GraphCanvas from './magic'
const Graph:React.FC = () => {
  return (
    <KeepAlive name={`/settings/graph`}>
      <div>
        <GraphCanvas/>
      </div>
    </KeepAlive>
  )
}

export default Graph