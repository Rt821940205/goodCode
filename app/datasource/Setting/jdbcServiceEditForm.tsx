import { jdbc_field_mapping } from '@/pages/app/datasource/model/create/step_2_jdbc_field_mapping';
import {
  ModelField,
  modelFieldCategory,
  modelFieldValueType,
} from '@/pages/app/datasource/util/modelField';
import { history } from '@@/core/history';
export const jdbcServiceEditForm = {
  title: '实体属性配置',
  jumpable: false,
  data: {
    startStep: 2,
  },
  api: {
    method: 'post',
    url: '/api/def/model/field/batch/add?_=jdbcEntity',
    requestAdaptor: function (api:any) {
      let modelId = api.data.id;
      let service_id = api.data.source_id;
      let appId = api.data.appId;
      let source_id = api.data.source_id;
      let table_id = api.data.table_id;
      let fields = buildJdbcDataFields(api, modelId, appId, service_id, source_id, table_id,true);
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
};

/**
 * build a fields as array todo jdbc
 * @param api
 * @param modelId
 * @param appId
 * @param service_id
 */
export function buildJdbcDataFields(
  api:any,
  modelId: any,
  appId: any,
  service_id: any,
  source_id: any,
  table_id: any,
  withSource?:boolean
) {
  if(withSource === undefined){
    withSource = false
  }
  let fields = [];
  let configFields = api.data.configFields;
  if (configFields === undefined) {
    configFields = [];
  }

  if(withSource){
    // source_id
    let sourceId = new ModelField(modelFieldCategory.CONFIG, 'source_id', modelId, appId);
    sourceId.setId(
      configFields.filter((item:any) => {
        return item.name === 'source_id';
      })[0]?.id,
    );
    sourceId.setName('source_id');
    sourceId.setValue(modelFieldValueType.String, source_id);
    if (source_id == undefined) {
      console.log('source_id 为空');
    }
    fields.push(sourceId);

    // table name
    let tableName = table_id;
    let tableNameField = new ModelField(modelFieldCategory.CONFIG, 'tableName', modelId, appId);
    tableNameField.setId(
      configFields.filter((item:any) => {
        return item.name === 'tableName';
      })[0]?.id,
    );
    tableNameField.setName('tableName');
    tableNameField.setValue(modelFieldValueType.String, tableName);
    if (tableName == undefined) {
      console.log('tableName 为空');
    }
    fields.push(tableNameField);
  }

  let columns = api.data.columns;
  if (columns === undefined) {
    return fields;
  }
  // index
  // position
  // name
  // value
  // type
  // disable
  for (let k in columns) {
    let column = new ModelField(modelFieldCategory.RESULT, '', modelId, appId);
    for (let f in columns[k]) {
      let value = columns[k][f];
      switch (f) {
        case 'name':
          column.setLocalName(value);
          column.setName(value);
          break;
        case 'displayName':
          column.setDisplayName(value);
          break;
        case 'type':
          // column.setValueType(value)
          column.setValueType(modelFieldValueType.String);
          break;
        case 'id':
          column.id = value;
          break;
        case 'asField':
          column.asField = value;
          break;
        case 'conditionSelected':
          column.conditionSelected = value;
          break;
        default:
          break;
      }
    }
    // 通过属性的state字段来实现勾选或者不勾选的效果
    if (column.asField === 1 && column.conditionSelected === 1) {
      // input and result
      column.setCategory(modelFieldCategory.INPUT_RESULT);
      column.state = 1;
      fields.push(column);
    } else if (column.conditionSelected === 1) {
      // input
      column.setCategory(modelFieldCategory.INPUT);
      column.state = 1;
      fields.push(column);
    } else if (column.asField === 1) {
      // result
      column.state = 1;
      fields.push(column);
    } else {
      column.state = 0;
      fields.push(column);
    }
  }
  return fields;
}
