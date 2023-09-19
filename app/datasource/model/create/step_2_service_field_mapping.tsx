import { SchemaNode } from '@fex/amis/lib/types';

export const service_field_mapping: SchemaNode = {
  type: 'page',
  body: [
    {
      type: 'group',
      mode: 'horizontal',
      body: [
        {
          label: '服务源',
          type: 'input-group',
          body: [
            {
              type: 'select',
              name: 'service_id',
              required: true,
              searchable: true,
              options: [
                {
                  label: '数据资源目录',
                  value: 'a',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      mode: 'horizontal',
      body: [
        {
          label: '服务名称',
          type: 'input-group',
          body: [
            {
              type: 'select',
              name: 'service_name',
              label: '服务名称',
              searchable: true,
              options: [
                {
                  label: '人口基本信息',
                  value: 'a',
                },
              ],
            },
            {
              label: '获取服务配置',
              type: 'button',
              level: 'link',
            },
          ],
        },
      ],
    },
    {
      type: 'panel',
      title: '返回结果Body',
      body: {
        label: '返回结果Body',
        type: 'json',
        mutable: true,
        value: {
          name: '服务名称',
          url: 'https://www.chinaoly.com/api/data/fetch',
          params: {},
          result: {},
        },
      },
    },
    {
      type: 'group',
      body: [
        {
          type: 'crud',
          title: '参数实体',
          source: '$serviceFields',
          columns: [
            {
              name: '${index+1}',
              label: '序号',
            },
            {
              name: 'code',
              label: '字段名',
            },
            {
              name: 'name',
              label: '名称',
            },
            {
              name: 'type',
              label: '类型',
            },
            {
              type: 'operation',
              label: '操作',
              buttons: [
                {
                  mode: 'inline',
                  type: 'switch',
                  onText: '开启',
                  offText: '关闭',
                },
              ],
            },
          ],
        },
        {
          type: 'crud',
          title: '结果实体',
          source: '$serviceFields',
          columns: [
            {
              name: '${index+1}',
              label: '序号',
            },
            {
              name: 'code',
              label: '字段名',
            },
            {
              name: 'name',
              label: '名称',
            },
            {
              name: 'type',
              label: '类型',
            },
            {
              type: 'operation',
              label: '操作',
              buttons: [
                {
                  mode: 'inline',
                  type: 'switch',
                  onText: '开启',
                  offText: '关闭',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
