import React from 'react'
import {Button,Tooltip} from 'antd'
import SvgIcon from '@/components/svgIcon'
import styles from './insertNode.less'
import { CloseOutlined } from '@ant-design/icons'
import { NodeData } from '@/@types/orchestrate'
import { useDispatch } from 'umi'
import {
  generateFunNode,
  generateIfNode,
  generateElseNode,
  generateEndNode,
  generateSplitNode
} from './util'

export type InsertNodeProps = {
  nextNodeId: string | undefined | null,
  parentNodeId:string | undefined | null,
  visible:boolean,
  onClose?: () => void,
  afterInsert?:()=>void
}

const InsertNode: React.FC<InsertNodeProps> = ({
  visible = false,
  onClose,
  afterInsert,
  nextNodeId,
  parentNodeId
}) => {
  const dispatch = useDispatch()
  const setActiveNode = (node:NodeData) => {
    dispatch({
      type: 'orchestrate/setActiveNode',
      payload:node
    });
  }
  const add = (addItem: NodeData) => {
    dispatch({
      type: 'orchestrate/addNode',
      payload: {
        addItem,
        parentNodeId,
        nextNodeId
      }
    })
  }
  const onChoose = (e: React.MouseEvent) => {
    e.stopPropagation()
    const node:NodeData = generateFunNode()
    add(node)
    setActiveNode(node)
    afterInsert?.()
  }
  const onIf = () => {
    const node:NodeData = generateIfNode()
    add(node)
    setActiveNode(node)
  }

  const onControl = () => { 
    const ifNode:NodeData = generateIfNode()
    add(ifNode)
    add(generateElseNode())
    setActiveNode(ifNode)
  }
  const onEnd = () => {
    const node:NodeData = generateEndNode()
    add(node)
    setActiveNode(node)
  }

  const onSplit = () => {
    const node:NodeData = generateSplitNode()
    add(node)
    setActiveNode(node)
  }


  const excuteList = [
    {
      name: '执行条件',
      icon: 'excute-if',
      helpText: "增加一个流程分支，配置该节点触发后续流程的执行条件。（if…else）",
      clickFn: onIf
    },
    {
      name: '执行控制',
      icon: 'excute-control',
      helpText: '根据设定条件，执行不同的组件操作。（else…if）',
      clickFn: onControl
    },
    {
      name: '循环执行',
      icon: 'excute-split',
      helpText: "对数组、列表等数据集的每个数据项执行相同的处理",
      clickFn: onSplit
    },
    {
      name: '执行终止',
      icon: 'excute-stop',
      helpText: "终止正在运行的任务，一般配合执行条件/执行控制使用。",
      clickFn: onEnd
    }
  ]
  return (
    <>
      {visible && (
        <div>
          <div className={styles.line}></div>
            <div  className={styles['insert-node-wrapper']}>
              <div className='text-gray'>您可以在此处插入一个组件</div>
            <Button
              icon={<SvgIcon iconClass='insert-btn-choose' />}
              className={styles.choose}
              onClick={onChoose}>
              选择组件
            </Button>
              
              <div className='text-gray'>或添加一个执行逻辑</div>

              <section className='flex'>
                {
                  excuteList.map(({icon,name,helpText,clickFn}) => {
                    return (
                      <Tooltip placement='top' title={helpText} key={name}>
                        <section className={styles['excute-item']} onClick={
                          (e) => {
                            e.stopPropagation();
                            clickFn?.();
                            afterInsert?.()
                          }
                        }>
                          <div className={styles['icon-wrappper']}>
                            <SvgIcon iconClass={ icon} className={styles.icon}/>
                          </div>
                          <span>{ name}</span>
                        </section>
                      </Tooltip>
                    )
                  })
                }
              </section>
            <CloseOutlined className={styles.close} onClick={ onClose } />
            </div>
        </div>
      )}
    </>
      
  )
}

export default InsertNode