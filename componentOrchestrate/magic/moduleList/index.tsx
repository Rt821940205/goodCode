import React, { useState ,useCallback, useEffect} from 'react'
import styles from './index.less';
import SearchInput from '../../components/searchInput';
import { Collapse } from 'antd';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import {CloseOutlined} from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import { NodeItem } from '@/@types/magic';
import { ConnectState } from '@/models/connect';
import classnames from 'classnames';
const { Panel } = Collapse;

type ModuleItem = {
  id:string,
  name: string,
  module_id:string,
  parent_id:string,
  children?: ModuleItem[],
  active?:boolean,
  [key:string]:any
}

const getName = (item: NodeItem) => {
  const { page_name, module_name, uiType } = item
  return ( ['page', 'flow'].includes(uiType) ? page_name : module_name) || ''
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

  const nodes: NodeItem[] = useSelector(({ magic: { nodes } }: ConnectState) => nodes)

  const moduleMenuVisible:boolean = useSelector(({ magic: { moduleMenuVisible } }: ConnectState) => moduleMenuVisible)

  const dispatch = useDispatch()

  const [modules, setModules] = useState<ModuleItem[]>([])

  const [activeKeys, setActiveKeys] = useState<string[]>([])

  const [activeIds, setActiveIds] = useState<string[]>([])



  useEffect(() => {
    const filterNodes: NodeItem[] = nodes.filter(i => i.uiType === 'module')
    const moduleNodes:ModuleItem[] = filterNodes.map((node):ModuleItem => {
      const { parent_id = '', id, children,module_id = '' } = node
      const name = getName(node)
      const formatChildren:ModuleItem[] = tree2list(children).map(item => {
        const { parent_id = '',id,module_id = ''} = item
        const name = getName(item)
        return {name,parent_id,id,module_id,children:[]}
      })
      return {name,parent_id,id,module_id,children:formatChildren}
    })
    setModules(moduleNodes)
  }, [nodes])

  const onItemClick = (item: ModuleItem) => {
    const { id } = item

    dispatch({
      type: 'magic/setActiveId',
      payload:id
    })
  }

  const debounceInputChange = useCallback(debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    //精确匹配页面模块
    const activeKeys: string[] = []

    const findIds: string[] = []

    setModules((modules) => {
      const newMoudles = [...modules]
      const trave = (tree: ModuleItem) => {
        let { module_id, children ,id} = tree
        if (module_id) {
          if (value && tree.name.indexOf(value) !== -1) {
            activeKeys.push(module_id)
            findIds.push(id)
          }
        }
        if (children && children.length) {
          children.forEach((tree) => {
            trave(tree)
          })
        }
      }
      newMoudles.forEach((module) => trave(module))
      return newMoudles
    })
    setActiveKeys(activeKeys)
    setActiveIds(findIds)

  }, 500), [])

  const onCollapseChange = (key: string | string[]) => {
    setActiveKeys([...key])
  }

  return (
    <div
      className={classnames(styles.wrapper, { [styles.hidden]: !moduleMenuVisible })}>
      <h3 className='flex justify-between items-center'>
        模块菜单
        <CloseOutlined
          className={styles.close}
          onClick={() => {
            dispatch({
              type: "magic/setModuleMenuVisible",
              payload:false
            })
          }}
        />
      </h3>

      <SearchInput
        placeholder='请输入'
        onChange={debounceInputChange}
        className='mb-2'
        allowClear
      />

      <Collapse
        accordion={false}
        activeKey={activeKeys}
        expandIconPosition='end'
        className={styles['module-list']}
        onChange={onCollapseChange}
        ghost
      >
        {
          modules.map(({ id, name, children = []}) => {
            return <Panel
              key={id}
              header={name}
              style={{ padding: 0 }}
              showArrow={ children.length > 0 }>
              {
                children.map((item) => {
                  const {id,name } =  item
                  return <div
                    key={id}
                    className={classNames(styles.item, { [styles.active]: activeIds.includes(id) })}
                    onClick={()=>onItemClick(item)}
                  >
                    <span className='overflow-line-1' title={name}>{name}</span>
                  </div>
                })
              }

            </Panel>
          })
        }
      </Collapse>
    </div>
  )
}

export default ModuleList