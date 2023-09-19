// 实体权限
import { SchemaNode } from '@fex/amis/lib/types';

/**
 * 实体权限表单
 */
export const modelPermissionForm: SchemaNode = [
  {
    type: 'matrix-checkboxes',
    name: 'model',
    label: '实体权限',
    rowLabel: '角色',
    columns: [
      {
        name: 'read',
        label: '可读',
      },
      {
        name: 'write',
        label: '可写',
      },
      {
        name: 'delete',
        label: '可删',
      },
    ],
    rows: [
      {
        label: '组织管理员',
      },
      {
        label: '应用管理员',
      },
    ],
  },
  {
    type: 'matrix-checkboxes',
    name: 'fields',
    label: '属性权限',
    rowLabel: '字段',
    columns: [
      {
        name: 'read',
        label: '可读',
      },
      {
        name: 'write',
        label: '可写',
      },
      {
        name: 'encrypt',
        label: '加密',
      },
      {
        name: 'desensitization',
        label: '脱敏',
      },
      {
        name: 'role',
        label: '角色',
      },
    ],
    rows: [
      {
        label: 'name',
      },
      {
        label: 'age',
      },
      {
        label: 'sex',
      },
      {
        label: 'idCard',
      },
    ],
  },
];
