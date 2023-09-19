import { jdbcFormBody } from '@/pages/app/datasource/jdbc/addJdbc';
import {
  ModelField,
  modelFieldCategory,
  modelFieldConstant,
  modelFieldValueType,
} from '@/pages/app/datasource/util/modelField';
import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";

const { query = {} } = history.location;
const { appId } = query;

/**
 * build a fields as array
 * @param api
 * @param modelId
 * @param appId
 */
function buildFields(api:any, modelId: bigint, appId: any,add?:boolean) {
  if(add === undefined){
    add = false
  }
  let fields = [];
  let fieldIdNameMapping = api.data.fieldIdNameMapping;

  // 默认使用jdbc
  let typeField = new ModelField(modelFieldCategory.CONFIG, 'type', modelId, appId);
  if(!add){
    typeField.setId(
      fieldIdNameMapping.filter((e) => {
        return e.name === 'type';
      })[0]?.id,
    );
  }
  typeField.setName('type');
  typeField.setValue(modelFieldValueType.String, 'jdbc');
  fields.push(typeField);

  // type
  let type = api.data.type;
  let url = 'mysql';
  let diakectField = undefined;
  let datasourceUrl = undefined;

  // username
  let username = api.data.username;
  let usernameField = new ModelField(
    modelFieldCategory.CONFIG,
    modelFieldConstant.DATA_SOURCE_USER,
    modelId,
    appId,
  );
  if(!add){
    usernameField.setId(
      fieldIdNameMapping.filter((e) => {
        return e.name === modelFieldConstant.DATA_SOURCE_USER.toString();
      })[0]?.id,
    );
  }
  usernameField.setName(modelFieldConstant.DATA_SOURCE_USER);
  usernameField.setValue(modelFieldValueType.String, username);
  fields.push(usernameField);

  // password
  let password = api.data.password;
  let passwordField = new ModelField(
    modelFieldCategory.CONFIG,
    modelFieldConstant.DATA_SOURCE_PWD,
    modelId,
    appId,
  );
  if(!add){
    passwordField.setId(
      fieldIdNameMapping.filter((e) => {
        return e.name === modelFieldConstant.DATA_SOURCE_PWD.toString();
      })[0]?.id,
    );
  }
  passwordField.setName(modelFieldConstant.DATA_SOURCE_PWD);
  passwordField.setValue(modelFieldValueType.String, password);
  fields.push(passwordField);

  switch (type) {
    case 'MySQL':
      url = api.data.mysqlUrl;
      datasourceUrl = new ModelField(
        modelFieldCategory.CONFIG,
        modelFieldConstant.DATA_SOURCE_URL,
        modelId,
        appId,
      );
      if(!add){
        datasourceUrl.setId(
          fieldIdNameMapping.filter((e) => {
            return e.name === modelFieldConstant.DATA_SOURCE_URL.toString();
          })[0]?.id,
        );
      }
      datasourceUrl.setName(modelFieldConstant.DATA_SOURCE_URL);
      datasourceUrl.setValue(modelFieldValueType.String, url);
      fields.push(datasourceUrl);

      diakectField = new ModelField(
        modelFieldCategory.CONFIG,
        modelFieldConstant.SQL_DIALECT,
        modelId,
        appId,
      );
      if(!add){
        diakectField.setId(
          fieldIdNameMapping.filter((e) => {
            return e.name === modelFieldConstant.SQL_DIALECT.toString();
          })[0]?.id,
        );
      }
      diakectField.setName(modelFieldConstant.SQL_DIALECT);
      diakectField.setValue(modelFieldValueType.String, 'MySQL');
      fields.push(diakectField);
      break;
    case 'MSSQL':
      url = api.data.mssqlUrl;
      datasourceUrl = new ModelField(
        modelFieldCategory.CONFIG,
        modelFieldConstant.DATA_SOURCE_URL,
        modelId,
        appId,
      );
      if(!add){
        datasourceUrl.setId(
          fieldIdNameMapping.filter((e) => {
            return e.name === modelFieldConstant.DATA_SOURCE_URL.toString();
          })[0]?.id,
        );
      }
      datasourceUrl.setName(modelFieldConstant.DATA_SOURCE_URL);
      datasourceUrl.setValue(modelFieldValueType.String, url);
      fields.push(datasourceUrl);

      diakectField = new ModelField(
        modelFieldCategory.CONFIG,
        modelFieldConstant.SQL_DIALECT,
        modelId,
        appId,
      );
      if(!add){
        diakectField.setId(
          fieldIdNameMapping.filter((e) => {
            return e.name === modelFieldConstant.SQL_DIALECT.toString();
          })[0]?.id,
        );
      }
      diakectField.setName(modelFieldConstant.SQL_DIALECT);
      diakectField.setValue(modelFieldValueType.String, 'MSSQL');
      fields.push(diakectField);
      break;
    case 'HIVE':
      url = api.data.hiveUrl;
      datasourceUrl = new ModelField(
        modelFieldCategory.CONFIG,
        modelFieldConstant.DATA_SOURCE_URL,
        modelId,
        appId,
      );
      if(!add){
        datasourceUrl.setId(
          fieldIdNameMapping.filter((e) => {
            return e.name === modelFieldConstant.DATA_SOURCE_URL.toString();
          })[0]?.id,
        );
      }
      datasourceUrl.setName(modelFieldConstant.DATA_SOURCE_URL);
      datasourceUrl.setValue(modelFieldValueType.String, url);
      fields.push(datasourceUrl);

      diakectField = new ModelField(
        modelFieldCategory.CONFIG,
        modelFieldConstant.SQL_DIALECT,
        modelId,
        appId,
      );
      if(!add){
        diakectField.setId(
          fieldIdNameMapping.filter((e) => {
            return e.name === modelFieldConstant.SQL_DIALECT.toString();
          })[0]?.id,
        );
      }
      diakectField.setName(modelFieldConstant.SQL_DIALECT);
      diakectField.setValue(modelFieldValueType.String, 'HIVE');
      fields.push(diakectField);
      break;
    default:
      break;
  }
  return fields;
}

