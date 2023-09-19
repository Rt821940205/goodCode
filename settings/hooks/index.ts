
import { useDispatch, useHistory, useLocation ,useModel} from 'umi'
import { useEffect, useRef, useState } from "react";
import { TabListItem } from '@/@types/settings';


export const useLocalRoute = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const openRoute = (tab:TabListItem ) => {
    if(!tab?.path)return
    const { label, key, path, parentKey = '' } = tab
    const tabItem = {
      label,
      key,
      path,
      parentKey
    }
    dispatch({
      type: 'settings/addTabItem',
      payload: tabItem
    })
    dispatch({
      type: 'settings/setActiveTabKey',
      payload:tabItem.key
    })
    history.push(path)
  }
  return {
    openRoute
  }
}

export const useAppId = () => {
  const location = useLocation()
  const appId = new URLSearchParams(location.search).get('appId') || ''
  return appId
}

export const  useOnClickOutside = (ref:any, handler:(event:MouseEvent)=>void)=>{
  useEffect(
    () => {
      const listener = (event: MouseEvent) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("click", listener);
      return () => {
        document.removeEventListener("click", listener);
      };
    },
    [ref, handler]
  );
}

export const useLeaveForm = (ref: any,onCancel?:()=>void) => {
  const isChangeRef = useRef(false)
  const [openModal, setOpenModal] = useState(false)
  useOnClickOutside(ref, () => {
    isChangeRef.current ? setOpenModal(true) :onCancel?.()
  })
  const onValuesChange = () => {
    isChangeRef.current = true
  }
  return {
    onValuesChange,
    openModal,
    setOpenModal
  }
}

export const useCurrentValue = <T>(value:any) => {
  const currentValue = useRef<T>()
  useEffect(() => {
    currentValue.current = value
  }, [value])
  return currentValue
}


// 数据魔方、数据工坊展示
export const useDataVisible = ():[boolean,boolean] => {
  const { initialState } = useModel('@@initialState');
  const { feature_sjmf_enabled, feature_sjgf_enabled } = initialState?.settings || {}
  return [feature_sjmf_enabled === '1',feature_sjgf_enabled === '1']
}