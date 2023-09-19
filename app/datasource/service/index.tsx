import AmisRenderer from '@/components/AmisRenderer';
import { Constants } from '@/pages/app/datasource/util/Constants';
import { modelFieldConstant } from '@/pages/app/datasource/util/modelField';
import { SchemaNode } from '@fex/amis/lib/types';
import { serviceSourceAddForm } from './form';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";

export default function () {
  const schema: SchemaNode = {
    type: 'page',
    title: '',
    data: {
      apiList: [
        {
          id: 1,
          name: '数据资源目录',
          ip: '127.0.0.1',
          port: 9091,
          serviceName: 'chinaoly-auth',
          path: '/user/info',
          auth: 'chinaoly',
        },
      ],
    },
    body: [
      {
        type: 'crud',
        source: '$apiList',
        syncLocation: false,
        autoGenerateFilter: true,
        headerToolbar: [
          {
            type: 'action',
            actionType: 'dialog',
            label: '增加智能服务源',
            level: 'primary',
            dialog: {
              size: 'lg',
              title: '创建智能服务源',
              body: serviceSourceAddForm,
            },
          },
        ],
        columns: [
          {
            name: 'id',
            label: '序号',
          },
          {
            name: 'name',
            label: '服务名称',
          },
          {
            name: 'ip',
            label: '服务ip',
          },
          {
            name: 'port',
            label: 'port',
          },
          {
            name: 'serviceName',
            label: '服务名',
          },
          {
            name: 'path',
            label: '服务地址',
          },
          {
            name: 'auth',
            label: '认证类型',
          },
          {
            type: 'operation',
            label: '操作',
            buttons: [
              {
                label: '编辑',
                type: 'button',
                actionType: 'dialog',
                dialog: serviceSourceAddForm,
              },
              {
                label: '删除',
                type: 'button',
                level: 'danger',
                actionType: 'ajax',
                confirmText: '确认要删除该服务吗？',
                api: '/datasource/delete',
              },
              {
                label: '服务列表',
                type: 'button',
                actionType: 'dialog',
                dialog: {
                  title: '服务列表',
                  body: [
                    {
                      type: 'service',
                      api: {
                        method: 'post',
                        url: '/api/def/model/pages?_serverList',
                        data: {
                          pageNum: '1',
                          pageSize: '100',
                          appId: '$appId',
                          categories: [30, 101210, 101610,101017],
                          source_id: '$id',
                          state: '1',
                        },
                        adaptor: function (payload: any) {
                          if(beforeHandle(payload)){
                            let items = payload.data.data;
                            if (!Array.isArray(items)) {
                              return {
                                data: [],
                              };
                            }
                            items.forEach((item) => {
                              item.fields.forEach((field) => {
                                if (field.name === modelFieldConstant.SQL_DIALECT) {
                                  item.type = field.val;
                                }
                                if (field.name === modelFieldConstant.DATA_SOURCE_URL) {
                                  item.url = field.val;
                                  switch (item.type) {
                                    case 'MySQL':
                                      item.mysqlUrl = field.val;
                                      item.msUrl = Constants.MsSQL_URL_DEFAULT.toString();
                                      item.hiveUrl = Constants.Hive_URL_DEAULT.toString();
                                      break;
                                    case 'MSSQL':
                                      item.msUrl = field.val;
                                      item.mysqlUrl = Constants.MySQL_URL_DEFAULT.toString();
                                      item.hiveUrl = Constants.Hive_URL_DEAULT.toString();
                                      break;
                                    case 'HIVE':
                                      item.hiveUrl = field.val;
                                      item.mysqlUrl = Constants.MySQL_URL_DEFAULT.toString();
                                      item.msUrl = Constants.MsSQL_URL_DEFAULT.toString();
                                      break;
                                    default:
                                      break;
                                  }
                                }
                              });
                            });
                            console.log(items);
                            return {
                              data: items,
                            };
                          }
                          return errorHandle(payload);
                        },
                      },
                      body: {
                        type: 'crud',
                        title: '',
                        data: {
                          items: [
                            {
                              id: 1,
                              name: '人口基本信息',
                              path: '/path1',
                            },
                          ],
                        },
                        columns: [
                          {
                            name: '${index+1}',
                            label: '序号',
                          },
                          {
                            name: 'name',
                            label: '名称',
                          },
                          {
                            name: 'path',
                            label: 'Path',
                          },
                          {
                            type: 'operation',
                            label: '操作',
                            width:"6.25rem",
                            buttons: [
                              {
                                label: '提取实体',
                                type: 'button',
                                actionType: 'link',
                                link: '/app/datasource/model/create/service/info?appId=${appId}&biz=service',
                              },
                            ],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                label: '提取实体',
                type: 'button',
                actionType: 'link',
                link: '/app/datasource/model/create/service/info?appId=${appId}&biz=service',
              },
            ],
          },
        ],
      },
    ],
  };
  return <AmisRenderer schema={schema} />;
}
