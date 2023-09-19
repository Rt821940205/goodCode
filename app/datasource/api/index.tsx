import AmisRenderer from '@/components/AmisRenderer';
import { headerBar, operations } from '@/pages/app/datasource/api/apiForm';
import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";

import { setTables } from '@/components/co-table';
import { setBreadcrumb } from '@/utils';
// import './index.less'
const { query = {} } = history.location;
const { appId } = query;
const crub = {
  api: {
    method: 'post',
    url: '/api/def/model/pages?_=_apiSourceForm',
    data: {
      pageNum: '1',
      pageSize: '100',
      appId: appId,
      categories: [1012],
      state: '1',
    },
    adaptor: function (payload:any) {
      if(beforeHandle(payload)){
        let items = payload.data.data;
        if (!Array.isArray(items)) {
          return {
            data: [],
          };
        }
        let fieldIdNameMapping:any = [];
        items.forEach((item:any) => {
          item.fields.forEach((field:any) => {
            fieldIdNameMapping.push({ name: field.name, id: field.id });
          });
          let type = item.fields.filter((obj:any) => obj.name == 'authentication_type')[0];
          let authentication_type = 'none';
          if (isObj(type)) {
            authentication_type = type.defaultValue;
          }
          item.authentication_type = authentication_type;

          switch (authentication_type) {
            case 'chinaoly':
              if (Array.isArray(item.fields)) {
                item.fields.forEach((o:any) => {
                  if (o.name === 'authenticationConfig__url') {
                    item.authUrl = o.defaultValue;
                  }
                  if (o.name === 'authenticationConfig__appKey') {
                    item.appKey = o.defaultValue;
                  }
                  if (o.name === 'authenticationConfig__appSecret') {
                    item.appSecret = o.defaultValue;
                  }
                });
              } else {
                console.log('加载数据失败，请重试…………')
              }
              break;
            case 'wyy':
              if (Array.isArray(item.fields)) {
                item.fields.forEach((o:any) => {
                  if (o.name === 'authenticationConfig__accessId') {
                    item.accessId = o.defaultValue;
                  }
                  if (o.name === 'authenticationConfig__privateKey') {
                    item.privateKey = o.defaultValue;
                  }
                });
              } else {
                console.log('加载数据失败，请重试…………')
              }
              break;
            default:
              break;
          }
        });
        fieldIdNameMapping = fieldIdNameMapping.filter((o:any) => {
          return o.name != undefined;
        });
        return {
          items: items,
          fieldIdNameMapping: fieldIdNameMapping,
        };
      }
      return errorHandle(payload);
    },
  },
  name:'apiSourceForm',
  syncLocation: false,
  autoGenerateFilter: true,
  headerToolbar: headerBar,
  className: 'p-4'
}

const columns = [
  {
    name: 'id',
    label: '序号',
  },
  {
    name: 'displayName',
    label: '服务名称',
  },
  {
    name: 'authentication_type',
    label: '认证类型',
  },
]


export function isObj(obj:any) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
export default function () {
  const breadcrumb = setBreadcrumb(); // 面包屑组件
  const schema: SchemaNode = {
    type: 'page',
    className: "base-light-page-center page-w1400 bg-white rounded-lg mt-6",
    body: [
      breadcrumb,
      setTables(crub, columns, operations) // 修改好样式的table表格
    ],
  };
  return <AmisRenderer schema={schema} />;
}
