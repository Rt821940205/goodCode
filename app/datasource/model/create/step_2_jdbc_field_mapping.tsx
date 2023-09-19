import {
  jdbcResultTHead,
  ResultTables,
  tdObj,
  Tds,
} from '@/pages/app/datasource/model/create/util/inputResultWrapper';
import { SchemaNode } from '@fex/amis/lib/types';
import './index.less';
import {displayNameHandle} from "@/services/xuanwu/stringutil";
export const jdbc_field_mapping: SchemaNode = {
  type: 'page',
  body: [
    {
      type: 'service',
      className: 'result-table',
      schemaApi: {
        method: 'get',
        url: '/api/ext/model/jdbc/table/desc?_=getTableColumns&modelId=${source_id}&tableName=${table_id}',
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
              value: 1,
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
