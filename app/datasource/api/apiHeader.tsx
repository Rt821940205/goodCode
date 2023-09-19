export const apiHeaderForm = {
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
};
