import React from 'react'
import Line from '../line'
import styles from './conditionNode.less'
import { NodeData } from '@/@types/orchestrate';
import { SubNodes } from '../index'
type ContainerNodeProps = {
  data: NodeData
}


const ContainerNode: React.FC<ContainerNodeProps> = ({ data, children }) => {

  const { nodeId } = data
  const childNodes = data.children || []

  console.debug('节点数据data', data)

  return (
    <div className={styles['condition-node-wrapper']}>
      {children}


      {

        data.containerName ?

          <div className={styles['condition-line-wrapper']}>
            <div className={styles['condition-line-top']}>
              {<span className={styles['condition-top-label']}>{data.containerName}</span>}
            </div>
            <div className={styles['condition-line-tr-content']}>
              {childNodes.length ? <>
                <Line showAdd={true} nextNodeId={childNodes[0].nodeId} parentNodeId={nodeId} />
                <SubNodes data={childNodes} parentNodeId={nodeId} />
              </> : null}
              <Line showAdd={true} arrow={false} height='2rem' parentNodeId={nodeId} nextNodeId={undefined} />
            </div>
            <div className={styles['condition-line-bottom']}></div>
          </div> :
          <> </>

      }

    </div>
  )
}

export default ContainerNode