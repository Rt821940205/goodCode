import React, { useState } from 'react'
import SvgIcon from '@/components/svgIcon'
import styles from './index.less'
import {List} from '@/pages/componentOrchestrate/manage/manageList'
import TipModal from '../../components/TipModal'
import { NodeData } from '@/@types/orchestrate';
import { useDispatch,useSelector } from "umi";
import { ConnectState } from '@/models/connect';
import {NOCOMPLETE} from '@/pages/componentOrchestrate/const';

import {
  generateDefaultNode
} from '../../../util'

interface Props {
  current: number,
  onChangeCurrent: (current: number)=>void,
  onChangeNode: (nodeObj: NodeData)=> void
}



const StepOne: React.FC<Props> = (Props) => {
  const activeNode: NodeData = useSelector(({ orchestrate: { activeNode } }: ConnectState) => activeNode)
  var { current, onChangeCurrent, onChangeNode } = Props 
  const [cardObj,setCardObj] = useState<any>({}) 
  const onSelect = (item:API.ComponentItem) => {
    console.log('item :>> ', item);
    var { name } = activeNode 
    if(name && name!==item['x-component-id']){
      setCardObj(item)
      showConfirm()
    }else{
      var { 'x-icon': icon, title, description, 'x-component-id': id,'x-component-id': id,'x-route-container': containerName} = item
      activeNode.name = id
      activeNode.title = title
      activeNode.description = description
      activeNode.icon = icon

      // 如果含有containerName
      if(containerName){
        activeNode.containerName = containerName;
        activeNode.children = [
          {
            ...generateDefaultNode(),
            nodeType: 'func'
          }
        ]
      }


      onChangeNode({...activeNode})
      onChangeCurrent(current+1)
    }
  }
  const [confirmOpen, setConfirmOpen] = useState(false)
  const showConfirm = ()=>{
    setConfirmOpen(true)
  }
  const handleOk = () => {
    var { 'x-icon': icon, title, description, 'x-component-id': id, 'x-route-container': containerName} = cardObj
    activeNode.name = id
    activeNode.title = title
    activeNode.description = description
    activeNode.icon = icon
    activeNode.containerName = containerName
    onChangeNode({...activeNode,
      action: undefined,    
      actionTitle: undefined, 
      configId: undefined,
      configTitle: undefined,
      input: {
        title: '输入',
        properties: {}
      },
      output: {
        title: '输出',
        properties: {}
      },
      isComplete: NOCOMPLETE
    })
    onChangeCurrent(current+1)
    setConfirmOpen(false);
  };
  const handleCancel = () => {
    setConfirmOpen(false);
  };
  var { 'icon': img = '', title, } = activeNode
  return (
    <>
      <div className={styles['component-title']}>
        { img ? <span className={styles['component-img']}>
                  <img src={img} alt="" />
                </span> : <SvgIcon iconClass="default-node-choose" style={{fontSize: '1rem'}}></SvgIcon> }
        <span>{ title || '请选择一个组件'}</span>
      </div>
      <List onItemClick={onSelect}/>
      <TipModal
        open={confirmOpen} onOk={handleOk} onCancel={handleCancel} 
        okText="更换" cancelText="不更换"
      >
        <div>更换组件后，该节点已保存的所有配置内容将清空，确定更换组件吗？</div>
      </TipModal>
      
    </>
  )
}

export default StepOne