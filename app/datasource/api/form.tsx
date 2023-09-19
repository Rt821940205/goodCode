import { apiKeyFormItems } from '@/pages/app/datasource/api/apiKey';
import {chinaolyFormItems, wyyFormItems} from '@/pages/app/datasource/api/chinaoly';
import { jwtFormItems } from '@/pages/app/datasource/api/jwt';
import { oauth2_0FormItems } from '@/pages/app/datasource/api/oauth2_0';
import { SchemaNode } from '@fex/amis/lib/types';
import './index.less'

let apiSourceCategory = 1012;
export const ApiSourceAddForm: SchemaNode = [
  {
    type: 'hidden',
    name: 'id',
  },
  {
    type: 'hidden',
    name: 'appId',
  },
  {
    type: 'input-text',
    name: 'displayName',
    label: '服务名称',
    validations: {
      maxLength: 20,
    },
    validationErrors: {
      maxLength: '长度超出限制，请输入小于20字的名称',
    },
    required: true,
  },
  {
    label: '实体类型:',
    name: 'display',
    type: 'hidden',
    // 存储类
    value: true,
  },
  {
    label: '实体分类:',
    type: 'hidden',
    name: 'category',
    value: apiSourceCategory,
  },
  {
    label: '认证类型:',
    type: 'select',
    searchable: true,
    name: 'authentication_type',
    value: 'none',
    // size: "sm",
    options: [
      {
        label: 'No Auth',
        value: 'none',
      },
      // {
      //   label: "API Key",
      //   value: 'apiKey'
      // },

      // {
      //   label: "OAuth 2.0",
      //   value: 'oauth2'
      // },

      // 隐藏jwt
      // {
      //   label: "JWT",
      //   value: 'jwt'
      // },
      {
        label: 'CHINAOLY',
        value: 'chinaoly',
      },
      {
        label: '微应用',
        value: 'wyy',
      },
    ],
  },
  {
    type: 'container',
    hiddenOn: "this.authentication_type != 'apiKey'",
    body: [...apiKeyFormItems],
  },
  {
    type: 'container',
    hiddenOn: "this.authentication_type != 'oauth2'",
    body: [...oauth2_0FormItems],
  },
  {
    type: 'container',
    hiddenOn: "this.authentication_type != 'jwt'",
    body: [...jwtFormItems],
  },
  {
    type: 'container',
    hiddenOn: "this.authentication_type != 'chinaoly'",
    body: [...chinaolyFormItems],
  },
  {
    type: 'container',
    hiddenOn: "this.authentication_type != 'wyy'",
    body: [...wyyFormItems],
  },
];
