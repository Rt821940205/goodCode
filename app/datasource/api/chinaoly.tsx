import './index.less';
export const chinaolyFormItems = [
  {
    type: 'input-text',
    required: true,
    name: 'authUrl',
    validations: {
      matchRegexp: '/^((https|http)?:\\/\\/)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/',
    },
    validationErrors: {
      matchRegexp: '请输入正确的url',
    },
    label: 'authUrl: ',
    placeholder: 'https://',
  },
  {
    type: 'input-text',
    required: true,
    name: 'appKey',
    label: 'appKey: ',
  },
  {
    type: 'input-text',
    name: 'appSecret',
    required: true,
    label: 'appSecret: ',
  },
];
export const wyyFormItems = [
  {
    type: 'input-text',
    required: true,
    name: 'accessId',
    label: 'accessId: ',
  },
  {
    type: 'input-text',
    name: 'privateKey',
    required: true,
    label: 'privateKey: ',
  },
];
