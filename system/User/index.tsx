import AmisRenderer from '@/components/AmisRenderer';
import {SchemaNode} from '@fex/amis/lib/types';
import {history} from "@@/core/history";
import './index.less'
import {userInfoForm} from "@/pages/system/User/userInfo";
import {userList} from "@/pages/system/User/userList";
export default function () {
  const {query = {}} = history.location;
  const { userId } = query;

  const bodyschema: SchemaNode = {
    type: 'page',
    title: '',
    bodyClassName: "p-0",
    asideResizor: true,
    asideMinWidth: 240,
    asideMaxWidth: 1000,
    asideClassName:"w-60",
    aside: [userList],
    body: [
      {
        type: 'service',
        name: 'roleForm',
        api: {
          method: 'post',
          url: '/api/graphql',
          data: {
            query: '{find_sys_role(obj:{}){id name description}}',
            variables: {

            }
          },
          adaptor: function (payload: any) {
            let backNum = payload.data.find_sys_role;
            return {
              find_sys_role: backNum,
            };
          },
        },
        body: [
          {
            type: 'container',
            body: [
              {
                type: 'tabs',
                id: 'userTab',
                tabs: [
                  {
                    title: '用户信息',
                    reload:true,
                    data:{
                      userId:userId
                    },
                    tab: userInfoForm,
                  },
                  {
                    title: '个人角色',
                    reload:true,
                    data:{
                      userId:userId
                    },
                    tab: [{
                      type: 'service',
                      name: 'roleForm',
                      api: {
                        method: 'post',
                        url: '/api/graphql?query=${userId}',
                        data: {
                          query: `{find_sys_role_user(obj: {user_id:$userId}) {
                            role_id
                            user_id
                            id
                            sys_role_user_just_sys_role{
                              name
                              description
                              remark
                              id
                            }
                          }}`,
                          variables: {
                            userId: "${userId}"
                          },
                        },
                        adaptor: function (payload: any) {
                          let relList = payload.data?.find_sys_role_user
                          let find_sys_role: Array<any> = []
                          if (Array.isArray(relList) && relList.length > 0) {
                            find_sys_role = relList.filter(item=>{return item.sys_role_user_just_sys_role != undefined}).map((item: any) => {
                              return {
                                pid:item.id,
                                id: item.sys_role_user_just_sys_role.id,
                                name: item.sys_role_user_just_sys_role.name,
                                description: item.sys_role_user_just_sys_role.description
                              }
                            })
                          }
                          return {
                            find_sys_role: find_sys_role,
                          };
                        },
                      },
                      body: {
                        type: 'crud',
                        source: '$find_sys_role',
                        syncLocation: false,
                        autoGenerateFilter: true,
                        columns: [
                          {
                            name: '${index+1}',
                            label: '序号',
                          },
                          {
                            name: 'name',
                            label: '角色',
                          },
                          {
                            name: 'description',
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
                              {
                                label: '删除',
                                type: 'button',
                                level: 'link',
                                size:"md",
                                className: "text-danger",
                                reload: 'roleForm',
                                actionType: 'ajax',
                                confirmText: '确认要删除该角色吗？',
                                api: {
                                  method: 'post',
                                  url: '/api/graphql',
                                  data: {
                                    query: 'mutation{delete_sys_role_user(id:$pid,obj:{})}',
                                    variables: {
                                      id: "${pid}"
                                    },
                                  },
                                  adaptor: function (payload: any) {
                                    let backNum = payload.data.delete_sys_role;
                                    return {
                                      backNum: backNum,
                                    };
                                  },
                                },
                              },
                            ],
                          },
                        ],
                      },
                    }
                    ]
                  },
                  {
                    title: '组织信息',
                    data:{
                      userId:userId
                    },
                    reload:true,
                    tab: [{
                      type: 'crud',
                      name: 'userOrganizeList',
                      api: {
                        method: 'post',
                        url: '/api/graphql?query=${userId}',
                        data: {
                          query: `{
                            find_sys_organize_user(obj: {user_id: "$userId" }) {
                              user_id
                              id
                              sys_organize_user_just_sys_organize{
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
                          let user_organizes = payload?.data?.find_sys_organize_user
                          user_organizes?.filter((item:any) => {
                            return item.sys_organize_user_just_sys_organize != undefined
                          }).forEach((item: any) => {
                            items.push({
                              id: item.id,
                              organize_name: item.sys_organize_user_just_sys_organize?.organize_name,
                              category: item.sys_organize_user_just_sys_organize?.category,
                              remark: item.sys_organize_user_just_sys_organize?.remark
                            })
                          })
                          return {
                            members: items
                          };
                        },
                      },
                      syncLocation: false,
                      autoGenerateFilter: true,
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
                            {
                              label: '删除',
                              type: 'button',
                              level: 'link',
                              size:"md",
                              className: "text-danger",
                              reload: 'userOrganizeList',
                              actionType: 'ajax',
                              confirmText: '确认要删除该角色吗？',
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
                              }
                            }
                          ]
                        }
                      ]
                    }]
                  },
                  {
                    title: '重置密码',
                    tab: {
                      type: 'form',
                      mode: "horizontal",
                      title: '',
                      panelClassName:"wrap-with-panel-false",
                      actions: [
                        {
                          type: 'button',
                          label: '编辑',
                          onEvent: {
                            click: {
                              actions: [
                                {
                                  actionType: 'setValue',
                                  componentId: "canEdit",
                                  args: {
                                    value: true
                                  }
                                }
                              ]
                            }
                          },
                          level: 'primary',
                          hiddenOn: 'this.canEdit == true'
                        },
                        {
                          type: 'button',
                          label: '取消',
                          level:"light",
                          onEvent: {
                            click: {
                              actions: [
                                {
                                  actionType: 'setValue',
                                  componentId: "canEdit",
                                  args: {
                                    value: false
                                  }
                                }
                              ]
                            }
                          },
                          hiddenOn: 'this.canEdit == false'
                        },
                        {
                          type: 'button',
                          label: '保存',
                          actionType: 'submit',
                          level: 'primary',
                          hiddenOn: 'this.canEdit == false'
                        },
                      ],
                      api: {
                        method: 'post',
                        url: '/api/graphql?_=update_sys_account',
                        data: {
                          query:
                            'mutation update(\\$id:Long!,\\$obj:input_sys_account!){update_sys_account(id:\\$id,obj:\\$obj)}',
                          variables: {
                            id: "$userId",
                            obj: {
                              password: "$password2"
                            },
                          },
                        },
                        adaptor: function (payload: any,response:any,api:any) {
                          return {
                            ...payload,
                            data: {
                              canEdit:false,
                              password1:'',
                              password2:''
                            }
                          };
                        },
                      },
                      data:{
                        userId:userId
                      },
                      rules: [
                        {
                          "rule": "password1 == password2",
                          "message": "两次输入的密码需要一致"
                        }
                      ],
                      body: [
                        {
                          id: 'userTip',
                          label: '用户密码:',
                          value: '******',
                          type: 'static',
                          mode: 'horizontal',
                          hiddenOn: 'this.canEdit == true'
                        },
                        {
                          type: 'input-password',
                          required: true,
                          name: 'password1',
                          validations: {
                            matchRegexp: '/^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,20}$/'
                          },
                          validationErrors: {
                            matchRegexp: '密码必须由8-20位字母、数字、特殊符号(@$!%*#?&)组成'
                          },
                          label: '新密码',
                          size: 'md',
                          hiddenOn: 'this.canEdit == false'
                        },
                        {
                          type: 'input-password',
                          name: 'password2',
                          validations: {
                            matchRegexp: '/^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,20}$/'
                          },
                          validationErrors: {
                            matchRegexp: '密码必须由8-20位字母、数字、特殊符号(@$!%*#?&)组成'
                          },
                          required: true,
                          label: '确认密码',
                          size: 'md',
                          hiddenOn: 'this.canEdit == false'
                        },
                        {
                          type: 'hidden',
                          id: 'canEdit',
                          name: 'canEdit',
                          value: false
                        },
                        {

                        }
                      ],
                    }

                  },
                ]
              }
            ]
          }
        ]
      }
    ]
  };
  const schema: SchemaNode = {
    type: 'page',
    bodyClassName:"bg-white m-4 rounded-lg p-0 h-screen-sub-140",
    title: '',
    body: [
      bodyschema
    ],
  };
  return <AmisRenderer schema={schema}/>;
}
