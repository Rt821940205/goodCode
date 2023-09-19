import {SchemaNode} from '@fex/amis/lib/types';

/**
 * 转换返回值中sex int 为对应的 label字典值
 * @param user 需要转换的对象
 */

// 组织架构-用户
export const deptUserManage: SchemaNode =
  {
    type: 'service',
    name: 'member',
    api: {
      method: 'post',
      url: '/api/graphql?organizeId=${organizeId}',
      data: {
        query: `{
          find_sys_organize_user(obj: {organize_id:$organizeId}) {
            id
            user_id
            organize_id
            sys_organize_user_just_sys_user_info {
              real_name
              mobile
              email
              staff_card
            }
          }
        }`,
        variables: {
          organizeId: '${organizeId}'
        },
      },
      requestAdaptor(api: any) {
        let organizeId = api.data.variables.organizeId;
        return {
          ...api,
          data: {
            ...api.data, // 获取暴露的 api 中的 data 变量
            variables: {
              organizeId: organizeId // 新添加数据
            },
          },
        };
      },
      adaptor: function (payload: any) {
        if (Array.isArray(payload.errors)) {
          return {find_sys_role: []}
        }
        let relList = payload.data.find_sys_organize_user
        let find_sys_user: Array<any> = []
        let selectedList: Array<string> = []
        if (Array.isArray(relList) && relList.length > 0) {
          find_sys_user = relList.filter((item: any) => {
            return item.sys_organize_user_just_sys_user_info != undefined
          }).map((item: any) => {
            let staff_card = item.sys_organize_user_just_sys_user_info.staff_card
            selectedList.push(item.id)
            return {
              id: item.id,
              real_name: item.sys_organize_user_just_sys_user_info?.real_name,
              email: item.sys_organize_user_just_sys_user_info.email,
              staff_card: staff_card,
              mobile: item.sys_organize_user_just_sys_user_info.mobile
            }
          })
        }
        return {
          find_sys_user: find_sys_user
        };
      }
    },
    body: {
      type: 'crud',
      syncLocation: false,
      headerToolbar: [
        {
          type: 'button',
          level: 'primary',
          label: '添加',
          align: 'right',
          actionType: 'dialog',
          reload: 'member',
          dialog: {
            title: '添加成员',
            size: 'lg',
            reload: 'member',
            body: [
              {
                type: 'form',
                reload: 'member',
                initApi: {
                  method: 'post',
                  url: '/api/graphql?organizeId=${organizeId}',
                  data: {
                    query: `{
                      find_sys_organize_user(obj: {organize_id:$organizeId}) {
                                user_id
                                organize_id
                                sys_organize_user_just_sys_user_info {
                                  id
                                  real_name
                                  mobile
                                  email
                                  staff_card
                                }
                              }
                   }`,
                    variables: {
                      organizeId: '$organizeId'
                    }
                  },
                  adaptor: function (payload: any, response: any, api: any) {
                    let user_id = ''
                    if (Array.isArray(payload.errors)) {
                      return {user_id: user_id}
                    }
                    let relList = payload.data.find_sys_organize_user
                    if (Array.isArray(relList) && relList.length > 0) {
                      relList.filter((item: any) => {
                        return item.sys_organize_user_just_sys_user_info != undefined
                      }).forEach((item: any) => {
                        if (user_id == undefined || user_id == '') {
                          user_id = item.sys_organize_user_just_sys_user_info.id
                        } else {
                          user_id = user_id + ',' + item.sys_organize_user_just_sys_user_info.id
                        }
                      })
                    }
                    return {
                      user_id: user_id,
                      selectedList: user_id,
                    }
                  }
                },
                api: {
                  method: 'post',
                  url: '/api/graphql?_=createOrganizeUser&organizeId=${organizeId}',
                  data: {
                    query: `mutation create(){
                      create_sys_organize_user(obj: $obj1)
                    }`,
                    organizeId: '$organizeId',
                    user_id: '$user_id',
                    selectedList: '$selectedList',
                    variables: {
                      obj1: {
                        organizeId: "$organizeId",
                        user_id: "$user_id"
                      }
                    }
                  },
                  requestAdaptor: function (api: any) {
                    let selectedList = api.data.selectedList
                    const oldValue = selectedList?.split(',')
                    let userIds = api.data.user_id.split(',')
                    userIds = userIds.filter((item:any) => {
                      return Array.isArray(oldValue) && -1 == oldValue.indexOf(item)
                    })
                    if(Array.isArray(userIds) && userIds.length == 0){
                      return {
                        ...api,
                        data:{
                         skip:true
                        }
                      }
                    }
                    let query = `mutation create(`
                    let queryBody = ''

                    let organizeId = api.data.organizeId
                    const objs: Array<any> = []
                    userIds.forEach((userId: string) => {
                      objs.push({
                        organize_id: organizeId,
                        user_id: userId
                      })
                    })
                    let variables = {}
                    objs.forEach((obj, index) => {
                      query = query + '$obj' + index + ':input_sys_organize_user!,'
                      variables['obj' + index] = obj
                      queryBody = queryBody + 'organize_user' + index + ':' + 'create_sys_organize_user(obj: $obj' + index + ')  '
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
                  adaptor: function (payload: any,response:any,api:any) {
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
                    name: 'organizeId'
                  },
                  {
                    type: 'hidden',
                    name: 'selectedList'
                  },
                  {
                    type: 'transfer',
                    required: true,
                    label: '请选择一个成员',
                    placeholder: '请选择',
                    name: 'user_id',
                    selectMode: 'tree',
                    sortable: true,
                    statistics:false,
                    searchable: true,
                    selectTitle: '全部成员',
                    resultTitle: '已选择',
                    searchPlaceholder: '请选择',
                    pickerSize: 'lg',
                    searchApi:{
                      method: 'post',
                      url: '/api/graphql',
                      data: {
                        query: `{
                          userInfos:pages_sys_user_info(obj: {real_name:"$term" ,state:1},pageNum:1,pageSize:100) {
                          data{
                                  real_name
                                  id
                                  state
                                  }
                                  pageNum
                                  pageSize
                                  total
                                }
                        }`,
                        variables: {},
                      },
                      adaptor: function (payload: any) {
                        let userInfos = payload.data.userInfos.data;
                        let options: Array<any> = userInfos.map((item: any) => {
                          return {
                            label: item?.real_name,
                            value: item.id
                          }
                        })
                        options = JSON.parse(JSON.stringify(options));
                        return {
                          options: options
                        };
                      }
                    },
                    source: {
                      method: 'post',
                      url: '/api/graphql',
                      data: {
                        query: `{
                          userInfos:pages_sys_user_info(obj: {state:1},pageNum:1,pageSize:200) {
                          data{
                                  real_name
                                  id
                                  state
                                  }
                                  pageNum
                                  pageSize
                                  total
                                }
                        }`,
                        variables: {},
                      },
                      adaptor: function (payload: any) {
                        let userInfos = payload.data.userInfos.data;
                        let options: Array<any> = userInfos.map((item: any) => {
                          return {
                            label: item?.real_name,
                            value: item.id
                          }
                        })
                        options = JSON.parse(JSON.stringify(options));
                        return {
                          options: options
                        };
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      ],
      loadDataOnce: true,
      affixHeader: false,
      name: 'organizeMemberForm',
      source: '$find_sys_user',
      columns: [
        {
          name: 'real_name',
          label: '姓名',
        },
        {
          name: 'mobile',
          label: '手机',
        },
        {
          name: 'staff_card',
          label: '工号'
        },
        {
          name: 'email',
          label: '邮箱',
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
            //   className: "text-danger",
            //   actionType: 'ajax',
            //   confirmText: '确认要删除吗？',
            //   reload: 'member',
            //   api: {
            //     method: 'post',
            //     url: '/api/graphql',
            //     data: {
            //       query: `mutation {
            //         delete_sys_organize_user(id: "$id", obj: {})
            //       }`,
            //       variables: null,
            //     },
            //     adaptor: function (payload: any) {
            //       let backNum = payload.data.delete_sys_organize_user;
            //       return {
            //         backNum: backNum,
            //       };
            //     }
            //   }
            // },
            {
              label: '删除',
              type: 'button',
              level: 'link',
              actionType: 'dialog',
              className: "text-danger",
              dialog: {
                title: '系统消息',
                body: [
                  '确认要删除吗?',
                  {
                    type: 'form',
                    title: '',
                    reload: 'member',
                    api: {
                      method: 'post',
                      url: '/api/graphql',
                      data: {
                        query: `mutation {
                          delete_sys_organize_user(id: "$id", obj: {})
                        }`,
                        variables: null,
                      },
                      adaptor: function (payload: any) {
                        let backNum = payload.data.delete_sys_organize_user;
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
    }
  };
