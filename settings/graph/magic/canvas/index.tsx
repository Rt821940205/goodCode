import React, { useEffect, useState, useRef, useCallback } from 'react'
import styles from './index.less';
import Header from './header';
import Node from './nodeUi';
import { jsPlumb } from 'jsplumb';
import { Button, message } from 'antd';
import AddModule, { type AddModuleRefProps } from './addModule';
import AddPage, { type AddPageRefProps } from './addPage';
import MovePage, { type MovePageRefProps } from './movePage';
import RenamePage, { type RenamePageRefProps } from './renamePage';
import ScaleOperate from './scaleOperate';
import { NodeType, Visible, NodeItem, NodeUiType } from '@/@types/magic';
import { queryALLNodes, toggleModule, deleteModule, deletePage, changeParent, togglePage, queryFlowId } from '@/services/xuanwu/magic';
import Loading from '@/components/loading/index';
import * as D3 from 'd3';
import { useAppId } from '../../hooks';
import { useDispatch, useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
import { getUUID } from '@/utils';
import {useLocalRoute} from "@/pages/settings/hooks";
import {MenuType} from "@/pages/settings/components/slideMenu";
import {FlowPath, PagePath} from "@/pages/settings/path";

const TypeMapper: Record<NodeType.PAGE | NodeType.FLOW, NodeUiType> = {
  [NodeType.PAGE]: 'page',
  [NodeType.FLOW]: 'flow'
}

type ContextMenuItem = {
  name: string,
  action: () => void
}
const ROOT_ID = 'app-canvas-sjmf-id'
const list2tree = (list: NodeItem[], rootId: string) => {
  const map = {}
  for (const item of list) {
    if (item.id) {
      item.children = []
      map[item.id] = item
    }
  }
  for (const item of list) {
    const parent = item.parent_id && map[item.parent_id] || null
    if (parent) {
      parent.children.push({ ...item, ...parent.parent_id === ROOT_ID ? { module_name: parent.module_name } : {} })
    }
  }
  return map[rootId]
}

const tree2list = (trees: NodeItem[]) => {
  let list: NodeItem[] = []
  let queue = [...trees]
  while (queue.length) {
    const tree = queue.shift()
    tree && list.push(tree)
    if (tree?.children) {
      queue.push(...tree.children)
    }
  }
  return list
}


const Canvas: React.FC = () => {

  const [jsPlumbInstance] = useState(jsPlumb.getInstance())

  const nodes: NodeItem[] = useSelector(({ magic: { nodes } }: ConnectState) => nodes)

  const refreshCanvas: boolean = useSelector(({ magic: { refreshCanvas } }: ConnectState) => refreshCanvas)

  const activeId = useSelector(({ magic: { acitveId } }: ConnectState) => acitveId)

  const rowData: { id?: string, type?: string, module_name?: string, page_name?: string } = useSelector(({ magic: { rowData } }: ConnectState) => rowData)

  const dispatch = useDispatch()

  const containerRef = useRef<HTMLDivElement>(null)

  const jsPlumbContainerRef = useRef<HTMLDivElement>(null)

  const [percent, setPercent] = useState(100)

  const [loading, setLoading] = useState(false)

  const addMoudleRef = useRef<AddModuleRefProps>(null)

  const addPageRef = useRef<AddPageRefProps>(null)

  const movePageRef = useRef<MovePageRefProps>(null)

  const renamePageRef = useRef<RenamePageRefProps>(null)

  const appId = useAppId()

  const { openRoute } = useLocalRoute()

  const [uuid, setUUid] = useState('') //变化时，node节点的key值也会变化，node ui节点会重新渲染

  const initNodes = async (): Promise<NodeItem[]> => {
    setLoading(true)
    try {
      const { modules, pages } = await queryALLNodes({ appId })
      const root: NodeItem = {
        id: ROOT_ID,
        hide: Visible.SHOW,
        uiType: 'app',
        parent_id: '',
        module_name: '测试应用',
        children: []
      }
      const formatModules = modules.map((i): NodeItem => {
        return { ...i, uiType: 'module', parent_id: ROOT_ID, children: [] }
      })

      const formatPages = pages.reduce((res: NodeItem[], i): NodeItem[] => {
        const { module_id, parent_id } = i
        const realParentId = parent_id || module_id
        //过滤不存在父节点的节点
        if (!realParentId) return res
        const item = { ...i, uiType: TypeMapper[i.node_type], parent_id: realParentId, children: [] }
        res.push(item)
        return res
      }, [])

      const tree = list2tree([root, ...formatModules, ...formatPages], ROOT_ID)

      //计算坐标
      const treeGenerator = D3.tree().nodeSize([150, 220]);
      const nodes = treeGenerator(D3.hierarchy(tree)).descendants();
      const formatNodes: NodeItem[] = nodes.map((i: any) => {
        const { data: { children, ...restData }, x, y } = i
        return {
          style: {
            left: y + 'px',
            top: (x + 520) + 'px'
          },
          ...restData,
          isHidden: false,
          openChildren: true,
          count: children.length,
          children
        }
      })

      dispatch({
        type: 'magic/setNodes',
        payload: formatNodes
      })

      dispatch({
        type: 'magic/setActiveId',
        payload: ''
      })

      setUUid(getUUID())

      return formatNodes
    } finally {
      setLoading(false)
    }
  }




  const reRenderLines = (nodes: NodeItem[]) => {
    jsPlumbInstance.reset()
    nodes.forEach(({ id, parent_id, isHidden }) => {
      jsPlumbInstance.draggable(id)
      if (!isHidden) {
        parent_id && jsPlumbInstance.connect({
          source: parent_id,
          target: id,
        });
      }
    })
  }

  useEffect(() => {
    console.log(rowData)
    if (rowData.type === 'add') {
      //@ts-ignore
      onAddPageByModule(rowData)
    }
    if (rowData.type === 'edit') {
      if(rowData.page_name) {
        //@ts-ignore
        onRenamePage(rowData)
      } else {
        //@ts-ignore
        onEditModule(rowData)
      }
    }
    if (rowData.type === 'delete') {
      if(rowData.page_name) {
        //@ts-ignore
        onDeletePage(rowData)
      } else {
        //@ts-ignore
        onDeleteModule(rowData)
      }
    }
    if(rowData.type === 'addModule') {
      onAddModule()
    }
  }, [rowData])


  useEffect(() => {
    initNodes()
      .then(nodes => {
        reRenderLines(nodes)
      })
  }, [])

  useEffect(() => {
    if (refreshCanvas) {
      initNodes()
        .then(nodes => {
          reRenderLines(nodes)
          dispatch({
            type: 'magic/setRefreshCanvas',
            payload: false
          })
        })
    }
  }, [refreshCanvas])



  useEffect(() => {
    const onResize = () => {
      jsPlumbInstance.repaintEverything()
    }
    jsPlumbInstance.ready(() => {
      jsPlumbInstance.reset();
      jsPlumbInstance.setContainer('canvas-container');
      jsPlumbInstance.importDefaults({
        Anchor: ['LeftMiddle', 'RightMiddle'],
        ConnectionsDetachable: false,
        Connector: ['Flowchart'],
        Overlays: [
          ['Arrow', { width: 10, length: 8, location: 1, foldback: 1 }]
        ],
        EndpointStyle: { fill: '', outlineWidth: 1 },
        PaintStyle: {
          stroke: '#333',
        },
      });

      window.addEventListener('resize', onResize)
    })
    return () => {
      if (jsPlumbInstance) {
        jsPlumbInstance.reset();
      }
      window.removeEventListener('resize', onResize)
    }
  }, [])

  //移动高亮节点到中心位置
  useEffect(() => {
    if (!activeId) return


    const scale = percent / 100
    const canvasContainer = containerRef.current as HTMLDivElement
    const canvasDom = jsPlumbContainerRef.current as HTMLDivElement
    const nodeOuter = document.getElementById(activeId)
    const left = nodeOuter?.offsetLeft || 0
    const top = nodeOuter?.offsetTop || 0
    const width = Math.round(canvasContainer.offsetWidth / 2)
    const height = Math.round(canvasContainer.offsetHeight / 2)
    canvasDom.style.left = width / scale - left + 'px'
    canvasDom.style.top = height / scale - top + 'px'

  }, [activeId])


  const onOk = async (addId?: string) => {
    const nodes = await initNodes()
    reRenderLines(nodes)
  }


  const onAddModule = () => {
    addMoudleRef.current?.init('add')
  }

  const onEditModule = (item: NodeItem) => {
    const { id, module_name } = item
    addMoudleRef.current?.init('edit', {
      module_name,
      id,
    })
  }

  const onDeleteModule = async (item: NodeItem) => {
    const { id } = item
    setLoading(true)
    try {
      await deleteModule({ appId, module_id: id })
      message.success('删除模块成功!')
      const nodes = await initNodes()
      reRenderLines(nodes)

    } finally {
      setLoading(false)
    }
  }

  const onToggleVisible = async (item: NodeItem) => {
    const { hide, id, uiType } = item
    setLoading(true)
    try {
      const params = { id, hide: !(hide === Visible.HIDE) }
      if (uiType === 'module') {
        await toggleModule(params)
      } else {
        await togglePage(params)
      }

      const nodes = await initNodes()
      reRenderLines(nodes)
      setLoading(false)
    } catch (err) {
      console.log('err :>> ', err);
      setLoading(false)
    }
  }

  const onAddPageByModule = (item: NodeItem) => {
    const { id = '' } = item
    addPageRef.current?.init({ module_id: id })
  }


  const onAddPage = (item: NodeItem) => {
    const { module_id = '', id } = item
    addPageRef.current?.init({ module_id: module_id, parent_id: id })
  }

  const onDeletePage = async (item: NodeItem) => {
    const { id, children, parent_id } = item
    setLoading(true)
    try {
      await deletePage({ id })
      const sublingIds = children.map(i => i.id)
      if (parent_id && sublingIds.length) {
        await changeParent({ ids: sublingIds, parent_id })
      }
      const nodes = await initNodes()
      reRenderLines(nodes)
      message.success('页面删除成功!')
    } finally {
      setLoading(false)
    }
  }

  const onDesignPage = (item: NodeItem) => {
    const { id } = item
    openRoute({
      label:`【页面】${item.page_name}`,
      key: `pageDetail-${item.id}:${item.module_id}`,
      parentKey: MenuType.PAGE,
      path: `${PagePath.DETAIL}/${id}?appId=${appId}&pageId=${id}`
    })
  }

  const onFlowDesign = async (item: NodeItem) => {
    const { id } = item
    const data = await queryFlowId({ id })
    const flowKey = data.find_sys_page_view?.[0]?.body
    openRoute({
      label:`【流程】${item.page_name}`,
      key: `${id}`,
      parentKey: MenuType.FLOW,
      path: `${FlowPath.DETAIL}/${flowKey}?appId=${appId}&id=${flowKey}`
    })
  }

  const onMovePage = (item: NodeItem) => {
    const { module_id = '', id } = item
    movePageRef?.current?.init({ module_id, id })
  }

  const onRenamePage = (item: NodeItem) => {
    const { page_name = '', id } = item
    renamePageRef?.current?.init({ id, page_name })
  }




  const renderContextMenu = useCallback((item: NodeItem) => {
    const { uiType, hide } = item

    const pageList = [
      { name: '添加页面', action: () => onAddPage(item) },
      {
        name: '设计页面', action: () => {
          uiType === 'flow' ? onFlowDesign(item) : onDesignPage(item)
        }
      },
      { name: '删除页面', action: () => onDeletePage(item) },
      { name: '移动页面到模块', action: () => onMovePage(item) },
      { name: '重命名', action: () => onRenamePage(item) },
    ]



    const menuMapper: Record<NodeUiType, ContextMenuItem[]> = {
      'app': [{ name: '添加模块', action: onAddModule }],
      'module': [
        { name: '编辑模块', action: () => onEditModule(item) },
        { name: '删除模块', action: () => onDeleteModule(item) },
        { name: '添加页面', action: () => onAddPageByModule(item) },
        { name: `${hide === Visible.HIDE ? '显示' : "隐藏"}模块`, action: () => onToggleVisible(item) },
      ],
      'flow': [...pageList],
      'page': [
        ...pageList,
        { name: `${hide === Visible.HIDE ? '显示' : "隐藏"}页面`, action: () => onToggleVisible(item) },
      ],
    }
    const list = menuMapper[uiType] as ContextMenuItem[]

    if (!list) return null
    return <>
      {
        list.map((i, idx) => {
          return <div key={idx}>
            <Button type='link' onClick={i.action}>{i.name}</Button>
          </div>
        })
      }
    </>
  }, [])


  const onOpenChange = (isOpen: boolean, node: NodeItem) => {
    const { id } = node
    let newNodes = [...nodes]
    const curNode = newNodes.find(i => i.id === id)
    if (!curNode?.children) {
      return
    }
    curNode.openChildren = isOpen
    //找出后代节点,隐藏或展开子节点
    const laterIds = tree2list(curNode.children).map(i => i.id)
    newNodes.forEach((i) => {
      if (laterIds.includes(i.id)) {
        i.isHidden = !isOpen
        i.openChildren = true
      }
    })
    dispatch({
      type: 'magic/setNodes',
      payload: newNodes
    })
    setUUid(getUUID())
    setTimeout(() => {
      reRenderLines(newNodes)
    })
  }

  const onAddBtn = (item: NodeItem) => {
    const { uiType } = item
    if (uiType === 'app') {
      onAddModule()
    } else if (uiType === 'module') {
      onAddPageByModule(item)
    } else if (['flow', 'page'].includes(uiType)) {
      onAddPage(item)
    }
  }

  const onDoubleClick = (item: NodeItem) => {
    const { uiType } = item
    if (!['page', 'flow'].includes(uiType)) return
    uiType === 'page' ? onDesignPage(item) : onFlowDesign(item)
  }


  //画布拖拽计算
  const onMouseDown = (e: React.MouseEvent) => {
    // 右键不管
    if (e.button === 2) {
      return;
    }
    const el = containerRef.current
    if (!el) return
    let isDown = true;
    const oldX = e.clientX;
    const oldY = e.clientY;
    const jsPlumbContainer = jsPlumbContainerRef.current;
    const offsetLeft = jsPlumbContainer?.offsetLeft || 0;
    const offsetTop = jsPlumbContainer?.offsetTop || 0;

    el.style.cursor = 'move';
    document.onmousemove = (e) => {
      e.preventDefault();
      if (!isDown) {
        return;
      }
      const newX = e.clientX;
      const newY = e.clientY;
      const newLeft = newX - oldX + offsetLeft;
      const newTop = newY - oldY + offsetTop;
      if (jsPlumbContainer) {
        jsPlumbContainer.style.left = newLeft + 'px';
        jsPlumbContainer.style.top = newTop + 'px';
      }
    };
    document.onmouseup = function (e) {
      isDown = false;
      el.style.cursor = 'auto';
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }

  return (
    <>
      <div className={styles['canvas-wrapper']}>

        <Header />

        <div className={styles['canvas-container']} onMouseDown={onMouseDown} ref={containerRef}>
          <Loading spinning={loading} />

          <div className={styles['scale-wrapper']}>
            <ScaleOperate percent={percent} onChange={(count) => setPercent(count)} containerRef={containerRef} />
          </div>

          <div className={styles['canvas-jsplumb']} ref={jsPlumbContainerRef} style={{ zoom: percent / 100 }}>
            {

              nodes.map((item: NodeItem) => {
                const { uiType, id, page_name, module_name, hide, style: { left = 0, top = 0 }, count, openChildren, isHidden } = item
                return <Node
                  key={`${uuid}-${id}`}
                  id={id}
                  type={uiType}
                  name={['page', 'flow'].includes(uiType) ? page_name : module_name}
                  style={{ left, top, display: isHidden ? 'none' : 'block' }}
                  count={count}
                  open={openChildren}
                  hide={hide === Visible.HIDE}
                  renderContextMenu={() => renderContextMenu(item)}
                  onAdd={() => onAddBtn(item)}
                  onOpenChange={(open) => onOpenChange(open, item)}
                  onDoubleClick={() => onDoubleClick(item)}
                  active={!!activeId && activeId === id}
                >
                </Node>
              })
            }
          </div>
        </div>

      </div>
      <AddModule ref={addMoudleRef} onOk={onOk} />
      <AddPage ref={addPageRef} onOk={onOk} />
      <MovePage ref={movePageRef} onOk={onOk}></MovePage>
      <RenamePage ref={renamePageRef} onOk={onOk} />
    </>
  )
}

export default Canvas