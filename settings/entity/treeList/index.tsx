import React, { ReactNode, useEffect, useRef, useState } from 'react'
import Container from '@/pages/settings/components/container';
import LeafNode from '@/pages/settings/components/leafNode';
import { Tree ,Space, message ,Modal} from 'antd';
import type {  DirectoryTreeProps} from 'antd/es/tree';
import { FolderOpenOutlined, PlusOutlined, EditOutlined ,DatabaseOutlined,DeleteOutlined} from '@ant-design/icons'
import { useRouteMatch, useSelector } from 'umi';
import AddEntity, { type AddEntityRefProps } from './addEntity';
import AddApi, { type AddApiRefProps } from './addApi';
import { MenuType } from '@/pages/settings/components/slideMenu';
import {queryLocalEntity,toggleEntityState, querySevice} from '@/services/xuanwu/entity';
import { useLocalRoute ,useAppId } from '@/pages/settings/hooks';
import { State } from '@/@types/entity';
import { EntityPath } from '@/pages/settings/path';
import { ConnectState } from '@/models/connect';
import styles from './index.less';
import classNames from 'classnames';
type TitleProps = {
  title: string,
  onAdd?: () => void,
  rightContent?:React.ReactNode
}
const Title:React.FC<TitleProps>= ({ title,onAdd,rightContent}) => { 
  return <div className={classNames('flex justify-between items-center py-1',styles.node) }>
    <span className="flex-1"><FolderOpenOutlined className='mr-1' />{title}</span>
    <Space>
      <div className={styles.operate}>
        {
          rightContent
        }
      </div>
      <div onClick={(e)=>e.stopPropagation()}>
        <PlusOutlined onClick={onAdd}/>
      </div>
    </Space> 
  </div>
}


type TreeDataItem = {
  title:ReactNode | string,
  key: string,
  parentKey?:string,
  path?: string,
  label?:string,
  isLeaf?:boolean,
  children?:TreeDataItem[]
}

const mapState = (state:ConnectState) => {
  return {
    activeTabKey:state.settings.activeTabKey
  }
}
const EntityTreeList: React.FC = () => {

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const [treeData, setTreeData] = useState<TreeDataItem[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const addEntityRef = useRef<AddEntityRefProps>(null)
  const addApiRef = useRef<AddApiRefProps>(null)
  const { activeTabKey } = useSelector(mapState)
  const match = useRouteMatch()
  const appId = useAppId()
  const { openRoute } = useLocalRoute()
  
  //本地实体
  const initLocalEntities = async () => {  
    const data = await queryLocalEntity({ appId, name: '' })
    const entitys: TreeDataItem[] = (data?.data || []).map((i: any) => {
      const { id, displayName, state } = i
      const toggleState = state === State.OPEN ? State.CLOSE:State.OPEN
      const rightContent = <Space>
        <EditOutlined />
        <DatabaseOutlined title='数据' onClick={(e)=>onLocalData(e,id,displayName)}/>
        <span onClick={(e)=>onToggleState(e,id,toggleState)}>{ state === State.OPEN ? '禁用': '启用' }</span>
      </Space>

      return {
        title: <LeafNode title={displayName} rightContent={rightContent} />,
        label:`【实体】${displayName}`,
        key:id,
        parentKey:MenuType.ENTITY,
        path: `${EntityPath.DETAIL}/${id}?appId=${appId}&modelId=${id}&subPage=true&page=1`,
        isLeaf:true
      }
    })
    return entitys
  }


   
  //api服务实体列表
  const initApiSevices = async () => {
    const { data } = await querySevice({ appId })
    const list = data || []
   
    const children: TreeDataItem[] = list.map((item) => {
      const  { displayName, id } = item
      const rightContent = <Space>
        <EditOutlined
          onClick={(e) => {
            e.stopPropagation()
            addApiRef.current?.init('edit',item)
          }}
        />
        <DeleteOutlined />
    </Space>
      return {
        title: <Title title={displayName} rightContent={rightContent} />,
        key: id,
        isLeaf:false
      }
    })
    setTreeData((origin) => {
      let newData = [...origin]
      newData[1].children = children
      return newData
    })
  }


  useEffect(() => {
    const treeData: TreeDataItem[] = [
      {
        title: <Title title='本地实体' onAdd={onLocalAdd} />,
        key: MenuType.ENTITY,
        label:'实体',
        path: `/settings/entity?appId=${appId}`,
        isLeaf:false,
        children: [],
      },
      {
        title: <Title title='API服务实体' onAdd={()=>addApiRef.current?.init('add')}/>,
        key: '1',
        children: [
        ],
      },
      {
        title: <Title title='外部数据源实体'/>,
        key: '2',
        children: [
         
        ],
      },
    ]

    initLocalEntities().then(entities => {
      treeData[0].children = entities
      setTreeData(treeData)
      setExpandedKeys([MenuType.ENTITY])
    })

  },[])
 

  useEffect(() => {
    activeTabKey && setSelectedKeys([activeTabKey])
  }, [match])
  
  const onLocalAdd = () => { 
    addEntityRef.current?.init()
  }

  
  
  const onLocalAddOk = (data:any) => {
    const { id ,displayName} = data
    openRoute({
      key:`entityDetail-${id}`,
      path: `${EntityPath.DETAIL}/${id}?appId=${appId}&modelId=${id}&subPage=true&page=1`,
      label:`实体-${displayName}`,
      parentKey:MenuType.ENTITY
    })
  }

  const onNameChange = (value:string) => { 
    console.log('value :>> ', value);
  }
 
  const onLocalData = (e: React.MouseEvent, id: string, name: string) => { 
    e.stopPropagation()
    openRoute({
      key:`entityData-${id}`,
      path: `${EntityPath.DATA}/${id}?appId=${appId}&modelId=${id}&subPage=true`,
      label:`实体-${name}`,
      parentKey:MenuType.ENTITY
    })
  }

  const onToggleState = (e:React.MouseEvent,id: string, state: State) => {
    e.stopPropagation()
    Modal.confirm({
      title: '提示',
      content: `确认要${state === State.OPEN ? '启用':'禁用'}该实体吗`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await toggleEntityState({ id, state })
        message.success(`${State.OPEN ? '启用' : '禁用'}成功!`)
        const entities = await initLocalEntities()
        setTreeData((treeData) => {
          let newData = [...treeData]
          newData[0].children = entities
          return newData
        })
      }
    })
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

  const onLoadData = (node: any) => {
    return new Promise(async (resolve, reject) => {
      console.log('node :>> ', node);
      if (node.key !== '1') return resolve([])
      await initApiSevices()
      resolve([])
    });
  };

  return (
    <>
      <Container title='实体列表' onChange={onNameChange} >
        <Tree
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          selectedKeys={selectedKeys}
          treeData={treeData}
          blockNode
          onExpand={onExpand}
          onSelect={onSelect}
          loadData={onLoadData} 
        />
      </Container>

      <AddEntity ref={addEntityRef} onOk={onLocalAddOk}/>
      <AddApi ref={addApiRef} onOk={()=>initApiSevices()}/>
    </>
   
  )
}

export default EntityTreeList