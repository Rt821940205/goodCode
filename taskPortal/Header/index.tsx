import SvgIcon from '@/components/svgIcon'
import React, {CSSProperties} from 'react'
import styles from './index.less';
import RightContent from '@/components/RightContent';
import {useHistory, useLocation} from 'umi';
import classNames from 'classnames';

export const LogoTitle: React.FC<{
  logo?: string,
  title?: string,
  onClick?:()=>void
}> = ({ logo,title, onClick }) => {

  return <div
    className={styles['logo-wrapper']}
    onClick={onClick}
   >
    {
      logo && <div className={styles.image}>
       <img src={logo} />
     </div>
    }
    {title && <div className={classNames(styles.title,{[styles['title-active']]: !!onClick })}>{title}</div>}
  </div>
}

export type MenuItemType = {
  label: string,
  icon?: string,
  path?: string,  //匹配路径
  exact?:boolean, //默认false,是否需要完全匹配路径菜单项才高亮
  redirect?: string,
  carryOldState?:boolean, //默认为false,跳转后是否携带跳转前的信息（如查询字符串）
  key?: string,  //不传则为index
  onClick?:(item?:MenuItemType)=>void
}

type MenuProps = {
  items: MenuItemType[],
  className?:string,
  style?:CSSProperties
}

export const Menu: React.FC<MenuProps> = ({ items, className, style}) => {
  const { pathname ,...rest} = useLocation()
  const history = useHistory()

  const onItemClick = ({ path, redirect ,carryOldState = false}: MenuItemType) => {
    const goPath = redirect || path
    if (goPath) {
      carryOldState  ? history.push({pathname:goPath,...rest}):history.push(goPath)
    }
  }

  return <div className={ className} style={style}>
  {
      items.map((item,idx) => {
        const {icon, label, path, exact = false,onClick } = item
        const key = item.key || idx
        const containPath: boolean = !!path && (exact ? path === pathname : pathname.indexOf(path) !== -1)

        return <div
          key={key}
          className={classNames(styles['menu-item'],{[styles['menu-item-active']]:containPath})}
          onClick={() => {
            onClick ? onClick(item) : onItemClick(item)
          }}>
          {icon && <SvgIcon iconClass={icon} />}
          <span>{ label }</span>
        </div>
    })
  }
</div>
}


const menuList: MenuItemType[] = [
  {
    label: '待办中心',
    icon: 'application',
    path: "/app/page/list/480707634148671488?appId=465467026043830272&pageId=480707634148671488",
  },
  {
    label: '任务核查',
    icon: 'upcoming',
    path: "/app/page/list/465476807232061440?appId=465467026043830272&pageId=465476807232061440&page=1",
  },
  {
    label: '任务模板',
    icon: "market",
    path:'/app/page/list/481046491025113088?appId=465467026043830272&pageId=481046491025113088&page=1'
  },
  {
    label: "基础配置",
    icon:"process"
  }
]

const Header: React.FC = () => {
  const history = useHistory()
  return (
    <div className={styles.wrapper}>
      <div className='flex'>
        <LogoTitle
          logo='/tz/taizhou-logo.png'
          title='警务协同'
          onClick={() => {
            history.push('/taskPortal')
          }}
        />
        <Menu items={menuList}/>
      </div>
      <RightContent></RightContent>
    </div>
  )
}

export default Header
