
import { useLocation ,useModel} from 'umi'
import { useEffect, useRef, useState } from "react";


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

export const useCurrentValue = (value:any) => {
  const currentValue = useRef()
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