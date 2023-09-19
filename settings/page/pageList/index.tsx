// @ts-nocheck
import React, {ReactNode, useEffect, useRef, useState} from 'react'
import Container from '@/pages/settings/components/container';
import {Space, Tree} from 'antd';
import type {DirectoryTreeProps} from 'antd/es/tree';
import {AppstoreOutlined, EditOutlined, FileOutlined, PlusOutlined} from '@ant-design/icons'
import {useParams, useRouteMatch, useSelector} from 'umi';
import {MenuType} from '@/pages/settings/components/slideMenu';
import {useAppId, useLocalRoute} from '@/pages/settings/hooks';
import {getPage, queryALLNodes} from "@/services/xuanwu/magic";
import styles from './index.less';
import classNames from 'classnames';
import {PagePath} from "@/pages/settings/path";
import AddPage, {AddPageRefProps} from "@/pages/settings/graph/magic/canvas/addPage";
import RenamePage, {RenamePageRefProps} from "@/pages/settings/graph/magic/canvas/renamePage";
import {NodeType} from "@/@types/magic";
import {ConnectState} from "@/models/connect";

type TitleProps = {
  title: string,
  onAdd?:()=>void
}
const Title:React.FC<TitleProps>= ({ title,onAdd}) => { 
  return <div className='flex justify-between items-center py-1'>
    <span className="flex-1"><AppstoreOutlined className='mr-1' />{title}</span>
    <Space>
      <div onClick={(e)=>e.stopPropagation()}>
        <PlusOutlined onClick={onAdd}/>
      </div>
    </Space>
  </div>
}

type LeafTitleProps = {
  title: string,
  rightContent?:ReactNode
}
const LeafTitle:React.FC<LeafTitleProps>= ({ title ,rightContent}) => { 
  return <div className={classNames('flex justify-between items-center py-1',styles.leaf)}>
    <span className='flex-1'><FileOutlined className='mr-1' />{title}</span>
    <div className={styles.operate}>
      {
        rightContent
      }
    </div>
  </div>
}

type TreeDataItem = {
  title:ReactNode | string,
  key: string,
  parentKey?:string,
  path?: string,
  label?:string,
  children?:TreeDataItem[]
}

const mapState = (state:ConnectState) => {
  return {
    activeTabKey:state.settings.activeTabKey
  }
}

const PageTreeList: React.FC = () => {

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const [treeData, setTreeData] = useState<TreeDataItem[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const addPageRef = useRef<AddPageRefProps>(null)
  const renamePageRef = useRef<RenamePageRefProps>(null)
  const { activeTabKey } = useSelector(mapState)
  const match = useRouteMatch()
  const appId = useAppId()
  const { openRoute } = useLocalRoute()
  
  const initPages = async () => {
    const data = await queryALLNodes({ appId })

    const pageData: TreeDataItem[] = []
    data.modules.map((module: any) => {
      const moduleItem: TreeDataItem = {
        title: <Title title={module.module_name} onAdd={() => {onAddPage(module)}} />,
        key: module.id,
        label: '模块',
        path: ``,
        children: []
      }
      const modulePages = data.pages.filter(_ => _.module_id == module.id && _.node_type == 1)
      if(modulePages.length > 0) {
        moduleItem.children = modulePages.map(page => {
          const {id, page_name, module_id} = page
          const rightContent = <Space>
            <EditOutlined onClick={() => {onRenamePage(page)}}/>
          </Space>
          return {
            title: <LeafTitle title={page_name||''} rightContent={rightContent} />,
            label:`【页面】${page_name}`,
            key: `pageDetail-${id}:${module_id}`,
            parentKey: MenuType.PAGE,
            path: `${PagePath.DETAIL}/${id}?appId=${appId}&pageId=${id}`,
          }
        })
      }
      pageData.push(moduleItem)
    })
    return pageData
  }

  useEffect(() => {
    loadData(() => {
      activeTabKey && setExpandedKeys([activeTabKey.split(':')[1]])
    })
  },[])

  useEffect(() => {
    activeTabKey && setSelectedKeys([activeTabKey])
  }, [match])

  const loadData = (cb) => {
    initPages().then(pageData => {
      setTreeData(pageData)
      cb && cb()
    })
  }

  const onAddPage = (item: any) => {
    const { id } = item
    addPageRef.current?.init({ module_id: id, parent_id: '', node_type: NodeType.PAGE })
  }

  const onRenamePage = (item: any) => {
    const { page_name = '', id } = item
    renamePageRef?.current?.init({ id, page_name })
  }


  const onOk = async (pageId?: string) => {
    loadData(async () => {
      //获取页面信息并打开页面
      const response = await getPage({id: pageId})
      const item = response.find_sys_page_view[0]
      openRoute({
        label:`【页面】${item.page_name}`,
        key: `pageDetail-${item.id}:${item.module_id}`,
        parentKey: MenuType.PAGE,
        path: `${PagePath.DETAIL}/${item.id}?appId=${appId}&pageId=${item.id}`
      })
    })
  }

  const onNameChange = (value:string) => { 
    console.log('value :>> ', value);
  }

  const onSelect: DirectoryTreeProps<TreeDataItem>['onSelect'] = (keys, info) => {
    console.log('Trigger Select', keys, info);
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
      <Container title='页面列表' onChange={onNameChange} >
        <Tree
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          selectedKeys={selectedKeys}
          treeData={treeData}
          blockNode
          onExpand={onExpand}
          onSelect={onSelect}
        />
      </Container>
      <AddPage ref={addPageRef} onOk={onOk}/>
      <RenamePage ref={renamePageRef} onOk={onOk} />
    </>
   
  )
}

export default PageTreeList