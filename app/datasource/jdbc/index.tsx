import AmisRenderer from '@/components/AmisRenderer';
import {datasourceJdbcEdit, datasourceJdbcForm} from '@/pages/app/datasource/jdbc/form';
import { Constants } from '@/pages/app/datasource/util/Constants';
import { modelFieldConstant } from '@/pages/app/datasource/util/modelField';
import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';
import { setBreadcrumb } from '@/utils';
export default function () {
  const { query = {} } = history.location;
  const { appId } = query;
  const datasourceServerCategory = 1016;
  const breadcrumb = setBreadcrumb(); // 面包屑组件
  const schema: SchemaNode = {
    type: 'page',
    title: '',
    className: 'base-light-page-center page-w1400 bg-white rounded-lg mt-6  p-6',
    body: [
      breadcrumb,
      {
        type: 'crud',
        name: 'jdbcSourceForm',
        api: {
          method: 'post',
          url: '/api/def/model/pages?_=datasourceIndex',
          data: {
            pageNum: '1',
            pageSize: '100',
            appId: appId,
            categories: [datasourceServerCategory],
            state: '1',
          },
          adaptor: function (payload:any) {
            let items = payload.data.data;
            if (!Array.isArray(items)) {
              return {
                data: [],
              };
            }
            let fieldIdNameMapping:any = [];
            items.forEach((item) => {
              item.fields.forEach((field:any) => {
                fieldIdNameMapping.push({ name: field.name, id: field.id });
                item.modelId = field.modelId;
                if (field.name === modelFieldConstant.SQL_DIALECT) {
                  item.type = field.defaultValue;
                }
                if (field.name === modelFieldConstant.DATA_SOURCE_USER) {
                  item.username = field.defaultValue;
                }
                if (field.name === modelFieldConstant.DATA_SOURCE_PWD) {
                  item.password = field.defaultValue;
                }
                if (field.name === modelFieldConstant.DATA_SOURCE_URL) {
                  item.url = field.defaultValue;
                  switch (item.type) {
                    case 'MySQL':
                      item.mysqlUrl = field.defaultValue;
                      item.msUrl = Constants.MsSQL_URL_DEFAULT.toString();
                      item.hiveUrl = Constants.Hive_URL_DEAULT.toString();
                      break;
                    case 'MSSQL':
                      item.msUrl = field.defaultValue;
                      item.mysqlUrl = Constants.MySQL_URL_DEFAULT.toString();
                      item.hiveUrl = Constants.Hive_URL_DEAULT.toString();
                      break;
                    case 'HIVE':
                      item.hiveUrl = field.defaultValue;
                      item.mysqlUrl = Constants.MySQL_URL_DEFAULT.toString();
                      item.msUrl = Constants.MsSQL_URL_DEFAULT.toString();
                      break;
                    default:
                      break;
                  }
                }
              });
            });
            fieldIdNameMapping = fieldIdNameMapping.filter((o:any) => {
              return o.name != undefined;
            });
            return {
              items: items,
              fieldIdNameMapping: fieldIdNameMapping,
            };
          },
        },
        syncLocation: false,
        autoGenerateFilter: true,
        headerToolbar: [
          {
            type: 'action',
            actionType: 'dialog',
            label: '添加数据源',
            level: 'primary',
            align: 'right',
            dialog: {
              title: '创建数据源',
              body: datasourceJdbcForm,
            },
          },
        ],
        columns: [
          {
            name: 'id',
            label: '序号',
          },
          {
            name: 'displayName',
            label: '数据源名称',
          },
          {
            name: 'url',
            label: '数据库地址',
          },
          {
            name: 'type',
            label: '数据库类型',
          },
          {
            type: 'operation',
            label: '操作',
            buttons: [
              {
                label: '编辑',
                type: 'button',
                actionType: 'dialog',
                dialog: {
                  title: '编辑数据源',
                  body: datasourceJdbcEdit,
                },
                level: 'link',
              },
              {
                label: '删除',
                type: 'button',
                reload: 'jdbcSourceForm',
                // actionType: 'ajax',
                // confirmText: '确认要删除该服务吗？',
                // api: 'get:/api/def/model/real/delete?modelId=${id}',
                level: 'link',
                className: 'text-danger',
                actionType: 'dialog',
                dialog: {
                  title: '系统消息',
                  body: [
                    '确认要删除该服务吗?',
                    {
                      type: 'form',
                      title: '',
                      api: 'get:/api/def/model/real/delete?modelId=${id}'
                    },
                  ],
                },
              },
              {
                label: '外部数据源表列表',
                type: 'button',
                actionType: 'link',
                link: '/app/datasource/jdbc/list?id=${id}&appId=${appId}&source_id=${id}',
                level: 'link',
              },
            ],
          },
        ],
      },
    ],
  };
  return <AmisRenderer schema={schema} />;
}
