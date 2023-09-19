import React from 'react'
import Line from '../line'
import styles from './conditionNode.less'
import { NodeData } from '@/@types/orchestrate';
import { SubNodes } from '../index'
type ConditionNodeProps = {
  data: NodeData
  type: 'if' | 'else' | 'split'
}


const ConditionNode: React.FC<ConditionNodeProps> = ({ data, type, children }) => {

  const { nodeId } = data
  const childNodes = data.children || []
  const isEnd = childNodes[childNodes.length - 1]?.nodeType === 'end'



  return (

    <div className={styles['condition-node-wrapper']}>
      {children}

      <div className={styles['condition-line-wrapper']}>
        {type === 'if' && <span className={styles['condition-left-label']}>不满足</span>}
        <div className={styles['condition-line-top']}>
          {type === 'if' && <span className={styles['condition-top-label']}>满足</span>}
        </div>
        <div className={styles['condition-line-top']}>
          {(type === 'split') && <span className={styles['condition-top-label']}>轮循</span>}
        </div>

        <div className={styles['condition-line-tr-content']}>
          {/* 递归渲染 */}
          {childNodes.length ? <>
            <Line showAdd={true} nextNodeId={childNodes[0].nodeId} parentNodeId={nodeId} />
            <SubNodes data={childNodes} parentNodeId={nodeId} />
          </> : null}


          {!isEnd && <Line showAdd={true} arrow={false} height='2rem' parentNodeId={nodeId} nextNodeId={undefined} />}
        </div>
        {!isEnd && <div className={styles['condition-line-bottom']}></div>}
      </div>
    </div>
  )
}

export default ConditionNode