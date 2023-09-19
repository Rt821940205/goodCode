import React, { useState ,useEffect,useRef,} from 'react'
import styles from './index.less';
import { Input, InputRef, message} from 'antd';
import SvgIcon from '@/components/svgIcon';
import { queryAppInfo,updateAppInfo} from '@/services/xuanwu/magic';
import { useAppId } from '@/pages/componentOrchestrate/hooks';
import { useDispatch, useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
const Header: React.FC = () => {
 
  const { app_name } = useSelector(({ magic:{appInfo} }: ConnectState) => appInfo) 

  const [name, setName] = useState('')

  const [nameEdit, setNameEdit] = useState<boolean>(false)

  const inputRef = useRef<InputRef>(null)

  const appId = useAppId()

  const dipatch = useDispatch()

  useEffect(() => {
    setName(app_name)
  }, [app_name])
  

  useEffect(() => {
    if (nameEdit) {
       inputRef.current?.focus({
        cursor:'end'
       });
    } else {
      updateName()
    }
    
  }, [nameEdit])

  
  const setAppInfo = async () => { 
    const data = await queryAppInfo({ appId })
    const app_name = data.find_sys_app?.[0].app_name
    dipatch({
      type: 'magic/setAppInfo',
      payload: {
        app_name,
        id:appId
      }
    })
  }
 
  const updateName = async () => { 
    if (!name  || name === app_name) return
    await updateAppInfo({ appId, app_name: name })
    dipatch({
      type: 'magic/setAppInfo',
      payload: {
        app_name:name,
        id:appId
      }
    })
    message.success('修改成功')
  }

  useEffect(() => {
    setAppInfo()
  }, [])
  
  return (
    <>
    <header className={styles.wrapper}>
      <div className='flex items-center'>
          <SvgIcon iconClass="app-name" className='m-0 text-xl'></SvgIcon>
            {
             nameEdit ?
             <Input
                style={{margin:'0 0.5rem'}}
                ref={inputRef}
                maxLength={20}
                value={name}
                onChange={(e)=>setName(e.target.value)}
                onBlur={
                  () => {
                    setNameEdit(false)
                  }
                }
                /> 
               :
                <span className={styles.name}>{ name }</span>
            }
            <SvgIcon
              iconClass="manage-name-edit"
              style={{ cursor: 'pointer', fontSize: '13px' }}
              onClick={(e) => {
                e.preventDefault()
                setNameEdit(edit => !edit)
              }}
             />
          </div>
      </header>
    </>
  )
}

export default Header