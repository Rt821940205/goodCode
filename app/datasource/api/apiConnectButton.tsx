import { buildApiServerFields } from '@/pages/app/datasource/util/apiConnectionTest';
import { wrapResultObjs } from '@/pages/app/datasource/util/apiHandle';

export const apiConnectButton = {
  actionType: 'ajax',
  className: 'content-button',
  type: 'button',
  messages: {
    success: '连接成功!',
    failed: '连接失败!',
  },
  api: {
    method: 'post',
    url: '/api/ext/model/api/connectivity',
    requestAdaptor: function (api: any) {
      let modelId = api.data.modelId;
      let appId = api.data.appId;
      let source_id = api.data.source_id;
      let fields = buildApiServerFields(api, modelId, appId, source_id);
      let id = api.data.id;
      if (id === undefined) {
        id = new Date().getTime();
      }
      return {
        ...api,
        data: {
          // 随意给一个id
          id: id,
          fields,
        },
      };
    },
    adaptor: function (payload:any, res:any, api:any) {
      if (api.data.fields.length === 0) {
        return {
          status: 2,
          msg: '请先填写必填参数再测试连接',
        };
      }
      if (payload.data === null || payload.data === undefined || payload.data === '') {
        return {
          status: payload.code,
          msg: payload.message,
        };
      }
      let results = payload.data.data;
      let resultObjs:any[] = [];
      if (results != undefined) {
        if (Array.isArray(results)) {
          results.forEach((e) => {
            wrapResultObjs(e, resultObjs);
          });
        } else {
          wrapResultObjs(results, resultObjs);
        }
      }
      let response = JSON.stringify(results);
      return {
        data: {
          responseBody: response,
          resultObjs: resultObjs,
        },
      };
    },
  },
  level: 'success',
  label: '测试连接',
};

// add
//{
//           actionType: "ajax",
//           type:'button',
//           api: {
//             method: 'post',
//             url: '/api/ext/model/api/connectivity',
//             requestAdaptor: function (api) {
//               let modelId = api.data.modelId
//               let appId = api.data.appId
//               // source_id
//               let source_id = api.data.id
//               let fields = buildApiServerFields(api, modelId, appId,source_id)
//               return {
//                 ...api,
//                 data: {
//                   fields
//                 },
//               };
//             },
//             adaptor: function (payload: any) {
//               let results = payload.data.data
//               let resultObjs = []
//               if (results != undefined) {
//                 if (Array.isArray(results)) {
//                   results.forEach(e => {
//                     wrapResultObjs(e, resultObjs);
//                   })
//                 } else {
//                   wrapResultObjs(results, resultObjs);
//                 }
//               }
//               let response = JSON.stringify(results)
//               console.log(results)
//               return {
//                 data: {
//                   responseBody: response,
//                   resultObjs: resultObjs
//                 }
//               };
//             }
//           },
//           level:'success',
//           label: "测试连接"
//         },
