export const jwtFormItems = [
  {
    type: 'input-text',
    required: true,
    name: 'auth_url',
    label: 'auth_url: ',
    placeholder: 'https://',
  },
  {
    type: 'group',
    mode: 'horizontal',
    body: [
      {
        type: 'input-text',
        required: true,
        name: 'app_id',
        label: 'app_id: ',
      },
      {
        type: 'input-text',
        name: 'app_security',
        required: true,
        label: 'app_security: ',
      },

      // {
      //   label: 'Auth URL',
      //   type: 'input-group',
      //   body: [
      //     {
      //       label: false,
      //       type: 'select',
      //       name: 'method',
      //       value:'get',
      //       required: true,
      //       options: [
      //         {
      //           label: 'GET',
      //           value: 'get',
      //         },
      //         {
      //           label: 'POST',
      //           value: 'post',
      //         }
      //       ],
      //     },
      //     {
      //       label: false,
      //       type: 'input-text',
      //       placeholder:'https://',
      //       name: 'url',
      //     },
      //     {
      //       label: '发送',
      //       type: 'button',
      //       level: 'link',
      //       actionType: 'dialog',
      //       dialog: {
      //         title: '发送测试',
      //         body: '这是一个交互样式页面，后端功能开发中。[[${method}]:${url}]',
      //       },
      //     },
      //   ],
      // },
    ],
  },
  // {
  //   label: false,
  //   type: 'group',
  //   body: [
  //     {
  //       type: 'tabs',
  //       tabsMode: 'radio',
  //       tabs: [
  //         {
  //           title: '查询参数',
  //           body: {
  //             label: false,
  //             type: 'input-table',
  //             name: 'params',
  //             addable: true,
  //             editable: true,
  //             removable: true,
  //             needConfirm: false,
  //             columns:paramColumns
  //           },
  //         },
  //         {
  //           title: 'Header',
  //           body: apiHeaderForm,
  //         },
  //         {
  //           title: 'Body',
  //           body: apiBodyForm,
  //         },
  //       ],
  //     },
  //   ],
  // },
];
