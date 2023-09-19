import React, { useEffect } from 'react'
import styles from './index.less';
import classnames from 'classnames';
import SvgIcon from '@/components/svgIcon'
import {TabListItem} from '@/@types/settings';
import { useDispatch, useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
import { useAppId, useLocalRoute } from '../../hooks';
import {EntityPath, PagePath, FlowPath, ServerPath} from '../../path';



export type MenuItem = {
  name: string,
  label: string,
  key: string,
  icon: string,
  path:string,
  link?:(appId:string | string[] | null)=>void //跳转的链接
}

export enum MenuType {
  GRAPH = 'graph',
  ENTITY = 'entity',
  PAGE = 'page',
  FLOW = 'flow',
  SERVER = 'server',
  AUTH = 'auth',
  CONFIG = 'config',
  HELP = 'help'
}

const topMenus: MenuItem[] = [
  {
    name: '蓝图',
    label: '应用蓝图',
    key:MenuType.GRAPH,
    path:'/settings/graph',
    icon: "graph",
  },
  {
    name: '页面',
    label: '页面设计',
    key: MenuType.PAGE,
    path: PagePath.BOARD,
    icon: "page",
  },
  {
    name: '实体',
    label: '实体管理',
    key: MenuType.ENTITY,
    path:EntityPath.RELATION,
    icon: "entity",
  },
  {
    name: '流程',
    label: '流程设计',
    key: MenuType.FLOW,
    icon: "flow",
    path: FlowPath.BOARD
  },
  {
    name: '组件',
    label: '服务组件',
    key: MenuType.SERVER,
    icon: "server",
    path: ServerPath.TIP
  }
]

const bottomMenus: MenuItem[] = [
  {
    name: '权限',
    label: '权限分配',
    key: MenuType.AUTH,
    icon: "auth",
    path:'/settings/auth'
  },
  {
    name: '设置',
    label: '应用设置',
    key: MenuType.CONFIG,
    icon: "config",
    path:'/settings/config'
  },
  {
    name: '帮助',
    label: '帮助中心',
    key: MenuType.HELP,
    icon: "help",
    path:'/settings/help'
  }
]

const mapState = (state: ConnectState) => {
  return {
    activeTabKey: state.settings.activeTabKey,
    tabList: state.settings.tabList,
    menuSpread:state.settings.menuSpread
  }
}

const SlideMenu: React.FC = () => {
  const { activeTabKey, tabList, menuSpread }: { tabList: TabListItem[], activeTabKey: string, menuSpread: boolean } = useSelector(mapState)
  const dispatch = useDispatch()
  const { openRoute } = useLocalRoute()
  const appId = useAppId()

  const activeParentKey = (tabList.find((i) => i.key === activeTabKey) || {}).parentKey

  const onMenuChange = (item:MenuItem) => { 
    if (!item.path) return
    const { key, path, label } = item
    openRoute({
      key,
      label,
      path:`${path}?appId=${appId}`
    })
  }

  const getMenuList = (menuList:MenuItem[]) => {
    return menuList.map((item: MenuItem) => {
         const {key ,icon,name} = item
         return <section
          className={
            classnames(
              styles['menu-list-item'],
              { [styles['menu-list-item-active']]: [activeTabKey,activeParentKey].includes(key)}
            )
          }
          key={key}
          onClick={() => {
            onMenuChange(item)
          }}>
          <SvgIcon iconClass={icon} className={styles['menu-list-item-icon']} />
          <span>{name}</span>
        </section>
    })
  }
  
  useEffect(() => {
    const first = topMenus[0]
    if (!first.path) return
    onMenuChange(first)
  }, [])
  
  return (
    <div className={styles['menu-list-wrapper']}>
      <section className={styles['menu-list-inner']}>
        {
          getMenuList(topMenus)
        }
      </section>
      <section className={styles['menu-list-inner']}>
        {
           getMenuList(bottomMenus)
        }
      </section>
      <div
        className={styles['menu-spread-btn-wrapper']}
        onClick={() => {
          dispatch({type:"settings/setMenuSpread",payload:!menuSpread})
        }}>
        <SvgIcon  iconClass={menuSpread ? 'menu-fold' : 'menu-spread'} className={styles['menu-spread-btn']}/>
      </div>
    </div>
  )
}

export default SlideMenu