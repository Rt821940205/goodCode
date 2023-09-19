import SvgIcon from '@/components/svgIcon'
import React, { CSSProperties, ReactNode, useState } from 'react'
import styles from './index.less';
import classnames from 'classnames';
import { Tooltip} from 'antd';
import type { NodeUiType } from '@/@types/magic';

export type NodeProps = {
  id:string,
  type: NodeUiType,
  name?:string,
  hide?: boolean, // 闭眼样式
  count?: number, //个数大于0才有展开或收缩的操作
  open?: boolean, 
  style?: CSSProperties,
  className?: string,
  active?:boolean,
  renderContextMenu?:()=>ReactNode,
  onClick?:()=>void,
  onAdd?: () => void,
  onOpenChange?: (open: boolean) => void,
  onContextMenu?: () => void,
  onDoubleClick?:()=>void
}

const StylesMappers: Record<NodeUiType, CSSProperties> = {
  'app': {
    background: "rgba(48, 92, 208, 0.2)",
    border: "1px solid #305CD0",
    borderRadius:'10px'
  },
  'module': {
    background: 'rgba(108, 46, 124, 0.2)',
    border: '1px solid #6C2E7C',
    borderRadius:'10px'
  },
  'page': {
    background: 'rgba(255, 158, 24, 0.2)',
    border: '1px solid #FF9E18',
  },
  'flow': {
    background: 'rgba(24, 200, 255, 0.2)',
    border: '1px solid #1FAFDC',
  }
}

const Node: React.FC<NodeProps> = ({
  type,
  id,
  name,
  hide = false,
  open = false,
  style,
  className,
  count = 0,
  active = false, //高亮
  renderContextMenu,
  onClick,
  onDoubleClick,
  onAdd,
  onOpenChange,
  onContextMenu
}) => {
  
  const [contextMenuVisible, setContextMenuVisible] = useState(false)

  return (
    <div
      id={id}
      className={classnames(styles.node,className)}
      style={style}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setContextMenuVisible(true)
        onContextMenu?.()
      }}
      onMouseLeave={() => {
        setContextMenuVisible(false)
      }}
      onDoubleClick={onDoubleClick}
    >

      <section className='flex items-center'>
      
        <div
          className={classnames(styles.square, { [styles.hide]: hide }, {[styles.active]:active})}
          style={StylesMappers[type]}>
            <SvgIcon iconClass={`canvas-node-${type}`} className={styles.icon}></SvgIcon>
            {
              hide
              &&
              <div className={styles['hide-eye-wrapper']}>
              <SvgIcon iconClass='canvas-node-eye' className={styles['hide-eye-icon']}></SvgIcon>
              </div>
          }
          <SvgIcon iconClass='canvas-node-add' className={styles.add} onClick={onAdd}></SvgIcon>

          {/* 左键菜单 */}
          {
            renderContextMenu && contextMenuVisible && <div className={styles.contextmenu}>
              {renderContextMenu()}
           </div>
          }
         

        </div>


        {/* 收缩展开样式 */}
        {
          count > 0
            &&
          <div className={styles['open-operate']}>
              <div className={styles.line}></div>
              {
                
                open ?
                    <SvgIcon
                      iconClass='canvas-node-minus'
                      className={styles.minus}
                      onClick={() => onOpenChange?.(!open)}>
                    </SvgIcon>
                    : <div
                      className={styles.count}
                      onClick={() => onOpenChange?.(!open)}
                    >
                      {count}
                    </div>
              }
          </div>
        }
      </section>

      <Tooltip placement="bottom" title={name}  getPopupContainer={(triggleNode)=>triggleNode}>
          <div className={classnames(styles.name, { [styles.hide]: hide })}>
              <span className='overflow-line-2'>{ name }</span>
          </div>
      </Tooltip>

  
     </div>
  )
}

export default Node