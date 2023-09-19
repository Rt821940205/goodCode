import React, { useState, useEffect } from 'react';
import { Button, Modal, Input ,PaginationProps, message} from 'antd';
import SvgIcon from '@/components/svgIcon'
import styles from './index.less'
import { queryComponentList,applyComponent as applyComponentApi } from '@/services/xuanwu/orcherate'
import Pagination from '@/components/pagination';
import Loading from '@/components/loading/index';
import NoData from '@/components/noData';
import { ComponentTabs, ComponentItem } from '../../../flow/component/componentList';
import {useAppId} from '@/pages/componentOrchestrate/hooks'
interface Props{
  isModalOpen: boolean,
  onCancel: () => void,
  applyOk?:()=>void
}



const applyComponent: React.FC<Props> = ({ isModalOpen, onCancel ,applyOk}) => {
  const appId = useAppId()
  
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
  
  const render = async () => {
    if(!appId) return 
    const payload = {
      appId,
      ...pageParams,
      category,
      keyword:keyword.trim()
    }
    setLoading(true)
    try {
      const {components,total} = await queryComponentList({ ...payload })
      const list = total === 0 ? [] : (components || [])
      setList(list)
      setTotal(total)
    } finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    isModalOpen && render()
  }, [isModalOpen,pageParams])

  const onApply = async (componentId:string) => {
    try {
      await applyComponentApi({appId,componentId})
      setList((preList) => {
        const list = [...preList]
        list.some(item => {
          if (item['x-component-id'] === componentId) {
            item.applyStatus = 'PASS'
            return true
          }
          return false
        })
        return list
      })
      applyOk?.()
      message.success('申请成功')
    } catch (err) {
      message.error('申请失败')
    }
  }
  
  return (
    <>
      <div>
        <Modal title="申请组件" open={isModalOpen} onOk={onCancel} onCancel={onCancel} className={styles['apply-component']}
          footer={null}
        >
          <div className={styles['component-title']}>请选择一个组件超市基本配置</div>
          <div className={styles['component-search']}>
            <Input
              placeholder="请输入关键字搜索"
              className={styles['search-input']}
              value={keyword}
              onChange={(e)=>setKeyword(e.target.value)}
            />
            <div className={styles['search-btn']}>
              <Button onClick={()=>setKeyword('')}>
                <SvgIcon iconClass="fa-refresh"></SvgIcon> 重置
              </Button>
              <Button onClick={() => {
                setTotal(0)
                setPageParams((prevState)=>({...prevState,page:1}))
              }}> 
                <SvgIcon iconClass="fa-search"></SvgIcon> 筛选
              </Button>
            </div>
          </div>

          <div className={styles['component-tabs']}>
            <ComponentTabs
               activeKey={category}
               onChange={(key) => {
                setCategory(key)
                setTotal(0)
                setPageParams(preState => ({ ...preState, page: 1 }))
              }}
            />
           
         
            <section className={styles.list}>
                <Loading spinning={loading} />
                {!loading  && list.length === 0 && <NoData />}
                {
                  list.map((item) => 
                    <div className={styles.item} key={item['x-component-id']}>
                      <ComponentItem data={item}>
                        <Button
                          size='small'
                          type='primary'
                          onClick={() => onApply(item['x-component-id'])}
                          disabled={item.applyStatus !== 'NONE'}
                          
                        >
                          {item.applyStatus === 'NONE' ? '申请':'已申请'}
                        </Button>
                      </ComponentItem>
                    </div>
                  
                    )
                }
            </section>
            <Pagination
              size='default'
              current={pageParams.page}
              pageSize={pageParams.limit}
              total={total}
              onChange={onPageChange}
            />
          </div>
        </Modal>
      </div>
    </>
  );
};

export default applyComponent;