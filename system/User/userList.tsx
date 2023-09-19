import {history} from "@@/core/history";

export const userList = {
  type: 'container',
  className: 'h-full',
  bodyClassName:"h-full flex flex-col",
  body: [
    {
      type: 'tpl',
      className: 'flex justify-center text-black py-2',
      tpl: '用户列表',
    },
    {
      type: 'hidden',
      name: 'userId'
    },
    {
      type: 'input-text',
      name: 'keywords',
      inputControlClassName: 'w-full',
      className:"mx-2",
      align: 'right',
      placeholder: '关键字检索',
    },
    {
      type: 'crud',
      name: 'userInfoList',
      columnsTogglable: false,
      toolbarClassName: "px-2 py-0",
      className: "user-nav-crud flex-1 table-border-none tabel-adaption-height",
      affixHeader: false,
      perPage: 100,
      api: {
        method: 'post',
        url: '/api/graphql?_=${keywords}',
        data: {
          query: `query find(\\$obj:input_sys_user_info!,\\$page:Int,\\$perPage:Int!){
                        users:pages_sys_user_info(obj: \\$obj, pageNum: \\$page, pageSize: \\$perPage) {
                          data {
                            real_name
                            leader_id
                            staff_card
                            id_card
                            id
                            state
                            email
                            sex
                            mobile
                            avatar
                            short_no
                            category
                          }
                          pageNum
                          pageSize
                          total
                        }
                      }`,
          variables: {
            obj:{
              "real_name":"$keywords",
              state:1
            },
            "page":"$page",
            "perPage":"$perPage"
          },
        },
        requestAdaptor: function (api: any) {
          return {
            ...api,
          }
        },
        adaptor: function (payload: any) {
          let items = payload?.data?.users?.data
          items.forEach((item: any) => {
            item.avatar = item.real_name.substring(0, 1)
          })
          let total = payload?.data?.users?.total
          return {
            ...payload.data,
            data: {
              items: items,
              total:total
            }
          }
        },
      },
      headerToolbar: [
        {
          type: 'tpl',
          tpl: '添加用户',
          className:"text-primary"
        },
        {
          type: 'button',
          level: 'link',
          align: 'right',
          className:"text-lg p-0",
          icon: 'fa-regular fa-square-plus',
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'clear',
                  componentId: "userFormChange"
                },
                {
                  actionType: 'setValue',
                  componentId: "editable",
                  args: {
                    value: false
                  }
                },
                {
                  actionType: 'setValue',
                  componentId: "editStatus",
                  args: {
                    value: true
                  }
                },
                {
                  actionType: 'setValue',
                  componentId: "saveAble",
                  args: {
                    value: true
                  }
                },
                {
                  actionType: 'changeActiveKey',
                  componentId: 'userTab',
                  args: {
                    'activeKey': 1
                  }
                },
              ]
            }
          }
        }
      ],
      footerToolbar: [
        "load-more",
        "statistics"
      ],
      itemAction: {
        type: 'button',
        onClick: (event: any, props: any, value: any) => {
          let targetVal = 'userInfo?userId=' + value?.id + ',roleForm?userId=' + value?.id
          console.log('targetVal ' + targetVal);
          props.onAction(
            event,
            {
              type: 'action',
              actionType: 'reload',
              target: targetVal
            },
            {
              userId: value?.id
            } // 这是 data
          );
          history.replace('/system/user?userId=' + value?.id)
          event.preventDefault();
        }
      },
      columns: [
        {
          type: "container",
          name: 'avatar',
          body: [
            {
              type: 'avatar',
              text: '${avatar}',
              style: {
                "background": "#305cd0",
                "color": "#FFFFFF"
              },
              width: 40
            }
          ]
        },
        {
          name: 'real_name',
          type: 'text'
        },
        // {
        //   name: 'account_name',
        //   // 账号
        //   type: 'hidden',
        // },
        // {
        //   name: 'id_card',
        //   // 身份证号
        //   type: 'hidden',
        // },
        // {
        //   name: 'staff_card',
        //   // 工号
        //   type: 'hidden',
        // },
        {
          type: "operation",
          width: 15,
          buttons: [
            {
              icon: 'fa fa-trash-can',
              className: 'text-danger hidden user-nav-item-delete',
              size: 'large',
              type: 'button',
              level: 'link',
              reload: 'userInfo,userInfoList',
              actionType: 'dialog',
              dialog: {
                title: '系统消息',
                body: [
                  '你确认要删除用户[${real_name}]吗？',
                  {
                    type: 'form',
                    title: '',
                    api: {
                      url: '/api/graphql',
                      method: 'post',
                      requestAdaptor: function (api: any) {
                        const accountName = api.data.account_name
                        const staffCard = api.data.staff_card
                        const idCard = api.data.id_card
                        let ts=new Date().getTime()
                        let id = api.data.id
                        console.log(api.data)
                        const split = '@del'
                        //let staff_card = api.data.__super.__super.staff_card +'_'+ ts
                        let account_name = accountName + split + ts
                        let staff_card = staffCard + split + ts
                        let id_card = idCard + split + ts
                        //console.log(staff_card)
                        return {
                          ...api,
                          data: {
                            query: `mutation update($id: Long!,$obj1: input_sys_user_info!,$obj2: input_sys_account!){
                                      update_sys_user_info(id: $id, obj: $obj1)
                                      update_sys_account(id: $id, obj: $obj2)
                                      delete_sys_role_user(obj:{user_id: $id})
                                      delete_sys_organize_user(obj:{user_id: $id})
                                      }`,
                            variables: {
                              id: id,
                              obj1:{state:0,staff_card: staff_card,id_card:id_card},
                              obj2:{state:0,account_name: account_name}
                            }
                          },
                        }
                      },
                      adaptor: function (payload: any) {
                        return {code: payload.code};
                      },
                    },
                    body: [
                      {type: 'hidden', name: 'account_name'},
                      {type: 'hidden', name: 'id'},
                      {type: 'hidden', name: 'staff_card'},
                      {type: 'hidden', name: 'id_card'},
                    ]
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
