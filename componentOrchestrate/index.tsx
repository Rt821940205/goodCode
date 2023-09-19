//组件编排页
import React,{useEffect,memo} from 'react'
import styles from './index.less'
import { useDispatch, useLocation, useSelector } from 'umi';
import Menu  from './menu';
import Manage from './manage';
import Magic from './magic';
import { ConnectState } from '@/models/connect';
import { MenuType } from '@/@types/magic';
import { useDataVisible } from './hooks';

const MemoizedMagic = memo(() => {
  return <Magic />
})

const Index: React.FC = () => {
  const activeMenu:string = useSelector(({ magic: { activeMenu } }: ConnectState) => activeMenu )

  const dispatch = useDispatch()

  const location = useLocation()

  const { query: { appId, dataId, type = MenuType.COMPONENT_MANAGE} } = location
  
  const [magicVisible,workVisible ] = useDataVisible()
  
  useEffect(() => {
    let menuType = type 

    if (menuType === MenuType.PAGE_MANAGE) {
      if (magicVisible) {
        menuType = MenuType.MAGIC
      } else if (workVisible) {
        menuType = MenuType.WORKSHOP
      }
    }


    dispatch({
      type: 'magic/setActiveMenu',
      payload:menuType
    })
  }, [type])
  
  if (!appId) {
    return null
  }


  const contentMapper = {
    [MenuType.COMPONENT_MANAGE]: ()=> {
      if (!dataId) return null
      return <Manage/>
    },
    [MenuType.PAGE_MANAGE]:MemoizedMagic,
    [MenuType.MAGIC]: MemoizedMagic,
    [MenuType.WORKSHOP]: MemoizedMagic
  }
  const ContentPage = contentMapper[activeMenu]
  
  return (
    <div className={styles["orchestrate-layout"]}>
      <Menu
        activeId={activeMenu}
        onChange={({ link, id }) => { 
          if (link) return link(appId)
          dispatch({
            type: "magic/setActiveMenu",
            payload:id
          })
         
        }}
      />
      <ContentPage/> 
    </div>
  )
}
export default Index