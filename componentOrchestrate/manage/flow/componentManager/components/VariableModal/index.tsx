import React, { useState, useMemo, useEffect } from "react";
import { Input, Tree } from "antd";
const { Search } = Input;
import type { DataNode as DataNodeExtend } from 'antd/es/tree';
import styles from './index.less'
import { CheckObj } from '@/@types/orchestrate';
import { useDispatch, useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
import SvgIcon from '@/components/svgIcon'
import { GlobalInDefine } from "@/pages/componentOrchestrate/GlobalInDefine";;
import { GlobalInProperty } from "../AmisProperty/GlobalIn";
import { render as renderAmis } from 'amis';
interface DataNode extends DataNodeExtend {
  parentKey?: string
}
interface Props {
  isModalOpen: boolean,
  onCancel: () => void,
  variableList?: any,
  variableClick: (item: CheckObj) => void,
  dynamic?: any,
  isFastBind?: boolean,
  style?: React.CSSProperties
}

var defaultData: DataNode[] = [];
var dataList: DataNode[] = [];
const generateList = (data: DataNode[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key, title } = node;
    dataList.push({ key, title });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(defaultData);
const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};
const VariableModal: React.FC<Props> = ({ isModalOpen, onCancel, variableClick, dynamic, isFastBind = true, style }) => {

  const dispatch = useDispatch()
  const globalConfigList = useSelector(({ orchestrate: { globalConfigList } }: ConnectState) => globalConfigList)
  const variableList = useSelector(({ orchestrate: { superVariable } }: ConnectState) => superVariable)
  const activeNode = useSelector(({ orchestrate: { activeNode } }: ConnectState) => activeNode)

  const fastBindClick = (value: any) => {
    var { key, title, } = dynamic || {}
    const itemValue = typeof value == 'string' ? value : JSON.stringify(value);
    console.log('快速绑定结果', dynamic, itemValue);
    // 查找nodeId. 如果找到，则更新，如果未找到，则新建。
    // let nodeFind = globalConfigList.find((i: any) => i.nodeId == activeNode.nodeId && i.originKey == (dynamic?.name || dynamic.key));
    const nodeFind = GlobalInDefine.find(globalConfigList, activeNode.nodeId, dynamic);
    if (nodeFind) {

      console.debug('已有globalConfigList', globalConfigList)

      const global = GlobalInDefine.getUpdateWithSample(globalConfigList, activeNode.nodeId, dynamic, itemValue);
      console.debug('最终全局输入', global);
      dispatch({
        type: 'orchestrate/updateGlobalConfigList',
        payload: [...global]
      });
      return;
    }

    // 未绑定，准备新增绑定
    var global = globalConfigList.filter((item: any) => {
      return item.originKey?.split('_')[0] === key
    })


    var payload = { ...dynamic, title, nodeId: activeNode.nodeId, originKey: key, key: key }
    if (global.length) {
      payload.key = `${key}_${global.length}`
      payload.title = `${title}_${global.length}`;
    }
    if (itemValue) {
      payload['sample'] = itemValue;
    }

    console.debug('准备保存示例数据', payload)

    dispatch({
      type: 'orchestrate/addGlobalConfig',
      payload: { ...payload }
    });
    variableClick({ title, key: payload.key, parentKey: 'in' })
  }

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map((item) => {
        if ((item.title as string || '').indexOf(value) > -1) {
          return getParentKey(item.key, defaultData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  useEffect(() => {
    setSearchValue('')
  }, [isModalOpen])
  const treeData = useMemo(() => {
    setExpandedKeys([])
    var global = globalConfigList.map((item: any) => {
      var { title, key } = item
      return {
        key: key,
        title,
        parentKey: 'in'
      }
    })
    defaultData = [
      {
        key: 'global',
        title: '全局输入',
        children: [...global]
      },
      ...variableList
    ]
    generateList(defaultData);

    console.debug('variableList', variableList);
    console.debug('defaultData', defaultData);

    const loop = (data: DataNode[], ishowIndex: boolean): DataNode[] =>
      data.map((item, variableIndex) => {


        console.debug('item', item)


        const strTitle = item?.title as string || '';
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        var parentKey = item && item.parentKey || ''
        if (ishowIndex) {
          setExpandedKeys((prevState) => {
            prevState.push(item.key)
            return [...prevState];
          })
        }
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              {!ishowIndex ? '' : variableIndex === 0 ? '' : variableIndex + '.'}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
              <span style={{ "display": "none" }}>{parentKey}</span>
            </span>
          ) : (
            <span>{!ishowIndex ? '' : variableIndex === 0 ? '' : variableIndex}:{strTitle}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children, false) };
        }
        return {
          title,
          key: item.key,
        };
      });

    return loop(defaultData, true);
  }, [searchValue, isModalOpen, globalConfigList.length]);

  // const onSelect = (selectedKeys: React.Key[], info: any) => {
  //   // console.log( selectedKeys, info)
  //   setSelectedKeys(selectedKeys)
  //   var isChildren;
  //   if (selectedKeys.length) {
  //     isChildren = info.selectedNodes[0].children
  //   } else {
  //     // setExpandedKeys(selectedKeys);
  //     var keys = expandedKeys.filter(obj => {
  //       return obj !== info.node.key
  //     })
  //     setExpandedKeys(keys);
  //   }
  //   if (isChildren) {
  //     setExpandedKeys(selectedKeys);
  //     setAutoExpandParent(true)
  //   } else {
  //     if (info.selectedNodes.length) {
  //       var title = info?.node?.title?.props?.children?.[3]
  //       var parentKey = info?.node?.title?.props?.children?.[4]?.props?.children
  //       var key = info?.node?.props?.eventKey
  //       if (parentKey != 'in') {
  //         key = key.substring(0, key.indexOf(','));
  //       }
  //       variableClick({ key, parentKey, title, })
  //     }
  //   }
  // };

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('__info', info, treeData)

    if (info.selectedNodes.length) {
      var title = info?.node?.title?.props?.children?.[3]

      console.debug('__title', title);

      var parentKey = info?.node?.title?.props?.children?.[4]?.props?.children

      console.debug('__parentKey', parentKey);


      var key = info?.node?.props?.eventKey

      console.debug('__key', key);

      if (parentKey != 'in' && key.indexOf(',')>0) {
        key = key.substring(0, key.indexOf(','));
      }

      console.log('__select key', key);
      console.log('__select parentKey', parentKey);
      console.log('__select title', title);

      variableClick({ key, parentKey, title, })
    }
  };



  return (
    <>


      {isModalOpen ?
        <div
          className={styles['modal-mask']}
          style={style}
        >
          <div className={styles['modal-title']}>
            <span style={{ flex: 1, fontWeight: 'bold' }}>为参数“{dynamic?.title}”选择变量</span>
            <SvgIcon iconClass="close" style={{ cursor: 'pointer' }} onClick={() => onCancel()}></SvgIcon>
          </div>



          <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />

          {
            dynamic ?
              <GlobalInProperty nodeId={activeNode?.nodeId} valueKey='sample' title='示例值' dynamic={dynamic} inputClick={(value: any) => fastBindClick(value)}></GlobalInProperty>
              : <></>
          }

          <Tree
            onExpand={onExpand}
            showIcon={true}
            showLine={true}
            expandedKeys={expandedKeys}
            selectedKeys={selectedKeys}
            autoExpandParent={autoExpandParent}
            treeData={treeData}
            onSelect={onSelect}
            className={styles['search-value']}
          >
          </Tree>
        </div>
        : null
      }
    </>
  )
}

export default VariableModal