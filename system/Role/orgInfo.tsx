
/**
 * 组织信息
 */
export  const orgInfo = {
  title: '组织信息',
  reload:true,
  tab: [{
    type: 'crud',
    name: 'organizeList',
    initFetchOn: 'this.chooseId',
    data:{
      chooseId:"$chooseId"
    },
    api: {
      method: 'post',
      url: '/api/graphql?query=${chooseId}',
      data: {
        query: `{
                            find_sys_role_organize(obj: {role_id: "$chooseId" }) {
                              role_id
                              id
                              sys_role_organize_just_sys_organize{
                                organize_name
                                category
                                remark
                              }
                            }
                          }`,
        variables: null,
      },
      adaptor: function (payload: any) {
        let items: Array<any> = []
        let role_users = payload?.data?.find_sys_role_organize
        role_users?.filter((item:any) => {
          return item.sys_role_organize_just_sys_organize != undefined
        }).forEach((item: any) => {
          items.push({
            id: item.id,
            organize_name: item.sys_role_organize_just_sys_organize?.organize_name,
            category: item.sys_role_organize_just_sys_organize?.category,
            remark: item.sys_role_organize_just_sys_organize?.remark
          })
        })
        return {
          members: items
        };
      },
    },
    syncLocation: false,
    autoGenerateFilter: true,
    headerToolbar:[
      {
        type: 'button',
        level: 'primary',
        label:'添加',
        align: 'right',
        actionType: 'dialog',
        reload: 'organizeList',
        dialog: {
          title: '添加组织',
          size: 'lg',
          reload: 'organizeList',
          body: [
            {
              type: 'form',
              size: 'lg',
              reload: 'organizeList',
              initApi:{
                method: 'post',
                url: '/api/graphql?_=initRoleOrganize&role_id=${chooseId}',
                data:{
                  query: `query(\\$obj:input_sys_role_organize!){
                            find_sys_role_organize(obj: \\$obj){organize_id sys_role_organize_just_sys_organize{
                              category
                            }}
                          }`,
                  variables: {
                    obj:{
                      role_id: '${chooseId}',state:1
                    }
                  }
                },
                adaptor:function (payload:any){
                  let organize_id = ''
                  payload.data.find_sys_role_organize.filter((item:any) => {
                    return item.sys_role_organize_just_sys_organize != undefined
                  }).forEach((item:any) => {
                    if(organize_id == ''){
                      organize_id = item.organize_id + '__' +item.sys_role_organize_just_sys_organize.category
                    }else {
                      organize_id =  organize_id + ',' + item.organize_id + '__' +item.sys_role_organize_just_sys_organize.category
                    }
                  })
                  return {
                    ...payload,
                    data:{
                      organize_id:organize_id
                    }
                  }
                }
              },
              api:{
                method: 'post',
                url: '/api/graphql?_=createRoleOrganize&role_id=${chooseId}',
                data:{
                  organize_id:'$organize_id',
                  query: `mutation create(\\$obj:input_sys_role_organize!){
                            create_sys_role_organize(obj: \\$obj)
                          }`,
                  variables: {
                    obj:{
                      role_id: '${chooseId}',
                      organize_id: '${organize_id}',
                    }
                  }
                },
                requestAdaptor:function (api:any){
                  let organize_ids = api.data.organize_id
                  const organizeIds = organize_ids?.split(',')?organize_ids?.split(','):[]
                  if(Array.isArray(organizeIds) && organizeIds.length == 0){
                    return {
                      ...api,
                      data:{
                        skip:true
                      }
                    }
                  }
                  let query = `mutation create(`
                  let queryBody = ''
                  let role_id = api.data.variables.obj.role_id
                  const objs: Array<any> = []
                  organizeIds.forEach((organize_id: string) => {
                    let cIndex = organize_id.indexOf('__')
                    if(-1 != cIndex){
                      organize_id = organize_id.substring(0,cIndex)
                    }
                    objs.push({
                      role_id: role_id,
                      organize_id: organize_id
                    })
                  })
                  let variables = {}
                  objs.forEach((obj, index) => {
                    query = query + '$obj' + index + ':input_sys_role_organize!,'
                    variables['obj' + index] = obj
                    queryBody = queryBody + 'role_organize' + index + ':' + 'create_sys_role_organize(obj: $obj' + index + ')  '
                  })
                  query = query.substring(0, query.length - 1)
                  query = query + '){' + queryBody + '}'
                  console.log('=== query: ', query)
                  console.log('=== variables: ', variables)
                  return {
                    ...api,
                    data: {
                      query: query,
                      variables: variables
                    }
                  }
                },
                adaptor:function (payload:any,response:any,api:any){
                  if(api.data.skip != undefined && api.data.skip == true){
                    return {
                      status: 0,
                      msg: '保存成功'
                    }
                  }
                  return {
                    ...payload
                  }
                }
              },
              body: [
                {
                  type: 'hidden',
                  name : 'chooseId'
                },
                {
                  name: 'organize_id',
                  // type: 'tabs-transfer-picker',
                  type: 'transfer',
                  label: '请选择一个组织',
                  placeholder: '请选择',
                  selectMode: 'tree',
                  pickerSize: 'full',
                  size: 'full',
                  source: {
                    method: 'post',
                    url: '/api/graphql',
                    data: {

                      query:`{
                offices:find_sys_organize(obj:{state:1}){id code organize_name level parent_id category}
              }`,
                      variables: {
                      },
                    },
                    adaptor: function (payload:any) {
                      let list = payload.data.offices;
                      let options: Array<any> = [];
                      if(Array.isArray(list) && list.length == 0){
                        return {
                          options: options
                        }
                      }
                      list.forEach((item: any) => {
                        item.parent_id = item.parent_id ? item.parent_id.toString() : null;
                      });
                      const makeTree = (pid: any, arr: any) => {
                        const res: Array<any> = [];
                        arr.forEach((i: any) => {
                          if (i.parent_id === pid) {
                            // 本身调用本身，递归查归属于本身的 children
                            const children = makeTree(i.id, list);
                            // 将原有的数据按照 element 的格式进行重构
                            let obj: any = {
                              label: i.organize_name,
                              value: i.id + '__' + i.category,
                              id:i.id,
                              category:i.category,
                              biz:i.category,
                              organize_name:i.organize_name,
                              children: [],
                            };
                            // 若是有 children 则插入 obj 中
                            if (children.length) {
                              obj.children = children;
                            }
                            res.push(obj);
                          }
                        });
                        return res;
                      };

                      if (list.length === 1) {
                        options = [
                          {
                            label: list[0].organize_name,
                            value: list[0].id + '__' +list[0].category,
                            id:list[0].id,
                            category:list[0].category,
                            biz:list[0].category,
                            organize_name:list[0].organize_name,
                            children: []
                          },
                        ];
                      } else {
                        options = JSON.parse(JSON.stringify(makeTree(null, list)));
                      }
                      let result:Array<any> = []
                      result.push({
                        label: '全部单位',
                        selectMode: 'tree',
                        searchable:true,
                        children: options
                      })
                      return {
                        options: result
                      };
                    },
                  }
                },
              ]
            }
          ]
        }
      }
    ],
    columns: [
      {
        name: '${index+1}',
        label: '序号',
      },
      {
        name: 'organize_name',
        label: '组织名称',
      },
      {
        name: 'remark',
        label: '描述',
        showCounter: true,
        maxLength: 500,
        validations: {
          maxLength: 500,
        },
        validationErrors: {
          maxLength: '长度应该小于500',
        },
      },
      {
        type: 'operation',
        label: '操作',
        width:"6.25rem",
        buttons: [
          // {
          //   label: '删除',
          //   type: 'button',
          //   level: 'link',
          //   className: "text-danger btn-red",
          //   reload: 'roleForm',
          //   actionType: 'ajax',
          //   confirmText: '确认要删除该角色吗？',
          //   api: {
          //     method: 'post',
          //     url: '/api/graphql',
          //     data: {
          //       query: `mutation {
          //         delete_sys_role_organize(id: "$id", obj: {})
          //       }`,
          //       variables: null,
          //     },
          //     adaptor: function (payload: any) {
          //       let backNum = payload.data.delete_sys_role_organize;
          //       return {
          //         backNum: backNum,
          //       };
          //     }
          //   }
          // }
          {
            label: '删除',
            type: 'button',
            level: 'link',
            actionType: 'dialog',
            className: "text-danger",
            size:"md",
            reload: 'roleForm,organizeList',
            dialog: {
              title: '系统消息',
              body: [
                '确认要删除吗?',
                {
                  type: 'form',
                  title: '',
                  api: {
                    method: 'post',
                    url: '/api/graphql',
                    data: {
                      query: `mutation {
                        delete_sys_role_organize(id: "$id", obj: {})
                      }`,
                      variables: null,
                    },
                    adaptor: function (payload: any) {
                      let backNum = payload.data.delete_sys_role_organize;
                      return {
                        backNum: backNum,
                      };
                    }
                  },
                  body: [
                    {type: 'hidden', name: 'id'},
                  ]
                }
              ]
            }
          },
        ]
      }
    ]
  }]
}
