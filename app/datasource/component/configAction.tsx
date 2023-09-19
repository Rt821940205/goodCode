import {beforeHandle, errorHandle} from "@/services/xuanwu/api";
import {SchemaNode} from "amis/lib/types";

/**
 * 提取实体 选择 组件配置和行为
 */
export const configAction: SchemaNode =
  {
    title: '选择组件配置及行为',
    size: 'lg',
    actions: [
      {
        type: "button",
        actionType: "link",
        label: "提取实体",
        level: 'primary',
        link: '/app/datasource/component/extract?componentId=${id}&configId=${configId}&componentActionName=${actionName}&componentAppId=${appId}&appId=${currentAppId}',
        target: false
      }
    ],
    body: {
      type: "form",
      body: [
        {
          label: '组件配置',
          type: 'select',
          name: 'configId',
          source: {
            method: 'post',
            url: '/api/def/model/list?_=componentConfigs',
            data: {
              componentId: '$id',
              currentAppId: '$currentAppId',
              componentAppId: '$appId',
            },
            requestAdaptor: function (api: any) {
              console.log('====', api.data.parentId);
              debugger
              return {
                ...api,
                data: {
                  appId: api.data.componentAppId,
                  parentId: api.data.componentId,
                  categories: ['101015', '101019'],
                  state: 1,
                },
              };
            },
            adaptor: function (payload: any) {
              if (beforeHandle(payload)) {
                let options = payload.data.map((c) => {
                  return {label: c.displayName, name: c.name, value: c.id};
                });
                return {options: options};
              }
              return errorHandle(payload);
            },
          },
          selectFirst: true,
          searchable: true,
          menuTpl: '<div>${label}、${name}</div>',
        },
        {
          label: '组件行为',
          type: 'select',
          name: 'actionName',
          source: {
            method: 'get',
            url: '/api/def/model/complete/info?modelId=${id}',
            adaptor: function (payload: any, response: any, api: any) {
              if (beforeHandle(payload)) {
                let options = payload.data.actions.map((c) => {
                  return {label: c.displayName, name: c.description, value: c.name};
                });
                return {options: options};
              }
              return errorHandle(payload);
            },
          },
          selectFirst: true,
          searchable: true,
          menuTpl: '<div>${label}、${name}</div>',
        }
      ]
    },
  }
