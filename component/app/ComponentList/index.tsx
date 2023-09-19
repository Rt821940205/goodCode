import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
import React from 'react';
import { history } from '@@/core/history';
import '@/pages/component/app/ComponentList/ComponentPagedList'
/**
 * 应用组件清单
 */



export default class AppList extends React.Component {
  render(): any {
    const metaName = "sys_component_registered"
    const { query = {} } = history.location;
    const { appId, status } = query;
    let fields = '';



    let componentStatus = status == undefined ? 1 : status;


    const schema: SchemaNode = [
      {
        type: 'page',
        className: "p-6",
        name: 'componentListPage',
        id: 'componentListPage',

        toolbar: [
          {
            level: 'primary',
            label: '新增编排组件',
            "type": "button",
            "icon": "fa fa-plus pull-left",

            "align": "right",
            actionType: 'url',
            url: '/component/compose?appId=' + appId + '&dataId=0&componentId=&applicationName=',
          },
          // {
          //   level: 'primary',
          //   label: '新增API组件',
          //   "type": "button",
          //   "icon": "fa fa-plus pull-left",
          //   disabled:true,
          // },

          {
            "type": "button",
            "label": "新增API组件",
            level: 'primary',
            "icon": "fa fa-plus pull-left",
            disabled:true,
            "actionType": "dialog",
            "dialog": {
              "title": "新建API组件",
              "size": "md",
              // "actions": [
                // {
                //   "type": "action",
                //   "label": "确定创建此API组件",
                //   "close": true,
                //   "level": "primary",
                //   "actionType": "ajax",
                //   "api": {
                //     "method": "post",
                //     "headers": {
                //       "xw-action": "eg_550e_api_build_action",
                //       "xw-component": "eg_550e_component_api_plugin",
                //       "xw-flat": 1,
                //       "xw-debug": 1,
                //     },
                //     "url": "/api/component/execute",
                //     "data": "$$",
                //     "responseData": {
                //       "&": "$$"
                //     }
                //   },

                //   "reload": "appComponentPagedList"

                // }
              // ],
              "body": {
                "type": "form",
                "api": {
                  "method": "post",
                  "headers": {
                    "xw-action": "eg_550e_api_build_action",
                    "xw-component": "eg_550e_component_api_plugin",
                    "xw-flat": 1,
                    "xw-debug": 1,
                  },
                  "url": "/api/component/execute",
                  "data": "$$",
                  "responseData": {
                    "&": "$$"
                  }
                },
                "redirect": "/component/app/ComponentList/apiEditor?appId=${appId}&componentId=${componentId}",
                "mode": "normal",
                // "debug": true,
                "body": [
                  {
                    "type": "hidden",
                    "name": "appId",
                    "value": "${appId}"
                  },
                  {
                    "type": "input-text",
                    "name": "title",
                    "required": true,
                    "label": "API资源系统名称",
                    "placeholder": "将做为组件名称保存"
                  },

                  {
                    "type": "input-text",
                    "required": true,
                    "name": "serverUri",
                    "label": "API服务器根URI",
                    "placeholder": "填写API服务访问域名或IP，要带http，如：http://127.0.0.1/",
                  },


                  {
                    "type": "tabs",
                    "tabs": [
                      {
                        "title": "接口1信息",
                        "tab": [{
                          "type": "input-text",
                          "name": "resourceTitle",
                          "label": "接口名称",
                          "placeholder": "API接口名称",
                          "required": true
                        }, {
                          "type": "input-text",
                          "name": "resourceUri",
                          "label": "接口URI地址",
                          "placeholder": "填写API相对URI，无须填写域名部分，如：/api/hello",
                          "required": true
                        },
                        {
                          "type": "tpl",
                          "tpl": "创建后，可以修改其它接口信息"
                        }],
                      },
                      {
                        "title": "添加更多接口",
                        "tab": [{
                          "type": "tpl",
                          "tpl": "创建后，可以添加更多接口信息"
                        }]
                      }
                    ]
                  }
                ]
              }
            }
          },

          {
            level: 'primary',
            label: '导入元数据',
            "type": "button",
            "icon": "fa fa-plus pull-left",
            "actionType": "dialog",
            "dialog": {
              "title": "上传元数据文件",
              "name": "uploadSchemaJson",
              "id": "uploadSchemaJson",

              "actions": [
                {
                  "type": "button",
                  "actionType": "cancel",
                  "label": "关闭",
                  "primary": true
                }
              ],

              // "debug": true,
              "body": [
                // {
                //   "type": "input-file",
                //   "btnLabel": "点击选择API组件简易元数据Json文件",
                //   "hideUploadButton": false,
                //   // className: "mt-0.5 mb-0 mr-0",
                //   "accept": ".json",
                //   // level: 'primary',
                //   // "downloadUrl": false,
                //   "receiver": {
                //     "url": "/api/component/execute",
                //     "method": "post",
                //     "data": {
                //       "component": "eg_550e_component_api_plugin",
                //       "actionName": "eg_550e_api_import_action",
                //       "app_id": "${appId}"
                //     }
                //   },

                //   "onEvent": {
                //     "success": {
                //       "actions": [
                //         {
                //           "actionType": "toast",
                //           "args": {
                //             "msgType": "success",
                //             "msg": "上传成功",
                //             "position": "top-right"
                //           }
                //         },
                //         {
                //           "actionType": "closeDialog",
                //           "componentId": "uploadSchemaJson"
                //         },
                //         {
                //           "actionType": "reload",
                //           "componentId": "appComponentPagedList"
                //         }
                //       ]
                //     },
                //     "fail": {
                //       "actions": [
                //         {
                //           "actionType": "toast",
                //           "args": {
                //             "msgType": "error",
                //             "msg": "${error}",
                //             "position": "top-right"
                //           }
                //         },
                //         {
                //           "actionType": "closeDialog",
                //           "componentId": "uploadSchemaJson"
                //         },

                //       ]
                //     },
                //   },
                // },

                {
                  "type": "input-file",
                  "btnLabel": "点击选择Schema文件",
                  "hideUploadButton": false,
                  // className: "mt-0.5 mb-0 mr-0",
                  "accept": ".json",
                  // level: 'primary',
                  // "downloadUrl": false,
                  "receiver": {
                    "url": "/api/component/execute",
                    "method": "post",
                    "data": {
                      "component": "eg_5531_component_manage_plugin",
                      "actionName": "eg_5531_schema_import_action",
                      "app_id": "${appId}",
                      "autImport":false
                    }
                  },

                  "onEvent": {
                    "success": {
                      "actions": [
                        {
                          "actionType": "toast",
                          "args": {
                            "msgType": "success",
                            "msg": "导入成功",
                            "position": "top-right"
                          }
                        },
                        {
                          "actionType": "closeDialog",
                          "componentId": "uploadSchemaJson"
                        },
                        {
                          "actionType": "reload",
                          "componentId": "appComponentPagedList"
                        }
                      ]
                    },
                    "fail": {
                      "actions": [
                        {
                          "actionType": "toast",
                          "args": {
                            "msgType": "error",
                            "msg": "${error}",
                            "position": "top-right"
                          }
                        },
                        {
                          "actionType": "closeDialog",
                          "componentId": "uploadSchemaJson"
                        },

                      ]
                    },
                  },
                },
                 {
                  "type": "tpl",
                  "tpl": "目前支持API组件简易Schema、OpenApi标准Schema、服务组件标准Schema的Json文件导入。如果Json文件比较大，载入需要一定时间，请耐心等待，如果是OpenApi批量导入，建议先裁剪schema，只保留需要导入的接口描述。",
                  "className": "mb-1"
                },
              ]
            }
          },
          {
            level: 'primary',
            label: '上传JAR组件',
            disabled: true,
            "type": "button",
            "icon": "fa fa-plus pull-left",
          }
        ],

        "title": "${applicationName} 服务组件管理",
        "remark": "",
        body: {
          type: 'page',
          body: [



            {
              id: "appComponentPagedList",
              name: "appComponentPagedList",
              visibleOn: 'status == 0',
              type: 'component-paged-list',
              appId: appId,
              status: "${componentStatus}"
            },

          ],
        }
      }
    ];
    return <AmisRenderer schema={schema} />;
  }
}
