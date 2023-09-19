import React, { useEffect, useState } from 'react';
import styles from './index.less'
import SvgIcon from '@/components/svgIcon'
import { Input, Switch } from 'antd'
import { AmisProperty } from "../../components/AmisProperty";
interface Props {
  value?: any[],
  inputClick: (field?: string | number, f?: string | number) => void,
  onChange?: (value: any) => void;
  checked?: boolean,
  placeholder?: string,
  isDelete?: boolean,
  isNoInput?: boolean,
  dynamic?: any
}
export const CustomInput: React.FC<Props> = (Props) => {
  var { dynamic, inputClick, onChange, checked = true, placeholder, isDelete = true, isNoInput = false, value = [] } = Props

  console.log('dynamic',dynamic);
  // if (!dynamic) {
  //   return <></>;
  // }

  // 简单数据处理
  let [simpleValue, setSimpleValue] = useState(typeof dynamic?.value === 'object' && dynamic?.value.length > 0 && dynamic?.value[0].key || '')
  console.debug('动态表单数据', dynamic)

  const onVariable = () => {
    inputClick()
  }
  const triggerChange = (value: any) => {
    console.log(value)
    onChange?.(value)
  };

  const onDelete = (e: any, index: number) => {
    let newValue = [...value]
    newValue.splice(index, 1)
    triggerChange(newValue)
  }
  const [inputValue, setInputValue] = useState('')
  const onkeydown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.keyCode === 13 && inputValue) {
      triggerChange([...value, {
        key: inputValue,
        node: 'static',
        parentKey: 'static',
        title: inputValue
      }])
      setInputValue('')

    }

    if (e.keyCode === 8 && inputValue == '' && value.length > 0) {
      onDelete(e, value.length - 1)
    }


  }
  const onBlur = () => {
    if (inputValue) {
      value.push({
        key: inputValue,
        node: 'static',
        parentKey: 'static',
        title: inputValue
      })
      triggerChange(value)
      setInputValue('')
    }
  }

  const onSimpleEvent = (v: any) => {
    let newValue = [{
      key: v,
      node: 'static',
      parentKey: 'static',
      title: v
    }]
    triggerChange(newValue)
    setSimpleValue(v)

  }

  return (
    // 暂使用本地定义，后期可优化为远程描述自定义
    dynamic && dynamic['x-ui-simple'] && dynamic?.type == 'boolean' ?

      <>
        <Switch checked={simpleValue == 'true'} onChange={(v) => onSimpleEvent(v.toString())}></Switch>
      </> :

      <>
        <div suppressContentEditableWarning contentEditable={isNoInput ? false : true} className={`${styles['edit-div']} ${isNoInput ? styles['no-edit-div'] : ''} ${dynamic?.readOnly ? styles['read-only'] : ''}`}>
          {
            Array.isArray(value) && value?.map((item: any, index: number) => {
              return <span className={styles.mr} key={index}>


                <div className={styles.variable} contentEditable={false} >
                  <AmisProperty dynamic={dynamic} value={value} inputClick={() => onVariable()} index={index}></AmisProperty>
                  <div>{item.serialNumber ? `${item.serialNumber} |` : ''}</div>
                  <div className={styles.overflow} title={item.title}>
                    <span> {checked ? item.title : item.key}
                      {
                        (!item.title && item.serialNumber == '全局输入') && <span className={styles.warn}>未找到</span>
                      }
                    </span>
                  </div>
                  {
                    isDelete && <SvgIcon iconClass="close" className={styles.svgicon} onClick={(e: any) => onDelete(e, index)}></SvgIcon>
                  }
                </div>
              </span>
            })
          }
          {

            !isNoInput && <div className={styles['input-style']}>
              <Input disabled={dynamic?.readOnly} onClick={() => onVariable()} placeholder={value && value.length > 0 ? '' : placeholder} value={inputValue} onChange={e => {
                setInputValue(e.target.value)
              }} onKeyDown={(e) => onkeydown(e)} onBlur={() => onBlur()}></Input>
            </div>
          }

          {
            (!value || value.length == 0) && dynamic && !dynamic?.readOnly && <AmisProperty dynamic={dynamic} value={value} inputClick={() => onVariable()} ></AmisProperty>
          }
        </div>
      </>
  );
};
