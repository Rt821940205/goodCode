import {
  ModelField,
  modelFieldCategory,
  modelFieldValueType,
} from '@/pages/app/datasource/util/modelField';

function generalFieldBuilder(value: any, fieldName: string, modelId: any, appId: string) {
  let field = new ModelField(modelFieldCategory.CONFIG, fieldName, modelId, appId);
  field.setName(fieldName);
  field.setValue(modelFieldValueType.String, value);
  return field;
}

/**
 * 构建api服务
 * *
 * * bizModel(API源)  auth
 * *
 * * - field - api url method params body
 * * - field - api url method params body
 * * - field - api url method params body
 * * - field - api url method params body
 * * - field - api url method params body
 * *
 * *
 * *
 * * mock
 * *  bizModel(api)
 * *  field - url
 * *  field - method
 * *  field - param
 * *  field - source_id  auth
 * @param api
 * @param modelId
 * @param appId
 * @param source_id
 */
export function buildApiServerFields(api: any, modelId: any, appId: any, source_id: any) {
  let fields:any[] = [];

  // url
  let url = api.data.url;
  if (url === '' || url === undefined) {
    return fields;
  }
  let urlField = generalFieldBuilder(url, 'url', modelId, appId);
  fields.push(urlField);
  // query param
  let params = api.data.params;
  if (Array.isArray(params)) {
    params.forEach((param) => {
      let bizNo = param.paramName
      let category = modelFieldCategory.INPUT
      if(param.paramName !== undefined && "header__" !== param.paramName.substring(0,"header__".length)){
        bizNo = 'param__' + param.paramName
      }
      if(param.paramName !== undefined && "header__" === param.paramName.substring(0,"header__".length)){
        category = modelFieldCategory.CONFIG
      }
      let paramField = {
        appId: appId,
        bizNo: bizNo,
        category: category,
        defaultValue: param.paramValue,
        displayName: param.paramValue,
        foreign: 0,
        indexed: 0,
        length: 20,
        localName: param.paramName,
        modelId: modelId,
        modify: 0,
        name: bizNo,
        notNull: 0,
        primary: 0,
        show: 1,
        state: 1,
        typeName: param.paramType,
        unique: 0,
        val: param.paramValue,
      };
      fields.push(paramField);
    });
  }

  // body
  // - none
  // - formData {key:value,key2:value2}
  // - urlEncoding {key:value,key2:value2}
  // - raw  raw:json
  // header {key:value,key2:value2}
  let header = api.data.header;
  if (Array.isArray(header)) {
    header.forEach((head) => {
      let headField = generalFieldBuilder(head.headerValue, head.headerName, modelId, appId);
      headField.setHeader(head.headerName);
      headField.setValueType(head.headerType);
      fields.push(headField);
    });
  }
  if (api.data.body === undefined) {
    return fields;
  }
  let bodyType = api.data.body.type;
  let authType = api.data.auth_type;
  if (authType === 'chinaoly') {
    bodyType = 'JSON';
  }
  let bodyTypeField = generalFieldBuilder(bodyType, 'body_type', modelId, appId);
  fields.push(bodyTypeField);
  bodyTypeField.setValue(modelFieldValueType.String, bodyType /*api.data.body.type*/);

  let bodyForm = api.data.body;
  let bodyFields = [];
  if (bodyForm != undefined) {
    switch (bodyForm.type) {
      case 'none':
        break;
      case 'formData':
        bodyForm.formData.forEach((body:any) => {
          let bodyFormDataField = generalFieldBuilder(
            body.paramValue,
            body.paramName,
            modelId,
            appId,
          );
          bodyFormDataField.setBodyFormData(body.paramName);
          bodyFormDataField.setValueType(body.paramType);
          bodyFormDataField.setValue(body.paramType, body.paramValue);
          fields.push(bodyFormDataField);
        });
        break;
      case 'formUrlencoded':
        bodyFields = bodyForm.formUrlencoded;
        bodyFields.forEach((body:any) => {
          let bodyFormUrlencodedField = generalFieldBuilder(
            body.paramValue,
            body.paramName,
            modelId,
            appId,
          );
          bodyFormUrlencodedField.setBodyFormUrlencodedField(body.paramName);
          bodyFormUrlencodedField.setValueType(body.paramType);
          fields.push(bodyFormUrlencodedField);
        });
        break;
      case 'JSON':
        bodyFields = [{ JSON: bodyForm.JSON }];
        let bodyRawField = generalFieldBuilder(bodyForm.JSON, 'JSON', modelId, appId);
        bodyRawField.setBodyJson('body');
        bodyRawField.setValueType(modelFieldValueType.String);
        fields.push(bodyRawField);
        break;
      default:
        break;
    }
  }

  let sourceIdField = generalFieldBuilder(source_id, 'source_id', modelId, appId);
  sourceIdField.setValue(modelFieldValueType.String, source_id);
  fields.push(sourceIdField);

  // method
  let method = api.data.method;
  let methodField = generalFieldBuilder(method, 'method', modelId, appId);
  fields.push(methodField);

  let responseBodyValue = api.data.requestBody;
  if (responseBodyValue === undefined) {
    return fields;
  }
  let responseBodyField = generalFieldBuilder(responseBodyValue, 'requestBody', modelId, appId);
  responseBodyField.setValue(modelFieldValueType.String, responseBodyValue /*api.data.body.type*/);
  fields.push(responseBodyField);

  return fields;
}
