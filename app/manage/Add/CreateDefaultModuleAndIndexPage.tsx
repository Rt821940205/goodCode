import { history } from '@@/core/history';

/**
 * 为应用创建默认模块和首页
 */
export const CreateDefaultModuleAndIndexPage = {
  name: 'doModuleAndPageCreateAction',
  type: 'service',
  initFetch: false,
  api: {
    method: 'post',
    url: '/api/graphql',
    data: {
      query: `mutation create(\\$obj:input_sys_page_view!){
                                  create_sys_module(obj:{app_id:"$appId",module_name:"默认模块",non_default:0})
                                  create_sys_page_view(obj:\\$obj)
                                }`,
      variables: {
        obj: {
          app_id: '$appId',
          title: '首页',
          page_name: '首页',
          module_id: '-1',
          body: '${jsonBody|json}',
        },
      },
    },
    adaptor: function (payload:any, response:any, api:any) {
      let backNum = payload.data.create_sys_module;
      let appId = api.data.variables.obj.app_id;
      //history.replace('/componentOrchestrate?ntype=page&appId='+appId+'&type=magic');
      history.replace(`/settings/graph?appId=${appId}`);
      return {
        backNum: backNum,
      };
    },
  },
  redirect: '/app/entityMange/entityMange?appId=${appId}&subPage=true',
};

