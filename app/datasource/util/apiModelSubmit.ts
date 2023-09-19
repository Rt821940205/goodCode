import { MockBizModel } from '@/pages/app/datasource/util/bizModel';
import {
  ModelField,
  modelFieldCategory,
  modelFieldValueType,
} from '@/pages/app/datasource/util/modelField';

/**
 * build a fields as array
 * @param api
 * @param modelId
 * @param appId
 * @param service_id
 */
function buildDataFields(api: any, modelId: any, appId: any, service_id: any) {
  let fields = [];
  let inputFields = [];
  let resultFields: object[] = [];
  let inputResultFields: object[] = [];
  let configFields = api.data.configFields;
  if (configFields === undefined) {
    configFields = [];
  }

  let paramsObj = api.data.params;
  // index
  // position
  // name
  // value
  // type
  // disable
  for (let k in paramsObj) {
    let param = new ModelField(modelFieldCategory.INPUT, '', modelId, appId);
    for (let f in paramsObj[k]) {
      let value = paramsObj[k][f];
      switch (f) {
        case 'name':
          param.setLocalName(value);
          // param.name = param__
          if (-1 === value.indexOf(param.name)) {
            param.setName(param.name + value);
          } else {
            param.setName(value);
          }
          break;
        case 'displayName':
          param.setDisplayName(value);
          break;
        case 'value':
          param.setValue(modelFieldValueType.String, value);
          break;
        case 'type':
          param.setValueType(value);
          break;
        case 'disable':
          param.disable = value;
          break;
        case 'id':
          param.id = value;
          break;
        case 'position':
          if (param.name === undefined || param.name === '') {
            param.setName(value + '__');
          }
          break;
        default:
          break;
      }
    }
    inputFields.push(param);
  }

  // 结果实体
  let results = api.data.results;
  for (let k in results) {
    let resultField = new ModelField(modelFieldCategory.RESULT, '', modelId, appId);
    for (let f in results[k]) {
      let value = results[k][f];
      switch (f) {
        case 'name':
          resultField.setName(value);
          break;
        case 'path':
          resultField.setLocalName(value);
          break;
        case 'type':
          resultField.setValueType(value);
          break;
        case 'disable':
          resultField.disable = value;
          break;
        case 'id':
          resultField.id = value;
          break;
        case 'displayName':
          resultField.setDisplayName(value);
          break;
        default:
          break;
      }
    }
    if (resultField.disable === 1) {
      resultField.state = 1;
    } else {
      resultField.state = 0;
    }
    resultFields.push(resultField);
  }
  // disable: 1
  // index: 1
  // name: "content"
  // path: "/content"
  // type: "String"
  // 处理input
  inputFields.forEach((each) => {
    // @ts-ignore
    var valueIndex = resultFields.findIndex(function (currentValue:any, currentIndex, currentArray) {
      if (currentValue.name === each.name) {
        return true;
      }
    });
    if (-1 != valueIndex) {
      // 存在重名 inputResultFields 有 each
      resultFields[valueIndex].deleteMe = true;
      each.setCategory(modelFieldCategory.INPUT_RESULT);
      if (each.disable === 1) {
        each.state = 1;
      } else {
        each.state = 0;
      }
      inputResultFields.push(each);
    } else {
      // input入库
      if (each.disable === 1) {
        each.state = 1;
      } else {
        each.state = 0;
      }
      fields.push(each);
    }
  });
  fields.push(...inputResultFields);
  resultFields
    .filter((e) => {
      return e.deleteMe == undefined;
    })
    .forEach((e) => {
      fields.push(e);
    });
  return fields;
}

export function flattenFieldsForModel(api: any) {
  let mockModel = new MockBizModel();

  if (undefined != api) {
    let modelId = api.data.modelId;
    if(modelId === undefined || modelId === ''){
      modelId = api.data.entityId
    }
    let appId = api.data.appId;
    let service_id = api.data.source_id;
    mockModel.appId = appId;
    mockModel.setFields(buildDataFields(api, modelId, appId, service_id));
  }
  return mockModel;
}
