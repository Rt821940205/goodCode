import {SchemaNode} from '@fex/amis/lib/types';
import {
  componentResultTHead,
  ResultTables,
  tdObj,
  Tds
} from "@/pages/app/datasource/model/create/util/inputResultWrapper";
import {displayNameHandle} from "@/services/xuanwu/stringutil";

/**
 * 提取实体 组装实体属性
 */
export const component_field_mapping: SchemaNode = [
  {
    type: 'group',
    body: [
      {
        type: 'input-text',
        size: 'lg',
        name: 'displayName',
        label: '实体名称'
      }
    ]
  },
  {
    type: 'group',
    body: [
      {
        type: 'textarea',
        size: 'lg',
        name: 'description',
        label: '描述'
      }
    ]
  },
  {
    type: 'group',
    body: [
      {
        type: 'service',
        className: 'result-table',
        schemaApi: {
          method: 'post',
          url: '/api/component/extract/model?_=getTableColumns',
          requestAdaptor: function (api: any) {
            const data = JSON.parse(JSON.stringify(api.data));
            data.componentId = api.data.componentId;
            data.componentConfigId = api.data.configId;
            data.componentAppId = api.data.componentAppId;
            data.componentActionName = api.data.componentActionName;
            return {...api, data};
          },
          adaptor: function (payload:any, response:any, api:any) {
            let columns = payload.data;
            if (!Array.isArray(columns)) {
              return {
                status: 2,
                msg: '请刷新重试',
              };
            }
            let resultTables = new ResultTables(componentResultTHead);
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
              let typeName = new tdObj();
              typeName.fill({ type: 'static', name: 'columns[' + idx + '].typeName', value: column.typeName });
              let category = new tdObj();
              category.fill({ type: 'static', hidden: true, name: 'columns[' + idx + '].category', value: column.category });
              let defaultValue = new tdObj();
              defaultValue.fill({ type: 'static', hidden: true, name: 'columns[' + idx + '].defaultValue', value: column.defaultValue });
              let state = new tdObj();
              state.fill({
                type: 'switch',
                trueValue: 1,
                falseValue: 0,
                name: 'columns[' + idx + '].state',
                value: 1,
                onText: '开启',
                offText: '关闭',
              });
              td.push(no);
              td.push(displayName);
              td.push(fieldName);
              td.push(typeName);
              td.push(state);
              td.push(category);
              td.push(defaultValue);
              resultTables.push(td);
            });
            let body = [resultTables];
            return {
              ...api.data,
              body: body,
            };
          },
        },
      }
    ],
  }
];

