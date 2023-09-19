import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
import './index.less'
export default function () {
  const schema: SchemaNode = {
    type: 'page',
    title: '',
    className: 'perm-setting permission-wrapper-page',
    data: {
      resources: [
        {
          id: 1,
          name: '页面',
        },
        {
          id: 2,
          name: '实体管理',
        },
        {
          id: 3,
          name: '高级实体',
        },
      ],
    },
    body: {
      type: 'form',
      title: '',
      body: {
        type: 'grid',
        columns: [
          {
            md: 3,
            columnClassName: 'b-r',
            body: [
              {
                type: 'service',
                api: {
                  method: 'post',
                  url: '/api/graphql',
                  data: {
                    query: '{find_sys_role(obj:{}){id name description}}',
                    variables: null,
                  },
                  adaptor: function (payload: any) {
                    let list = payload.data.find_sys_role;
                    return {
                      items: list,
                    };
                  },
                },
                body: {
                  type: 'table',
                  source: '$items',
                  rowClassNameExpr: "<%= data.id==2 ? 'bg-info' : '' %>",
                  itemAction: {
                    type: 'button',
                    actionType: 'ajax',
                    api: '',
                  },
                  columns: [
                    {
                      name: 'name',
                      label: '角色列表',
                    },
                  ],
                },
              },
            ],
          },
          {
            md: 3,
            columnClassName: 'b-r',
            body: [
              {
                type: 'table',
                source: '$resources',
                rowClassNameExpr: "<%= data.id==1 ? 'bg-info' : '' %>",
                columns: [
                  {
                    name: 'name',
                    label: '资源列表',
                  },
                ],
              },
            ],
          },
          {
            md: 0,
            body: {
              name: 'matrix',
              type: 'matrix-checkboxes',
              rowLabel: '所在目录',
              columns: [
                {
                  label: '可读',
                },
                {
                  label: '可写',
                },
                {
                  label: '可删',
                },
                {
                  label: '自定义',
                },
              ],
              rows: [
                {
                  label: '页面A',
                  value: '123',
                },
                {
                  label: '模版B',
                },
                {
                  label: '｜- 页面B1',
                },
                {
                  label: '页面C',
                },
              ],
            },
          },
        ],
      },
    },
  };
  return <AmisRenderer schema={schema} />;
}
