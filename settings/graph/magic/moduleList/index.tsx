// @ts-nocheck
import React, {ReactNode, useEffect, useMemo, useState} from 'react';
import {Input, Space, Tree, Button} from 'antd';
import type {DataNode} from 'antd/es/tree';
import classNames from 'classnames';
import {useDispatch, useSelector} from 'umi';
import {ConnectState} from '@/models/connect';
import styles from './index.less';
import {AppstoreOutlined, FileOutlined, FormOutlined, MinusOutlined, PlusOutlined, BranchesOutlined} from '@ant-design/icons';
import {NodeItem} from '@/@types/magic';
import Container from "@/pages/settings/components/container";

const {Search} = Input;

type TitleProps = {
  title: string,
  onAdd?: () => void
}
const Title: React.FC<TitleProps> = ({title, onAdd}) => {
  return <div className='flex justify-between items-center py-1'>
    <span className="flex-1"><AppstoreOutlined className='mr-1'/>{title}</span>
    <Space>
      <div onClick={(e) => e.stopPropagation()}>
        <PlusOutlined onClick={onAdd}/>
      </div>
    </Space>
  </div>
}

type LeafTitleProps = {
  title: string,
  type: string,
  rightContent?: ReactNode
}
const LeafTitle: React.FC<LeafTitleProps> = ({title, type, rightContent}) => {
  return <div className={classNames('flex justify-between items-center py-1', styles.leaf)}>
    <span className='flex-1'>{type == 'flow' ? <BranchesOutlined className='mr-1'/> :
      <FileOutlined className='mr-1'/>}{title}</span>
    <div className={styles.operate}>
      {
        rightContent
      }
    </div>
  </div>
}

type ModuleItem = {
  id?: string,
  name?: string,
  title: string,
  key: string,
  module_id: string,
  parent_id: string,
  children?: ModuleItem[],
  active?: boolean,
  [key: string]: any
}

const getParentKey = (key: React.Key, tree: any[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: NodeItem) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

const getName = (item: NodeItem) => {
  const {page_name, module_name, uiType} = item
  return (['page', 'flow'].includes(uiType) ? page_name : module_name) || ''
}

const tree2list = (trees: NodeItem[]) => {
  let list: NodeItem[] = []
  let queue = [...trees]
  while (queue.length) {
    const tree = queue.shift()
    tree && list.push(tree)
    if (tree?.children) {
      queue.unshift(...tree.children)
    }
  }
  return list
}

const ModuleList: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [defaultData, setDefaultData] = useState<DataNode[]>([]);

  const nodes: NodeItem[] = useSelector(({magic: {nodes}}: ConnectState) => nodes)
  const dispatch = useDispatch()
  const moduleMenuVisible: boolean = useSelector(({magic: {moduleMenuVisible}}: ConnectState) => moduleMenuVisible)

  useEffect(() => {
    if (nodes.length > 0) {
      const filterNodes: NodeItem[] = nodes.filter(i => i.uiType === 'module')
      const moduleNodes: ModuleItem[] = filterNodes.map((node): ModuleItem => {
        const {parent_id = '', id, children, module_id = '', module_name} = node
        const name = getName(node)
        const formatChildren: ModuleItem[] = tree2list(children).map(item => {
          const {parent_id = '', id, module_id = '', module_name, page_name} = item
          const name = getName(item)
          return {
            title: name,
            module_name,
            parent_id,
            key: id,
            module_id,
            children: null,
            page_name,
            uiType: item.uiType
          }
        })
        return {title: name, module_name, parent_id, key: id, module_id, children: formatChildren, uiType: node.uiType}
      })
      setDefaultData(moduleNodes)
    }
  }, [nodes])

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    const data = nodes.map(item => ({...item, title: getName(item), key: item.id}));
    const newExpandedKeys = data
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, defaultData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const addItem = (item: any) => {
    dispatch({
      type: "magic/setShowAddPage",
      payload: {id: item.key, module_name: item.module_name, type: 'add'}
    })
  };
  const deleteItem = (item: any) => {
    dispatch({
      type: "magic/setShowAddPage",
      payload: {id: item.key, module_name: item.module_name, page_name: item.page_name, children: [], type: 'delete'}
    })
  };
  const modifyItem = (item: any) => {
    dispatch({
      type: "magic/setShowAddPage",
      payload: {id: item.key, module_name: item.module_name, page_name: item.page_name, type: 'edit'}
    })
  };

  const addModule = () => {
    dispatch({
      type: "magic/setShowAddPage",
      payload: {type: 'addModule'}
    })
  }

  const treeData = useMemo(() => {
    const loop = (data: DataNode[]): DataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        if (item.uiType == 'module') {
          const title = <Title title={strTitle} onAdd={() => {addItem(item)}}></Title>
          return {title, key: item.key, children: loop(item.children)};
        } else {
          const rightContent = <Space>
            <MinusOutlined onClick={() => deleteItem(item)}/>
            <FormOutlined onClick={() => modifyItem(item)}/>
          </Space>
          const title = <LeafTitle title={strTitle} type={item.uiType} rightContent={rightContent}></LeafTitle>
          return {title, key: item.key};
        }
      });
    return loop(defaultData);
  }, [defaultData, searchValue]);

  const onItemClick = (selectedKeys: React.Key[]) => {
    const [id] = selectedKeys;
    dispatch({
      type: 'magic/setActiveId',
      payload: id
    })
  };

  const onNameChange = (value: string) => {
    console.log('value :>> ', value);
  }

  return (
    <>
      <Container title='模块列表' onChange={onNameChange}>
        <Button className={styles.addModuleBtn} type='primary' onClick={addModule} icon={<PlusOutlined/>}>添加模块</Button>
        <Tree
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={treeData}
          blockNode
          onSelect={onItemClick}
        />
      </Container>
    </>
  );
};

export default ModuleList;