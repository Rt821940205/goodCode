import { SchemaNode } from '@fex/amis/lib/types';
import './index.less';
const commonInfo = [
  {
    type: 'hidden',
    name: 'appId',
  },
  {
    type: 'hidden',
    name: 'modelId',
  },
  {
    type: 'group',
    body: [
      {
        type: 'input-text',
        mode:'horizontal',
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
];
let apiSourceCategory = 101210;
/**
 * api model info
 */
export const apiModelInfoForm: SchemaNode = [
  ...commonInfo,
  {
    type: 'group',
    body: [
      {
        label: '实体类型:',
        name: 'display',
        type: 'hidden',
        value: true,
      },
      {
        label: '实体分类:',
        type: 'hidden',
        disabled: true,
        name: 'category',
        value: apiSourceCategory,
      },
    ],
  },
  {
    type: 'group',
    body: [
      {
        name: 'description',
        type: 'textarea',
        mode:'horizontal',
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
  }
];

let datasourceCategory = 101610;
/**
 * datasource model info
 */
export const datasourceModelInfoForm: SchemaNode = [
  ...commonInfo,
  {
    type: 'group',
    body: [
      {
        label: '实体类型:',
        name: 'display',
        type: 'hidden',
        value: true,
      },
      {
        label: '实体分类:',
        type: 'hidden',
        disabled: true,
        name: 'category',
        value: datasourceCategory,
      },
    ],
  },
  {
    type: 'group',
    body: [
      {
        name: 'description',
        mode:'horizontal',
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
