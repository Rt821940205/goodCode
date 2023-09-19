import AmisRenderer from '@/components/AmisRenderer';
import { api_field_mapping } from '@/pages/app/datasource/model/create/step_2_api_field_mapping';
import { service_field_mapping } from '@/pages/app/datasource/model/create/step_2_service_field_mapping';
import { findMethodOrUrl } from '@/pages/app/datasource/model/create/util/apiModelFieldAdd';
import { jdbcServiceEditForm } from '@/pages/app/datasource/Setting/jdbcServiceEditForm';
import { flattenFieldsForModel } from '@/pages/app/datasource/util/apiModelSubmit';
import {
  ModelField,
  modelFieldCategory,
  modelFieldValueType,
} from '@/pages/app/datasource/util/modelField';
import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';
import { message } from 'antd';
import { apiModelInfoForm, datasourceModelInfoForm } from './step_1_info';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";

export default function () {
  const { query = {} } = history.location;
  const { appId, biz, startStep, source_id, api_id, table_id } = query;
  if (appId === undefined || appId === '') {
    console.log('appId为空!!!!!!');
  }
  let steps:any= [];
  let apiSteps = [
    {
      title: '服务信息',
      jumpable: false,
      data: {
        startStep: 1,
        api_id: api_id,
        source_id: source_id,
      },
      api: {
        method: 'post',
        url: '/api/def/model/complete/save?_=stepOne',
        requestAdaptor: function (api:any) {
          let fields = [];
          // source_id
          let sourceIdField = new ModelField(modelFieldCategory.CONFIG, 'source_id', 0, appId);
          sourceIdField.setName('source_id');
          sourceIdField.setValue(modelFieldValueType.String, source_id);
          if (source_id == undefined) {
            console.log('source_id 为空');
          }
          fields.push(sourceIdField);
          // apiId
          let apiField = new ModelField(modelFieldCategory.CONFIG, 'api_id', 0, appId);
          apiField.setName('api_id');
          apiField.setValue(modelFieldValueType.String, api_id);

          if (api_id == undefined) {
            console.log('api_id 为空');
          }
          fields.push(apiField);
          return {
            ...api,
            data: {
              ...api.data,
              fields: fields,
            },
          };
        },
        adaptor: function (payload: any) {
          if(beforeHandle(payload)){
            let entityId = payload.data.id;
            return {
              data: {
                ...payload.data,
                entityId: entityId,
              },
              entityId: entityId,
            };
          }
          return errorHandle(payload);
        },
      },
      body: apiModelInfoForm,
    },
  ];
  let datasourceSteps = [
    {
      title: '数据表信息',
      jumpable: false,
      data: {
        startStep: 1,
      },
      api: {
        method: 'post',
        url: '/api/def/model/complete/save?_=step01',
        requestAdaptor: function (api:any) {
          if (appId === undefined || appId === '') {
            message.error('appId不能为空,请重新操作');
            history.replace('/app/manage/list');
          }
          let fields = [];
          // source_id
          let sourceId = new ModelField(modelFieldCategory.CONFIG, 'source_id', 0, appId);
          sourceId.setName('source_id');
          sourceId.setValue(modelFieldValueType.String, source_id);
          if (source_id == undefined) {
            console.log('source_id 为空');
          }
          fields.push(sourceId);

          // table name
          let tableName = table_id;
          let tableNameField = new ModelField(modelFieldCategory.CONFIG, 'tableName', 0, appId);
          tableNameField.setName('tableName');
          tableNameField.setValue(modelFieldValueType.String, tableName);
          if (tableName == undefined) {
            console.log('tableName 为空');
          }
          fields.push(tableNameField);
          return {
            ...api,
            data: {
              ...api.data,
              fields: fields,
            },
          };
        },
        adaptor: function (payload: any) {
          if(beforeHandle(payload)){
            let modelId = payload.data.id;
            return {
              modelId: modelId,
              data: {
                ...payload.data,
                modelId: modelId,
              },
            };
          }
          return errorHandle(payload);
        },
      },
      body: datasourceModelInfoForm,
    },
  ];
  if (biz == 'service') {
    steps = [
      ...apiSteps,
      {
        title: '智能服务配置',
        jumpable: false,
        api: {
          method: 'post',
          url: '/api/def/model/save',
          requestAdaptor: function (api:any) {
            return {
              ...api,
              data: {
                ...api.data,
              },
            };
          },
          adaptor: function (payload: any) {
            return {
              data: payload.data,
            };
          },
        },
        body: service_field_mapping,
      },
    ];
  }
  if (biz == 'api') {
    steps = [
      ...apiSteps,
      {
        title: '实体属性配置',
        data: {
          modelId: '$id',
          startStep: 2,
          appId: appId,
          service_id: source_id,
          api_id: api_id,
        },
        initApi: {
          method: 'get',
          url: '/api/def/model/field/list?modelId=${source_id}&api_id=${api_id}&source_id=${source_id}&entityId=${entityId}',
          adaptor: function (payload:any, response:any, api:any) {
            let api_id = api.query.api_id;
            let entityId = api.query.entityId;
            let apiInfos:any = [];
            let fields = payload.data;
            let currentApi = undefined;
            let currentApiId = '';
            if (Array.isArray(fields)) {
              currentApi = fields.filter((f) => {
                return f.id === api_id;
              })[0];
            }
            if (currentApi != undefined) {
              currentApiId = currentApi.id;
              let itemValues = JSON.parse(currentApi.defaultValue);
              itemValues.forEach((k: any, index: number) => {
                let xpathd = k.xpathKey;
                k.index = index;
                let items = findMethodOrUrl(xpathd, k);
                if (items.length > 0) {
                  // @ts-ignore
                  apiInfos.push(...items);
                }
              });
            }
            return {
              ...api.data,
              data: {
                apiMethod: apiInfos.filter((e:any) => {
                  return e.k === 'method';
                })[0].v,
                apiUrl: apiInfos.filter((e:any) => {
                  return e.k === 'url';
                })[0].v,
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
    ];
  }
  if (biz == 'jdbc') {
    steps = [...datasourceSteps, jdbcServiceEditForm];
  }

  const schema: SchemaNode = {
    type: 'page',
    data: {
      biz: biz,
      appId: appId,
    },
    body: [
      {
        type: 'steps',
        title: '',
        data: {
          source_id: source_id,
          appId: appId,
          table_id: table_id,
        },
        startStep: startStep,
        actionFinishLabel: '生成实体',
        steps: steps,
      },
      {

      }
    ],
  };
  return <AmisRenderer schema={schema} />;
}
