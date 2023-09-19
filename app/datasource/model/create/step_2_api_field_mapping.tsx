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
import { SchemaNode } from '@fex/amis/lib/types';
import {displayNameHandle} from "@/services/xuanwu/stringutil";

export const api_field_mapping: SchemaNode = {
  type: 'page',
  title: '',
  body: [
    {
      type: 'hidden',
      name: 'source_id',
    },
    {
      type: 'hidden',
      name: 'modelId',
    },
    {
      type: 'hidden',
      name: 'apiMethod',
    },
    {
      type: 'hidden',
      name: 'api_id',
    },
    {
      type: 'hidden',
      name: 'apiUrl',
    },
    {
      type: 'hidden',
      name: 'apiId',
    },
    {
      type: 'container',
      body: [
        {
          type: 'service',
          className: 'params-table',
          schemaApi: {
            method: 'get',
            url: '/api/def/model/field/list?modelId=${source_id}&api_id=${api_id}&source_id=${source_id}&pageId=${pageId}',
            adaptor: function (payload:any, response:any, api:any) {
              let api_id = api.query.api_id;
              let serviceFields:any[] = [];
              let fields = payload.data;
              let currentApi = undefined;
              if (Array.isArray(fields)) {
                currentApi = fields.filter((f) => {
                  return f.id === api_id;
                })[0];
              }
              let paramsTables = new ParamsTables();
              if (currentApi != undefined) {
                let itemValues = JSON.parse(currentApi.defaultValue);
                itemValues.forEach((k: any, index: number) => {
                  let xpathd = k.xpathKey;
                  k.index = index;
                  var items = xpathFieldParse(xpathd, k);
                  if (items.length > 0) {
                    // @ts-ignore
                    serviceFields.push(...items);
                  }
                });
              }
              serviceFields.forEach((param:any, idx:any) => {
                // position code value type disable
                let td = new Tds();
                let no = new tdObj();
                param.code = displayNameHandle(param.code)
                no.fill({ type: 'static', name: 'params[' + idx + '].index', value: idx + 1 });
                let position = new tdObj();
                position.fill({
                  type: 'static',
                  name: 'params[' + idx + '].position',
                  value: param.position,
                });
                let displayName = new tdObj();
                param.displayName = param.code
                param.displayName = displayNameHandle(param.displayName)
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
                type.fill({ type: 'static', name: 'params[' + idx + '].type', value: param.type });

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
                  className: 'flex my-4'
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
        {
          type: 'service',
          className: 'result-table',
          schemaApi: {
            method: 'get',
            url: '/api/def/model/field/list?modelId=${source_id}&api_id=${api_id}&source_id=${source_id}',
            adaptor: function (payload:any, response:any, api:any) {
              let api_id = api.query.api_id;
              let source_id = api.query.source_id;
              let resultObjs:any[] = [];
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
                  className: 'flex my-4'
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
};
