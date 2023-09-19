export const checkboxForm = {
  type: 'form',
  name: 'pageSetting',
  className: 'role-form',
  panelClassName:"wrap-with-panel-false",
  api: {
    method: 'post',
    url: '/api/authority/role/grantResourceByRoleId?roleId=${chooseId}',
    requestAdaptor: function (api: any) {
      let permissionCheck:string = api.data.permissionCheck
      let roleId = api.data.chooseId
      let resources: Array<string> = permissionCheck.split(',')
      return {
        ...api,
        data: {
          roleId: roleId,
          type: 'module',
          resourceIds: resources
        }
      }
    },
    adaptor: function (payload: any) {
      return {
        ...payload,
      }
    }
  },
  initApi: {
    method: 'post',
    url: '/api/authority/resource/listByRoleId?roleId=${chooseId}&appId=1',
    requestAdaptor: function (api: any) {
      return {
        ...api,
        data: {
          roleId:api.query.roleId
        }
      }
    },
    adaptor: function (payload: any) {
      let permissionCheck = ''
      if(Array.isArray(payload.errors)){
        console.log(JSON.stringify(payload.errors))
        return {
          ...payload,
          data: {
            resourceList: [],
            permissionCheck: permissionCheck
          }
        }
      }
      payload.data.filter((item:any) => {
        return item.type == 'module' && item.parentId != undefined
      }).forEach((item:any) => {
        if(permissionCheck == ''){
          permissionCheck = item.xid
        }else {
          permissionCheck = permissionCheck + ',' + item.xid
        }
      })
      return {
        ...payload,
        data: {
          resourceList: payload.data,
          permissionCheck: permissionCheck
        }
      }
    }
  },
  title: '',
  body: [
    {
      type: 'hidden',
      name: 'roleId'
    },
    {
      type: 'checkbox',
      label: '模块',
      mode: 'horizontal',
      option: "页面",
      className: 'role-form-checkbox',
    },
    {
      type: 'service',
      schemaApi:{
        method: 'post',
        url: '/api/graphql',
        data:{
          query: `{find_sys_resource(obj: {type:"module",state:1,app_id:1}) {
                                  permission
                                  name
                                  id
                                  parent_id
                                }
                   }`
        },
        adaptor:function (payload:any){
          let resourceList = payload.data.find_sys_resource
          let rootList = resourceList.filter((item:any) => {return item.parent_id == '' || item.parent_id == undefined})
          let checkboxList:Array<any> = []
          rootList.forEach((item:any)=> {
            let options:Array<any> = resourceList.filter((inner:any) => {return item.id == inner.parent_id}).map((item:any)=>{
              return {
                label: item.name,
                value: item.id
              }
            })
            const checkboxUnit:any =  {
              type: 'checkboxes', name: 'permissionCheck', label: '',
              mode: 'horizontal',
              className: 'role-form-checkboxes',
            }
            checkboxUnit.label = item.name
            checkboxUnit.options = options
            checkboxList.push(checkboxUnit)
          })
          return{
            type: 'container',
            body:[
              ...checkboxList
            ]
          }
        }
      }
    }
  ]
}


/**
 * 页面配置
 */
export const pageConfig = {
  title: '页面配置',
  reload:true,
  className: 'user-tabs-info user-tabs-info-tableform',
  tab: checkboxForm
}
