export const appResource = {
  type: 'form',
  name: 'appResourceSetting',
  api: {
    method: 'post',
    url: '/api/authority/role/grantResourceByRoleId?roleId=${chooseId}',
    requestAdaptor: function (api: any) {
      let permissionCheck: string = api.data.permissionCheck;
      let roleId = api.data.chooseId;
      let appId = api.data.appResourceId;
      let resources: Array<string> = permissionCheck.split(',');
      return {
        ...api,
        data: {
          roleId: roleId,
          appId: appId,
          type: 'functional',
          resourceIds: resources,
        },
      };
    },
    adaptor: function (payload: any) {
      return {
        ...payload,
      };
    },
  },
  initFetch: false,
  initApi: {
    method: 'post',
    url: '/api/graphql?query=${chooseId}',
    data: {
      query: `{find_sys_role_resource(obj: {type:"functional",state:1,app_id:$appResourceId,role_id:$chooseId}) {
                                 resource_id
                               }
                       }`,
    },

    adaptor: function (payload: any) {
      let resourceList = payload.data.find_sys_role_resource;
      let authResource: Array<any> = [];
      let permissionCheck = '';
      resourceList.forEach((item: any) => {
        if (permissionCheck == '') {
          permissionCheck = item.resource_id;
        } else {
          permissionCheck = permissionCheck + ',' + item.resource_id;
        }
        authResource.push(item.resource_id);
      });
      return {
        ...payload,
        data: {
          resourceList: authResource,
          permissionCheck: permissionCheck,
        },
      };
    },
  },
  title: '',
  body: [
    {
      type: 'hidden',
      name: 'appResourceId',
      value: '-1',
    },
    {
      type: 'hidden',
      name: 'chooseId',
    },
    {
      type: 'service',
      initFetchSchema: false,
      schemaApi: {
        method: 'post',
        url: '/api/graphql?query=${appResourceId}',
        data: {
          query: `{find_sys_resource(obj: {type:"functional",state:1,app_id:$appResourceId}) {
                            name
                            id
                          }
                       }`,
        },
        adaptor: function (payload: any) {
          let resourceList = payload.data.find_sys_resource;
          let checkboxList: Array<any> = [];
          let options: Array<any> = resourceList.map((item: any) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
          const checkboxUnit: any = {
            type: 'checkboxes',
            name: 'permissionCheck',
            label: '',
            columnsCount: 1,
            inline: false,
            options: options,
          };

          checkboxList.push(checkboxUnit);

          return {
            type: 'container',
            body: [...checkboxList],
          };
        },
      },
    },
  ],
};
