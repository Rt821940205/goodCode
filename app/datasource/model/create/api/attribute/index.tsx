import AmisRenderer from '@/components/AmisRenderer';
import { api_field_mapping } from '@/pages/app/datasource/model/create/step_2_api_field_mapping';
import { flattenFieldsForModel } from '@/pages/app/datasource/util/apiModelSubmit';
import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';
import {getSteps} from "@/components/steps";
import { setBreadcrumb } from '@/utils';

export default function () {
  const { query = {} } = history.location;
  const { appId, biz, source_id, api_id, table_id } = query;
  if (appId === undefined || appId === '') {
    console.log('appId为空!!!!!!');
  }
  let steps:any= [
    {
      title: '服务信息',
    },
    {
      title: '实体属性配置',
    }
  ];
  let data = {
    source_id: source_id,
    appId: appId,
    table_id: table_id,
  }
  const breadcrumb = setBreadcrumb(); // 面包屑组件
  const schema: SchemaNode = {
    type: 'page',
    className: "base-light-page-center page-w1400 bg-white rounded-lg mt-6",
    data: {
      biz: biz,
      appId: appId,
    },
    body: [
      breadcrumb,
      {
        type: "container",
        style: {
          width: '25rem',
        },
        className: "",
        body: getSteps(1,data,...steps),
      },
      {
        title: '',
        type:'form',
        className: 'attribute-form-wrapper',
        data: {
          modelId: '$modelId',
          appId: appId,
          service_id: source_id,
          api_id: api_id,
        },
        actions:[
          {
            type:'button',
            actionType:'submit',
            level:'primary',
            label:'生成实体'
          }
        ],
        initApi: {
          method: 'get',
          url: '/api/def/model/field/list?modelId=${source_id}&api_id=${api_id}&source_id=${source_id}&entityId=${entityId}',
          adaptor: function (payload:any, response:any, api:any) {
            let api_id = api.query.api_id;
            let entityId = api.query.entityId;
            let fields = payload.data;
            let currentApiId = '';
            if (Array.isArray(fields)) {
              currentApiId = fields.filter((f) => {
                return f.id === api_id;
              })[0]?.id;
            }
            return {
              ...api.data,
              data: {
                apiId: currentApiId,
                entityId: entityId,
              },
            };
          },
        },
        api: {
          method: 'post',
          url: '/api/def/model/field/batch/add?_=apiStep2Entity',
          requestAdaptor: function (api:any) {
            // api_id
            // source_id
            let model = flattenFieldsForModel(api);
            let entityId = api.data.entityId;
            return {
              ...api,
              data: {
                ...model,
                appId: appId,
                generate: true,
                id: entityId,
                entityId: entityId,
              },
            };
          },
          adaptor: function (payload:any) {
            if (payload.code === 500) {
              return {
                status: payload.code,
                msg: '实体生成失败',
              };
            }
            history.replace('/app/entityMange/entityMange?appId=' + appId);
            return {
              data: payload.data,
            };
          },
        },
        body: api_field_mapping,
      },
    ],
  };
  return <AmisRenderer schema={schema} />;
}
