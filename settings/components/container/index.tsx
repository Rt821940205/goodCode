import React, {  ReactNode, useCallback } from 'react'
import SearchInput from '../searchInput';
import debounce from 'lodash.debounce';
import styles from './index.less';
import { CloseOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
import classnames from 'classnames';
type ContainerProps = {
  title: string,
  onChange?: (value: string) => void,
  onClose?:()=>void,
  children:ReactNode
}
const Container: React.FC<ContainerProps> = ({ title ,onChange,children,onClose}) => {

  const debounceInputChange = useCallback(debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    onChange?.(value)
  }, 500), [])
  const { menuSpread } = useSelector((state:ConnectState) => ({
    menuSpread:state.settings.menuSpread
  }))
  const dispatch = useDispatch()


  return (
    <div className={classnames(styles.wrapper,{[styles.hidden]:!menuSpread})} >
   
      <h3 className='flex justify-between items-center'>
        {title}
        <CloseOutlined
          className={styles.close}
          onClick={() => {
            if (onClose) return
            dispatch({type:"settings/setMenuSpread",payload:false})
          }}
        />
      </h3>
      
      <SearchInput
        placeholder='请输入'
        onChange={debounceInputChange}
        allowClear
        className='mt-2 mb-2'
      />
      <div className='flex-1 overflow-auto relative pr-1'>
         {children}
      </div>
    </div>
  )
}

export default Container