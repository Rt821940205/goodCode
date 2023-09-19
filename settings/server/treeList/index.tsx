
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import Container from '@/pages/settings/components/container';
import {Tree, Space, Tabs as AntTabs, Button} from 'antd';
import type {  DirectoryTreeProps} from 'antd/es/tree';
import {  PlusOutlined} from '@ant-design/icons'
import { useDispatch, useRouteMatch, useSelector,useAliveController } from 'umi';

import { MenuType } from '@/pages/settings/components/slideMenu';
import { useLocalRoute ,useAppId ,useCurrentValue} from '@/pages/settings/hooks';
import styles from './index.less';
import { ConnectState } from '@/models/connect';
import {queryCreateComponent ,type CreateComponentItem} from "@/services/xuanwu/server";
import {ServerPath} from "@/pages/settings/path";
import AddComponent, { AddComponentRefProps } from './addComponent';
import LeafNode from '@/pages/settings/components/leafNode';
import ApplyList from './applyList';
import { TabListItem } from '@/@types/settings';

type TreeDataItem = {
  title:ReactNode | string,
  key: string,
  parentKey?:string,
  path?: string,
  label?:string,
  isLeaf?:boolean,
  children?:TreeDataItem[]
}

const ARRANGE_ID_PREFIX = 'serverArrage'
const mapState = (state:ConnectState) => {
  return {
    tabList:state.settings.tabList,
    activeTabKey:state.settings.activeTabKey
  }
}
const ServerTreeList: React.FC = () => {

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const [createTreeData, setCreateTreeData] = useState<TreeDataItem[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const addComponentRef = useRef<AddComponentRefProps>(null)

  const { activeTabKey ,tabList}:{tabList:TabListItem[],activeTabKey:string} = useSelector(mapState)
  const match = useRouteMatch()
  const appId = useAppId()
  const { openRoute } = useLocalRoute()
  const dispatch = useDispatch()

  const tabListRef = useCurrentValue<TabListItem[]>(tabList)
  const { drop } = useAliveController()
  
  
  const onArrage = (e: React.MouseEvent, item: CreateComponentItem ) => { 
    const { title, id } = item
    e.stopPropagation()

    //如果打开过 则先删除
    const tabList = tabListRef.current || []
    const targetIndex = tabList.findIndex((i) => (i.key + "").indexOf(ARRANGE_ID_PREFIX) !== -1)
    if (targetIndex >= 0) {
      const path = tabList[targetIndex].path
      const pathname = path.slice(0, path.indexOf('?'))
      const newTabList = tabList.filter((i) =>(i.key + "").indexOf(ARRANGE_ID_PREFIX) === -1)
      dispatch({
        type: "settings/setTabList",
        payload:newTabList
      })
      drop(pathname)
    }
    
    openRoute({
      key:`${ARRANGE_ID_PREFIX}-${id}`,
      path: `${ServerPath.ARRANGE}/${id}?appId=${appId}&dataId=${id}`,
      label:`【组件编排】${title}`,
      parentKey:MenuType.SERVER
    })


  }

  const onTest = (e: React.MouseEvent, item: CreateComponentItem ) => { 
    const { title, id ,component_id} = item
    e.stopPropagation()

    openRoute({
      key:`serverTest-${id}`,
      path: `${ServerPath.TEST}/${id}?appId=${appId}&componentId=${component_id}`,
      label:`【组件测试】${title}`,
      parentKey:MenuType.SERVER
    })
  }


  const render = async () => { 
    const res = await queryCreateComponent({ appId })
    const treeData = res.data.map((item) => {
      const { id, title ,meta_def_id} = item
      const rightContent = <Space>
        <span>文档</span>
        <span onClick={(e)=>onArrage(e,item)}>编排</span>
        <span onClick={(e)=>onTest(e,item)}>测试</span>
      </Space>
      return {
        title: <LeafNode title={title} rightContent={rightContent}/>,
        key: `serverDetail-${id}`,
        parentKey: MenuType.SERVER,
        label:`【组件文档】${title}`,
        path: `${ServerPath.DETAIL}/${id}?appId=${appId}&componentId=${meta_def_id}`,
        isLeaf: true
      }
    })
    setCreateTreeData(treeData)
  }
  
  useEffect(() => {
    render()
  },[])
 

  useEffect(() => {
    activeTabKey && setSelectedKeys([activeTabKey])
  }, [match])
  
  const onNameChange = (value:string) => { 
    console.log('value :>> ', value);
  }

  const onSelect: DirectoryTreeProps<TreeDataItem>['onSelect'] = (keys, info) => {
    const { key, path = '', label = '', parentKey } = info.node
    setSelectedKeys(keys)
    openRoute({key,path,label,parentKey})
  };
 
  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };



  return (
    <>
      <Container title='组件列表' onChange={onNameChange} >
        <AntTabs defaultActiveKey="1" className={styles.tabs}>
          <AntTabs.TabPane tab="我创建的" key="1">
            <Button
              className={styles.addButton}
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => {
                addComponentRef.current?.init()
              }}>
              创建组件
            </Button>
            <Tree
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              selectedKeys={selectedKeys}
              treeData={createTreeData}
              blockNode
              onExpand={onExpand}
              onSelect={onSelect}
            />
          </AntTabs.TabPane>
          <AntTabs.TabPane tab="我申请的" key="2">
            <ApplyList/>
          </AntTabs.TabPane>
        </AntTabs>
      </Container>
      <AddComponent ref={addComponentRef} onOk={render}/>
    </>
   
  )
}

export default ServerTreeList