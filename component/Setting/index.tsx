import '@/components/amis/components/EngineComponent/EngineUiRenderer';
import '@/components/amis/components/EngineComponent/EngineUiTestRenderer';
import AmisRenderer, { setBreadcrumb } from '@/components/AmisRenderer';
import { MockBizModel } from '@/pages/app/datasource/util/bizModel';
import { ModelField, modelFieldCategory } from '@/pages/app/datasource/util/modelField';
import { ComponentConfigDialog } from '@/pages/component/Setting/component/ComponentConfigDialogSimple';
import { ComponentConfigCheckAction } from '@/pages/component/Setting/component/ComponentConfigCheckActionOld';
import { ComponentHelperContent } from '@/pages/component/Setting/component/ComponentHelperContent';

import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';
import React from 'react';
/**
 * 应用中心 应用列表
 */
export default class ComponentSetting extends React.Component {
  render(): any {
    const { query = {} } = history.location;
    const { componentId } = query;
    const breadcrumb = setBreadcrumb(); // 面包屑组件
    const fieldPrefix = 'field__';
    const fieldDisplayNamePrefix = '__displayField__';
    const fieldDescPrefix = '__descField__';
    const fieldTypePrefix = '__typeField__';

    const schema: SchemaNode = {
      type: 'page',
      bodyClassName:'mx-64 mt-6 h-screen card-container',
      initApi: {
        method: 'get',
        url: '/api/def/model/complete/info?modelId=' + componentId,
        adaptor: function (payload: any) {
          console.log(payload);

          return {
            ...payload,
            data: {
              id: payload.data.id,
              componentModel: payload.data,
              name: payload.data.displayName,
              description: payload.data.description,
              icon: '/images/component/' + payload.data.name + '.png',
              actions: payload.data.actions,
            },
          };
        },
      },
      body: [
        {
          type: "container",
          bodyClassName: "flex h-51 mb-6",
          body: [
            {
              type: 'avatar',
              src: '${icon}',
              shape: "square",
              icon:'',
              className:"bg-transparent h-20 w-20 mr-6",
            },
            {
              type: "container",
              style: {
                width:'45.5rem'
              },
              body: [
                {
                  type: "tpl",
                  tpl: '${name}',
                  className: "block text-black text-lg",
                },
                {
                  type: "tooltip-wrapper",
                  content: "${description}",
                  body: [
                    {
                      type: "tpl",
                      className:"my-6 block overflow-line-2 text-gray",
                      tpl: '${description}'
                    },
                  ]
                },
                {
                  type: 'button',
                  level: 'primary',
                  size:'md',
                  label: '＋ 新增配置',
                  actionType: 'dialog',
                  dialog: {
                    title: '新增配置',
                    actions: [
                      ComponentConfigCheckAction(componentId),
                      {
                        type: 'button',
                        label: '取消',
                        level:"light",
                        actionType: 'cancel',
                      },
                      {
                        type: 'button',
                        label: '确认',
                        actionType: 'confirm',
                        level: 'primary',
                      },
                    ],
                    body: [
                      {
                        type: 'service',
                        schemaApi: {
                          method: 'get',
                          url: '/api/def/model/complete/info?modelId=' + componentId,
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
                              wrapWithPanel: false,
                              actions: [],
                              api: {
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
                                  model.category = 101015;
                                  model.parentId = componentId;
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
              ]
            }
          ]
        },
        {
          type: 'tpl',
          tpl: '配置信息',

        },
        {
          type: 'crud',
          className:"my-6",
          data: {
            pageSize: '${perPage}',
          },
          api: {
            method: 'post',
            url: '/api/def/model/pages?_=componentConfig',
            requestAdaptor: function (api: any) {
              return {
                ...api,
                data: {
                  appId: "396320893233737728",
                  pageNum: 1,
                  parentId: componentId,
                  pageSize: 100,
                  categories: [101015],
                  state: 1,
                },
              };
            },
            adaptor: function (payload: any) {
              let result = payload?.data?.data;
              result.forEach((item: any) => {
                item.component_name = item.displayName;
              });
              let pageNum = payload?.data?.pageNum;
              let pageSize = payload?.data?.pageSize;
              let total = payload?.data?.total;
              return {
                ...payload,
                data: {
                  pageNum: pageNum,
                  pageSize: pageSize,
                  total: total,
                  items: result,
                },
              };
            },
          },
          affixHeader: false,
          pageField: 'pageNum',
          perPageField: 'pageSize',
          defaultParams: {
            pageNum: 1,
          },
          footerToolbar: ['pagination'],
          mode: 'cards',
          placeholder: '暂无组件配置',
          columnsCount: 4,
          card: {
            useCardLabel: false,
            className:"border-none",
            bodyClassName:"text-center bg-gray-50 h-31",
            body: [
              {
                type: 'tpl',
                tpl: '${component_name}',
                className:"text-black mb-2"
              },
              {
                type: 'tpl',
                tpl: ' V ${version}',
              },
              {
                type: "container",
                bodyClassName:"text-center flex justify-center mt-6",
                body: [
                  {
                    label: '移除',
                    type: 'button',
                    level: 'enhance',
                    className:"text-danger  border-danger mr-6",
                    actionType: 'dialog',
                    dialog: {
                      title: '系统消息',
                      body: [
                        '确认要移除?',
                        {
                          type: 'form',
                          title: '',
                          api: {
                            method: 'get',
                            url: '/api/def/model/update/${id}/0',
                            dataType: 'form',
                            data: {
                            },
                            adaptor: function (payload: any) {
                              console.debug(payload);
                              return {
                                ...payload,
                              };
                            },
                          },
                          body: [
                            {type: 'hidden', name: 'id'},
                          ]
                        }
                      ]
                    }
                  },
                  {
                    label: '详情',
                    type: 'button',
                    level: 'enhance',
                    actionType: 'dialog',
                    dialog: ComponentConfigDialog,
                  },
                ]
              },
              {
                type: 'hidden',
                name: 'id',
              }
            ],
            actionsCount: 10,
            itemAction: {
              type: 'button',
              level:"light",
              actionType: 'dialog',
              dialog: ComponentConfigDialog,
              // actionType: 'link',
              // link: '/component/detail?componentId=' + componentId,
            }
          },
        },
        {
          type: 'tpl',
          tpl: '帮助文档',
        },
        {
          type: 'button',
          label: '${name}说明',
          level: 'link',
          actionType: 'link',
          link: '/component/setting2?componentId=${componentId}&pageNum=1',
          // link: '/system/helpCenter',
        },
        ComponentHelperContent(),

      ],
    };
    return <AmisRenderer schema={schema} />;
  }
}
