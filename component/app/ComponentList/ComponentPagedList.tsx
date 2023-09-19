import { Renderer } from '@fex/amis';
import * as React from 'react';
import '@/pages/component/app/ComponentList/ComponentManageDialog'
import '@/pages/component/app/ComponentList/ComponentConfigList'
import '@/pages/component/app/ComponentList/ComponentVersionList'
import '@/pages/component/app/ComponentList/ComponentSchemaList'

export default class ComponentPagedList extends React.Component {
  render(): any {

    let { render } = this.props;


    const body = {
      "type": "crud",
      "perPage": 20,
      "affixHeader": false,
      // "columnsTogglable": false,
      "syncLocation": false,
      "strictMode": true,
      "fid": "appComponentList",
      "id": "appComponentList",
      "name": "appComponentList",
      "primaryField": "id",
      "filter": {
        "type": "form",
        "className": "m-2",
        "title": "",
        "debug": false,
        "body": [

          {
            "type": "input-text",
            "label": "组件关键词",
            "name": "obj.keywords"
          },


          {
            "type": "hidden",
            "name": "obj.app_id",
            "value": "${appId}"
          },
          {
            "label": "状态",
            "type": "select",
            "name": "obj.status",
            "menuTpl": "${label}",
            "value": "1",
            "options": [
              {
                "label": "在线",
                "value": "1"
              },
              {
                "label": "离线",
                "value": "0"
              },
              {
                "label": "已回收",
                "value": "-1"
              }
            ]
          },
          {
            "type": "submit",
            "icon": "fa fa-search pull-left",

            "level": "primary",
            "label": "查询",
          }
        ]
      },
      "columns": [
        // {
        //   "label": "数据ID",
        //   "type": "hidden",
        //   "name": "id",
        //   "value":"${id}"
        // },
        // {
        //   "label": "组件关键词",
        //   "type": "static",
        //   "name": "keywords"
        // },
        {
          "label": "组件",
          "type": "static",
          "align": "left",

          "name": "title"
        },

        // {
        //   "label": "组件",
        //   "name": "title",
        //   "align":"left",
        //   "type": "tpl",
        //   "tpl": "${title|truncate:20}",

        //   "popOver": {
        //     "trigger": "hover",
        //     "position": "left-top",
        //     "showIcon": false,
        //     "title": "详情",
        //     "body": [
        //       {
        //       "type": "tpl",
        //       "tpl": "组件名：${title}"
        //     },{
        //       "type": "divider"
        //     },{
        //       "type": "tpl",
        //       "tpl": "描述：${description}"
        //     }]
        //   }

        // },
        {
          "label": "描述",
          "type": "static",
          "name": "description",
          "align": "left"
        },

        // {
        //   "label": "组件图标",
        //   "type": "static",
        //   "name": "icon"
        // },

        // {
        //   "label": "玄武元数据定义ID",
        //   "type": "static",
        //   "name": "meta_def_id"
        // },
        // {
        //   "label": "评分",
        //   "type": "static",
        //   "name": "score"
        // },
        // {
        //   "label": "引擎类型",
        //   "type": "static",
        //   "name": "executor_type"
        // },
        // {
        //   "label": "组件分类ID",
        //   "type": "static",
        //   "name": "category_id"
        // },

        // {
        //   "label": "应用ID",
        //   "type": "static",
        //   "name": "app_id"
        // },
        // {
        //   "label": "测试ID",
        //   "type": "static",
        //   "name": "test_id"
        // },
        {
          "label": "组件标识",
          "type": "static",
          "name": "component_id"
        },
        {
          label: '文档',

          type: 'link',
          size: 'sm',
          body: '文档',
          actionType: 'url',
          level: 'link',

          href: '/component/setting2?componentId=${meta_def_id}'
        },



        // {
        //   "label": "组件状态",
        //   "type": "static",
        //   "name": "status"
        // },

        // {
        //   "label": "组件状态",
        //   "type": "mapping",
        //   "name": "status",
        //   "map": {
        //     "1": "在线",
        //     "0": "离线",
        //     "-1": "已回收",
        //     "*": "其他"
        //   }
        // },

        {
          "label": "组件状态",
          "type": "button-group",
          "buttons": [

            {
              "label": "组件状态",
              "type": "mapping",
              "name": "status",
              "map": {
                "1": "在线",
                "0": "离线",
                "-1": "已回收",
                "*": "其他"
              },

            },

          ]
        },
        {
          "label": "类型",
          "width": 100,

          "type": "button-group",
          "buttons": [
            {
              visibleOn: "executor_type !=3",
              "label": "类型",
              "type": "mapping",
              "name": "executor_type",
              "map": {
                "0": "JAR",
                "1": "API",
                "2": "ENP",
                "3": "编排",
                "*": "其他"
              },

            },
            {
              type: 'link',
              visibleOn: "${executor_type == 1}",
              size: 'sm',
              body: '修改',
              level: 'link',
              actionType: 'url',
              href: '/component/app/ComponentList/apiEditor?appId=${app_id}&componentId=${component_id}'
            },
            {
              type: 'link',
              visibleOn: "${STARTSWITH(component_id, 'cg_')}",
              size: 'sm',
              body: '编排',
              level: 'link',
              actionType: 'url',
              href: '/component/compose?appId=${app_id}&dataId=0&componentId=${component_id}'
            },

          ]
        },
        // {
        //   "label": "编排",
        //   "width": 100,

        //   "type": "button-group",
        //   "buttons": [


        //     {
        //       "className": "mr-1",
        //       type: 'link',
        //       visibleOn: "${STARTSWITH(component_id, 'cg_')}",
        //       size:'sm',
        //       body: '编排',
        //       level: 'link',
        //       actionType: 'url',
        //        href: '/component/compose?appId=${app_id}&dataId=0&componentId=${component_id}'
        //   },

        //   {
        //     type: 'static',
        //     visibleOn: "executor_type !=3",
        //     value: '-'
        // },

        //   ]
        // },
        // {
        //   "label": "组件作者",
        //   "type": "static",
        //   "name": "author"
        // },
        // {
        //   "label": "行为数量",
        //   "type": "static",
        //   "name": "action_count"
        // },
        // {
        //   "label": "版本",
        //   "type": "static",
        //   "name": "version"
        // },
        {
          "label": "测试",
          type: 'link',
          size: 'sm',
          body: '测试',
          level: 'link',
          actionType: 'url',
          href: '/component/app/ComponentList/apiTest?appId=${app_id}&componentId=${component_id}'
        },
        {
          "label": "版本",
          "type": "button-group",
          "buttons": [
            {
              "label": "${version}${ (ready_version =='' ||   version==ready_version) ? '':' !'}",

              visibleOn: 'executor_type == 3 || executor_type == 1',
              "type": "button",
              "actionType": "dialog",
              "dialog": {
                "title": "历史版本",
                "size": "lg",
                "actions": [
                  {
                    "type": "button",
                    "actionType": "cancel",
                    "label": "关闭",
                    "primary": true
                  }
                ],
                "body": [
                  {
                    id: "appComponentVersionList",
                    name: "appComponentVersionList",
                    type: 'component-version-list',
                  },
                ]
              }
            },
            {
              visibleOn: 'executor_type != 3 &&executor_type != 1',

              "label": "${version}",
              "type": "button",
              "actionType": "dialog",

              "dialog": {
                "size": "lg",

                "title": "组件Schema",
                // "body": "现阶段仅开放编排组件的版本管理",
                "body": [
                  {
                    id: "appComponentSchemaList",
                    name: "appComponentSchemaList",
                    type: 'component-schema-list',
                  },
                ],
                "actions": [
                  {
                    "type": "button",
                    "actionType": "cancel",
                    "label": "确认",
                    "primary": true
                  }
                ],
              }
            }

          ]
        },

        // {
        //   "label": "${version}",
        //   visibleOn: 'executor_type == 3',
        //   "type": "button",
        //   "actionType": "dialog",
        //   "dialog": {
        //     "title": "历史版本",
        //     "size": "lg",
        //     "actions": [
        //       {
        //         "type": "button",
        //         "actionType": "cancel",
        //         "label": "关闭",
        //         "primary": true
        //       }
        //     ],
        //     "body": [
        //       {
        //         id:"appComponentVersionList",
        //         name:"appComponentVersionList",
        //             type:'component-version-list',
        //         },
        //     ]
        //   }
        // },

        // {
        //   "label": "预备",
        //   "type": "static",
        //   "name": "ready_version"
        // },
        // {
        //   "label": "组件标签",
        //   "type": "static",
        //   "name": "tags"
        // },
        // {
        //   "label": "共享数量",
        //   "type": "static",
        //   "name": "shared_count"
        // },
        // {
        //   "label": "更多描述",
        //   "type": "static",
        //   "name": "detail"
        // },
        // {
        //   "label": "消费行为数量",
        //   "type": "static",
        //   "name": "consumer_count"
        // },

        // {
        //   "label": "共享状态",
        //   "type": "static",
        //   "name": "share_status"
        // },
        {
          "label":"共享状态",
          "type": "mapping",
          "name": "share_status",
          "map": {
            "1": "即时共享",
            "0": "授权共享",
            "-1": "不共享",
            "200": "共用不共享",
            "300": "私密共享",
            "*": "其他"
          }
        },
        {
          "label": "共享状态",
          "type": "button-group",
          "buttons": [

            // {
            //   "type": "mapping",
            //   "name": "share_status",
            //   "map": {
            //     "1": "申请共享",
            //     "0": "授权共享",
            //     "-1": "不共享",
            //     "200": "共用不共享",
            //     "300": "私密共享",
            //     "*": "其他"
            //   },

            // },


            {
              "type": "button",
              "label": "共享状态",
              "body": {
                "type": "mapping",
                "name": "share_status",
                "map": {
                  "1": "即时共享",
                  "0": "授权共享",
                  "-1": "不共享",
                  "200": "共用不共享",
                  "300": "私密共享",
                  "*": "修改"
                },

              },
              "actionType": "dialog",
              "size": "right",
              "dialog": {
                "title": "编辑(临时)",
                "body": [
                  {
                    "type": "form",
                    "api": {
                      "method": "post",
                      "url": "/api/component/execute",
                      "data": {
                        "action": "eg_5531_set_share_status_action",
                        "component": "eg_5531_component_manage_plugin",
                        "share_status": "$share_status",
                        "componentId": "$component_id",
                        "appId": "$appId"

                      }
                    },
                    "body": [

                      // {
                      //   "type": "input-text",
                      //   "label": "共享状态",
                      //   "name": "share_status"
                      // },

                      {
                        "label": "共享状态",
                        "type": "select",
                        "name": "share_status",
                        "menuTpl": "${label}",
                        "value": "1",
                        // "1": "申请共享",
                        // "0": "授权共享",
                        // "-1": "不共享",
                        // "200": "共用不共享",
                        // "300": "私密共享",
                        // "*": "其他"

                        "options": [
                          {
                            "label": "即时共享",
                            "value": "1"
                          },
                          {
                            "label": "授权共享",
                            "value": "0"
                          },
                          {
                            "label": "不共享",
                            "value": "-1"
                          },
                          {
                            "label": "共用不共享",
                            "value": "200"
                          },
                          {
                            "label": "私密共享",
                            "value": "300"
                          }
                        ]
                      },

                    ]
                  }
                ]
              }
            },

          ]
        },

        // {
        //   "label": "数据状态",
        //   "type": "static",
        //   "name": "state"
        // },
        // {
        //   "label": "创建人ID",
        //   "type": "static",
        //   "name": "create_id"
        // },
        // {
        //   "label": "创建人名",
        //   "type": "static",
        //   "name": "create_name"
        // },
        // {
        //   "label": "修改人ID",
        //   "type": "static",
        //   "name": "modify_id"
        // },
        // {
        //   "label": "修改人名",
        //   "type": "static",
        //   "name": "modify_name"
        // },
        // {
        //   "label": "修改时间",
        //   "type": "static",
        //   "name": "modify_time"
        // },
        {
          "label": "创建于",
          "name": "create_time",
          "type": "date",
          "fromNow": true
        },
        {
          "label": "修改于",
          "name": "modify_time",
          "type": "date",
          "fromNow": true
        },
        // {
        //   "label": "创建时间",
        //   "type": "static",
        //   "name": "create_time"
        // },
        {
          "label": "配置",
          "type": "button-group",
          "buttons": [
            {
              visibleOn: 'executor_type == 3',
              "tpl": "-",
              "type": "tpl",

            },

            {
              visibleOn: 'executor_type != 3',

              "label": "配置",
              "type": "button",
              "actionType": "dialog",
              "dialog": {
                "title": "配置清单",
                "size": "lg",
                "actions": [
                  {
                    "type": "button",
                    "actionType": "cancel",
                    "label": "关闭",
                    "primary": true
                  }
                ],
                "body": [
                  {
                    id: "appComponentConfigList",
                    name: "appComponentConfigList",
                    type: 'component-config-list',
                  },
                ]
              }
            }]
        },

        {
          "label": "订阅",
          "type": "button-group",
          "buttons": [
            {
              visibleOn: 'executor_type != 3 || consumer_count != 1',
              "tpl": "-",
              "type": "tpl",

            },
            {
              visibleOn: 'executor_type == 3 && consumer_count == 1 && consumer_status==0 && status !=1',
              "label": "已关闭",
              "type": "button",
              "actionType": "dialog",

              "dialog": {
                "actions": [
                  {
                    "type": "button",
                    "actionType": "cancel",
                    "label": "知道了",
                    "primary": true
                  }
                ],
                "title": "提示",
                "body": "订阅已关闭，如需求启动，请先上线组件"
              }
            },

            {
              visibleOn: 'executor_type == 3 && consumer_count == 1 && consumer_status==0  && status == 1',
              appId: '${app_id}',
              version: '${version}',
              type: 'component-manage-dialog',
              componentId: '${component_id}',
              componentTitle: '${title}',
              component: 'eg_b445_component_consumer_plugin',
              message: '确认要开启组件 ${title}(${component_id})的订阅触发器吗？\r\n开启后，组件将提供持续订阅触发服务',
              action: 'eg_b445_start_action',
              btnName: '已关闭',
              actionName: '开启'

            },


            {
              visibleOn: 'executor_type == 3 && consumer_count == 1 && consumer_status==1',
              appId: '${app_id}',
              version: '${version}',
              type: 'component-manage-dialog',
              componentId: '${component_id}',
              componentTitle: '${title}',
              component: 'eg_b445_component_consumer_plugin',
              message: '确认要关闭组件 ${title}(${component_id})的订阅触发器吗？\r\n开启后，组件将关闭订阅触发服务',
              action: 'eg_b445_stop_action',
              btnName: '已开启',
              actionName: '关闭'

            },
          ]

        },

        {
          "label": "管理操作",
          "type": "button-group",
          "buttons": [
            //   {
            //     "className": "mr-1",
            //     type: 'link',
            //     visibleOn: "${STARTSWITH(component_id, 'cg_')}",
            //     size:'sm',
            //     body: '编排',
            //     level: 'link',
            //     actionType: 'url',
            //      href: '/component/compose?appId=${app_id}&dataId=0&componentId=${component_id}'
            // },


            {
              visibleOn: 'status == 1',
              appId: '${app_id}',

              version: '${version}',
              type: 'component-manage-dialog',
              componentId: '${component_id}',
              componentTitle: '${title}',
              message: '确认要下线组件 ${title}(${component_id})吗？\r\n下线后，组件将停止服务',
              action: 'eg_a341_offline_action',
              actionName: '下线'

            },
            // {
            //   visibleOn: 'status == 0',
            //   appId: '${app_id}',
            //   version: '${version}',
            //       type:'component-manage-dialog',
            //       componentId :'${component_id}',
            //       componentTitle :'${title}',
            //       message:'确认要上线组件 ${title}(${component_id})吗？\r\n上线后，组件将提供服务',
            //       action:'eg_a341_online_action',
            //       actionName: '上线'

            //   },
            {
              // 现在的发布实际只是 上线，后续再改进发布。
              visibleOn: 'status == 0',
              appId: '${app_id}',
              version: '${version}',
              type: 'component-manage-dialog',
              componentId: '${component_id}',
              componentTitle: '${title}',
              message: '确认要上线组件 ${title}(${component_id})吗？\r\n上线后，组件将提供服务',
              action: 'eg_a341_online_action',
              actionName: '上线'

            },
            {
              visibleOn: 'status == 0',
              appId: '${app_id}',
              version: '${version}',
              type: 'component-manage-dialog',
              componentId: '${component_id}',
              componentTitle: '${title}',
              message: '确认要回收组件 ${title}(${component_id})吗？\r\n回收后，组件将进入回收站',
              action: 'eg_a341_recycling_action',
              actionName: '回收'

            },

          ]
        }
      ],

      "api": {
        "method": "post",
        "url": "/api/graphql",
        "dataType": "json",
        "graphql": "query find($obj: input_sys_component_registered, $page: Int, $perPage: Int){ pages_sys_component_registered(obj: $obj, pageNum: $page, pageSize: $perPage) {     data { id keywords share_status icon description title meta_def_id score executor_type category_id ready_version app_id test_id component_id author action_count version tags shared_count detail consumer_count consumer_status status  state create_id create_name modify_id modify_name modify_time create_time }     pageNum     pageSize     total   } }",
        "data": {
          "obj": { app_id: "${appId}", status: 1 },

          "&": "$$"
        },
        "responseData": {
          "&": "$$",
          "items": "${pages_sys_component_registered.data}",
          "total": "${pages_sys_component_registered.total}"
        }
      },
      "enableAPI": true
    };

    return render('body', body, this.props);
  }
}


Renderer({
  type: 'component-paged-list',
  autoVar: true,
})(ComponentPagedList);
