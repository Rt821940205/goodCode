import React, { useState ,useEffect} from 'react'
import {ComponentTabs,ComponentItem} from '@/pages/componentOrchestrate/manage/flow/component/componentList';
import Pagination from '@/components/pagination';
import Loading from '@/components/loading/index';
import NoData from '@/components/noData';
import { PaginationProps,Button } from 'antd';
import { useAppId } from '@/pages/settings/hooks';
import { queryAppliedComponent } from '@/services/xuanwu/orcherate'
import ApplyComponent from '@/pages/componentOrchestrate/manage/flow/componentManager/ApplyComponent';
const ApplyList: React.FC = () => {
  const [category, setCategory] = useState('')
  const [total, setTotal] = useState(0)
  const [pageParams, setPageParams] = useState({
    page: 1,
    limit: 10,
  })
  const onPageChange: PaginationProps['onChange'] = (page, pageSize) => {
    setPageParams({page,limit:pageSize})
  }
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<API.ComponentItem[]>([])
  const [open, setOpen] = useState(false)
  const appId = useAppId()
  const render =  async () => {
    const payload = {
      appId,
      ...pageParams,
      category,
      keyword:''
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
    <>
      <ComponentTabs
        activeKey={category}
        onChange={(key) => {
          setCategory(key)
          setTotal(0)
          setPageParams(preState => ({ ...preState, page: 1 }))
        }}
      />
        <section className='flex-1 overflow-auto relative'>
          {!loading  && list.length === 0  && <NoData />}
          <Loading spinning={loading} />
          {
            list.map((item) => <ComponentItem
              data={item}
              key={item['x-component-id']}
            />)
          }
        </section>

      <Pagination
          current={pageParams.page}
          pageSize={pageParams.limit}
          total={total}
          onChange={onPageChange}
      />
      <div style={{ textAlign: "center" ,margin:'10px 0'}}>
        <Button type="primary"  onClick={()=>setOpen(true)}>没有我要的组件?点击申请&gt; </Button>
      </div>
      
      <ApplyComponent
        isModalOpen={open}
        onCancel={() => setOpen(false)}
        applyOk={()=>{render()}}
      >
      </ApplyComponent>
    </>
  )
}

export default ApplyList