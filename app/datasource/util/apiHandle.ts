import { ApiSourceField } from '@/pages/app/datasource/Setting/apiSourceField';
import {
  Constants,
  ModelField,
  modelFieldCategory,
  modelFieldCategoryKey,
  modelFieldPrefix,
  modelFieldValueType,
} from '@/pages/app/datasource/util/modelField';
import { BodyData, HeaderData, ParamData } from '@/pages/app/datasource/util/parse';

/**
 * 将服务以服务源fields的方式注册上去
 * @param api
 * @param modelId
 * @param appId
 */
export function buildApiSourceFields(api:any, modelId: any, appId: any) {
  // 包含
  let bodyType = api.data.body.type;
  let fields = [];
  let compressApiSourcefields:any = [];
  // /config/url
  let urlValue = api.data.url;
  let urlKey = 'url';
  let urlParam = new ApiSourceField(urlKey);
  urlParam.setValue(urlValue, modelFieldValueType.String);
  urlParam.buildConfigXpathKey();
  compressApiSourcefields.push(urlParam);

  // method
  let methodValue = api.data.method;
  let methodKey = 'method';
  let methodObj = new ApiSourceField(methodKey);
  methodObj.setValue(methodValue, modelFieldValueType.String);
  methodObj.buildConfigXpathKey();

  compressApiSourcefields.push(methodObj);

  // body type
  let bodyForm = api.data.body;
  let bodyTypeKey = 'body_type';
  let bodyTypeField = new ApiSourceField(bodyTypeKey);
  let bodyFields = [];
  let bodyTypeValue = 'none';
  switch (bodyType) {
    case 'none':
      bodyTypeField.setValue(bodyTypeValue, modelFieldValueType.String);
      bodyTypeField.buildConfigXpathKey();
      compressApiSourcefields.push(bodyTypeField);
      break;
    case 'formData':
      bodyFields = bodyForm.formData;
      bodyTypeField.setValue('formData', modelFieldValueType.String);
      bodyTypeField.buildConfigXpathKey();
      compressApiSourcefields.push(bodyTypeField);
      // formData
      bodyFields.forEach((item:any) => {
        let formData = new ApiSourceField(item.paramName);
        formData.setValue(item.paramValue, item.paramType);
        formData.setXpathKey(
          modelFieldPrefix.FORM_DATA_FIELD_POSITION,
          modelFieldCategoryKey.INPUT_KEY,
        );
        compressApiSourcefields.push(formData);
      });
      break;
    case 'JSON':
      bodyTypeField.setValue('JSON', modelFieldValueType.String);
      bodyTypeField.buildConfigXpathKey();
      compressApiSourcefields.push(bodyTypeField);
      // raw
      // INPUT/json/body
      let raw = new ApiSourceField('JSON');
      raw.setValue(bodyForm.JSON, modelFieldValueType.String);
      raw.setXpathKey(modelFieldPrefix.JSON_FIELD_POSITION, modelFieldCategoryKey.INPUT_KEY);
      compressApiSourcefields.push(raw);
      break;
    default:
      break;
  }
  // header
  let headers = api.data.header;
  if (Array.isArray(headers)) {
    headers.forEach((head) => {
      let h = new ApiSourceField(head.headerName);
      h.setValue(head.headerValue, head.headerType);
      h.setXpathKey(modelFieldPrefix.HEADER_FIELD_POSITION, modelFieldCategoryKey.INPUT_KEY);
      compressApiSourcefields.push(h);
    });
  }

  // param
  let params = api.data.params;
  if (Array.isArray(params)) {
    params.forEach((param) => {
      let paramField = new ApiSourceField(param.paramName);
      paramField.setValue(param.paramValue, param.paramType);
      paramField.setXpathKey(
        modelFieldPrefix.PARAM_FIELD_POSITION,
        modelFieldCategoryKey.INPUT_KEY,
      );
      compressApiSourcefields.push(paramField);
    });
  }

  // result
  let results = api.data.resultObjs;
  if (Array.isArray(results)) {
    results.forEach((result) => {
      let resultField = new ApiSourceField(result.displayName);
      resultField.localName = result.paramName;
      // resultField.routeKey = modelFieldCategoryKey.RESULT_KEY
      resultField.setValue(result.paramValue, result.paramType);
      resultField.setXpathKey(
        modelFieldPrefix.RESULT_FIELD_POSITION,
        modelFieldCategoryKey.RESULT_KEY,
      );
      let items = compressApiSourcefields.filter((item:any) => {
        return item.xpathKey === resultField.getXpathKey();
      });
      if (items.length === 0) {
        compressApiSourcefields.push(resultField);
      }
    });
  }
  let showName = api.data.showName;
  let name = Constants.ApiDataNamePrefix + showName;
  let apisConfig = new ModelField(modelFieldCategory.CONFIG, name, modelId, appId);
  let apiConfigCompress = '';

  apiConfigCompress = JSON.stringify(compressApiSourcefields);
  let timestamp = new Date().getTime();
  if (api.data.id != undefined) {
    apisConfig.id = api.data.id;
  }
  apisConfig.setName(Constants.ApiServiceFieldsPrefix + timestamp);
  apisConfig.setValue(modelFieldValueType.String, apiConfigCompress);
  fields.push(apisConfig);
  console.log('fields');
  console.log(compressApiSourcefields);
  return fields;
}

