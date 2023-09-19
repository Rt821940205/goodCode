// @ts-nocheck
import React, {ReactNode, useEffect, useRef, useState} from 'react'
import Container from '@/pages/settings/components/container';
import {Space, Tree} from 'antd';
import type {DirectoryTreeProps} from 'antd/es/tree';
import {AppstoreOutlined, BranchesOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'
import {useParams} from 'umi';
import {MenuType} from '@/pages/settings/components/slideMenu';
import {useAppId, useLocalRoute} from '@/pages/settings/hooks';
import {queryALLNodes, queryFlowId} from "@/services/xuanwu/magic";
import styles from './index.less';
import classNames from 'classnames';
import {FlowPath, PagePath} from "@/pages/settings/path";
import AddPage, {AddPageRefProps} from "@/pages/settings/graph/magic/canvas/addPage";
import RenamePage, {RenamePageRefProps} from "@/pages/settings/graph/magic/canvas/renamePage";
import {NodeType} from "@/@types/magic";

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
    <span className='flex-1'><BranchesOutlined className='mr-1' />{title}</span>
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
  nodeType?:number,
  children?:TreeDataItem[]
}

const FlowTreeList: React.FC = () => {

  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [treeData, setTreeData] = useState<TreeDataItem[]>([])
  const addPageRef = useRef<AddPageRefProps>(null)
  const renamePageRef = useRef<RenamePageRefProps>(null)
  const params = useParams<{ id: string }>()
  const appId = useAppId()
  const { openRoute } = useLocalRoute()
  
  const initPages = async () => {
    const data = await queryALLNodes({ appId })
    const flowData: TreeDataItem[] = []
    data.modules.map((module: any) => {
      const moduleItem: TreeDataItem = {
        title: <Title title={module.module_name} onAdd={() => {onAddPage(module)}} />,
        key: module.id,
        label: '模块',
        path: ``,
        nodeType: 0,
        children: []
      }
      const modulePages = data.pages.filter(_ => _.module_id == module.id && _.node_type == 2)
      if(modulePages.length > 0) {
        moduleItem.children = modulePages.map(page => {
          const {id, page_name} = page
          const rightContent = <Space>
            <EditOutlined onClick={() => {onRenamePage(page)}} />
          </Space>
          return {
            title: <LeafTitle title={page_name||''} rightContent={rightContent} />,
            label:`【流程】${page_name}`,
            key: `${id}`,
            parentKey: MenuType.FLOW,
            nodeType: page.node_type,
            path: '',
          }
        })
      }
      flowData.push(moduleItem)
    })
    return flowData
  }

  useEffect(() => {
    initPages().then(flowData => {
       setTreeData(flowData)
    })
  },[])
 

  useEffect(() => {
    if (params.id) {
      setSelectedKeys([params.id])
    }
  }, [])

  const onAddPage = (item: any) => {
    const { id } = item
    addPageRef.current?.init({ module_id: id, parent_id: '', node_type: NodeType.FLOW })
  }

  const onRenamePage = (item: any) => {
    const { page_name = '', id } = item
    renamePageRef?.current?.init({ id, page_name })
  }

  const onOk = async (addId?: string) => {
    //alert('添加成功')
  }

  const onNameChange = (value:string) => { 
    console.log('value :>> ', value);
  }

  const onSelect: DirectoryTreeProps<TreeDataItem>['onSelect'] = async (keys, info) => {
    console.log('Trigger Select', keys, info);
    if(info.node.nodeType == 2) {
      let {key, path = '', label = '', parentKey} = info.node
      const data = await queryFlowId({id: key})
      const flowKey = data.find_sys_page_view?.[0]?.body
      path = `${FlowPath.DETAIL}/${flowKey}?appId=${appId}&id=${flowKey}`
      openRoute({key, path, label, parentKey})
    }
  };

  return (
    <>
      <Container title='流程列表' onChange={onNameChange} >
        <Tree
          // selectedKeys={selectedKeys}
          treeData={treeData}
          blockNode
          onSelect={onSelect}
        />
      </Container>
      <AddPage ref={addPageRef} onOk={onOk}/>
      <RenamePage ref={renamePageRef} onOk={onOk} />
    </>
   
  )
}

export default FlowTreeList