import React, { useEffect, useState,useCallback, useRef } from 'react'

import styles from './index.less';
import Loading from '@/components/loading/index';
import NoData from '@/components/noData';
import SvgIcon from '@/components/svgIcon';
import SearchInput from '../../components/searchInput';
import { queryMagicList ,queryWorkShopList } from '@/services/xuanwu/magic';
import debounce from 'lodash.debounce';
import ChooseModule, {type  ChooseModuleRefProps} from './chooseModule';
import { useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
import {  MenuType } from '@/@types/magic';
import classnames from 'classnames';

export type ListItem = {
  applicationid: string,
  applicationname: string,
  name?:string,
  description:string,
  icon?: string,
  detail?:any,
  [key:string]:any
}

const getMagicList = (value?:string): Promise<ListItem[]> => {
 
  return new Promise((resolve, reject) => {
    queryMagicList(value || "").then((data) => {
      let list = data
      list =list
            .map((i: ListItem) => {
              let { detail } = i
              detail = detail && JSON.parse(detail) || {}
              return {...i, detail,icon:detail.iconUrl}
            })
            .filter((i: ListItem) => { 
              const params = i.detail.params || []
              return  params.some((par:any) => {
                return (par.nodeType === 'DATA_SET' && par?.dataSetColumns?.length > 0) || par.nodeType === 'ODPS_COMPARE'
              })
            })
      resolve(list)
    })
  });
}

const getWorkShopList = (value?:string): Promise<ListItem[]> => {

  return new Promise((resolve, reject) => {
    queryWorkShopList(value || "").then((data) => {
      let list = data.map((i: ListItem) => {
        let { detail } = i
        detail = detail && JSON.parse(detail) || {}
        return {...i, detail,icon:detail.iconUrl,applicationname:i.name}
      })
      resolve(list)
    })
  });
}

const DataList: React.FC = () => {

  const [loading, setLoading] = useState(false)

  const [list, setList] = useState<ListItem[]>([])

  const activeMenu = useSelector(({ magic: { activeMenu } }: ConnectState) => activeMenu)
  
  const menuSpread = useSelector(({ magic: { menuSpread } }:ConnectState)=> menuSpread )

  const chooseModuleRef = useRef<ChooseModuleRefProps>(null)
  const render = async (value?: string) => {
    if(![MenuType.MAGIC,MenuType.WORKSHOP]) return
    try {
      setLoading(true)
      const data:ListItem[] = await (activeMenu === MenuType.MAGIC ? getMagicList(value):getWorkShopList(value))
      setList(data || [])
    } finally {
      setLoading(false)
    }
  }
 

  useEffect(() => {
    render()
  }, [activeMenu])
  
  const debounceInputChange = useCallback(debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    render(value)
  }, 500), [activeMenu])

  const onItemClick = (item:ListItem) => { 
    chooseModuleRef.current?.init(item)
  }

  return (
    <>
     <div className={classnames(styles.wrapper,{[styles.hidden]:!menuSpread})}>
        <h3>数据{activeMenu === MenuType.WORKSHOP ? '工坊' : '魔方'}</h3>
        <SearchInput
          placeholder='搜索应用'
          onChange={debounceInputChange}
          allowClear
        />
        <div className='flex-1 overflow-auto relative'>
          {!loading && list.length === 0 && <NoData/>}
          <Loading spinning={loading} />
          {
            list.map((item) => {
              const { applicationid,applicationname,description,icon} = item
              return <div key={applicationid} className={styles.item} onClick={()=>onItemClick(item)}>
                <div>
                  {icon ?
                    <img src={`data:image/png;base64,${icon}`} className={styles['image']} />
                    : <SvgIcon iconClass='default-node-choose' style={{ fontSize: '2rem' }} />}
                </div>
                <div className='flex flex-col' >
                  <span className='overflow-line-1' title={ applicationname }>{ applicationname}</span>
                  <span className='text-gray overflow-line-1' title={description}>{description }</span>
                </div>
              </div>
            })
          }
        </div>
      </div>
      <ChooseModule ref={chooseModuleRef} dataType={ activeMenu } />
    </>
  )
}

export default DataList