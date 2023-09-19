

export const GlobalInDefine = {

  update: (globalConfigList: any, value: any, index: any, key: any) => {
    let some = { ...globalConfigList[index] }
    try {
      some[key] = typeof value == 'string' ? value : JSON.stringify(value);
    } catch {
      some[key] = value;
    }
    globalConfigList[index] = some;
    return [...globalConfigList];
  },

  getGlobalInWithName: (data: any) => {
    return data.map((item: any, index: number) => {
      var { name, title, value, sample } = item
      return {
        ...item,
        key: name,
        title,
        value,
        sample
      }
    })
  },

  getGlobalInWithIndex: (globalConfigList: any) => {
    return globalConfigList.map((item: any, index: number) => {
      var { key, title, value, sample } = item
      return {
        ...item,
        key: index,
        name: key,
        title,
        value,
        sample,
      }
    })
  },

  getUpdateWithSample: (globalConfigList: any, nodeId: string, dynamic: any, itemValue: any) => {

    return globalConfigList.map((item: any, index: number) => {
      if (item.nodeId == nodeId && item.originKey == (dynamic?.name || dynamic.key)) {
        item.sample = itemValue;
      }
      console.log('找到的数据',item)
      var { title, value, sample } = item
      return {
        ...item,
        title,
        value,
        sample
      }
    })
  },


  find: (globalConfigList: any, nodeId: string, dynamic: any) => {
    return globalConfigList.find((i: any) => i.nodeId == nodeId && i.originKey == (dynamic?.name || dynamic.key));
  },

  getGlobalInStaticValue:(inputValue:any)=>{
   return  {
      key: inputValue,
      node: 'static',
      parentKey: 'static',
      title: inputValue
    }
  }
}
