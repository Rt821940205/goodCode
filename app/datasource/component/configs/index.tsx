import AmisRenderer from '@/components/AmisRenderer';
import {history} from '@@/core/history';
import {SchemaNode} from '@fex/amis/lib/types';
import {beforeHandle, errorHandle} from '@/services/xuanwu/api';
import {ModelField, modelFieldCategory, modelFieldValueType} from "@/pages/app/datasource/util/modelField";
import {MockBizModel} from "@/pages/app/datasource/util/bizModel";


//组件 应用配置管理
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
    body: {
      type: 'crud',
      title: '',
      syncLocation: false,
      filter: filter(),
      api: {
        method: 'post',
        url: '/api/def/model/pages?_=components',
        requestAdaptor: function (api: any) {
          // 数据深拷贝
          const data = JSON.parse(JSON.stringify(api.data));
          data.pageSize = data.perPage;
          data.pageNum = data.page;
          //组件appId
          data.appId = '396320893233737728';
          data.categories = [101016];
          data.state = 1;
          return {...api, data};
        },
        adaptor: function (payload: any, response: any, api: any) {
          if (beforeHandle(payload)) {
            const {data, total} = payload.data
            data.forEach(e => {
              e.currentAppId = appId
            });
            return {items: data, total}
          }
          return errorHandle(payload);
        },
      },
      columns: [
        {
          name: 'id',
          width: 200,
          label: 'ID',
        },
        {
          name: 'displayName',
          label: '组件名',
        },
        {
          name: 'description',
          label: '说明',
        },
        {
          type: "button-group",
          label: "操作",
          buttons: [
            {
              type: "button",
              label: "新增配置",
              level: "link",
              className: "text-danger",
              actionType: 'dialog',
              dialog: {
                title: '新增配置',
                actions: [
                  {
                    label: '测试',
                    actionType: 'confirm',
                    close: false,
                    type: 'button',
                    api: {
                      method: 'post',
                      url: '/api/component/checkComponentConfig?componentId=$id',
                      dataType: 'form',
                      requestAdaptor: function (api: any) {
                        let componentId = api.data.componentId;
                        let config = {}

                        for (let k in api.data) {

                          if (k.indexOf('field__') == 0) {
                            config[k.substring(7)] = api.data[k]
                          }
                        }

                        return {
                          ...api,
                          data: {
                            componentId: componentId,
                            ...config
                          },
                        };
                      },
                      adaptor: function (payload: any) {
                        console.debug(payload);
                        return {
                          ...payload,
                        };
                      },
                    },
                  },
                  {
                    type: 'button',
                    label: '保存',
                    actionType: 'confirm',
                    level: 'primary',
                  },
                ],
                body: [
                  {
                    type: 'service',
                    schemaApi: {
                      method: 'get',
                      url: '/api/def/model/complete/info?modelId=${id}',
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
              },
            },
            {
              type: "button",
              label: "应用配置",
              level: "link",
              actionType: "link",
              link: '/app/datasource/component/configs/app_configs?componentId=${id}&componentAppId=${appId}&appId=${currentAppId}',
            },
            {
              type: "button",
              label: "系统配置",
              level: "link",
              actionType: "link",
              link: '/app/datasource/component/configs/sys_configs?componentId=${id}&componentAppId=${appId}&appId=${currentAppId}',
            }
          ]
        }

      ],
    },
  };
  return <AmisRenderer schema={schema}/>;
}

// 搜索栏
const filter = () => {
  return {
    title: '',
    actions: [],
    className: 'search-row',
    body: [
      {
        type: 'input-text',
        name: 'name',
        label: '组件名称:',
        value: '',
        size: 'sm',
      },
      {
        type: 'reset',
        label: '重 置',
        className: 'btn-common',
        icon: 'fa fa-refresh',
      },
      {
        type: 'submit',
        label: '筛 选 ',
        className: 'btn-common',
        icon: 'fa fa-search',
      },
    ],
  }
}

