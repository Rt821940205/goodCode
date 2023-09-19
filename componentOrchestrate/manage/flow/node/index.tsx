import Func from './funcNode';
import Trigger from './triggerNode';
import IfNode from './ifNode'
import SplitNode from './splitNode'
import ElseNode from './elseNode';
import End from './endNode'
import { NodeData ,NodeType} from '@/@types/orchestrate';
import React,{useState} from 'react'
import { useDispatch, useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
import TipModal from '../component/tipModal'
import {COMPLETE} from '@/pages/componentOrchestrate/const';
type NodeProps = {
  type:NodeType, //节点类型
  data: NodeData, //节点数据
}

//计算序号位置
const calcIndexStyle = (level: number = 1) => {
  const left = level === 1 ? '-3rem' : `-${3 + (level - 1) * 6.7}rem`
  return { left }
}
//根据节点类型渲染不同节点
const Node: React.FC<NodeProps> = ({ type, data }) => {
  const dispatch = useDispatch()
  const activeNodeId = useSelector(({ orchestrate: { activeNode } }: ConnectState) => activeNode?.nodeId)
  const { _index, _level,isComplete } = data
  const indexStyle = calcIndexStyle(_level)
  const nodeMap = {
    'trigger': Trigger,
    'func': Func,
    'if': IfNode,
    'else':ElseNode,
    'end': End,
    'split': SplitNode,
  }
  
  const [open,setOpen] = useState(false)
  const onDelete = () => {
    setOpen(true)
  }
  const onClick = () => {
    dispatch({
      type: 'orchestrate/setActiveNode',
      payload:{...data}
    })
  }
  const NodeComp = nodeMap[type]
  if (!NodeComp) return null
  return <>
    <TipModal
      open={open}
      onOk={(e) => {
        dispatch({
          type: 'orchestrate/deleteNode',
          payload:data.nodeId
        })
        dispatch({
          type: 'orchestrate/setActiveNode',
          payload:{}
        })
        setOpen(false)
      }}
      onCancel={() => {
        setOpen(false)
      }}
    >
      <div>
        {Array.isArray(data.children) && data.children.length ?
          '所嵌套的所有节点也将被删除，确定删除节点吗？' : '确定删除节点吗？'
        }
      </div>
    </TipModal>
    <NodeComp 
      index = {_index}
      indexStyle={indexStyle}
      onDelete={_index === 1 ? undefined:onDelete}
      data={data}
      active={activeNodeId === data.nodeId}
      onClick={onClick}
      complete={isComplete === COMPLETE}
    />
  </>
  
}
export default Node