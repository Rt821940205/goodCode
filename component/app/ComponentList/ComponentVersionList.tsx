import { Renderer } from '@fex/amis';
import * as React from 'react';
import '@/pages/component/app/ComponentList/ComponentManageDialog'

export default class ComponentVersionList extends React.Component {
  render(): any {

    let { render } = this.props;


    const body ={
      "type": "crud",
      "perPage":10,

      "affixHeader": false,
      "columnsTogglable": false,
      // "title": "组件编排源代码",
      "componentId": "4167114e-ca7a-4000-a561-1551a3e99000",
      "fid": "fidggn7nd",
      "id": "fidggn7nd",
      "name": "fidggn7nd",
      "zids": [
        "fidxwpbz8"
      ],
      "czids": [],

      "columns": [
        // {
        //   "label": "数据ID",
        //   "type": "static",
        //   "name": "id"
        // },
        // {
        //   "label": "编排结果Schema",
        //   "type": "static",
        //   "name": "schema"
        // },
        // {
        //   "label": "组件ID",
        //   "type": "static",
        //   "name": "component_id"
        // },
        // {
        //   "label": "编排结果SchemaMd5",
        //   "type": "static",
        //   "name": "schema_md5"
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
        // {
        //   "label": "编排来源类型",
        //   "type": "static",
        //   "name": "source_type"
        // },


        {
          "label": "来源",
          "type": "mapping",
          "name": "source_type",
          "map": {
            "FISH": "编排",
            "simple": "旧编排",
            "API": "API导入",
            "*": "其他"
          },

        },

        // {
        //   "label": "编排源代码",
        //   "type": "static",
        //   "name": "source"
        // },

        {
          "label": "版本号",
          "type": "static",
          "name": "version"
        },
        // {
        //   "label": "编排结果路由",
        //   "type": "static",
        //   "name": "routes"
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
        //   "label": "编排源代码MD5",
        //   "type": "static",
        //   "name": "source_md5"
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
        //   "label": "修改时间",
        //   "type": "static",
        //   "name": "modify_time"
        // },
        // {
        //   "label": "创建时间",
        //   "type": "static",
        //   "name": "create_time"
        // }

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
          type: 'link',
          visibleOn: "${STARTSWITH(component_id, 'http_')}",
          size:'sm',
          body: '导出',
          level: 'link',
          actionType: 'url',
           href: '/api/component/execute?xw-component=eg_1ac2_component_compose_plugin&xw-action=eg_1ac2_compose_export_action&xw-appId=${app_id}&dataId=${id}&version=${version}'
      },
      {
        type: 'link',
        visibleOn: "${STARTSWITH(component_id, 'cg_')}",
        size:'sm',
        body: '回滚',
        level: 'link',
        actionType: 'url',
         href: '/component/compose?appId=${app_id}&dataId=0&componentId=${component_id}&version=${version}'
    },


      ],
      "api": {
        "method": "post",
        "url": "/api/graphql",
        "dataType": "json",
        "graphql": "query find($obj: input_sys_component_compose, $page: Int, $perPage: Int){ pages_sys_component_compose(obj: $obj, pageNum: $page, pageSize: $perPage) {     data { id  component_id schema_md5 description source_type  title version   app_id source_md5 state create_id create_name modify_id modify_name modify_time create_time }     pageNum     pageSize     total   } }",
        "data": {
          "obj": {app_id:"${appId}","component_id":"${component_id}"},
          "&": "$$"
        },
        "responseData": {
          "&": "$$",
          "items": "${pages_sys_component_compose.data}",
          "total": "${pages_sys_component_compose.total}"
        }
      },
      "enableAPI": true,
      "rid": -1
    };

    return render('body', body, this.props);
  }
}


  Renderer({
    type: 'component-version-list',
    autoVar: true,
  })(ComponentVersionList);
