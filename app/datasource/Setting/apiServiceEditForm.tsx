import { api_field_mapping } from '@/pages/app/datasource/model/create/step_2_api_field_mapping';
import {
  ModelField,
  modelFieldCategory,
  modelFieldPrefix,
  modelFieldValueType,
} from '@/pages/app/datasource/util/modelField';

import { history } from '@@/core/history';

const { query = {} } = history.location;
const { appId } = query;
/**
 * build a fields as array
 * @param api
 * @param modelId
 * @param appId
 * @param service_id
 * @param bodyType
 */
function buildApiDataFields(api:any, modelId: bigint, appId: any, service_id: any, bodyType: any) {
  let fields = [];
  // url
  let urlValue = api.data.url;
  let urlParam = new ModelField(modelFieldCategory.CONFIG, 'url', modelId, appId);
  urlParam.setName('url');
  urlParam.setValue(modelFieldValueType.String, urlValue);

  // method
  let methodValue = api.data.method;
  let methodObj = new ModelField(modelFieldCategory.CONFIG, 'method', modelId, appId);
  methodObj.setName('method');
  methodObj.setValue(modelFieldValueType.String, methodValue);
  fields.push(urlParam);
  fields.push(methodObj);
  // source_id
  let sourceId = new ModelField(modelFieldCategory.CONFIG, 'source_id', modelId, appId);
  sourceId.setName('source_id');
  sourceId.setValue(modelFieldValueType.String, service_id);
  if (service_id == undefined) {
    console.log('source_id 为空');
  }
  fields.push(sourceId);

  // body type
  let bodyForm = api.data.body;
  let bodyTypeField = new ModelField(modelFieldCategory.CONFIG, 'body_type', modelId, appId);
  bodyTypeField.setName('body_type');
  let bodyFields = [];
  switch (bodyType) {
    case 'none':
      bodyTypeField.setValue(modelFieldValueType.String, bodyType);
      fields.push(bodyTypeField);
      break;
    case 'formData':
      bodyFields = bodyForm.formData;
      if (Array.isArray(bodyFields)) {
        bodyTypeField.setValue(modelFieldValueType.String, 'formData');
        fields.push(bodyTypeField);
        // formData
        bodyFields.forEach((e) => {
          let formData = new ModelField(
            modelFieldCategory.INPUT,
            modelFieldPrefix.FORM_DATA_FIELD_PREFIX + e.paramName,
            modelId,
            appId,
          );
          formData.setName(modelFieldPrefix.FORM_DATA_FIELD_PREFIX + e.paramName);
          formData.setValue(e.paramType, e.paramValue);
          fields.push(formData);
        });
      }
      break;
    case 'formUrlencoded':
      bodyFields = bodyForm.formUrlencoded;
      if (Array.isArray(bodyFields)) {
        bodyTypeField.setValue(modelFieldValueType.String, 'formUrlencoded');
        fields.push(bodyTypeField);
        // formUrlencoded
        bodyFields.forEach((e) => {
          let formUrlencoded = new ModelField(
            modelFieldCategory.INPUT,
            modelFieldPrefix.FORM_DATA_URL_ENCODING_FIELD_PREFIX + e.paramName,
            modelId,
            appId,
          );
          formUrlencoded.setName(
            modelFieldPrefix.FORM_DATA_URL_ENCODING_FIELD_PREFIX + e.paramName,
          );
          formUrlencoded.setValue(e.paramType, e.paramValue);
          fields.push(formUrlencoded);
        });
      }
      break;
    case 'JSON':
      bodyTypeField.setValue(modelFieldValueType.String, 'JSON');
      fields.push(bodyTypeField);
      // raw
      let raw = new ModelField(
        modelFieldCategory.INPUT,
        'body',
        modelId,
        appId,
      );
      raw.setName('body');
      raw.setValue(modelFieldValueType.String, bodyForm.JSON.paramValue);
      fields.push(raw);
      break;
    default:
      break;
  }
  // header
  let headers = api.data.header;
  if (Array.isArray(headers)) {
    headers.forEach((head) => {
      let name = modelFieldPrefix.HEADER_FIELD_PREFIX + head.headerName;
      let h = new ModelField(modelFieldCategory.INPUT, name, modelId, appId);
      h.setName(name);
      h.setValue(head.headerType, head.headerValue);
      fields.push(h);
    });
  }

  // param
  let params = api.data.params;
  if (Array.isArray(params)) {
    params.forEach((param) => {
      let paramName = modelFieldPrefix.HEADER_FIELD_PREFIX + param.paramName;
      let paramField = new ModelField(modelFieldCategory.INPUT, paramName, modelId, appId);
      paramField.setName(paramName);
      paramField.setValue(param.paramType, param.paramValue);
      fields.push(paramField);
    });
  }

  // result
  let results = api.data.resultObj;
  if (Array.isArray(results)) {
    results.forEach((result) => {
      let resultName = result.paramName;
      let resultField = new ModelField(modelFieldCategory.RESULT, resultName, modelId, appId);
      resultField.setName(resultName);
      resultField.setValueType(result.paramType);
      resultField.setDisplayName(result.displayName);
      fields.push(resultField);
    });
  }
  console.log('fields');
  console.log(fields);
  return fields;
}

export const apiServiceEditForm = {
  title: '智能服务配置',
  jumpable: false,
  api: {
    method: 'post',
    url: '/api/def/model/field/batch/add?_=aiServiceEntity',
    requestAdaptor: function (api:any) {
      let modelId = api.data.modelId;
      let service_id = api.data.service_id;
      let bodyType = api.data.body.type;
      let fields = buildApiDataFields(api, modelId, appId, service_id, bodyType);
      return {
        ...api,
        data: {
          modelId: modelId,
          id: modelId,
          appId: appId,
          fields,
        },
      };
    },
    adaptor: function (payload: any) {
      let msg = payload.message;
      if (payload.code != 200) {
        return {
          status: 2,
          msg: msg,
        };
      }
      return {
        data: payload.data,
      };
    },
  },
  body: api_field_mapping,
};
