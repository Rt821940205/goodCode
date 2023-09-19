import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
import React from 'react';
import { history } from '@@/core/history';
/**
 * 应用测试
 */



export default class apiEditorPage extends React.Component {


  render(): any {
    const { query = {} } = history.location;
    const { appId, componentId } = query;
    const baseUrl = "/api/component/execute"
    const schema: SchemaNode = [
      {
        type: 'container',
        className: "p-6",
        name: 'apiEditorPage',
        id: 'apiEditorPage',

        body: [
          {
            "type": "service",
            "debug": true,
            "onEvent": {
              "broadcast_action": {
                "actions": [
                  {
                    "actionType": "reload",
                    "data": {
                      "action": "${action}"
                    }
                  },
                  {
                    "actionType": "toast",
                    "args": {
                      "msgType": "success",
                      "msg": "切换到${action}"
                    }
                  }
                ]
              }
            },
            "api": {
              "method": "post",
              "url": baseUrl,
              "headers": {
                "xw-component": "eg_4e59_component_query_plugin",
                "xw-action": "eg_4e59_component_query_detail_action"
              },
              "data": {
                "baseUri": baseUrl,
                "componentId": componentId,
                "action": "$action"
              },
              adaptor: function (payload: any, response: any, api: any) {
                console.log(payload);
                console.log(response);
                console.log(api);

                let actionInfo = payload.data.component.actions[0];
                // 如果action !=null。则
                if (api.data.action) {

                  actionInfo = payload.data.component.actions.find((a: any) => a.operationId == api.data.action)

                }
                let operationId = actionInfo.operationId;

                let value = payload.data.component.actions[0]['x-in-sample'] || {};
                // value.appId = appId;
                let schema = actionInfo['in'] || {};
                let upload = schema.properties.file ? true : false;
                let uri = baseUrl;
                let fullUri = `${baseUrl}?xw-component=${componentId}&xw-action=${operationId}&xw-flat=1`;

                let headers = {
                  "xw-action": operationId,
                  "xw-component": componentId,
                  "xw-flat": 1,
                  "xw-debug": 1,
                  "xw-file-debug": 1
                }

                let code: any = {
                  "type": "action",
                  "label": "发出一个请求",
                  "level": "primary",
                  "actionType": "ajax",
                  "api": {
                    "method": "post",
                    "headers": headers,
                    "url": uri,
                    "data": value,
                    "responseData": {
                      "&": "$$",
                    }
                  }
                }

                // HEADERS
                let code1 = JSON.parse(JSON.stringify(code));
                // POST
                let code2 = JSON.parse(JSON.stringify(code));
                delete code2.api['headers'];
                code2.api.url = uri;
                code2.api.data['xw-component'] = componentId;
                code2.api.data['xw-action'] = operationId;
                code2.api.data['xw-flat'] = 1;
                let code3 = JSON.parse(JSON.stringify(code));
                delete code3.api['headers'];
                code3.api.url = fullUri;


                if (upload) {
                  delete schema.properties.file;
                  code = {
                    "type": "input-file",
                    "name": "file",
                    "level": "primary",
                    "accept": "*",
                    "receiver": {
                      "url": uri,
                      "method": "post",
                      "headers": headers,
                      "data": value,
                    },
                    "autoFill": {
                      "&": "$$",
                    }
                  }

                  // HEADERS
                  code1 = JSON.parse(JSON.stringify(code));
                  // POST
                  code2 = JSON.parse(JSON.stringify(code));
                  delete code2.receiver['headers'];
                  code2.receiver.url = uri;
                  code2.receiver.data['xw-component'] = componentId;
                  code2.receiver.data['xw-action'] = operationId;
                  code2.receiver.data['xw-flat'] = 1;
                  //
                  code3 = JSON.parse(JSON.stringify(code));
                  delete code3.receiver['headers'];
                  code3.receiver.url = fullUri;



                }

                return {
                  ...payload,
                  data: {
                    "upload": upload,
                    "code": code,
                    "code1": code1,
                    "code2": code2,
                    "code3": code3,
                    "uri": uri,
                    "fullUri": fullUri,
                    "headers": headers,
                    "component": componentId,
                    "componentInfo": payload.data.component,
                    "componentData": payload.data,
                    "action": operationId,
                    "value": value,
                    "schema": schema,
                    "actionInfo":actionInfo,
                    "outSchema": actionInfo['out'] || {},
                    "actions": payload.data.component.actions.map((i: any) => { return { "label": i.summary, "value": i.operationId } })
                  }
                }
              }

            },
            body: [

              {
                "type": "service",
                "debug": true,
                "onEvent": {
                  "broadcast_action": {
                    "actions": [
                      {
                        "actionType": "reload",
                        "data": {
                          "action": "${action}"
                        }
                      },
                      {
                        "actionType": "toast",
                        "args": {
                          "msgType": "success",
                          "msg": "切换到${action}"
                        }
                      }
                    ]
                  }
                },
                "api": {
                  "method": "post",
                  "url": baseUrl,
                  "headers": {
                    "xw-component": "eg_4e59_component_query_plugin",
                    "xw-action": "eg_4e59_component_query_detail_action"
                  },
                  "data": {
                    "baseUri": baseUrl,
                    "componentId": componentId,
                    "action": "$action"
                  },
                  adaptor: function (payload: any, response: any, api: any) {
                    console.log(payload);
                    console.log(response);
                    console.log(api);


                    return {
                      ...payload,
                      data: {
                      }
                    }
                  }

                },
                body: []
              },




              {
                "type": "property",
                "column": 2,
                "items": [
                  {
                    "label": "组件名",
                    "content": "${componentInfo.info.title}"
                  },
                  {
                    "label": "组件标识",
                    "content": "${componentInfo.info.x-component-id}"
                  },
                  {
                    "label": "行为标识",
                    "content": "${action}"
                  },
                  {
                    "label": "版本",
                    "content": "${componentInfo.info.x-component-ver}"
                  },
                  {
                    "label": "所属应用id",
                    "content": "${componentInfo.authorAppId}"
                  }, {
                    "label": "metaId",
                    "content": "${componentInfo.metaId}"
                  }
                ]
              },
              {
                "type": "page",
                "className": "pt-5"
              },
              {
                "type": "panel",
                "title": "资源清单",
                "body": [{
                  "type": "list-select",
                  "name": "action",
                  "source": "${actions}",
                  "onEvent": {
                    "change": { // 监听点击事件
                      "actions": [ // 执行的动作列表
                        {
                          "actionType": "broadcast",
                          "args": {
                            "eventName": "broadcast_action"
                          },
                          "data": {
                            "action": "${action}",
                            "label": "${label}",
                          }
                        }
                      ]
                    }
                  }
                }]
              },


              // {
              //   "type": "button",
              //   "label": "弹个表单",
              //   "actionType": "dialog",
              //   "dialog": {
              //     "title": "新建API组件",
              //     "size":"md",
              //     "actions": [
              //       {
              //         "type": "action",
              //         "label": "确定创建此API组件",
              //         "close": true,
              //         "level": "primary",
              //         "actionType": "ajax",
              //         "api": {
              //           "method": "post",
              //           "headers": {
              //             "xw-action": "eg_550e_api_build_action",
              //             "xw-component": "eg_550e_component_api_plugin",
              //             "xw-flat": 1,
              //             "xw-debug": 1,
              //           },
              //           "url": "/api/component/execute",
              //           "data": "$$",
              //           "responseData": {
              //             "&": "$$"
              //           }
              //         }
              //       }
              //     ],
              //     "body": {
              //       "type": "form",
              //       "mode": "normal",
              //       "debug":true,
              //       "body": [
              //         {
              //           "type": "hidden",
              //           "name": "appId",
              //           "value": "${appId}"
              //         },
              //         {
              //           "type": "input-text",
              //           "name": "title",
              //           "required": true,
              //           "label": "API资源系统名称",
              //           "placeholder": "将做为组件名称保存"
              //         },

              //         {
              //           "type": "input-text",
              //           "required": true,
              //           "name": "serverUri",
              //           "label": "API服务器根URI",
              //           "placeholder": "填写API服务访问域名或IP，要带http，如：http://127.0.0.1/",
              //         },


              //         {
              //           "type": "tabs",
              //           "tabs": [
              //             {
              //               "title": "接口1信息",
              //               "tab": [  {
              //                 "type": "input-text",
              //                 "name": "resourceName",
              //                 "label": "接口名称",
              //                 "placeholder": "API接口名称",
              //                 "required": true
              //               },  {
              //                 "type": "input-text",
              //                 "name": "resourceUri",
              //                 "label": "接口URI地址",
              //                 "placeholder": "填写API相对URI，无须填写域名部分，如：/api/hello",
              //                 "required": true
              //               },
              //              {
              //                 "type": "tpl",
              //                 "tpl": "创建后，可以修改其它接口信息"
              //               }],
              //             },
              //             {
              //               "title": "添加更多接口",
              //               "tab": [{
              //                 "type": "tpl",
              //                 "tpl": "创建后，可以添加更多接口信息"
              //               }]
              //             }
              //           ]
              //         }
              //       ]
              //     }
              //   }
              // },


              {
                "type": "panel",
                "title": "${actionInfo.summary}  配置",
                "body":

                  [{
                    "type": "tabs",
                    "tabs": [

                      {
                        "title": "Query",
                        "tab": [
                          {
                            "type": "tpl",
                            "tpl":"Query参数通过URL传递"
                          },
                          {
                            "type": "json-schema-editor",
                            "name": "schema",
                            "label": "字段类型"
                          },

                          {
                            "type": "json",
                            "name": "value",
                            "levelExpand": 10,
                            "mutable": true
                          },
                        ]
                      },
                      {
                        "title": "Path",
                        "tab": [
                          {
                            "type": "json",
                            "name": "value",
                            "levelExpand": 10,
                            "mutable": true
                          },
                        ]
                      },
                      {
                        "title": "Body",
                        "tab": [
                          {
                            "type": "json",
                            "name": "value",
                            "levelExpand": 10,
                            "mutable": true
                          },
                        ]
                      },
                      {
                        "title": "Header",
                        "tab": [
                          {
                            "type": "json",
                            "name": "value",
                            "levelExpand": 10,
                            "mutable": true
                          },
                        ]
                      },
                      {
                        "title": "Auth",
                        "tab": [
                          {
                            "type": "json",
                            "name": "value",
                            "levelExpand": 10,
                            "mutable": true
                          },
                        ]
                      },
                      {
                        "title": "设置",
                        "tab": [
                          {
                            "type": "json",
                            "name": "actionInfo",
                            "levelExpand": 10,
                            "mutable": true,
                          },
                        ]
                      },
                    ]
                  }]
              },

              {
                "type": "form",
                "api": "/amis/api/mock2/form/saveForm",
                "debug": true,
                "title": "基本配置",
                data: {


                },
                "body": [


                  {
                    "type": "collapse-group",
                    "activeKey": [
                      "1"
                    ],
                    "body": [
                      {
                        "type": "collapse",
                        "key": "1",
                        "header": "基本配置",
                        "body": {
                          "type": "json-schema",
                          "name": "baseConfig",
                          "schema": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": [
                              "title",
                              "serverUri",
                              "description"
                            ],
                            "properties": {

                              "title": {
                                "type": "string",
                                "title": "组件名"
                              },

                              "description": {
                                "type": "string",
                                "format": "textarea",
                                "title": "组件介绍"
                              },

                              "serverUri": {
                                "type": "string",
                                "format": "url",
                                "title": "API服务器根URI"
                              }
                            }
                          }
                        }
                      },
                      {
                        "type": "collapse",
                        "key": "2",
                        "header": "更多配置",
                        "body": {
                          "type": "json-schema",
                          "name": "advConfig",
                          "schema": {
                            "type": "object",
                            "additionalProperties": false,
                            "properties": {


                              "allowServerUriIn": {
                                "type": "boolean",
                                "title": "允许参数传递API服务器根URI",
                                "description": "选中时，IN参数可以传递API服务器根URI覆盖配置",
                              },
                              "responseHeader": {
                                "type": "boolean",
                                "title": "是否输出消息头",
                                "description": "选中时，将在结果中显示消息头",
                              },
                              "auth": {
                                "type": "object",
                                "title": "前置身份验证",
                                "additionalProperties": false,
                                "required": [
                                  "authComponent",
                                  "authAction",
                                  "authConfig"
                                ],
                                "properties": {
                                  "authComponent": {
                                    "type": "string",
                                    "title": "组件名称标识"
                                  },
                                  "authAction": {
                                    "type": "string",
                                    "title": "组件行为标识"
                                  },
                                  "authConfig": {
                                    "type": "string",
                                    "title": "组件配置ID"
                                  }
                                }
                              },

                            }
                          }
                        }
                      },
                      {
                        "type": "collapse",
                        "key": "3",
                        "header": "请求默认配置，可以被资源中的参数覆盖",
                        "body": {
                          "type": "json-schema",
                          "name": "advConfig",
                          "schema": {
                            "type": "object",
                            "additionalProperties": false,
                            "properties": {
                              "method": {
                                "type": "string",
                                "title": "默认请求方法",
                                "description": "默认方法，可被服务资源覆盖",
                                "enum": ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"]
                              },
                              "contentType": {
                                "type": "string",
                                "title": "默认请求格式",
                                "description": "默认方法，可被服务资源覆盖"
                              },
                              "jsonPath": {
                                "type": "string",
                                "title": "内容JSON PATH",
                                "description": "如果指定了JSON PATH，输出结果将是JSON PATH读取的结果"
                              },
                              "headersConfig": {
                                "title": "headers配置",
                                "type": "object"
                              },
                              "queryConfig": {
                                "title": "query参数配置",
                                "type": "object"
                              },
                              "parametersConfig": {
                                "title": "parameter配置",
                                "type": "object"
                              },
                              "pathConfig": {
                                "title": "path默认",
                                "type": "object"
                              }
                            }
                          }
                        }
                      }
                    ]
                  }



                ]
              },
              {
                "type": "json",
                "source": "${componentInfo}"
              },
              {

                "type": "json-schema-editor",
                "name": "configSchema",
                "schema": "${componentInfo.config}",
                "enableAdvancedSetting": true,
                "placeholder": {
                  "key": "请输入字段名称",
                  "title": "请输入名称",
                  "description": "请输入描述信息",
                  "default": "",
                  "empty": "暂无字段"
                }
              }

            ]
          }]
      }
    ];
    return <AmisRenderer schema={schema} />;
  }
}
