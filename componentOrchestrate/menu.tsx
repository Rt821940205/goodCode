import React, { useEffect, useState } from 'react'
import styles from './menu.less';
import classnames from 'classnames';
import SvgIcon from '@/components/svgIcon'
import { MenuType } from '@/@types/magic';
import { useDispatch, useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useDataVisible } from './hooks';
export type MenuItem = {
  name: string,
  id: string,
  icon: string,
  link?:(appId:string | string[] | null)=>void //跳转的链接
}
type Props = {
  activeId:string,
  onChange?:(item:MenuItem)=>void
}

const staticMenus: MenuItem[] = [
  // {
  //   name: '数据魔方',
  //   id: 'magic',
  //   icon: "menu-cp-magic",
  //   link: (appId) => {
  //     window.open(`/component-process-designer/canvasIndex?ntype=page&appId=${appId}`)
  //   }
  // },
  // {
  //   name: '数据工坊',
  //   id: 'factory',
  //   icon: "menu-cp-factory",
  //   link: (appId) => {
  //     window.open(`/component-process-designer/canvasIndex?ntype=page&tabIndex=1&appId=${appId}`)
  //   }
  // },
  {
    name: '实体管理',
    id: MenuType.ENTITY,
    icon: "menu-cp-entity",
    link: (appId) => {
      window.open( `/app/entityMange/entityMange?appId=${appId}`)
    }
  },
  {
    name: '应用设置',
    id: MenuType.SETTING,
    icon: "menu-cp-setting",
    link: (appId) => {
      window.open( `/app/manage/setting?appId=${appId}`)
    }
  },
  {
    name: '组件管理',
    id: MenuType.COMPONENT_MANAGE,
    icon: "menu-cp-manage",
    link: (appId) => {
      window.open( `/component/app/ComponentList?appId=${appId}`)
    }
  }
]
const Menu: React.FC<Props> = ({ activeId, onChange }) => {

  const [magicVisible,workVisible] = useDataVisible()
 
  const spread = useSelector(({ magic: { menuSpread } }: ConnectState) => menuSpread)

  const moduleMenuVisible = useSelector(({ magic: { moduleMenuVisible } }: ConnectState) => moduleMenuVisible)

  const activeMenu = useSelector(({ magic: { activeMenu } }: ConnectState) => activeMenu)
  
  const dispatch = useDispatch()

  const [menuList, setMenuList] = useState<MenuItem[]>([])

  useEffect(() => {
    let dymicMenus: MenuItem[] = []
    if (!magicVisible && !workVisible) {
      setMenuList([{ name: '页面管理', id: 'page-manage', icon: "menu-cp-magic" }, ...staticMenus])
      return
    } 

    if (magicVisible) {
      dymicMenus.push({
          name: '数据魔方',
          id: MenuType.MAGIC,
          icon: "menu-cp-magic"
      })
    }
    if (workVisible) {
      dymicMenus.push(  {
        name: '数据工坊',
        id: MenuType.WORKSHOP,
        icon: "menu-cp-factory",
      })
    }
    setMenuList([...dymicMenus, ...staticMenus])
  
  },[])

  return (
    <div className={styles['menu-list-wrapper']}>
      <section className={styles['menu-list-inner']}>
        {
          menuList.map((item: MenuItem) => {
            const {id ,icon,name} = item
            return <section
              className={classnames(styles['menu-list-item'], { [styles['menu-list-item-active']]: activeId && activeId === id })}
              key={id}
              onClick={() => {
                onChange?.({...item})
              }}>
              <SvgIcon iconClass={icon} className={styles['menu-list-item-icon']} />
              <span>{name}</span>
            </section>
          })
        }
      </section>

      <div className={styles.operate}>
        {
          [MenuType.MAGIC,MenuType.WORKSHOP,MenuType.PAGE_MANAGE].includes(activeMenu) &&  <div className={styles['operate-item']}
            onClick={() => {
              dispatch({
                type: "magic/setModuleMenuVisible",
                payload:!moduleMenuVisible
              })
            }}>
            {moduleMenuVisible ? <MenuFoldOutlined /> :<MenuUnfoldOutlined />}
            <div>模块菜单</div>
          </div>
        }
        {
          activeMenu !== MenuType.PAGE_MANAGE
          &&
        <SvgIcon
          iconClass={spread ? 'menu-fold' : 'menu-spread'}
          className={styles['menu-spread-btn']}
          onClick={() => {
            dispatch({
              type: "magic/setMenuSpread",
              payload:!spread
            })
          }}
          />
        }
      </div>
    </div>
  )
}

export default Menu