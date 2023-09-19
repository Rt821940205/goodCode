import AmisRenderer from '@/components/AmisRenderer';
import {history} from '@@/core/history';
import {SchemaNode} from '@fex/amis/lib/types';
import {ModelField, modelFieldCategory, modelFieldValueType} from "@/pages/app/datasource/util/modelField";
import {MockBizModel} from "@/pages/app/datasource/util/bizModel";

//组件应用配置
export default function () {
  const fieldPrefix = 'field__';
  const fieldDisplayNamePrefix = '__displayField__';
  const fieldDescPrefix = '__descField__';
  const fieldTypePrefix = '__typeField__';
  const {query = {}} = history.location;
  const {appId} = query;
  const schema: SchemaNode = {
    type: 'page',
    title: '',
    "body": {
      "type": "crud",
      api: {
        method: 'post',
        url: '/api/def/model/pages?_=componentConfig&componentId=${componentId}',
        requestAdaptor: function (api: any) {
          let componentId = api.data.componentId
          let currentAppId = api.data.appId
          debugger
          return {
            ...api,
            data: {
              pageNum: 1,
              //组件本身的应用id
              appId: currentAppId,
              parentId: componentId,
              pageSize: 100,
              categories: [101019],
              state: 1,
            },
          };
        },
        adaptor: function (payload: any) {
          let list: Array<any> = payload.data.data;
          const result: Array<any> = list.map((item: any) => {
            return {
              id: item.id,
              displayName: item.displayName,
              description: item.description
            }
          });
          return {
            data: {
              options: result
            }
          };
        },
      },
      "headerToolbar": [
        {
          "type": "search-box",
          "align": "left",
          "name": "keywords",
          "placeholder": "请输入关键字",
        }
      ],
      "itemActions": [
        {
          "type": "button",
          "label": "查看",
          "actionType": "dialog",
          "dialog": {
            "title": "查看",
            body: [
              {
                type: 'service',
                schemaApi: {
                  method: 'get',
                  url: '/api/def/model/complete/info?modelId=${componentId}',
                  adaptor: function (payload: any) {
                    let fields = payload.data.fields;
                    let bodyItems: Array<any> = [];
                    bodyItems.push({
                      type: 'input-text',
                      name: 'configName',
                      required: true,
                      mode: 'horizontal',
                      showCounter: true,
                      maxLength: 20,
                      validations: {
                        maxLength: 20,
                      },
                      validationErrors: {
                        maxLength: '长度超出限制，请输入小于20字的名称',
                      },
                      placeholder: '请输入一个长度小于20的名称',
                      label: '配置名',
                    });
                    fields
                      .filter((item: any) => {
                        return item.category == 2 || item.category == 4;
                      })
                      .forEach((item: any) => {
                        let required = false;
                        if (item.notNull == 1) {
                          required = true;
                        }
                        bodyItems.push({
                          type: 'input-text',
                          name: fieldPrefix + item.name,
                          mode: 'horizontal',
                          placeholder: item.description,
                          required: required,
                          label: item.displayName,
                        });
                        // 字段显示名称
                        bodyItems.push({
                          type: 'hidden',
                          name: fieldDisplayNamePrefix + item.name,
                          value: item.displayName,
                        });
                        // 字段注释
                        bodyItems.push({
                          type: 'hidden',
                          name: fieldDescPrefix + item.name,
                          value: item.description,
                        });
                        // 字段类型
                        bodyItems.push({
                          type: 'hidden',
                          name: fieldTypePrefix + item.name,
                          value: item.typeName,
                        });
                      });
                    bodyItems.push({
                      type: 'textarea',
                      name: 'configDescription',
                      label: '配置描述',
                      mode: 'horizontal',
                      showCounter: true,
                      maxLength: 500,
                      validations: {
                        maxLength: 500,
                      },
                      validationErrors: {
                        maxLength: '长度应该小于500',
                      },
                    });
                    return {
                      type: 'form',
                      actions: [],
                      api: {
                        data: {
                          '&': '$$',
                          currentAppId: '$currentAppId',
                          componentId: '$id',
                          componentActionName: '$actionName',

                        },
                        method: 'post',
                        url: '/api/def/model/complete/save?_=componentCreate',
                        requestAdaptor: function (api: any) {
                          let component = api.data;
                          let displayName = '';
                          let description = '';
                          const fields: Array<any> = [];
                          for (let key in component) {
                            console.log(key);
                            if (key === 'configName') {
                              displayName = component[key];
                            }
                            if (key === 'configDescription') {
                              description = component[key];
                            }
                            if (key?.substring(0, fieldPrefix.length) === fieldPrefix) {
                              const name = key.substring(fieldPrefix.length);
                              const field = new ModelField(
                                modelFieldCategory.INPUT_RESULT,
                                component[fieldDisplayNamePrefix + name],
                              );
                              field.setName(name);
                              field.setDescription(component[fieldDescPrefix + name]);
                              field.setValue(component[fieldTypePrefix + name], component[key]);
                              fields.push(field);
                            }
                          }

                          const model: any = new MockBizModel();
                          model.displayName = displayName;
                          model.description = description;
                          model.display = true;
                          // 配置
                          model.category = 101019;

                          model.appId = api.data.currentAppId
                          model.parentId = api.data.componentId
                          const componentIdField = new ModelField(
                            modelFieldCategory.CONFIG,
                            "组件id",
                            model.id,
                            '',
                            api.data.componentId
                          );
                          componentIdField.name = "componentId"
                          componentIdField.typeName = modelFieldValueType.Long
                          const componentActionNameField = new ModelField(
                            modelFieldCategory.CONFIG,
                            "组件行为",
                            model.id,
                            '',
                            api.data.componentActionName
                          );
                          componentActionNameField.name = "componentActionName"
                          componentIdField.typeName = modelFieldValueType.String
                          fields.push(componentActionNameField);

                          model.setFields(fields);
                          return {
                            ...api,
                            data: {
                              ...model,
                            },
                          };
                        },
                        adaptor: function (payload: any) {
                          return {
                            ...payload,
                          };
                        },
                      },
                      title: '',
                      body: bodyItems,
                    };
                  },
                },
              },
            ],
          }
        },
        {
          "type": "button",
          "label": "编辑",
          "actionType": "drawer",
          "drawer": {
            "position": "left",
            "size": "lg",
            "title": "编辑",
            "body": {
              "type": "form",
              "name": "sample-edit-form",
              "api": "/api/sample/$id",
              "body": [
                {
                  "type": "input-text",
                  "name": "engine",
                  "label": "Engine",
                  "required": true
                },
                {
                  "type": "divider"
                },
                {
                  "type": "input-text",
                  "name": "browser",
                  "label": "Browser",
                  "required": true
                },
                {
                  "type": "divider"
                },
                {
                  "type": "input-text",
                  "name": "platform",
                  "label": "Platform(s)",
                  "required": true
                },
                {
                  "type": "divider"
                },
                {
                  "type": "input-text",
                  "name": "version",
                  "label": "Engine version"
                },
                {
                  "type": "divider"
                },
                {
                  "type": "select",
                  "name": "grade",
                  "label": "CSS grade",
                  "options": [
                    "A",
                    "B",
                    "C",
                    "D",
                    "X"
                  ]
                }
              ]
            }
          }
        },
        {
          "type": "button",
          "label": "删除",
          "actionType": "ajax",
          "confirmText": "您确认要删除?",
          "api": "delete:/api/sample/$id"
        }
      ],
      "columns": [
        {
          "name": "id",
          "label": "配置ID",
          "type": "text",
        },
        {
          "name": "displayName",
          "label": "配置名称",
          "type": "text",
        },
        {
          "name": "description",
          "label": "配置描述",
          "type": "text",
        }
      ]
    }
  };
  return <AmisRenderer schema={schema}/>;
}