/**
 * build a fields as array
 * @param api
 * @param modelId
 * @param appId
 */
export function buildFields(api:any, modelId: bigint, appId: any, add?: boolean) {
  if (add === undefined) {
    add = false;
  }
  let fields = [];
  let fieldIdNameMapping = api.data.fieldIdNameMapping;

  // authentication_type
  let authentication_type_value = api.data.authentication_type;
  let authentication_type = new ModelField(
    modelFieldCategory.CONFIG,
    'authentication_type',
    modelId,
    appId,
  );
  if (!add) {
    authentication_type.setId(
      fieldIdNameMapping.filter((item:any) => {
        return item.name === 'authentication_type';
      })[0]?.id,
    );
  }
  authentication_type.setName('authentication_type');
  authentication_type.setValueWithDefault(
    modelFieldValueType.String,
    authentication_type_value,
    'none',
  );
  fields.push(authentication_type);
  switch (authentication_type_value) {
    case 'none':
    case undefined:
      break;
    case 'wyy':
      let accessIdValue = api.data.accessId;

      // accessId
      let accessIdObj = new ModelField(
        modelFieldCategory.CONFIG,
        modelFieldPrefix.URL_FIELD_PREFIX + 'accessId',
        modelId,
        appId,
      );
      if (!add) {
        accessIdObj.setId(
          fieldIdNameMapping.filter((item:any) => {
            return item.name === modelFieldPrefix.URL_FIELD_PREFIX + 'accessId';
          })[0]?.id,
        );
      }
      accessIdObj.setName(modelFieldPrefix.URL_FIELD_PREFIX + 'accessId');
      accessIdObj.setValue(modelFieldValueType.String, accessIdValue);
      fields.push(accessIdObj);

      // privateKey
      let privateKey = api.data.privateKey;
      let privateKeyObj = new ModelField(
        modelFieldCategory.CONFIG,
        modelFieldPrefix.URL_FIELD_PREFIX + 'privateKey',
        modelId,
        appId,
      );
      if (!add) {
        privateKeyObj.setId(
          fieldIdNameMapping.filter((item:any) => {
            return item.name === modelFieldPrefix.URL_FIELD_PREFIX + 'privateKey';
          })[0]?.id,
        );
      }
      privateKeyObj.setName(modelFieldPrefix.URL_FIELD_PREFIX + 'privateKey');
      privateKeyObj.setValue(modelFieldValueType.String, privateKey);
      fields.push(privateKeyObj);
      break;
    case 'chinaoly':
      let authUrlValue = api.data.authUrl;
      let urlParam = new ModelField(
        modelFieldCategory.CONFIG,
        modelFieldPrefix.URL_FIELD_PREFIX + 'url',
        modelId,
        appId,
      );
      if (!add) {
        urlParam.setId(
          fieldIdNameMapping.filter((item:any) => {
            return item.name === modelFieldPrefix.URL_FIELD_PREFIX + 'url';
          })[0]?.id,
        );
      }
      urlParam.setUrl('url');
      urlParam.setValue(modelFieldValueType.String, authUrlValue);
      fields.push(urlParam);
      // appKey
      let appKey = api.data.appKey;
      let appKeyObj = new ModelField(
        modelFieldCategory.CONFIG,
        modelFieldPrefix.URL_FIELD_PREFIX + 'appKey',
        modelId,
        appId,
      );
      if (!add) {
        appKeyObj.setId(
          fieldIdNameMapping.filter((item:any) => {
            return item.name === modelFieldPrefix.URL_FIELD_PREFIX + 'appKey';
          })[0]?.id,
        );
      }
      appKeyObj.setName(modelFieldPrefix.URL_FIELD_PREFIX + 'appKey');
      appKeyObj.setValue(modelFieldValueType.String, appKey);
      fields.push(appKeyObj);

      // appSecret
      let appSecret = api.data.appSecret;
      let appSecretObj = new ModelField(
        modelFieldCategory.CONFIG,
        modelFieldPrefix.URL_FIELD_PREFIX + 'appSecret',
        modelId,
        appId,
      );
      if (!add) {
        appSecretObj.setId(
          fieldIdNameMapping.filter((item:any) => {
            return item.name === modelFieldPrefix.URL_FIELD_PREFIX + 'appSecret';
          })[0]?.id,
        );
      }
      appSecretObj.setName(modelFieldPrefix.URL_FIELD_PREFIX + 'appSecret');
      appSecretObj.setValue(modelFieldValueType.String, appSecret);
      fields.push(appSecretObj);
      break;
    default:
      // url
      break;
  }
  return fields;
}

///////

