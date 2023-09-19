import { Renderer } from '@fex/amis';
import * as React from 'react';
import '@/pages/component/app/ComponentList/ComponentManageDialog'

export default class ComponentSchemaList extends React.Component {
  render(): any {

    let { render } = this.props;


    const body ={
      "type": "crud",
      "affixHeader": false,
      "columnsTogglable": false,
      "title": "组件描述信息",
      "componentId": "4167114e-ca7a-4000-a561-1551a3e99000",
      "fid": "fidggn7nd",
      "id": "fidggn7nd",
      "canAccessSuperData": false,
      "name": "fidggn7nd",
      "zids": [
        "fiduats6o"
      ],
      "czids": [],
      // "filterTogglable": true,
      // "filter": {
      //   "type": "form",
      //   "title": "",
      //   "submitText": "",
      //   "custActions": true,
      //   "body": [
      //     {
      //       "type": "input-text",
      //       "label": "ID",
      //       "name": "obj.id"
      //     },
      //     {
      //       "type": "input-text",
      //       "label": "组件ID",
      //       "name": "obj.component_id"
      //     },
      //     {
      //       "type": "input-text",
      //       "label": "组件版本",
      //       "name": "obj.component_version"
      //     },
      //     {
      //       "type": "input-text",
      //       "label": "组件备注",
      //       "name": "obj.component_detail"
      //     },
      //     {
      //       "type": "input-text",
      //       "label": "组件描述详情",
      //       "name": "obj.component_schema"
      //     },
      //     {
      //       "type": "input-text",
      //       "label": "组件描述MD5",
      //       "name": "obj.component_schema_md5"
      //     },
      //     {
      //       "type": "input-text",
      //       "label": "应用ID",
      //       "name": "obj.app_id"
      //     },
      //     {
      //       "type": "input-text",
      //       "label": "状态",
      //       "name": "obj.state"
      //     },
      //     {
      //       "type": "input-text",
      //       "label": "创建人ID",
      //       "name": "obj.create_id"
      //     },
      //     {
      //       "type": "input-text",
      //       "label": "创建人名",
      //       "name": "obj.create_name"
      //     },
      //     {
      //       "type": "input-text",
      //       "label": "修改人ID",
      //       "name": "obj.modify_id"
      //     },
      //     {
      //       "type": "input-text",
      //       "label": "修改人名",
      //       "name": "obj.modify_name"
      //     },
      //     {
      //       "type": "input-text",
      //       "label": "修改时间",
      //       "name": "obj.modify_time"
      //     },
      //     {
      //       "type": "input-text",
      //       "label": "创建时间",
      //       "name": "obj.create_time"
      //     },
      //     {
      //       "type": "submit",
      //       "label": "筛 选 ",
      //       "className": "btn-common",
      //       "icon": "fa fa-search"
      //     },
      //     {
      //       "label": "新增",
      //       "type": "button",
      //       "actionType": "dialog",
      //       "dialog": {
      //         "title": "新增组件描述信息",
      //         "size": "lg",
      //         "body": [
      //           {
      //             "type": "container",
      //             "style": {
      //               "overflow-y": "scroll"
      //             },
      //             "body": [
      //               {
      //                 "type": "form",
      //                 "title": "",
      //                 "actions": [],
      //                 "api": {
      //                   "method": "post",
      //                   "dataType": "json",
      //                   "url": "/api/graphql",
      //                   "graphql": "mutation create_sys_component_schema($obj: input_sys_component_schema!){ create_sys_component_schema(obj: $obj) }",
      //                   "data": {
      //                     "obj": "$obj"
      //                   }
      //                 },
      //                 "body": [
      //                   {
      //                     "type": "hidden",
      //                     "label": "ID",
      //                     "name": "obj.id"
      //                   },
      //                   {
      //                     "type": "input-text",
      //                     "label": "组件ID",
      //                     "name": "obj.component_id"
      //                   },
      //                   {
      //                     "type": "input-text",
      //                     "label": "组件版本",
      //                     "name": "obj.component_version"
      //                   },
      //                   {
      //                     "type": "input-text",
      //                     "label": "组件备注",
      //                     "name": "obj.component_detail"
      //                   },
      //                   {
      //                     "type": "input-text",
      //                     "label": "组件描述详情",
      //                     "name": "obj.component_schema"
      //                   },
      //                   {
      //                     "type": "input-text",
      //                     "label": "检验码",
      //                     "name": "obj.check_code"
      //                   },
      //                   {
      //                     "type": "input-text",
      //                     "label": "组件描述MD5",
      //                     "name": "obj.component_schema_md5"
      //                   },
      //                   {
      //                     "type": "input-text",
      //                     "label": "应用ID",
      //                     "name": "obj.app_id"
      //                   }
      //                 ]
      //               }
      //             ]
      //           }
      //         ]
      //       }
      //     }
      //   ]
      // },
      "columns": [
        {
          "label": "ID",
          "type": "static",
          "name": "id"
        },
        {
          "label": "组件ID",
          "type": "static",
          "name": "component_id"
        },
        {
          "label": "组件版本",
          "type": "static",
          "name": "component_version"
        },
        // {
        //   "label": "组件备注",
        //   "type": "static",
        //   "name": "component_detail"
        // },
        // {
        //   "label": "组件描述详情",
        //   "type": "static",
        //   "name": "component_schema"
        // },
        // {
        //   "label": "组件描述MD5",
        //   "type": "static",
        //   "name": "component_schema_md5"
        // },
        // {
        //   "label": "应用ID",
        //   "type": "static",
        //   "name": "app_id"
        // },
        // {
        //   "label": "状态",
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
        // {
        //   "label": "创建时间",
        //   "type": "static",
        //   "name": "create_time"
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
        {
          "label": "操作",
          "type": "button-group",
          "buttons": [
            // {
            //   "type": "button",
            //   "label": "编辑",
            //   "level": "link",
            //   "actionType": "dialog",
            //   "size": "right",
            //   "dialog": {
            //     "title": "编辑组件描述信息（临时）",
            //     "size": "lg",
            //     "body": [
            //       {
            //         "type": "form",
            //         "api": {
            //           "method": "post",
            //           "dataType": "json",
            //           "url": "/api/graphql",
            //           "graphql": "mutation update_sys_component_schema($id: Long!, $obj: input_sys_component_schema!){ update_sys_component_schema(id: $id, obj: $obj) }",
            //           "data": {
            //             "obj": {
            //               // "component_id": "$component_id",
            //               "component_version": "$component_version",
            //               "component_detail": "$component_detail",
            //               "component_schema": "$component_schema",
            //               // "check_code": "$check_code",
            //               "component_schema_md5": "$component_schema_md5",
            //               // "app_id": "$app_id"
            //             },
            //             "id": "$id"
            //           }
            //         },
            //         "body": [
            //           // {
            //           //   "type": "hidden",
            //           //   "label": "ID",
            //           //   "name": "id"
            //           // },
            //           // {
            //           //   "type": "input-text",
            //           //   "label": "组件ID",
            //           //   "name": "component_id"
            //           // },
            //           {
            //             "type": "input-text",
            //             "label": "组件版本",
            //             "name": "component_version"
            //           },
            //           {
            //             "type": "textarea",
            //             "label": "组件备注",
            //             "name": "component_detail"
            //           },
            //           {
            //             "type": "textarea",
            //             "label": "组件描述详情",
            //             "name": "component_schema"
            //           },
            //           {
            //             "type": "input-text",
            //             "label": "检验码",
            //             "name": "check_code"
            //           },
            //           {
            //             "type": "input-text",
            //             "label": "组件描述MD5",
            //             "name": "component_schema_md5"
            //           },
            //           // {
            //           //   "type": "input-text",
            //           //   "label": "应用ID",
            //           //   "name": "app_id"
            //           // }
            //         ]
            //       }
            //     ]
            //   }
            // },
            {
              "type": "button",
              "label": "导出",
              "level": "link",
              "size": "right",
              // "body": [
              //   "导出"
              // ],
              // "href": "/api/component/execute?component=eg_5531_component_manage_plugin&actionName=eg_5531_schema_view_action&component_id=${component_id}&app_id=${app_id}&version=${component_version}",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "url",
                      "args": {
                        "url": "/api/component/execute?component=eg_5531_component_manage_plugin&actionName=eg_5531_schema_view_action",
                        "params":{
                          "component_id":"${component_id}",
                          "app_id":"${app_id}",
                          "version":"${component_version}",
                        }

                      }
                    }
                  ]
                }
              }
            },
            // {
            //   "label": "导出",
            //   "type": "link",
            //   "href": "/api/component/executeComponent?component=eg_21d1_component_meta_data_plugin&actionName=eg_21d1f33a_component_meta_data_export_action&component_name=${id}",
            //   "body": [
            //     "导出"
            //   ],
            //   "fid": "fid0rycgm",
            //   "componentId": "dcff3fac-ad52-4000-a4d3-f1f62a068000",
            //   "czids": [
            //     "fidhjqmre"
            //   ],
            //   "zids": [
            //     "fida71oef"
            //   ],
            //   "id": "fid0rycgm",
            //   "rid": -1
            // }
          ]
        }
      ],
      "api": {
        "method": "post",
        "url": "/api/graphql",
        "dataType": "json",
        "graphql": "query find($obj: input_sys_component_schema, $page: Int, $perPage: Int){ pages_sys_component_schema(obj: $obj, pageNum: $page, pageSize: $perPage) {     data { id component_id component_version component_detail component_schema component_schema_md5 app_id state create_id create_name modify_id modify_name modify_time create_time }     pageNum     pageSize     total   } }",
        "data": {
          "obj": {app_id:"${appId}","component_id":"${component_id}"},
          "&": "$$"
        },
        "responseData": {
          "&": "$$",
          "items": "${pages_sys_component_schema.data}",
          "total": "${pages_sys_component_schema.total}"
        }
      },
      "enableAPI": true,
      "rid": -1
    };

    return render('body', body, this.props);
  }
}


  Renderer({
    type: 'component-schema-list',
    autoVar: true,
  })(ComponentSchemaList);
