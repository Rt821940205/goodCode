import {
  parseResult,
  xpathFieldParse,
} from '@/pages/app/datasource/model/create/util/apiModelFieldAdd';
import {
  ParamsTables,
  ResultTables,
  tdObj,
  Tds,
} from '@/pages/app/datasource/model/create/util/inputResultWrapper';
import { flattenFieldsForModel } from '@/pages/app/datasource/util/apiModelSubmit';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";
import {displayNameHandle} from "@/services/xuanwu/stringutil";

export const apiFieldList = {
  type: 'form',
  title: '',
  initApi: {
    method: 'get',
    url: '/api/def/model/complete/info?modelId=${modelId}',
    adaptor: function (payload: any) {
      let modelFields = payload.data.fields;
      // category 1 config
      // category 2 input
      // category 3 result
      // category 4 input and result
      let configFields = modelFields.filter((item:any) => {
        return item.category === 1;
      });
      let paramsFields = modelFields.filter((item:any) => {
        return item.category === 2 || item.category === 4;
      });
      let resultFields = modelFields.filter((item:any) => {
        return item.category === 3 || item.category === 4;
      });
      let params: object[] = [];
      paramsFields.forEach((currentValue: any, index: number, arr: Array<string>) => {
        var key = index.toString() + '';
        let position = 'param'
        if(currentValue.name !== undefined && "header__" === currentValue.name.substring(0,"header__".length)){
          position = 'header'
        }
        params[key] = {
          index: index,
          id: currentValue.id,
          position: position,
          displayName: currentValue.displayName,
          name: currentValue.name,
          value: currentValue.defaultValue,
          type: currentValue.typeName,
          disable: currentValue.state,
        };
      });
      let results: object[] = [];
      resultFields.forEach((currentValue: any, index: number, arr: Array<string>) => {
        var key = index.toString() + '';
        results[key] = {
          index: index,
          id: currentValue.id,
          displayName: currentValue.displayName,
          name: currentValue.name,
          value: currentValue.defaultValue,
          type: currentValue.typeName,
          disable: currentValue.state,
        };
      });

      let source_id = '';
      let sourceIdList = undefined;
      let apiIdList = undefined;
      if (Array.isArray(payload.data.fields)) {
        sourceIdList = payload.data.fields.filter((item:any) => item.name === 'source_id');
        apiIdList = payload.data.fields.filter((item:any) => {
          return item.name === 'api_id';
        });
      }
      if (Array.isArray(sourceIdList) && sourceIdList != null && sourceIdList.length > 0) {
        source_id = sourceIdList[0].defaultValue;
      }
      let modelId = payload.data.id;
      let api_id = '';
      if (Array.isArray(apiIdList) && apiIdList != null && apiIdList.length > 0) {
        api_id = apiIdList[0].defaultValue;
      }
      return {
        modelFields: modelFields,
        hasFields: true,
        data: {
          params: params,
          results: results,
          source_id: source_id,
          api_id: api_id,
          entityId: modelId,
          configFields: configFields,
          hasFields: true,
        },
      };
    },
  },
  api: {
    method: 'post',
    url: '/api/def/model/field/batch/add?_=apiStep2Entity',
    requestAdaptor: function (api:any) {
      let appId = api.data.appId;
      // api_id
      // source_id
      let model = flattenFieldsForModel(api);
      let entityId = api.data.entityId;
      return {
        ...api,
        data: {
          ...model,
          appId: appId,
          // 只更新字段，不生成页面
          generate: false,
          id: entityId,
          entityId: entityId,
        },
      };
    },
    adaptor: function (payload: any) {
      if(beforeHandle(payload)){
        return {
          ...payload,
          data: payload.data,
        };
      }
      return errorHandle(payload);
    },
  },
  name: 'apiFields',
  hiddenOn: 'this.category != 101210',
  body: [
    {
      type: 'grid',
      columns: [
        {
          body: [
            {
              type: 'service',
              initFetchSchema: false,
              name: 'serviceEdit',
              rebuild: 'serviceEdit?modelFields=${modelFields}',
              className: 'params-table',
              schemaApi: {
                method: 'get',
                url: '/api/def/model/field/list?modelId=${source_id}&api_id=${api_id}&source_id=${source_id}&hasFields=${hasFields}',
                adaptor: function (payload:any, response:any, api:any) {
                  let api_id = api.query.api_id;
                  let serviceFields: object[] = [];
                  let sourceFields = payload.data;
                  let currentApi = undefined;
                  if (Array.isArray(sourceFields)) {
                    currentApi = sourceFields.filter((f) => {
                      return f.id === api_id;
                    })[0];
                  }
                  let paramsTables = new ParamsTables();
                  if (currentApi != undefined) {
                    let itemValues = JSON.parse(currentApi.defaultValue);
                    itemValues.forEach((k: any, index: number) => {
                      let xpathd = k.xpathKey;
                      k.index = index;
                      let items = xpathFieldParse(xpathd, k);
                      if (items.length > 0) {
                        // @ts-ignore
                        serviceFields.push(...items);
                      }
                    });
                  } else {
                    console.log('warning api_id is null');
                  }
                  serviceFields.forEach((param:any, idx) => {
                    // position code value type disable
                    let td = new Tds();
                    let no = new tdObj();
                    no.fill({ type: 'static', name: 'params[' + idx + '].index', value: idx + 1 });
                    let position = new tdObj();
                    position.fill({
                      type: 'static',
                      name: 'params[' + idx + '].position',
                      value: param.position,
                    });
                    param.displayName = param.code
                    param.displayName = displayNameHandle(param.displayName)
                    let displayName = new tdObj();
                    displayName.fill({
                      type: 'input-text',
                      name: 'params[' + idx + '].displayName',
                      value: param.displayName,
                      validations: {
                        maxLength: 20,
                      },
                      required: true,
                      labelRemark: {
                        body: 'UI展示名',
                        icon: 'question-mark',
                      },
                      validationErrors: {
                        maxLength: '长度超出限制，请输入小于20字的名称',
                      },
                      placeholder: '请输入一个长度小于20的名称',
                    });
                    let fieldName = new tdObj();
                    fieldName.fill({
                      type: 'static',
                      name: 'params[' + idx + '].name',
                      value: param.code,
                    });
                    let value = new tdObj();
                    value.fill({
                      type: 'static',
                      name: 'params[' + idx + '].value',
                      value: param.value,
                    });
                    let type = new tdObj();
                    type.fill({
                      type: 'static',
                      name: 'params[' + idx + '].type',
                      value: param.type,
                    });

                    let disable = new tdObj();
                    disable.fill({
                      type: 'switch',
                      trueValue: 1,
                      falseValue: 0,
                      name: 'params[' + idx + '].disable',
                      value: param.disable,
                      onText: '开启',
                      offText: '关闭',
                    });
                    td.push(no);
                    td.push(position);
                    td.push(displayName);
                    td.push(fieldName);
                    td.push(value);
                    td.push(type);
                    td.push(disable);
                    paramsTables.push(td);
                  });
                  let body = [
                    {
                      type: 'tpl',
                      tpl: '请求参数',
                    },
                    paramsTables,
                  ];
                  return {
                    ...api.data,
                    body: body,
                  };
                },
              },
            },
          ],
        },
        {
          body: [
            {
              type: 'service',
              className: 'result-table',
              schemaApi: {
                method: 'get',
                url: '/api/def/model/field/list?modelId=${source_id}&api_id=${api_id}&source_id=${source_id}',
                adaptor: function (payload:any, response:any, api:any) {
                  let api_id = api.query.api_id;
                  let source_id = api.query.source_id;
                  let resultObjs:any = [];
                  let fields = payload.data;
                  let currentApi = undefined;
                  if (Array.isArray(fields)) {
                    currentApi = fields.filter((f) => {
                      return f.id === api_id;
                    })[0];
                  }
                  let resultTables = new ResultTables();
                  if (currentApi != undefined) {
                    let itemValues = JSON.parse(currentApi.defaultValue);
                    itemValues.forEach((k:any, index:any) => {
                      let xpathd = k.xpathKey;
                      k.index = index;
                      var resultObjMapping = parseResult(xpathd, k);
                      if (resultObjMapping.length > 0) {
                        resultObjs.push(...resultObjMapping);
                      }
                    });
                  }
                  resultObjs.forEach((result:any, idx:any) => {
                    // "paramName":"content"
                    // "displayName":"/content"
                    // "paramType":"String"
                    // "disable":1
                    // "id":5
                    // "index":5
                    let td = new Tds();
                    let no = new tdObj();
                    no.fill({ type: 'static', name: 'results[' + idx + '].index', value: idx + 1 });
                    let displayName = new tdObj();
                    result.paramName = displayNameHandle(result.paramName)
                    displayName.fill({
                      type: 'input-text',
                      name: 'results[' + idx + '].displayName',
                      value: result.paramName,
                      validations: {
                        maxLength: 20,
                      },
                      required: true,
                      labelRemark: {
                        body: 'UI展示名',
                        icon: 'question-mark',
                      },
                      validationErrors: {
                        maxLength: '长度超出限制，请输入小于20字的名称',
                      },
                      placeholder: '请输入一个长度小于20的名称',
                    });
                    let fieldName = new tdObj();
                    fieldName.fill({
                      type: 'static',
                      name: 'results[' + idx + '].name',
                      value: result.paramName,
                    });
                    let path = new tdObj();
                    path.fill({
                      type: 'static',
                      name: 'results[' + idx + '].path',
                      value: result.displayName,
                    });
                    let type = new tdObj();
                    type.fill({
                      type: 'select',
                      name: 'results[' + idx + '].type',
                      value: result.paramType,
                      options: ['Long', 'String'],
                    });
                    let disable = new tdObj();
                    disable.fill({
                      type: 'switch',
                      trueValue: 1,
                      falseValue: 0,
                      name: 'results[' + idx + '].disable',
                      value: result.disable,
                      onText: '开启',
                      offText: '关闭',
                    });
                    td.push(no);
                    td.push(displayName);
                    td.push(fieldName);
                    td.push(path);
                    td.push(type);
                    td.push(disable);
                    resultTables.push(td);
                  });
                  let body = [
                    {
                      type: 'tpl',
                      tpl: '返回结果',
                    },
                    resultTables,
                  ];
                  return {
                    ...api.data,
                    body: body,
                    source_id: source_id,
                  };
                },
              },
            },
          ],
        },
      ],
    },
  ],
};
