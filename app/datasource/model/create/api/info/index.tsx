import AmisRenderer from '@/components/AmisRenderer';
import {
  ModelField,
  modelFieldCategory,
  modelFieldValueType,
} from '@/pages/app/datasource/util/modelField';
import {history} from '@@/core/history';
import {SchemaNode} from '@fex/amis/lib/types';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";
import {findMethodOrUrl} from "@/pages/app/datasource/model/create/util/apiModelFieldAdd";

import { setEntity } from '@/components/entityStep/index';
import { setBreadcrumb } from '@/utils';

const {query = {}} = history.location;
const {appId, biz, source_id, api_id, table_id} = query;

function loadField(list: Array<any>, key: string, value: any) {
  let sourceIdField = new ModelField(modelFieldCategory.CONFIG, key, 0, appId);
  sourceIdField.setName(key);
  sourceIdField.setValue(modelFieldValueType.String, value);
  if (value === undefined) {
    console.log(`${key} 为空`);
  }
  list.push(sourceIdField);
}

const props = {
  data: { api_id, source_id, startStep: 1, },
  initApi:{
    method: 'get',
    url: '/api/def/model/complete/info?modelId='+source_id,
    adaptor:function (api:any){
      const apiMatch = api.data.fields.filter((item:any)=>{return item.id === api_id})
      let apiInfos:any = []
      if (apiMatch.length > 0) {
        const itemValues = JSON.parse(apiMatch[0].defaultValue)
        apiInfos = itemValues.reduce((pre: Array<any>, cur: any, index: Number) => {
          cur.index = index
          const list = findMethodOrUrl(cur.xpathKey, cur)
          pre.push(...list)
          return pre
        }, [])
      }
      const apiMethod = apiInfos.filter((e:any) => {
        return e.k === 'method';
      })[0].v

      const apiUrl = apiInfos.filter((e:any) => {
        return e.k === 'url';
      })[0].v
      return {
        data:{ apiMethod, apiUrl }
      }
    }
  },
  api: {
    method: 'post',
    url: '/api/def/model/complete/save?_=stepOne',
    requestAdaptor: function (api: any) {
      let fields: Array<any> = [];
      loadField(fields, 'source_id', source_id)
      loadField(fields, 'api_id', api_id)
      loadField(fields, 'method', api.data.apiMethod)
      loadField(fields, 'url', api.data.apiUrl)
      return {
        ...api,
        data: { fields, ...api.data, },
      };
    },
    adaptor: function (payload: any) {
      if (beforeHandle(payload)) {
        let entityId = payload.data.id;
        return {
          entityId,
          data: { entityId, ...payload.data, }
        };
      }
      return errorHandle(payload);
    },
  },
  redirect:'/app/datasource/model/create/api/attribute?appId=${appId}&biz=api&source_id=${source_id}&api_id=${api_id}&entityId=${id}&modelId=${id}',

}

const body = [
  { type: 'hidden', name: 'modelId' },
  { type: 'hidden', name: 'display', value: true },
  { type: 'hidden', name: 'category', value: 101210 },
]

export default function () {
  if (appId === undefined || appId === '') {
    console.log('appId为空!!!!!!');
  }
  const steps: any = [
    { title: '服务信息' },
    { title: '实体属性配置' }
  ];
  const breadcrumb = setBreadcrumb(); // 面包屑组件
  const schema: SchemaNode = {
    type: 'page',
    // className: 'step-page',
    className: "base-light-page-center page-w1400 bg-white rounded-lg mt-6",
    data: {
      biz: biz,
      appId: appId,
    },
    body: [
      breadcrumb,
      setEntity(props, body, { value: 0, data: { source_id, appId, table_id }, steps }),
      // getSteps(0, {source_id, appId, table_id }, ...steps),
      // {
      //   title: '',
      //   type: 'form',
      //   data: { api_id, source_id, startStep: 1, },
      //   // initApi:{
      //   //   method: 'get',
      //   //   url: '/api/def/model/complete/info?modelId='+source_id,
      //   //   adaptor:function (api:any){
      //   //     const apiMatch = api.data.fields.filter((item:any)=>{return item.id === api_id})
      //   //     let apiInfos:any = []
      //   //     if (apiMatch.length > 0) {
      //   //       const itemValues = JSON.parse(apiMatch[0].defaultValue)
      //   //       apiInfos = itemValues.reduce((pre: Array<any>, cur: any, index: Number) => {
      //   //         cur.index = index
      //   //         const list = findMethodOrUrl(cur.xpathKey, cur)
      //   //         pre.push(...list)
      //   //         return pre
      //   //       }, [])
      //   //     }
      //   //     const apiMethod = apiInfos.filter((e:any) => {
      //   //       return e.k === 'method';
      //   //     })[0].v

      //   //     const apiUrl = apiInfos.filter((e:any) => {
      //   //       return e.k === 'url';
      //   //     })[0].v
      //   //     return {
      //   //       data:{ apiMethod, apiUrl }
      //   //     }
      //   //   }
      //   // },
      //   // api: {
      //   //   method: 'post',
      //   //   url: '/api/def/model/complete/save?_=stepOne',
      //   //   requestAdaptor: function (api: any) {
      //   //     let fields: Array<any> = [];
      //   //     loadField(fields, 'source_id', source_id)
      //   //     loadField(fields, 'api_id', api_id)
      //   //     loadField(fields, 'method', api.data.apiMethod)
      //   //     loadField(fields, 'url', api.data.apiUrl)
      //   //     return {
      //   //       ...api,
      //   //       data: { fields, ...api.data, },
      //   //     };
      //   //   },
      //   //   adaptor: function (payload: any) {
      //   //     if (beforeHandle(payload)) {
      //   //       let entityId = payload.data.id;
      //   //       return {
      //   //         entityId,
      //   //         data: { entityId, ...payload.data, }
      //   //       };
      //   //     }
      //   //     return errorHandle(payload);
      //   //   },
      //   // },
      //   // redirect:'/app/datasource/model/create/api/attribute?appId=${appId}&biz=api&source_id=${source_id}&api_id=${api_id}&entityId=${id}&modelId=${id}',
      //   body: apiModelInfoForm,
      // }
    ],
  };
  return <AmisRenderer schema={schema}/>;
}
