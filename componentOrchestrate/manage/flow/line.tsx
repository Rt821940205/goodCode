import React, { useState } from 'react'
import styles from './line.less';
import SvgIcon from '@/components/svgIcon'
import classNames from 'classnames'
import InsertNode from './insertNode';

export type LineProps = {
  nextNodeId: string | undefined | null,//线的下一个节点id
  parentNodeId:string | undefined | null,//线父节点id
  label?: string, //线文字
  arrow?: boolean, //是否有箭头
  showAdd: boolean,//是否展示添加功能
  bottomBtn?: boolean //添加按钮是否在底部
  height?: string,//线高
} 
const Line: React.FC<LineProps> = ({
  label,
  arrow = true,
  showAdd,
  bottomBtn = false,
  height,
  nextNodeId,
  parentNodeId,
}) => {
  const [nodeVisible, setNodeVisible] = useState<boolean>(false)
  const lineStyle = height ? { height } : {}
  const renderAddBtn = (cls: string) => {
    return  <SvgIcon
    iconClass='co-node-add'
    className={cls}
    onClick={()=>setNodeVisible(true)}
   />
  }
  
  const btnVisible = showAdd && !nodeVisible 

  return (
    <>
      <InsertNode
        nextNodeId={nextNodeId}
        parentNodeId={parentNodeId}
        visible={nodeVisible}
        onClose={() => setNodeVisible(false)}
        afterInsert={()=>setNodeVisible(false)}
      />
      
      <div className={styles['line-wrapper']}>
        <div
          className={classNames(styles.line, { [styles.arrow]: arrow })}
          style={ label && showAdd ? { height: '7.5rem' ,...lineStyle} : lineStyle}
        >
          {/* 线上标签 */}
          {label && <span className={styles.text}>{label}</span>}
          
          {/* 默认显示中间按钮 */}
          {btnVisible && !bottomBtn
            && renderAddBtn(classNames(styles['add-btn'], { [styles['add-btn-with-label']]: label?.length }))
          }

        </div>
      </div>
      {/* 底部固定按钮 */}
      { btnVisible &&  bottomBtn &&  renderAddBtn(styles['bottom-add-btn']) }
    </>
  )
}

export default Line