export function chooseApi(api:any, payload:any, appId:any) {
  let items = payload.data;
  if (!Array.isArray(items)) {
    return {
      data: [],
    };
  }
  return {
    options: payload.data
      .filter((item:any) => {
        return item.name.indexOf('api__fields__') == 0;
      })
      .map((item:any) => {
        let params = [];
        let body = undefined;
        let header = [];
        let valueString = item.defaultValue;
        let jsonObj = JSON.parse(valueString);
        jsonObj.forEach((obj:any) => {
          let xpathd = obj.xpathKey;
          // 最后一个/后面就是key
          let key = xpathd.substring(xpathd.lastIndexOf('/') + 1, xpathd.length);
          // prefix 第一个/之前的就是类型 CONFIG INPUT RESULT INPUT_RESULT
          let prefix = xpathd.substring(0, xpathd.indexOf('/', 0));
          // position prefix之后的就是position
          let jude = xpathd.substring(0, xpathd.indexOf(key) - 1);
          let startIndex = xpathd.indexOf(prefix) + 6;
          if (-1 != jude.indexOf('//')) {
            startIndex = xpathd.indexOf(prefix) + 7;
          }
          let position = xpathd.substring(startIndex, xpathd.indexOf(key) - 1);
          switch (position) {
            case modelFieldPrefix.PARAM_FIELD_POSITION.toString():
              let paramData = new ParamData();
              paramData.paramName = key;
              paramData.paramValue = obj.value;
              paramData.paramType = obj.type;
              params.push(paramData);
              break;
            case modelFieldPrefix.HEADER_FIELD_POSITION.toString():
              let headerData = new HeaderData();
              headerData.headerName = key;
              headerData.headerValue = obj.value;
              headerData.headerType = obj.type;
              console.log('headerData');
              console.log(obj);
              header.push(headerData);
              break;
            case modelFieldPrefix.JSON_FIELD_POSITION.toString():
              let bodyDataRaw = new BodyData();
              bodyDataRaw.JSON = obj.value;
              bodyDataRaw.type = 'JSON';
              body = bodyDataRaw;
              break;
            case modelFieldPrefix.FORM_DATA_FIELD_POSITION.toString():
              let bodyData = new BodyData();
              let param = new ParamData();
              param.paramName = key;
              param.paramValue = obj.value;
              param.paramType = obj.type;
              bodyData.formData.push(param);
              bodyData.type = 'formData';
              body = bodyData;
              break;
            case modelFieldPrefix.FORM_DATA_URL_ENCODING_FIELD_POSITION.toString():
              let bodyDataUrl = new BodyData();
              let paramUrl = new ParamData();
              paramUrl.paramName = key;
              paramUrl.paramValue = obj.value;
              paramUrl.paramType = obj.type;
              bodyDataUrl.formData.push(paramUrl);
              bodyDataUrl.type = modelFieldPrefix.FORM_DATA_URL_ENCODING_FIELD_POSITION.toString();
              body = bodyDataUrl;
              break;
            default:
              break;
          }
        });
        console.log(body);
        return {
          label: item.displayName.substring(
            Constants.ApiDataNamePrefix.length,
            item.displayName.length,
          ),
          value: item.id,
        };
      }),
  };
}

export function chooseApiService(payload: any) {
  let items = payload.data.data;
  if (!Array.isArray(items)) {
    return {
      data: [],
    };
  }
  let options:any = [];
  items.forEach((item) => {
    let obj = { label: item.displayName, value: item.id };
    options.push(obj);
  });
  return {
    data: {
      options: options,
    },
  };
}

/**
 * 递归遍历json所有数据
 *
 * @param jsons { jsonArray } json 数据
 * @param name { string } 拼接前缀
 * @param sign { string } 拼接方式
 * @param callback { function } 回调方法
 */
export function xpathKeysTrans(jsons:any, name:any, sign:any, callback:any) {
  for (let key in jsons) {
    let k = '';
    let isArray = false;
    if (parseFloat(key).toString() != 'NaN') {
      k = name + '[]';
      isArray = true;
    } else {
      k = name + sign + key;
      isArray = false;
    }
    if (!(jsons[key] instanceof Object)) {
      if (typeof callback === 'function') {
        // /value/header/0/headerValue headerValue admin
        if (parseFloat(key).toString() != 'NaN') {
          key = '[]';
        }
        callback(k, key, jsons[key], isArray);
      }
    } else {
      xpathKeysTrans(jsons[key], k, sign, callback); //如果是Object则递归
    }
  }
}

export function wrapResultObjs(results:any, resultObjs: any[]) {
  let keyList:any[] = [];
  xpathKeysTrans(results, '', '/', function (k:any, key:any, value:any, isArray:any) {
    keyList.push({ paramName: k, displayName: key, paramType: 'String' });
  });
  let newArr = [];
  let obj = {};
  for (let i = 0; i < keyList.length; i++) {
    if (!obj[keyList[i].paramName]) {
      newArr.push(keyList[i]);
      obj[keyList[i].paramName] = true;
    }
  }
  console.log(newArr);

  newArr.forEach((o) => {
    resultObjs.push({ paramName: o.paramName, displayName: o.displayName, paramType: 'String' });
  });
}
