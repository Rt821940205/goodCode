/**
 * 应用列表
 */
export const appList = {
  type: 'container',
  className: 'left-list-wrapper',
  body: [
    {
      type: 'container',
      className: 'system-list',
      body: '应用列表 >>',
    },

    {
      type: 'crud',
      affixHeader: false,
      className: 'user-crud',
      name: 'appList',
      api: {
        method: 'post',
        url: '/api/graphql?_=sys_app',
        data: {
          query: `{
                          find_sys_app(obj: {state:1}) {
                              app_name
                              id
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
          let items = payload?.data?.find_sys_app;
          return {
            ...payload.data,
            data: {
              items: items,
            },
          };
        },
      },

      itemAction: {
        type: 'button',
        onClick: (event: any, props: any, value: any) => {
          props.onAction(event, {
            type: 'action',
            actionType: 'reload',
            target: 'appResourceSetting?appResourceId=' + value?.id,
          });
          //history.replace('/system/role?chooseId='+value?.id+'&appResourceId='+value.id)

          event.preventDefault();
        },
      },

      columns: [
        {
          name: 'app_name',
          type: 'text',
          className: 'user-table-text',
        },
      ],
    },
  ],
};
