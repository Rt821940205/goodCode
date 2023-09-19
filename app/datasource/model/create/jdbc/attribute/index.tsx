import AmisRenderer from '@/components/AmisRenderer';
import {buildJdbcDataFields} from '@/pages/app/datasource/Setting/jdbcServiceEditForm';
import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';
import {jdbc_field_mapping} from "@/pages/app/datasource/model/create/step_2_jdbc_field_mapping";
import {getSteps} from "@/components/steps";
import { setBreadcrumb } from '@/utils';

export default function () {
  const { query = {} } = history.location;
  const { appId, biz, source_id, table_id } = query;
  if (appId === undefined || appId === '') {
    console.log('appId为空!!!!!!');
  }
  let steps:any= [
    {
      title:'数据表信息'
    },
    {
      title:'实体属性配置'
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
        type: 'form',
        className: 'attribute-form-wrapper',
        data: {
          startStep: 2,
        },
        actions:[
          {
            type:'button',
            actionType:'submit',
            level:'primary',
            label:'生成实体'
          }
        ],
        api: {
          method: 'post',
          url: '/api/def/model/field/batch/add?_=jdbcEntity',
          requestAdaptor: function (api:any) {
            let modelId = api.data.modelId;
            let service_id = api.data.source_id;
            let appId = api.data.appId;
            let source_id = api.data.source_id;
            let table_id = api.data.table_id;
            let fields = buildJdbcDataFields(api, modelId, appId, service_id, source_id, table_id);
            if (fields.length === 0) {
              return {
                status: 2,
                msg: '请刷新重试',
              };
            }
            return {
              ...api,
              data: {
                id: modelId,
                appId: appId,
                generate: true,
                add: true,
                table_id: table_id,
                source_id: source_id,
                fields: fields,
                name: api.data.name,
                status: 1,
                display: true,
                category: 101610,
              },
            };
          },
          adaptor: function (payload:any, response:any, api:any) {
            if (payload.code === 500) {
              return {
                status: payload.code,
                msg: '实体生成失败',
              };
            }
            let appId = api.data.appId;
            history.replace('/app/entityMange/entityMange?appId=' + appId);
            return {
              data: {
                ...payload.data,
                add: api.data.add,
              },
            };
          },
        },
        body: jdbc_field_mapping,
      }
    ],
  };
  return <AmisRenderer schema={schema} />;
}
