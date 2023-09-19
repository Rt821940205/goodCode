import AmisRenderer from '@/components/AmisRenderer';
import {
  ModelField,
  modelFieldCategory,
  modelFieldValueType,
} from '@/pages/app/datasource/util/modelField';
import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';
import { message } from 'antd';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";
import { setEntity } from '@/components/entityStep';
// import {datasourceModelInfoForm} from "@/pages/app/datasource/model/create/step_1_info";
// import {getSteps} from "@/pages/app/model/manage/Create/components/steps";
import { setBreadcrumb } from '@/utils';

const { query = {} } = history.location;
const { appId, biz, source_id, table_id } = query;
if (appId === undefined || appId === '') {
  console.log('appId为空!!!!!!');
}
const steps:any= [
  { title:'数据表信息' },
  { title:'实体属性配置' }
];
const data = { source_id, appId, table_id }

// 表单属性
const props = {
  api: {
    method: 'post',
    url: '/api/def/model/complete/save?_=step01',
    requestAdaptor: function (api:any) {
      if (appId === undefined || appId === '') {
        message.error('appId不能为空,请重新操作');
        history.replace('/app/manage/list');
      }
      let fields: Array<any> = [];
      loadField(fields, 'source_id', source_id)
      loadField(fields, 'tableName', table_id)
      return {
        ...api,
        data: { fields, ...api.data, },
      };
    },
    adaptor: function (payload: any) {
      if(beforeHandle(payload)){
        let modelId = payload.data.id;
        return {
          modelId,
          data: { modelId, ...payload.data },
        };
      }
      return errorHandle(payload);
    },
  },
  redirect:'/app/datasource/model/create/jdbc/attribute?appId=${appId}&biz=jdbc&source_id=${source_id}&table_id=${table_id}&modelId=${id}',
}
// 表单节点属性
const body = [
  { type: 'hidden', name: 'modelId' },
  { type: 'hidden', name: 'display', value: true },
  { type: 'hidden', name: 'category', value: 101610 },
]

// 导入field类型
function loadField(list: Array<ModelField>, key: string, value: any) {
  let sourceIdField = new ModelField(modelFieldCategory.CONFIG, key, 0, appId);
  sourceIdField.setName(key);
  sourceIdField.setValue(modelFieldValueType.String, value);
  if (value === undefined) {
    console.log(`${key} 为空`);
  }
  list.push(sourceIdField);
}

export default function () {
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
      setEntity(props, body, { value: 0, data, steps }),
      // getSteps(0,data,...steps),
      // {
      //   title: '',
      //   type:'form',
      //   api: {
      //     method: 'post',
      //     url: '/api/def/model/complete/save?_=step01',
      //     requestAdaptor: function (api:any) {
      //       if (appId === undefined || appId === '') {
      //         message.error('appId不能为空,请重新操作');
      //         history.replace('/app/manage/list');
      //       }
      //       let fields: Array<any> = [];
      //       loadField(fields, 'source_id', source_id)
      //       loadField(fields, 'tableName', table_id)
      //       // source_id
      //       // let sourceId = new ModelField(modelFieldCategory.CONFIG, 'source_id', 0, appId);
      //       // sourceId.setName('source_id');
      //       // sourceId.setValue(modelFieldValueType.String, source_id);
      //       // if (source_id == undefined) {
      //       //   console.log('source_id 为空');
      //       // }
      //       // fields.push(sourceId);

      //       // table name
      //       // let tableName = table_id;
      //       // let tableNameField = new ModelField(modelFieldCategory.CONFIG, 'tableName', 0, appId);
      //       // tableNameField.setName('tableName');
      //       // tableNameField.setValue(modelFieldValueType.String, tableName);
      //       // if (tableName == undefined) {
      //       //   console.log('tableName 为空');
      //       // }
      //       // fields.push(tableNameField);
      //       return {
      //         ...api,
      //         data: { fields, ...api.data, },
      //       };
      //     },
      //     adaptor: function (payload: any) {
      //       if(beforeHandle(payload)){
      //         let modelId = payload.data.id;
      //         return {
      //           modelId,
      //           data: { modelId, ...payload.data },
      //         };
      //       }
      //       return errorHandle(payload);
      //     },
      //   },
      //   redirect:'/app/datasource/model/create/jdbc/attribute?appId=${appId}&biz=jdbc&source_id=${source_id}&table_id=${table_id}&modelId=${id}',
      //   body: datasourceModelInfoForm,
      // }
    ],
  };
  return <AmisRenderer schema={schema} />;
}
