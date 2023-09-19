export const callbackUrl = [
  {
    type: 'group',
    body: [
      {
        label: 'Callback Url:',
        labelRemark:
          'The endpoint for authorization server. this is used to get the authorization token',
        type: 'input-group',
        body: [
          {
            label: false,
            type: 'select',
            name: 'method',
            required: true,
            value: 'GET',
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
            placeholder: 'http://',
            required: true,
            // placeholder:'Enter request URL',
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
];

export const authUrl = [
  {
    type: 'group',
    body: [
      {
        label: 'Auth URL',
        labelRemark:
          'The endpoint for authorization server. this is used to get the authorization token',
        type: 'input-group',
        body: [
          {
            label: false,
            type: 'select',
            name: 'method',
            required: true,
            value: 'GET',
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
            placeholder: 'http://',
            required: true,
            // placeholder:'Enter request URL',
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
];

export const implicitMode = [
  ...authUrl,
  ...callbackUrl,
  {
    type: 'input-text',
    label: 'Client ID:',
  },
  {
    type: 'input-text',
    label: 'State:',
  },
];
export const accessTokenUrl = [
  {
    type: 'group',
    body: [
      {
        label: 'Access Token URL',
        labelRemark:
          'The endpoint for authorization server. this is used to get the authorization token',
        type: 'input-group',
        body: [
          {
            label: false,
            type: 'select',
            name: 'method',
            required: true,
            value: 'GET',
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
            placeholder: 'http://',
            required: true,
            // placeholder:'Enter request URL',
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
];
/**
 * code mode
 */
export const oauth2_0CodeModeFormItems = [
  ...accessTokenUrl,
  ...implicitMode,
  {
    type: 'input-text',
    label: 'Client Secret:',
  },
];

export const oauth2_0CodePKCEModeFormItems = [
  {
    label: 'Code Challenge Method:',
    type: 'select',
    name: 'ccMethod',
    value: 'sha256',
    options: [
      {
        label: 'Plain',
        value: 'plain',
      },
      {
        label: 'SHA-256',
        value: 'sha256',
      },
    ],
  },
  {
    type: 'input-text',
    label: 'Code Verifier:',
  },
];

export const passwordMode = [
  ...accessTokenUrl,
  {
    type: 'input-text',
    label: 'Client ID:',
  },
  {
    type: 'input-text',
    label: 'Username:',
  },
  {
    type: 'input-text',
    label: 'Password:',
  },
  {
    type: 'input-text',
    label: 'Client Secret:',
  },
  {
    type: 'input-text',
    label: 'State:',
  },
];

export const clientMode = [
  ...accessTokenUrl,
  {
    type: 'input-text',
    label: 'Client ID:',
  },
  {
    type: 'input-text',
    label: 'Client Secret:',
  },
  {
    type: 'input-text',
    label: 'State:',
  },
];

export const oauth2_0FormItems = [
  {
    type: 'input-text',
    required: true,
    label: 'Token Name:',
  },
  {
    type: 'select',
    label: 'Grant Type',
    name: 'grantType',
    value: 'code',
    required: true,
    options: [
      {
        label: 'Authorization Code',
        value: 'code',
      },
      {
        label: 'Authorization Code(With PKCE)',
        value: 'pkceCode',
      },
      {
        label: 'Implicit',
        value: 'implicit',
      },
      {
        label: 'Password Credentials',
        value: 'password',
      },
      {
        label: 'Client Credentials',
        value: 'client',
      },
    ],
  },
  {
    type: 'container',
    hiddenOn: "this.grantType != 'code'",
    body: [...oauth2_0CodeModeFormItems],
  },

  {
    type: 'container',
    hiddenOn: "this.grantType != 'pkceCode'",
    body: [...oauth2_0CodeModeFormItems, ...oauth2_0CodePKCEModeFormItems],
  },
  // code mode
  {
    type: 'container',
    hiddenOn: "this.grantType != 'implicit'",
    body: [...implicitMode],
  },

  {
    type: 'container',
    hiddenOn: "this.grantType != 'password'",
    body: [...passwordMode],
  },

  {
    type: 'container',
    hiddenOn: "this.grantType != 'client'",
    body: [...clientMode],
  },
];
