import React,{ useRef, useState} from 'react'
import styles from './nodeUi.less'
import SvgIcon from '@/components/svgIcon'
import { EllipsisOutlined } from '@ant-design/icons';
import { Badge, Popover,Avatar } from 'antd';
import classnames from 'classnames';
export type NodeUIProps = {
  style?: React.CSSProperties,//节点样式
  index: number | undefined, //节点序号
  indexStyle?: React.CSSProperties,//节点序号样式
  complete?: boolean, //节点是否已完成
  icon?: string | React.ReactNode, //节点图标
  src?: string | undefined | null, //图标地址
  iconStyle?: React.CSSProperties, //节点图标样式
  active?: Boolean //是否选中
  onClick?: () => void, //节点点击
} & Omit<MenuProps,'onClick'>

type MenuProps = {
  onClick?:(e:React.MouseEvent)=>void,
  onDelete?:(()=>void) | undefined//删除节点回调
}
const Menu: React.FC<MenuProps> = ({ onClick, onDelete }) => {
  return <section style={{ margin: '0 -0.6rem' }} onClick={onClick}>
    <div
      className={classnames(styles['menu-item'], { [styles['menu-item-disabled']]: !onDelete })}
      onClick={onDelete}
    >
      删除
    </div>
  </section>
}

const NodeUI: React.FC<NodeUIProps> = ({
  style = {},
  index = 0,
  indexStyle ={},
  complete = false,
  icon = 'default-node-choose',
  src,
  iconStyle = {},
  children,
  active = false,
  onDelete,
  onClick,
 
}) => {
  const [open, setOpen] = useState(false);
  
  const ref = useRef(null)
  icon = typeof icon === 'string' ?<SvgIcon iconClass={icon} style={{fontSize: '3rem',...iconStyle}} /> : icon
  return (
    <>
      <section
        ref={ref}
        className={classnames(styles["node-wrapper"], { [styles.active]: active })}
        style={style}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
          onClick?.()
        }}
      >
        {/* 序号 */}
        
        <div className={styles.index} style={indexStyle}>
          <Badge
            count={index}
            overflowCount={9999}
            style={{ backgroundColor: '#305CD0' }}
           >
            
          </Badge>
        </div>
        
        {/* 节点图标 */}
        <Avatar
          shape="square"
          size={48}
          icon={icon}
          style={{ width: '3rem', height: '3rem', lineHeight: '3rem', marginRight: '0.625rem', background:'transparent',...iconStyle }}
          src={src}
        />
        <div className={styles['node-content']}>
          {/* 节点右侧内容 */}
          <div style={{ color: '#666' }}>
            {children}
          </div>

           {/* 节点菜单*/}
          <Popover
            content={
              <Menu onClick={ 
                (e) => {
                  e.stopPropagation()
                  setOpen(false)
                }}
                onDelete={onDelete}
              />
            }
            trigger="click"
            placement='bottom'
            open={open}
            getPopupContainer={()=> ref.current!}
            onOpenChange={(newOpen:boolean)=>setOpen(newOpen)}
          >
            <EllipsisOutlined className={styles["operate-btn"]} onClick={(e) => {
              e.stopPropagation()
            }} />
          </Popover>
        </div>
        {complete && <SvgIcon iconClass='node-complete' className={styles.complete} />}
      </section>
    </>
  )
}

export default NodeUI