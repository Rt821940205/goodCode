export const paramBody = {
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
};
