import { SchemaNode } from '@fex/amis/lib/types';

export const serviceSourceAddForm: SchemaNode = {
  type: 'form',
  body: [
    {
      type: 'input-text',
      name: 'name',
      label: '智能服务名称',
      required: true,
    },
    {
      type: 'group',
      body: [
        {
          label: '服务地址',
          type: 'input-group',
          body: [
            {
              label: false,
              type: 'select',
              name: 'method',
              required: true,
              options: [
                {
                  label: 'GET',
                  value: 'GET',
                },
                {
                  label: 'POST',
                  value: 'POST',
                },
              ],
            },
            {
              label: false,
              type: 'input-text',
              name: 'url',
            },
            {
              label: '发送',
              type: 'button',
              level: 'link',
              actionType: 'dialog',
              dialog: {
                title: '发送测试',
                body: '这是一个交互样式页面，后端功能开发中。',
              },
            },
          ],
        },
      ],
    },
    {
      label: false,
      type: 'group',
      body: [
        {
          type: 'tabs',
          tabsMode: 'radio',
          tabs: [
            {
              title: '查询参数',
              body: {
                label: false,
                type: 'input-table',
                name: 'param',
                addable: true,
                editable: true,
                removable: true,
                needConfirm: false,
                columns: [
                  {
                    label: '参数名',
                    name: 'paramName',
                    type: 'input-text',
                  },
                  {
                    label: '参数值',
                    name: 'paramValue',
                    type: 'input-text',
                  },
                  {
                    label: '类型',
                    name: 'paramType',
                    type: 'select',
                    options: ['Long', 'String'],
                  },
                ],
              },
            },
            {
              title: 'Authorization',
              body: '选项卡内容2',
            },
            {
              title: 'Header',
              body: {
                label: false,
                type: 'input-table',
                name: 'header',
                addable: true,
                editable: true,
                removable: true,
                needConfirm: false,
                columns: [
                  {
                    label: '参数名',
                    name: 'headerName',
                    type: 'input-text',
                  },
                  {
                    label: '参数值',
                    name: 'headerValue',
                    type: 'input-text',
                  },
                  {
                    label: '类型',
                    name: 'headerType',
                    type: 'select',
                    options: ['Long', 'String'],
                  },
                ],
              },
            },
            {
              title: 'Body',
              body: '选项卡内容3',
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
        mutable: true,
        type: 'json',
        value: {
          a: 'a',
          b: 'b',
          c: {
            d: 'd',
          },
        },
      },
    },
  ],
};
