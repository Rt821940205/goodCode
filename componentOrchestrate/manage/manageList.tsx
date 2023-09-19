import React, { useState ,useEffect,useCallback, useImperativeHandle,useRef} from 'react'
import styles from './manageList.less';
import { Button,Input,PaginationProps} from 'antd';
import ApplyComponent from '../manage/flow/componentManager/ApplyComponent';
import { SearchOutlined } from '@ant-design/icons';
import { queryAppliedComponent } from '@/services/xuanwu/orcherate'
import Loading from '@/components/loading/index';
import NoData from '@/components/noData';
import Pagination from '@/components/pagination';
import debounce from 'lodash.debounce'

import {useAppId} from '@/pages/componentOrchestrate/hooks'
import {ComponentTabs,ComponentItem} from './flow/component/componentList';
import { useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
type ListProps = {
  onItemClick?: (item: API.ComponentItem) => void,
}
export const List: React.FC<ListProps> = React.forwardRef(({ onItemClick},ref) => {
  
  const appId = useAppId()

  useImperativeHandle(ref, () => ({
   refresh: render
  }))

  const [pageParams, setPageParams] = useState({
    page: 1,
    limit: 10,
  })

  const [list, setList] = useState<API.ComponentItem[]>([])

  const [category, setCategory] = useState('')

  const [total, setTotal] = useState(0)
  
  const [keyword, setKeyword] = useState('')

  const [loading, setLoading] = useState(false)
  

  const onPageChange: PaginationProps['onChange'] = (page, pageSize) => {
    setPageParams({page,limit:pageSize})
  }
  
  const debounceInputChange = useCallback(debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
    setTotal(0)
    setPageParams((prevState)=>({...prevState,page:1}))
  }, 500), [])
  
  const render =  async () => {
    const payload = {
      appId,
      ...pageParams,
      category,
      keyword:keyword.trim()
    }
    setLoading(true)
    try {
      const {components,total} = await queryAppliedComponent({ ...payload })
      const list = total === 0 ? [] : (components || [])
      console.debug('组件列表', list)
      setList(list)
      setTotal(total)
    } finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    render()
  }, [pageParams])

  return (
    < >
      <Input
          placeholder='请输入关键字搜索'
          size='large'
          suffix={<SearchOutlined style={{ color: '#999' }} />}
          onChange={debounceInputChange}
          className={styles.search}
        />

        <ComponentTabs
         activeKey={category}
         onChange={(key) => {
          setCategory(key)
          setTotal(0)
          setPageParams(preState => ({ ...preState, page: 1 }))
          }}
        />

        <section className={styles.list}>
          {!loading  && list.length === 0  && <NoData />}
          <Loading spinning={loading} />
          {
          list.map((item) => <ComponentItem
            data={item}
            key={item['x-component-id']}
            onClick={() => onItemClick?.(item)}
          />)
          }
        </section>
        
        <Pagination
          current={pageParams.page}
          pageSize={pageParams.limit}
          total={total}
          onChange={onPageChange}
        />
     
    </>
  )
})

const ManageList: React.FC = () => {
  const [open, setOpen] = useState(false)

  const listRef = useRef() as React.MutableRefObject<any>

  const menuSpread = useSelector(({ magic: { menuSpread } }: ConnectState) => menuSpread)

  return (
    <div className={ !menuSpread ? styles.hidden:''}>
      <div className={styles['managelist-wrapper']}>
        <h3>组件管理</h3>
        <List ref={ listRef}/>
        <div style={{ textAlign: "center" ,margin:'10px 0'}}>
          <Button type="primary"  onClick={()=>setOpen(true)}>没有我要的组件?点击申请&gt; </Button>
        </div>
      </div>
      <ApplyComponent
        isModalOpen={open}
        onCancel={() => setOpen(false)}
        applyOk={()=>listRef.current?.refresh()}
      >
      </ApplyComponent>
    </div>
  )
}

export default ManageList