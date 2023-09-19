import {
  jdbcResultTHead,
  ResultTables,
  tdObj,
  Tds,
} from '@/pages/app/datasource/model/create/util/inputResultWrapper';
import { buildJdbcDataFields } from '@/pages/app/datasource/Setting/jdbcServiceEditForm';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";
import {displayNameHandle} from "@/services/xuanwu/stringutil";
export const jdbcFieldList = {
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
          // 只更新字段，不生成页面
          generate: false,
          add: true,
          fields: fields,
          name: api.data.name,
          status: 1,
          display: true,
          category: 101610,
        },
      };
    },
    adaptor: function (payload: any) {
      if(beforeHandle(payload)){
        return {
          data: payload.data,
        };
      }
      return errorHandle(payload);
    },
  },
  hiddenOn: 'this.category != 101610',
  name: 'jdbcFields',
  body: [
    {
      type: 'service',
      className: 'result-table',
      initFetchSchema: false,
      schemaApi: {
        method: 'get',
        url: '/api/ext/model/jdbc/table/desc?_=getTableColumns&modelId=${source_id}&tableName=${table_id}&hasFields=${hasFields}',
        adaptor: function (payload:any, response:any, api:any) {
          let columns = payload.data;
          if (!Array.isArray(columns)) {
            return {
              status: 2,
              msg: '请刷新重试',
            };
          }
          let resultTables = new ResultTables(jdbcResultTHead);
          columns.forEach((column, idx) => {
            let td = new Tds();
            let no = new tdObj();
            no.fill({ type: 'static', name: 'columns[' + idx + '].index', value: idx + 1 });
            let displayName = new tdObj();

            if (column.displayName === '' || column.displayName === undefined) {
              column.displayName = column.name
              column.displayName = displayNameHandle(column.displayName)
              displayName.fill({
                type: 'input-text',
                name: 'columns[' + idx + '].displayName',
                value: column.displayName,
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
            } else {
              column.displayName = displayNameHandle(column.displayName)
              displayName.fill({
                type: 'input-text',
                name: 'columns[' + idx + '].displayName',
                value: column.displayName,
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
            }
            let fieldName = new tdObj();
            fieldName.fill({
              type: 'static',
              name: 'columns[' + idx + '].name',
              value: column.name,
            });
            let type = new tdObj();
            type.fill({ type: 'static', name: 'columns[' + idx + '].type', value: column.type });
            let asField = new tdObj();
            asField.fill({
              type: 'switch',
              trueValue: 1,
              falseValue: 0,
              name: 'columns[' + idx + '].asField',
              value: 0,
              onText: '开启',
              offText: '关闭',
            });
            let conditionSelected = new tdObj();
            conditionSelected.fill({
              type: 'switch',
              trueValue: 1,
              falseValue: 0,
              name: 'columns[' + idx + '].conditionSelected',
              value: 0,
              onText: '开启',
              offText: '关闭',
            });
            td.push(no);
            td.push(displayName);
            td.push(fieldName);
            td.push(type);
            td.push(asField);
            td.push(conditionSelected);
            resultTables.push(td);
          });
          let body = [resultTables];
          return {
            ...api.data,
            body: body,
          };
        },
      },
    },
  ],
};
