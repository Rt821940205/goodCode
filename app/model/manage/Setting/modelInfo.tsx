import { SchemaNode } from '@fex/amis/lib/types';
import './index.less';
/**
 * 实体基本信息
 */
export const modelInfoFormBody: SchemaNode = [
  {
    type: 'hidden',
    name: 'appId',
  },
  {
    type: 'hidden',
    name: 'category',
  },
  {
    type: 'hidden',
    name: 'id',
  },
  {
    type: 'group',
    body: [
      {
        type: 'input-text',
        validations: { maxLength: 20 },
        validationErrors: { maxLength: '长度超出限制，请输入小于20字的名称' },
        name: 'displayName',
        label: '实体名称:',
        mode:'horizontal',
        required: true,
        placeholder: '请输入一个长度小于20的名称',
      },
    ],
  },
  {
    type: 'group',
    body: [
      {
        label: '实体类型:',
        name: 'display',
        type: 'hidden',
        value: false,
      },
      {
        label: '实体分类:',
        type: 'hidden',
        name: 'category',
        value: 30,
      },
    ],
  },
  {
    type: 'group',
    body: [
      {
        name: 'description',
        type: 'textarea',
        showCounter: true,
        maxLength: 500,
        mode:'horizontal',
        validations: {
          maxLength: 500,
        },
        validationErrors: {
          maxLength: '长度应该小于500',
        },
        label: '实体描述:',
      },
    ],
  },
];

export const modelInfoFormEdit: SchemaNode = [
  {
    type: 'hidden',
    name: 'appId',
  },
  {
    type: 'hidden',
    name: 'id',
  },
  {
    type: 'group',
    body: [
      {
        type: 'input-text',
        validations: {
          maxLength: 20,
        },

        validationErrors: {
          maxLength: '长度超出限制，请输入小于20字的名称',
        },
        name: 'displayName',
        label: '实体名称:',
        required: true,
        placeholder: '请输入一个长度小于20的名称',
      },
    ],
  },
  {
    type: 'group',
    body: [
      {
        label: '实体类型:',
        name: 'display',
        type: 'hidden',
        value: false,
      },
      {
        label: '实体分类:',
        type: 'hidden',
        name: 'category',
        value: 30,
      },
    ],
  },
  {
    type: 'group',
    body: [
      {
        name: 'description',
        type: 'textarea',
        showCounter: true,
        maxLength: 500,
        validations: {
          maxLength: 500,
        },
        validationErrors: {
          maxLength: '长度应该小于500',
        },
        label: '实体描述:',
      },
    ],
  },
];
