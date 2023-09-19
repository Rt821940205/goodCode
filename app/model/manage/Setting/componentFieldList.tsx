import {ParamsTables, ResultTables, tdObj, Tds} from "@/pages/app/datasource/model/create/util/inputResultWrapper";
import {parseResult, xpathFieldParse} from "@/pages/app/datasource/model/create/util/apiModelFieldAdd";
import {displayNameHandle} from "@/services/xuanwu/stringutil";

export const componentFieldList = {
  type: 'form',
  title: '',
  actions:[],
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
      let columnFields = modelFields.filter((item:any) => {
        return item.category !== 1;
      });
      let columns: object[] = [];
      columnFields.forEach((currentValue: any, index: number, arr: Array<string>) => {
        var key = index.toString() + '';
        let asField = 0;
        let conditionSelected = 0;
        // input
        if (currentValue.category === 2 || currentValue.category === 4) {
          if (currentValue.state == 1) {
            conditionSelected = 1;
          }
        }
        // output
        if (currentValue.category === 3 || currentValue.category === 4) {
          if (currentValue.state == 1) {
            asField = 1;
          }
        }

        // result
        columns[key] = {
          index: index,
          id: currentValue.id,
          displayName: currentValue.displayName,
          name: currentValue.name,
          type: currentValue.typeName,
          asField: asField,
          conditionSelected: conditionSelected,
          disable: currentValue.state,
        };
      });
      let source_id = '';
      let sourceIdList = undefined;
      let tableNameList = undefined;
      if (Array.isArray(payload.data.fields)) {
        sourceIdList = payload.data.fields.filter((item:any) => item.name === 'source_id');
        tableNameList = payload.data.fields.filter((item:any) => {
          return item.name === 'tableName';
        });
      }
      if (Array.isArray(sourceIdList) && sourceIdList != null &&sourceIdList.length > 0) {
        source_id = sourceIdList[0].defaultValue;
      }
      let modelId = payload.data.id;
      let tableName = '';
      if (Array.isArray(tableNameList) && tableNameList.length > 0) {
        tableName = tableNameList[0].defaultValue;
      }
      return {
        modelFields: modelFields,
        hasFields: true,
        data: {
          columns: columns,
          source_id: source_id,
          table_id: tableName,
          entityId: modelId,
          configFields: configFields,
          hasFields: true,
        },
      };
    },
  },
  name: 'componentFields',
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
                      tpl: '输入参数',
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
                      tpl: '返回参数',
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
