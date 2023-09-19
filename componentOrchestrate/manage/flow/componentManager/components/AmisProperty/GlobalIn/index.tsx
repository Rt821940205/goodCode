import React from 'react';
import styles from './index.less'
import { Button, Typography, message } from 'antd'
import { useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
import {
  SettingOutlined
} from '@ant-design/icons';

import { AmisProperty } from "../../AmisProperty";
import { GlobalInDefine } from "@/pages/componentOrchestrate/GlobalInDefine";
import { Define } from '@/pages/componentOrchestrate/AmisPropertyDefine';
;


interface Props {
  nodeId?: any,
  title?: any,
  valueKey?: any,
  inputClick: any,
  dynamic: any

}
export const GlobalInProperty: React.FC<Props> = (Props) => {

  var { nodeId, title, valueKey, dynamic, inputClick } = Props

  const globalConfigList = useSelector(({ orchestrate: { globalConfigList } }: ConnectState) => globalConfigList)

  console.debug('Props', Props, valueKey, dynamic, globalConfigList)

  const callback = (data: any) => {
    console.debug('返回值', data)
    let value = Define.getAmisDataValue(data);
    if (!value) {
      // 提示配置
      message.error(`请为已绑定的全局输入参数"${dynamic.title}"配置示例值，以用于节点测试`);
    }
    inputClick(value);
  }

  let value: any = []
  let btn = null;
  // const inputValue = dynamic?.valueKey 

  // if (inputValue) {
  //   value = [GlobalInDefine.getGlobalInStaticValue(inputValue)]
  // }


  console.debug('nodeId', nodeId)
  if (nodeId) {
    const nodeFind = GlobalInDefine.find(globalConfigList, nodeId, dynamic);
    if (nodeFind) {
      dynamic = nodeFind;
      const inValue = dynamic[valueKey]
      value = [GlobalInDefine.getGlobalInStaticValue(inValue)]
      btn = <Typography.Text>已绑定参数到全局输入<SettingOutlined className={styles.icon} /></Typography.Text>;
    } else {
      btn = <Button type="primary">{`绑定参数到全局输入`}</Button>;
    }
  } else {
    const inValue = dynamic[valueKey]
    value = [GlobalInDefine.getGlobalInStaticValue(inValue)]
  }

  console.debug('全局参数值', valueKey, title, value)

  console.debug('全局参数值dynamic', dynamic)
  console.debug('GlobalIn准备绑定AmisProperty数据', globalConfigList, valueKey, dynamic, value)

  return (
    <>
      <AmisProperty dataTitle={title} btn={btn} dynamic={dynamic} value={value} inputClick={(ret: any) => callback(ret)} ></AmisProperty>
    </>
  );
};
