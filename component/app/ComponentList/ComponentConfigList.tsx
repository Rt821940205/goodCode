import { Renderer } from '@fex/amis';
import * as React from 'react';
import '@/pages/component/app/ComponentList/ComponentManageDialog'

export default class ComponentConfigList extends React.Component {
  render(): any {

    let { render } = this.props;


    const body = {

      footerToolbar: [
        {
          "label": "新增",
          "type": "button",
          "actionType": "dialog",
          "dialog": {
            "title": "新增组件应用配置（临时）",
            "size": "lg",
            "body": [
              {
                "type": "container",
                "style": {
                  "overflow-y": "scroll"
                },
                "body": [
                  {
                    "type": "form",
                    "canAccessSuperData": false,
                    "title": "",
                    "actions": [],
                    "api": {
                      "method": "post",
                      "dataType": "json",
                      "url": "/api/graphql",
                      "graphql": "mutation create_sys_component_config($obj: input_sys_component_config!){ create_sys_component_config(obj: $obj) }",
                      "data": {
                        "obj": "$configObj"
                      }
                    },
                    "body": [
                      {
                        "type": "hidden",
                        "label": "数据ID",
                        "name": "configObj.id"
                      },
                      {
                        "type": "hidden",
                        "label": "引用的共享ID",
                        "name": "configObj.ref_id",
                        "value": "0"
                      },
                      {
                        "type": "switch",
                        "label": "是否共享",
                        "name": "configObj.shared"
                      },
                      {
                        "type": "textarea",
                        "label": "配置详情",
                        "name": "configObj.config_value",
                        "value":"{}"
                      },
                      {
                        "type": "hidden",
                        "label": "组件ID",
                        "name": "configObj.component_id",
                        "value": "${component_id}"
                      },
                      {
                        "type": "hidden",
                        "label": "组件数据ID",
                        "name": "configObj.component_data_id",
                        "value":"0"
                      },
                      {
                        "type": "input-text",
                        "label": "描述",
                        "name": "configObj.description"
                      },
                      {
                        "type": "input-text",
                        "label": "名称",
                        "name": "configObj.title",
                        "value":"配置"
                      },
                      {
                        "type": "switch",
                        "label": "是否默认配置",
                        "name": "configObj.config_default",
                      },
                      {
                        "type": "input-text",
                        "label": "配置MD5",
                        "name": "configObj.config_md5"
                      },

                      {
                        "type": "input-text",
                        "label": "更多描述",
                        "name": "configObj.detail",
                        "value":"{}"
                      },
                      {
                        "type": "hidden",
                        "label": "应用ID",
                        "name": "configObj.app_id",
                        "value":"${app_id}"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }

      ],

      "type": "crud",
      "perPage":10,
      "loadDataOnce": true,
      "affixHeader": false,
      "columnsTogglable": false,
      // "title": "组件应用配置",
      "componentId": "15736b47-44a3-4000-a9a8-d89d56b4b000",
      "fid": "fid255hkk",
      "id": "fid255hkk",
      "name": "fid255hkk",
      "canAccessSuperData": false,

      "zids": [
        "fid6mkguh"
      ],
      "czids": [],
      // "filterTogglable": true,
      // "filter": {
      //   "type": "form",
      //   "title": "",
      //   "canAccessSuperData": false,
      //   "debug":true,
      //   "submitText": "",
      //   "custActions": true,
      //   "body": [
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "数据ID",
      //     //   "name": "obj.id"
      //     // },
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "引用的共享ID",
      //     //   "name": "obj.ref_id"
      //     // },
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "是否共享",
      //     //   "name": "obj.shared"
      //     // },
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "配置详情",
      //     //   "name": "obj.config_value"
      //     // },
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "组件ID",
      //     //   "name": "obj.component_id"
      //     // },
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "组件数据ID",
      //     //   "name": "obj.component_data_id"
      //     // },
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "描述",
      //     //   "name": "obj.description"
      //     // },
      //     {
      //       "type": "input-text",
      //       "label": "名称",
      //       "name": "obj.title"
      //     },
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "是否默认配置",
      //     //   "name": "obj.config_default"
      //     // },
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "配置MD5",
      //     //   "name": "obj.config_md5"
      //     // },
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "更多描述",
      //     //   "name": "obj.detail"
      //     // },
      //     {
      //       "type": "hidden",
      //       "label": "应用ID",
      //       "name": "obj.app_id",
      //       "value":"${app_id}"
      //     },
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "数据状态",
      //     //   "name": "obj.state"
      //     // },
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "创建人ID",
      //     //   "name": "obj.create_id"
      //     // },
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "创建人名",
      //     //   "name": "obj.create_name"
      //     // },
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "修改人ID",
      //     //   "name": "obj.modify_id"
      //     // },
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "修改人名",
      //     //   "name": "obj.modify_name"
      //     // },
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "修改时间",
      //     //   "name": "obj.modify_time"
      //     // },
      //     // {
      //     //   "type": "input-text",
      //     //   "label": "创建时间",
      //     //   "name": "obj.create_time"
      //     // },
      //     {
      //       "type": "submit",
      //       "label": "筛 选 ",
      //       "className": "btn-common",
      //       "icon": "fa fa-search"
      //     },



      //   ]
      // },
      "columns": [
        {
          "label": "数据ID",
          "type": "static",
          "name": "id"
        },
        // {
        //   "label": "引用的共享ID",
        //   "type": "static",
        //   "name": "ref_id"
        // },

        // {
        //   "label": "配置详情",
        //   "type": "static",
        //   "name": "config_value"
        // },
        // {
        //   "label": "组件ID",
        //   "type": "static",
        //   "name": "component_id"
        // },
        // {
        //   "label": "组件数据ID",
        //   "type": "static",
        //   "name": "component_data_id"
        // },

        {
          "label": "名称",
          "type": "static",
          "name": "title"
        },
        {
          "label": "描述",
          "type": "static",
          "name": "description"
        },
        {
          "label": "是否共享",
          "type": "status",
          "name": "shared"
        },
        {
          "label": "是否默认配置",
          "type": "status",
          "name": "config_default"
        },
        // {
        //   "label": "配置MD5",
        //   "type": "static",
        //   "name": "config_md5"
        // },
        // {
        //   "label": "更多描述",
        //   "type": "static",
        //   "name": "detail"
        // },
        // {
        //   "label": "应用ID",
        //   "type": "static",
        //   "name": "app_id"
        // },
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
          "label": "最后修改",
          "type": "static",
          "name": "modify_name"
        },
        {
          "label": "操作",
          "type": "button-group",
          "buttons": [
            {
              "type": "button",
              "label": "编辑",
              "level": "link",
              "actionType": "dialog",
              "size": "right",
              "dialog": {
                "title": "编辑组件应用配置（临时）",
                "size":"lg",
                "body": [
                  {
                    "type": "form",
                    "api": {
                      "method": "post",
                      "dataType": "json",
                      "url": "/api/graphql",
                      "graphql": "mutation update_sys_component_config($id: Long!, $obj: input_sys_component_config!){ update_sys_component_config(id: $id, obj: $obj) }",
                      "data": {
                        "obj": {
                          // "ref_id": "$ref_id",
                          "shared": "$shared",
                          "config_value": "$config_value",
                          // "component_id": "$component_id",
                          // "component_data_id": "$component_data_id",
                          "description": "$description",
                          "title": "$title",
                          "config_default": "$config_default",
                          // "config_md5": "$config_md5",
                          // "check_code": "$check_code",
                          "detail": "$detail",
                          // "app_id": "$app_id"
                        },
                        "id": "$id"
                      }
                    },
                    "body": [
                      // {
                      //   "type": "hidden",
                      //   "label": "数据ID",
                      //   "name": "id"
                      // },
                      // {
                      //   "type": "input-text",
                      //   "label": "引用的共享ID",
                      //   "name": "ref_id"
                      // },
                      // {
                      //   "type": "input-text",
                      //   "label": "是否共享",
                      //   "name": "shared"
                      // },
                      {
                        "name": "shared",
                        "type": "switch",
                        "label": "是否共享",
                        // "option": "是否共享"
                      },

                      {
                        "type": "textarea",
                        "label": "配置详情",
                        "name": "config_value"
                      },
                      // {
                      //   "type": "input-text",
                      //   "label": "组件ID",
                      //   "name": "component_id"
                      // },
                      // {
                      //   "type": "input-text",
                      //   "label": "组件数据ID",
                      //   "name": "component_data_id"
                      // },
                      {
                        "type": "input-text",
                        "label": "描述",
                        "name": "description"
                      },
                      {
                        "type": "input-text",
                        "label": "名称",
                        "name": "title"
                      },
                      {
                        "type": "input-text",
                        "label": "是否默认配置",
                        "name": "config_default"
                      },
                      // {
                      //   "type": "input-text",
                      //   "label": "配置MD5",
                      //   "name": "config_md5"
                      // },
                      // {
                      //   "type": "input-text",
                      //   "label": "检验码",
                      //   "name": "check_code"
                      // },
                      {
                        "type": "textarea",
                        "label": "更多描述",
                        "name": "detail"
                      },
                      // {
                      //   "type": "input-text",
                      //   "label": "应用ID",
                      //   "name": "app_id"
                      // }
                    ]
                  }
                ]
              }
            },
            // {
            //   "type": "button",
            //   "label": "删除",
            //   "level": "link",
            //   "actionType": "ajax",
            //   "originalType": "button",
            //   "confirmText": "确认要删除该数据吗？",
            //   "size": "right",
            //   "api": {
            //     "method": "post",
            //     "dataType": "json",
            //     "url": "/api/graphql",
            //     "graphql": "mutation delete_sys_component_config($id: Long!, $obj: input_sys_component_config!){ delete_sys_component_config(id: $id, obj: $obj) }",
            //     "data": {
            //       "obj": {},
            //       "id": "$id"
            //     }
            //   }
            // }
          ]
        }
      ],
      "api": {
        "method": "post",
        "url": "/api/graphql",
        "dataType": "json",
        "graphql": "query find($obj: input_sys_component_config, $page: Int, $perPage: Int){ pages_sys_component_config(obj: $obj, pageNum: $page, pageSize: $perPage) {     data { id ref_id shared  component_id component_data_id description title config_value config_default config_md5 detail app_id state create_id create_name modify_id modify_name modify_time create_time }     pageNum     pageSize     total   } }",
        "data": {
          "obj": {app_id:"${appId}","component_id":"${component_id}"},
          "&": "$$"
        },
        "responseData": {
          "&": "$$",
          "items": "${pages_sys_component_config.data}",
          "total": "${pages_sys_component_config.total}"
        }
      },
      "enableAPI": true
    };

    return render('body', body, this.props);
  }
}


  Renderer({
    type: 'component-config-list',
    autoVar: true,
  })(ComponentConfigList);
