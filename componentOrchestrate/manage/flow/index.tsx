// 组件编排画布流程
import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import SvgIcon from '@/components/svgIcon';
import Node from './node';
import Line from './line';
import { NodeData, GlobalList } from '@/@types/orchestrate';
import { useDispatch, useLocation, useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Radio, Dropdown, Menu, Button, Input, message, InputRef } from 'antd';
import type { MenuProps } from 'antd';
import GlobalConfig from './componentManager/GlobalConfig';
import ExcuteSetting from './componentManager/execute';
import ExecuteBreakSetting from './componentManager/executeBreak'
import ExecuteSplitSetting from './componentManager/executeSplit';;
import FunSetting from './componentManager/Workflows';
import { useAppId } from '@/pages/componentOrchestrate/hooks'

import _ from "lodash"
export const SubNodes: React.FC<{
  data: NodeData[];
  parentNodeId: string | undefined;
}> = ({ data = [], parentNodeId }) => {
  return (
    <>
      {(data || []).map((node: NodeData, index, arr) => (
        <div key={node.nodeId}>
          {index > 0 && data[index - 1]?.nodeType !== 'end' && (
            <Line
              nextNodeId={node.nodeId}
              parentNodeId={parentNodeId}
              showAdd={true}
              label={node._level === 1 && node._index === 2 ? '执行操作' : ''}
            />
          )}
          <Node type={node.nodeType} data={node} />
        </div>
      ))}
    </>
  );
};

const MinPercent = 40;
const MaxPercent = 200;
const menuItems: MenuProps['items'] = [
  {
    key: 200,
    label: '200%',
  },
  {
    key: 150,
    label: '150%',
  },
  {
    key: 100,
    label: '100%',
  },
  {
    key: 80,
    label: '80%',
  },
  {
    key: 50,
    label: '50%',
  },
];

