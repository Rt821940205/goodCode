/**
 * body
 */
export const modelComponentActionBody = [
  {
    type: 'hidden',
    name: 'modelId'
  },
  {
    type: 'select',
    label: '组件：',
    required:true,
    placeholder: '请选择',
    name: 'componentId',
    searchable:true,
    source: {
      method: 'post',
      url: '/api/def/model/pages?_=componentAll',
      requestAdaptor: function (api: any) {
        return {
          ...api,
          data: {
            categories: [101016],
            state: 1,
            pageSize: 100,
          },
        };
      },
      adaptor: function (payload: any) {
        let list: Array<any> = payload.data.data;
        const result: Array<any> = list.map((item: any) => {
          return {
            label: item.displayName,
            value: item.id + '__' + item.displayName
          }
        });
        return {
          data: {
            options: result
          }
        };
      }
    }
  },
  {
    type: 'select',
    label: '组件配置',
    searchable: true,
    name: 'configModelId',
    required:true,
    initFetchOn: 'this.componentId',
    source: {
      method: 'post',
      url: '/api/def/model/pages?_=componentConfig&componentId=${componentId}',
      requestAdaptor: function (api: any) {
        let componentId = api.query.componentId
        componentId = componentId.substring(0,componentId.indexOf('__'))
        return {
          ...api,
          data: {
            pageNum: 1,
            parentId: componentId,
            pageSize: 100,
            categories: [101015],
            state: 1,
          },
        };
      },
      adaptor: function (payload: any) {
        let list: Array<any> = payload.data.data;
        const result: Array<any> = list.map((item: any) => {
          return {
            label: item.displayName,
            value: item.id
          }
        });
        return {
          data: {
            options: result
          }
        };
      }
    }
  },
  {
    type: 'select',
    label: '组件action',
    searchable: true,
    name: 'actionName',
    required:true,
    initFetchOn: 'this.componentId',
    source: {
      method: 'get',
      url: '/api/def/model/complete/info?componentId=${componentId}',
      requestAdaptor:function (api:any){
        let componentId = api.query.componentId
        componentId = componentId.substring(0,componentId.indexOf('__'))
        return {
          ...api,
          data: {
            modelId: componentId
          }
        }
      },
      adaptor: function (payload: any) {
        let list: Array<any> = payload.data.actions;
        const result: Array<any> = list.map((item: any) => {
          return {
            label: item.displayName,
            value: item.name + '|__|' + item.displayName
          }
        });
        return {
          data: {
            options: result
          }
        };
      }
    }
  },
]

  /**
 * 实体action 绑定组件
 */
export const modelComponentActionAdd = {
  type: 'form',
  api: {
    method: 'post',
    url: '/api/def/model/action/bind/component',
    requestAdaptor:function (api:any){
      let displayName = api.data.componentId
      displayName = displayName.substring(displayName.indexOf('__')+2)
      let actionNameOld = api.data.actionName
      let actionName = actionNameOld.substring(0,actionNameOld.indexOf('|__|'))
      let action = api.data.actionName
      displayName = displayName + '(' +  action.substring(action.indexOf('|__|')+4) + ')'
      return{
        ...api,
        data:{
          ...api.data,
          displayName:displayName,
          actionName:actionName
        }
      }
    },
    adaptor: function (payload: any) {
      let data = payload.data;
      return {
        data: data,
      };
    },
  },
  reload: 'actionsForm',
  data: {
    name: '',
    actionType: '',
    displayName: '',
    description: '',
    nonList: false,
    returnType: '$modelName',
    modelId: '$id',
    id: '',
  },
  mode: 'horizontal',
  body: modelComponentActionBody,
};


