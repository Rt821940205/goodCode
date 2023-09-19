import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
import React from 'react';
import { history } from '@@/core/history';
/**
 * 应用测试
 */



export default class ApiTest extends React.Component {


  render(): any {
    const { query = {} } = history.location;
    const { appId, componentId } = query;
    const baseUrl = "/api/component/execute"

    const schema: SchemaNode = [
      {
        type: 'container',
        className: "p-6",
        name: 'apiTestPage',
        id: 'apiTestPage',
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
                "xw-action": "eg_4e59_component_query_detail_action",
                "xw-appId": appId
              },
              "data": {
                "baseUri": baseUrl,
                "componentId": componentId,
                "action": "$action"
              },
              adaptor: function (payload: any, response: any, api: any) {
                console.debug(payload);
                console.debug(response);
                console.debug(api);

                let actionInfo = payload.data.component.actions[0];
                // 如果action !=null。则
                if (api.data.action) {

                  actionInfo = payload.data.component.actions.find((a: any) => a.operationId == api.data.action)

                }
                let operationId = actionInfo.operationId;

                console.debug("actionInfo", actionInfo);


                let value = actionInfo['x-in-sample'];
                // value.appId = appId;
                let schema = actionInfo['in'] || {};
                let properties = schema.properties || {}

                console.debug("schema", schema);


                let upload = properties.file ? true : false;
                let uri = baseUrl;
                let fullUri = `${baseUrl}?xw-component=${componentId}&xw-action=${operationId}&xw-appId=${appId}&xw-flat=1`;

                if (!value) {

                  console.debug('没有输入示例，自动尝试从默认值获得', properties)
                  value = {}

                  if (actionInfo && properties) {

                    for (let key in properties) {
                      let prop = properties[key]
                      if (!prop.readOnly) {

                        if (prop && prop.default) {
                          value[key] = prop.default;
                        }
                      } else {
                        delete properties[key]

                      }
                    }

                  }
                }



                let headers = {
                  "xw-action": operationId,
                  "xw-component": componentId,
                  "xw-appId": appId,
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
                code2.api.data['xw-appId'] = appId;
                code2.api.data['xw-flat'] = 1;
                let code3 = JSON.parse(JSON.stringify(code));
                delete code3.api['headers'];
                code3.api.url = fullUri;


                if (upload) {
                  delete properties.file;
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
                  code2.receiver.data['xw-appId'] = appId;
                  //
                  code3 = JSON.parse(JSON.stringify(code));
                  delete code3.receiver['headers'];
                  code3.receiver.url = fullUri;

                }
                console.debug("schema", schema);
                console.debug("value", value);

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
                    "outSchema": actionInfo['out'] || {},
                    "actions": payload.data.component.actions.map((i: any) => { return { "label": i.summary, "value": i.operationId } })
                  }
                }
              }

            },
            "body": {
              "type": "form",
              "wrapWithPanel": false,
              "actions": [],
              "debug": false,
              "body": [
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
                  "visibleOn": "${actions.length >= 1}",
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


                {
                  "type": "panel",
                  "title": "介绍",
                  "body": [{
                    "type": "tpl",
                    "tpl": "${componentInfo.info.description}"
                  },
                  {
                    "type": "link",
                    "href": "/component/setting2?componentId=${componentInfo.metaId}",
                    "body": " 查看详情>"
                  },

                  ]
                },

                {
                  "type": "panel",
                  "title": "请求代码",
                  "body":

                    [{
                      "type": "tabs",
                      "tabs": [
                        {
                          "title": "输入示例",
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
                          "title": "输入配置",
                          "tab": [
                            {
                              "type": "json-schema",
                              "name": "value",
                              "schema": "${inputSchema}",
                              "value": "${value|toJson}"

                            }
                          ]
                        }, {
                          "title": "输入描述",
                          "tab": [
                            {
                              "name": "inputSchema",
                              "type": "editor",
                              "language": "json",
                              "value": "${schema}"
                            }
                          ]
                        }, {
                          "title": "当前请求数据",
                          "tab": [
                            {
                              "name": "value",
                              "type": "editor",
                              "language": "json"
                            }
                          ]
                        }, {
                          "title": "当前请求头",
                          "tab": [
                            {
                              "type": "json",
                              "name": "headers",
                              "levelExpand": 10,
                              "mutable": true
                            },
                          ]
                        }, {
                          "title": "页面使用示例(1)",
                          "tab": [
                            {
                              "name": "inputCode",
                              "type": "editor",
                              "language": "json",
                              "value": "${code1}"
                            }
                          ]
                        }, {
                          "title": "页面使用示例(2)",
                          "tab": [
                            {
                              "name": "inputCode",
                              "type": "editor",
                              "language": "json",
                              "value": "${code2}"
                            }
                          ]
                        }, {
                          "title": "页面使用示例(3)",
                          "tab": [
                            {
                              "name": "inputCode",
                              "type": "editor",
                              "language": "json",
                              "value": "${code3}"
                            }
                          ]
                        },

                      ]
                    }]
                },

                {
                  "type": "panel",

                  "title": "测试结果",
                  "body":
                    [

                      {
                        "type": "tabs",
                        "tabs": [

                          {
                            "title": "输出结果",
                            "tab": [
                              {
                                "visibleOn": "${result.downloadNotice}",
                                "type": "button",
                                "label": "下载文件",
                                "level": "primary",
                                "className": "mb-3",
                                "onEvent": {
                                  "click": {
                                    "actions": [
                                      {
                                        "actionType": "url",
                                        "args": {
                                          "url": "${fullUri}",
                                          "blank": true,
                                          "params": "${value}",
                                        }
                                      }
                                    ]
                                  }
                                }
                              },
                              {
                                "name": "responseResult",
                                "type": "editor",
                                "language": "json",
                                "allowFullscreen": false,
                                "options": {
                                  "lineNumbers": "off"
                                },
                                "value": "${result}"
                              }],


                          },

                          {
                            "title": "输出描述",
                            "tab": [
                              {
                                "name": "responseSchema",
                                "type": "editor",
                                "language": "json",
                                "allowFullscreen": false,
                                "options": {
                                  "lineNumbers": "off"
                                },
                                "value": "${outSchema}"
                              }
                            ]
                          },
                          {
                            "title": "输出详情",
                            "tab": [

                              {
                                "name": "response",
                                "type": "editor",
                                "language": "json",
                                "allowFullscreen": false,
                                "options": {
                                  "lineNumbers": "off"
                                },
                                "value": "${response}"
                              }, {
                                "type": "json",
                                "name": "response",
                                "levelExpand": 1
                              }
                            ]
                          },
                          {
                            "title": "跟踪日志",
                            "visibleOn": "${response.data.requestId}",
                            "tab": [
                              {
                                "type": "action",
                                "label": "下载",
                                "level": "primary",
                                "actionType": "ajax",
                                "api": {
                                  "method": "GET",
                                  "url": "/api/component/debug?requestId=${response.data.requestId}",
                                  "responseData": {
                                    "debug_result": "$$",
                                  }
                                }
                              },
                              {
                                "visibleOn": "${debug_result}",
                                "name": "debug_result",
                                "type": "editor",
                                "language": "json",
                                "allowFullscreen": false,
                                "options": {
                                  "lineNumbers": "off"
                                },
                                "value": "${debug_result}"
                              },
                              {
                                "type": "json",
                                "visibleOn": "${debug_result}",
                                "name": "debug_result",
                                "levelExpand": 1
                              }
                            ]
                          }

                        ]
                      }]
                },

                {
                  "visibleOn": "${upload}",
                  "type": "input-file",
                  "name": "file",
                  "level": "primary",
                  "accept": "*",
                  "receiver": {
                    "url": "${uri}",
                    "headers": "${headers}",
                    "method": "post",
                    "data": "${value}",
                    adaptor: function (payload: any, response: any) {
                      console.debug(payload);
                      console.debug(response);
                      let data = {
                        ...payload,
                        data: { response: response }
                      };
                      console.debug('data', data);
                      return data;
                    }
                  },
                  "autoFill": {
                    // "&": "$$",
                    "result": "${response.data.data}",
                    "requestId": "${response.data.requestId}",
                    "response": "${response}"

                  },
                  "onEvent": {
                    "fail": {
                      "actions": [
                        {
                          "actionType": "toast",
                          "args": {
                            "msgType": "error",
                            "msg": "上传失败"
                          }
                        }
                      ]
                    }
                  }
                },


                {
                  "visibleOn": "${!upload}",
                  "type": "action",
                  "label": "提交测试数据",
                  "level": "primary",
                  "actionType": "ajax",
                  "api": {
                    "method": "post",
                    "headers": "${headers}",
                    "url": "${uri}",
                    "data": "${value}",

                    adaptor: function (payload: any, response: any, api: any) {
                      if (response.headers['content-disposition']) {
                        let data = { response: response };
                        data['result'] = {
                          downloadNotice: '文件下载暂不支持提交测试数据方式，请使用请点 下载文件',
                          "amis下载示例": {
                            "type": "button",
                            "label": "下载文件",
                            "level": "primary",
                            "onEvent": {
                              "click": {
                                "actions": [
                                  {
                                    "actionType": "url",
                                    "args": {
                                      "url": `${baseUrl}?xw-component=${api.headers['xw-component']}`,
                                      "blank": true,
                                      "params": "${params}",
                                    }
                                  }
                                ]
                              }
                            }
                          }
                        }
                        data.response.data = data['result']

                        return data

                      } else {

                        let data =
                        {
                          result: payload.data,
                          response: response,
                        }
                        if (payload.status) {
                          data['result'] = payload.msg;
                        }

                        return data;

                      }
                    }
                  }
                },



              ]
            }
          }

        ]
      }
    ];
    return <AmisRenderer schema={schema} />;
  }
}
