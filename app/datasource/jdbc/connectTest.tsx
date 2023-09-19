import { MockBizModel } from '@/pages/app/datasource/util/bizModel';
import {
  ModelField,
  modelFieldCategory,
  modelFieldConstant,
  modelFieldValueType,
} from '@/pages/app/datasource/util/modelField';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";

/**
 * build a fields as array
 * @param api
 * @param modelId
 * @param appId
 */
function buildJdbcFields(api:any, modelId: any, appId: any) {
  let fields = [];

  // let mssqlUrl = api.data.mssqlUrl
  // let hiveUrl = api.data.hiveUrl
  // let username = api.data.username
  // let password = api.data.password

  // db type
  let type = new ModelField(modelFieldCategory.CONFIG, 'type', modelId, appId);
  type.setName('type');
  type.setValue(modelFieldValueType.String, 'jdbc');
  fields.push(type);

  let dbType = api.data.type;
  let dbTypeObj = new ModelField(
    modelFieldCategory.CONFIG,
    modelFieldConstant.SQL_DIALECT,
    modelId,
    appId,
  );
  dbTypeObj.setName(modelFieldConstant.SQL_DIALECT);
  dbTypeObj.setValueWithDefault(modelFieldValueType.String, dbType, 'none');
  fields.push(dbTypeObj);
  switch (dbType) {
    case 'none':
    case undefined:
      break;
    case 'MySQL':
      // url
      let mysqlUrl = api.data.mysqlUrl;
      let mysqlUrlObj = new ModelField(
        modelFieldCategory.CONFIG,
        modelFieldConstant.DATA_SOURCE_URL,
        modelId,
        appId,
      );
      mysqlUrlObj.setName(modelFieldConstant.DATA_SOURCE_URL);
      mysqlUrlObj.setValue(modelFieldValueType.String, mysqlUrl);
      fields.push(mysqlUrlObj);
      // appKey
      let username = api.data.username;
      let password = api.data.password;

      let userNameObj = new ModelField(
        modelFieldCategory.CONFIG,
        modelFieldConstant.DATA_SOURCE_USER,
        modelId,
        appId,
      );
      userNameObj.setName(modelFieldConstant.DATA_SOURCE_USER);
      userNameObj.setValue(modelFieldValueType.String, username);
      fields.push(userNameObj);

      let passwordObj = new ModelField(
        modelFieldCategory.CONFIG,
        modelFieldConstant.DATA_SOURCE_PWD,
        modelId,
        appId,
      );
      passwordObj.setName(modelFieldConstant.DATA_SOURCE_PWD);
      passwordObj.setValue(modelFieldValueType.String, password);
      fields.push(passwordObj);
      break;
    default:
      // url
      break;
  }
  return fields;
}

export const jdbcConnectButton = {
  label: '连通性测试',
  type: 'button',
  level: 'link',
  actionType: 'ajax',
  messages: {
    success: '连接成功!',
    failed: '连接失败!',
  },
  api: {
    method: 'post',
    url: '/api/ext/model/jdbc/connectivity',
    requestAdaptor: function (api:any) {
      let timestamp = new Date().getTime();
      let displayName = api.data.name;
      let category = api.data.category;
      let display = api.data.display;
      let jdbc = new MockBizModel();
      jdbc.displayName = displayName;
      jdbc.display = display;
      jdbc.category = category;
      let id = api.data.id;
      let fields = buildJdbcFields(api, timestamp, timestamp);
      return {
        ...api,
        data: {
          ...jdbc,
          id: id,
          fields,
        },
      };
    },
    adaptor: function (payload:any) {
      if(beforeHandle(payload)){
        return {
          data: payload.data,
        };
      }
      return errorHandle(payload);
    },
  },
};