export const datasourceJdbcForm: SchemaNode = {
  type: 'form',
  mode: 'horizontal',
  promptPageLeave: true,
  reload: 'jdbcSourceForm',
  api: {
    method: 'post',
    url: '/api/def/model/complete/save',
    requestAdaptor: function (api) {
      let modelId = api.data.modelId;
      let timestamp = new Date().getTime();
      let name = 'jdbcSource__' + timestamp;
      let displayName = api.data.displayName;
      let add = true
      let fields = buildFields(api, modelId, appId,add);
      return {
        ...api,
        data: {
          ...api.data,
          localName: displayName,
          id: modelId,
          name: name,
          displayName: displayName,
          fields: fields,
        },
        fields: fields,
      };
    },
    adaptor: function (payload) {
      if(beforeHandle(payload)){
        return {
          data: payload.data,
        };
      }
      return errorHandle(payload);
    },
  },
  body: jdbcFormBody,
};


export const datasourceJdbcEdit: SchemaNode = {
  type: 'form',
  mode: 'horizontal',
  promptPageLeave: true,
  reload: 'jdbcSourceForm',
  api: {
    method: 'post',
    url: '/api/def/model/complete/save',
    requestAdaptor: function (api) {
      let modelId = api.data.modelId;
      let timestamp = new Date().getTime();
      let name = 'jdbcSource__' + timestamp;
      let displayName = api.data.displayName;
      let add = false
      let fields = buildFields(api, modelId, appId,add);
      return {
        ...api,
        data: {
          ...api.data,
          localName: displayName,
          id: modelId,
          name: name,
          displayName: displayName,
          fields: fields,
        },
        fields: fields,
      };
    },
    adaptor: function (payload) {
      if(beforeHandle(payload)){
        return {
          data: payload.data,
        };
      }
      return errorHandle(payload);
    },
  },
  body: jdbcFormBody,
};
