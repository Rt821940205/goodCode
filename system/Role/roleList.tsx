import { history } from '@@/core/history';

/**
 * 角色列表
 */
export const roleList = {
  type: 'container',
  className: 'h-full',
  bodyClassName:"h-full flex flex-col",
  body: [
    {
      type: 'tpl',
      className: 'flex justify-center text-black py-2',
      tpl: '角色列表',
    },
    {
      type: 'hidden',
      name: 'chooseId',
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
      affixHeader: false,
      columnsTogglable: false,
      toolbarClassName: "px-2 py-0",
      className: "role-nav-crud flex-1 table-border-none tabel-adaption-height",
      name: 'roleList',
      api: {
        method: 'post',
        url: '/api/graphql?_=${keywords}',
        data: {
          query: `{
                          pages_sys_role(obj: {name:"$keywords",app_id:1}, pageNum: 1, pageSize:100) {
                            data {
                              parent_id
                              name
                              description
                              remark
                              id
                            }
                            pageNum
                            pageSize
                            total
                          }
                        }`,
          variables: null,
        },
        requestAdaptor: function (api: any) {
          return {
            ...api,
          };
        },
        adaptor: function (payload: any) {
          let items = payload?.data?.pages_sys_role?.data;
          items.forEach((item: any) => {
            item.avatar = item.name.substring(0, 1);
          });
          return {
            ...payload.data,
            data: {
              items: items,
            },
          };
        },
      },
      headerToolbar: [
        {
          type: 'tpl',
          tpl: '添加角色',
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
                  componentId: 'roleFormChange',
                },
                {
                  actionType: 'setValue',
                  componentId: 'editable',
                  args: {
                    value: false,
                  },
                },
                {
                  actionType: 'setValue',
                  componentId: 'editStatus',
                  args: {
                    value: true,
                  },
                },
                {
                  actionType: 'setValue',
                  componentId: 'saveAble',
                  args: {
                    value: true,
                  },
                },
                {
                  actionType: 'changeActiveKey',
                  componentId: 'roleTab',
                  args: {
                    activeKey: 1,
                  },
                },
              ],
            },
          },
        },
      ],
      itemAction: {
        type: 'button',
        onClick: (event: any, props: any, value: any) => {
          let targetVal =
            'roleInfo?chooseId=' +
            value?.id +
            ',personalMember?chooseId=' +
            value?.id +
            ',organizeList?chooseId=' +
            value?.id +
            ',pageSetting?chooseId=' +
            value?.id +
            ',appConfigSetting?chooseId=' +
            value?.id;
          console.log('targetVal ' + targetVal);
          props.onAction(event, {
            type: 'action',
            actionType: 'reload',
            target: targetVal,
          });
          history.replace('/system/role?chooseId=' + value?.id);
          event.preventDefault();
        },
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
          name: 'name',
          type: 'text',
        },
        {
          type: 'operation',
          width: 15,
          buttons: [
            {
              icon: 'fa fa-trash-can',
              className: 'text-danger hidden role-nav-item-delete',
              size: 'large',
              type: 'button',
              level: 'link',
              actionType: 'dialog',
              dialog: {
                title: '系统消息',
                body: [
                  '你确认要删除[${name}]角色吗？',
                  {
                    type: 'form',
                    title: '',
                    api: {
                      url: '/api/graphql',
                      method: 'post',
                      data: {
                        query: `mutation {
                                      delete_sys_role(id: $id, obj: {})
                                      delete_sys_role_organize(obj:{role_id: $id})
                                      delete_sys_role_user(obj:{role_id: $id})
                                      delete_sys_role_resource(obj:{role_id: $id})
                                      }`,
                        variables: {},
                      },
                      adaptor: function (payload: any) {
                        return { code: payload.code };
                      },
                    },
                    body: [{ type: 'hidden', name: 'id' }],
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};
