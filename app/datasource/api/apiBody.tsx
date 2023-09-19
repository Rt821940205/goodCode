import { paramColumns } from '@/pages/app/datasource/api/params';

export const apiBodyForm = {
  name: 'body',
  label: false,
  type: 'combo',
  multiLine: true,
  items: [
    {
      type: 'radios',
      name: 'type',
      label: '类型选择',
      value: 'none',
      options: [
        {
          label: 'none',
          value: 'none',
        },
        {
          label: 'form-data',
          value: 'formData',
        },
        {
          label: 'raw',
          value: 'JSON',
        },
      ],
    },
    {
      type: 'container',
      body: [
        {
          label: false,
          type: 'input-table',
          hiddenOn: "this.type != 'formData'",
          name: 'formData',
          addable: true,
          editable: true,
          removable: true,
          needConfirm: false,
          columns: paramColumns,
        },
        {
          label: false,
          type: 'input-table',
          hiddenOn: "this.type != 'formUrlencoded'",
          name: 'formUrlencoded',
          addable: true,
          editable: true,
          removable: true,
          needConfirm: false,
          columns: paramColumns,
        },
        {
          type: 'json-editor',
          label: '',
          hiddenOn: "this.type != 'JSON'",
          name: 'JSON',
        },
      ],
    },
  ],
};