const Flow: React.FC = () => {
  const { nodes, activeNode, componentInfo } = useSelector(({ orchestrate }: ConnectState) => (orchestrate))
  const { nodeId: activeNodeId, nodeType: activeNodeType } = activeNode || {};
  const nodeChoosed: boolean = !!activeNodeId;
  const dispatch = useDispatch()

  console.log('全局数据检测',nodes, activeNode, componentInfo)

  const [percent, setPercent] = useState<number>(100);

  const [name, setName] = useState<string>('')

  const [nameEdit, setNameEdit] = useState<boolean>(false)

  const inputRef = useRef<InputRef>(null)

  const location = useLocation()

  useEffect(() => {
    setName(componentInfo.name)
  }, [componentInfo.name])

  useEffect(() => {
    nameEdit && inputRef.current?.focus({
      cursor: 'end'
    });
  }, [nameEdit])

  useEffect(() => {
    const {appId,dataId} = location.query
    dispatch({
      type: 'orchestrate/queryDetail',
      payload: {
        app_id: appId,
        dataId:dataId,
      }
    });
  },[])


  const [globalSetting, setGlobalSetting] = useState<boolean>(false)

  const onMinu = () => {
    setPercent((prePercent) => Math.max(MinPercent, prePercent - 10));
  };
  const onPlus = () => {
    setPercent((prePercent) => Math.min(MaxPercent, prePercent + 10));
  };
  const onClick: MenuProps['onClick'] = ({ key }) => {
    setPercent(Number(key));
  };

  const onApiTest = () => {

  }

  const onSave = async () => {
    const { title } = componentInfo
    if (!title) {
      message.error('请先配置组件名称')
      setGlobalSetting(true)
      return
    }
    dispatch({
      type: 'orchestrate/saveNodes',
      resolve: (data: any) => {
        console.debug(data);
        message.success(data.msg ? data.msg : '保存成功!')
      }
    })
  }

  const onModifyNode = (node: NodeData) => {
    dispatch({
      type: 'orchestrate/modifyNode',
      payload: {
        nodeId: activeNodeId,
        item: { ...node },
      },
    });
    setTimeout(() => {
      dispatch({
        type: 'orchestrate/saveNodes',
        resolve: (data: any) => {
          console.debug(data);
          if (data.msg && data.msg.indexOf('注意') > 0) {
            message.success(data.msg);
          }
        }
      })
    }, 0)
  };

  const onOperateCancel = () => {
    dispatch?.({
      type: 'orchestrate/setActiveNode',
      payload: {},
    });
  };


  const propertiesToElement = (element:any,nodeId:string,pk:any)=>{


    if(element?.properties){
      if(!element['children']) {element['children']= []}
      for (const key in element.properties) {
        const elementChildren = element.properties[key];
       let nodeKey =  pk ? `${pk}.${key}`: key;
       console.log('__nodeKey',nodeKey)
        element['children'].push({
          ...propertiesToElement(elementChildren,nodeId,nodeKey),
          title: elementChildren.title || key,
          parentKey: nodeId,
          key: nodeKey ,
        })
      }
    }

    console.debug('__element1', `${pk}`, element)
    return element;

  }

  const getTreeData = (nodes: any, superVariable: any[] = []) => {
    for (var i = 0; i < nodes.length; i++) {

      console.debug('nodes', nodes[i])

      var { out: { properties = {} } = {}, title, nodeId, children, nodeType } = nodes[i]
      var listOut: any[] = []
      for (const key in properties) {
        const element = properties[key];
        const item = {
          key,
          ...propertiesToElement(element, nodeId, key),
        };

        console.log('__item',item);

        listOut.push(item);


      }


      console.debug('listOut', listOut)

      var variable = listOut.map((item: any) => {
        var { key, title } = item
        return {
          key: key + "," + nodeId,
          title: title || key,
          parentKey: nodeId,
          children: item.children || []
        }
      })
      superVariable.push({
        title: title || getNodeName(nodeType),
        key: nodeId,
        children: variable,
      })
      if (children && children.length > 0) {
        getTreeData(children, superVariable)
      }
    }

    console.debug('superVariable', superVariable)
    return superVariable;
  }





  function getNodeName(nodeType: string) {
    return (nodeType == 'func' ? '-' : nodeType);
  }

  const flatData = (data: NodeData[]) => {
    return data.reduce((prev: NodeData[], curr: NodeData) => {
      prev.push(curr);
      if (curr.children && curr.children.length > 0) {
        prev.push(...flatData(curr.children));
        // 删除children
        delete curr.children
      }
      return prev;
    }, []);
  };
  useEffect(() => {
    /*
     20230716-ljy-添加节点输出所有Map类型的子属性读取(不包含array节点，array节点需要指定index，不能一键关联)

    原：只按平级输出所有根节点属性。
    现：平级输出所有节点属性
    TODO: 按层级控制展开节点，且大部分节点只能 同级间使用，只有少量节点可以 跨层级读取。


     */

    let newNodes = nodes.map((item: NodeData) => {
      return _.cloneDeep(item)
    })
    newNodes = flatData(newNodes)


    console.debug('nodesupdateSuperVariable',newNodes)


    const activeIndex = newNodes.findIndex((node: NodeData) => node.nodeId === activeNode.nodeId)
    var superVariable = getTreeData(newNodes.slice(0, activeIndex))


    dispatch?.({
      type: 'orchestrate/updateSuperVariable',
      payload: superVariable
    })
  }, [activeNode])

  return (
    <>
      <div className={styles['flow-wrapper']} id='arrage-flow-wrapper'>
        <header className={styles['flow-name-wrapper']}>
          <div>
            <Button type="primary" className={styles.save} onClick={onSave}>保存编排</Button>
            {
              nameEdit ?
                <Input
                  ref={inputRef}
                  maxLength={20}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={
                    (e) => {
                      dispatch({
                        type: 'orchestrate/setComponentInfo',
                        payload: {
                          title: e.target.value
                        }
                      })
                      setNameEdit(false)
                    }
                  }
                /> :
                <>
                  <span className={styles['flow-name']}>{componentInfo.title || '请填写组件名称'}</span>
                  <SvgIcon iconClass="manage-name-edit"
                    style={{ cursor: 'pointer', fontSize: '13px' }}
                    onClick={() => setGlobalSetting(true)}
                  // onClick={() => {
                  //   setNameEdit(true)
                  //   setName(componentInfo.title || '组件名称')
                  // }}
                  />
                </>
            }
            <Button type="primary" className={styles.apiTest} target="_blank" href={`/component/app/ComponentList/apiTest?appId=${useAppId()}&componentId=${componentInfo.name}`}>测试接口</Button>
          </div>
        </header>


        {/* 编排画布区域 */}
        <section className={styles['flow-canvas']} style={{ overflow: 'auto' }}>
          <section className={styles['flow-canvas-inner']} style={{ zoom: percent / 100 }}>
            <SubNodes data={nodes} parentNodeId={undefined} />
            {nodes.length > 0 && nodes[nodes.length - 1].nodeType !== 'end' && (
              <Line showAdd={true} nextNodeId={undefined} parentNodeId={undefined} bottomBtn />
            )}
          </section>


          <footer className={styles['footer']}>
            {/* 底部放大等设置区域 */}
            <Radio.Group value="" className={styles['zoom']}>
              <Radio.Button
                className={styles['zoom-item']}
                onClick={onMinu}
                disabled={percent === MinPercent}
              >
                <ZoomOutOutlined />
              </Radio.Button>
              <Dropdown
                overlay={<Menu onClick={onClick} items={menuItems} />}
                placement="top"
                trigger={['click']}
              >
                <Radio.Button className={styles['zoom-count']}>{`${percent}%`}</Radio.Button>
              </Dropdown>
              <Radio.Button
                className={styles['zoom-item']}
                onClick={onPlus}
                disabled={percent === MaxPercent}
              >
                <ZoomInOutlined />
              </Radio.Button>
            </Radio.Group>
            {/* 全局按钮 */}
            <div title='全局输入'>
              <SvgIcon
                iconClass='global-config-setting'
                className={styles.config}
                onClick={() => setGlobalSetting(true)}
              />
            </div>

          </footer>
        </section>
      </div>
      {/* 组件信息设置 */}
      <FunSetting
        open={nodeChoosed && ['trigger', 'func'].includes(activeNodeType)}
        onCancel={onOperateCancel}
        nodeObj={activeNode}
        onChangeNode={onModifyNode}
      />


      <div onClick={(e) => e.stopPropagation()}>
        {/* 执行条件设置 */}
        <ExcuteSetting
          open={nodeChoosed && activeNodeType === 'if'}
          onCancel={onOperateCancel}
          onChange={onModifyNode}
          svg="execute-condition"
        />
        {/* 
        <ExecuteSplitSetting
          open={nodeChoosed && activeNodeType === 'split'}
          onCancel={onOperateCancel}
          onChange={onModifyNode}
          svg='execute-split'
        /> */}

        {/* 执行结束*/}

        <ExecuteBreakSetting
          open={nodeChoosed && activeNodeType === 'end'}
          onCancel={onOperateCancel}
          onChange={onModifyNode}
          svg='execute-condition'
        />
      </div>

      {/* 全局输入 */}
      <GlobalConfig
        open={globalSetting}
        onCancel={() => setGlobalSetting(false)}
      />
    </>
  );
};

export default Flow