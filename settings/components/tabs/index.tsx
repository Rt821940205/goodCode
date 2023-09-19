import React, { useRef } from 'react'
import { Tabs  as AntdTabs,Button ,type TabsProps} from 'antd';
import { useAliveController, useDispatch, useHistory, useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
import type { TabListItem } from '@/@types/settings';
import styles from './index.less';
import { useAppId } from '@/pages/settings/hooks';
import PublishModal, { type PublishModalRefProps } from './publishModal';
import {EyeOutlined, ThunderboltOutlined} from "@ant-design/icons";
type TargetKey = React.MouseEvent | React.KeyboardEvent | string
type SelectorProps = {
  tabList: TabListItem[],
  activeTabKey:string
}
const mapState = (state: ConnectState):SelectorProps => {
  return {
    tabList: state.settings.tabList,
    activeTabKey:state.settings.activeTabKey
  }
}


const Tabs: React.FC = () => {
  const { tabList, activeTabKey }:SelectorProps = useSelector(mapState)
  const history = useHistory()
  const dispatch = useDispatch()
  const appId = useAppId()
  const publishModalRef = useRef<PublishModalRefProps>(null)
  const { drop } = useAliveController()

  const tabs : TabsProps['items']= tabList.map((i) => {
    return {
      key: i.key + '',
      label:i.label,
      closable:tabList.length > 1
    }
  })

  const onChange = (activeKey:string) => { 
    if (activeKey && activeKey !== activeTabKey) {
      dispatch({
        type: 'settings/setActiveTabKey',
        payload:activeKey
      })
      const path = (tabList.find((i) => i.key === activeKey) || {}).path
      path && history.push(path)
    }
  }

  const onPreview = () => { 
    window.open(`/app/page/list?appId=${appId}`)
  }

  const onPublish = () => { 
    publishModalRef.current?.init()
  }

  const goOldVersion = () => {
    window.location.href = `/componentOrchestrate?ntype=page&appId=${appId}&type=page-manage`
  }

  const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
    if (action === 'remove') {
      const targetIndex = tabList.findIndex((i) => i.key === targetKey)
      const path = tabList[targetIndex].path
      const pathname = path.slice(0, path.indexOf('?'))
      const newTabList = tabList.filter((i) => i.key !== targetKey)
      if (newTabList.length && targetKey === activeTabKey) {
        const activeTab = newTabList[Math.max(targetIndex-1,0)]
        dispatch({
          type: 'settings/setActiveTabKey',
          payload:activeTab.key
        })
        history.push(activeTab.path)
      }
      dispatch({
        type: "settings/setTabList",
        payload:newTabList
      })
      drop(pathname)
    }
  };

  const operations =  <div className="my-2">
    <Button type='link' onClick={goOldVersion}>返回旧版</Button>
    <Button
      className='rounded mr-5'
      icon={<EyeOutlined />}
      onClick={onPreview}>
      应用预览
    </Button>
    <Button className='rounded mr-5' icon={<ThunderboltOutlined />} onClick={onPublish}>应用发布</Button>
  </div>

  return (
    <>
      <div className={styles.wrapper}>
        <AntdTabs
          hideAdd
          type="editable-card"
          activeKey={activeTabKey}
          items={tabs}
          tabBarExtraContent={operations}
          tabBarStyle={{ marginBottom: '1px' }}
          onChange={onChange}
          onEdit={onEdit}
        />
      </div>
      <PublishModal ref={publishModalRef} />
    </>
   
  )
}

export default Tabs