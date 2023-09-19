import { apiHeaderForm } from '@/pages/app/datasource/api/apiHeader';
import { paramColumns } from '@/pages/app/datasource/api/params';
import { apiBodyForm } from '@/pages/app/datasource/model/create/step_2_api_header';
import './index.less';
// 添加服务接口表单
export const addServiceForm = [
  {
    type: 'hidden',
    name: 'id',
  },
  {
    type: 'hidden',
    name: 'appId',
  },
  {
    type: 'hidden',
    name: 'modelId',
  },
  {
    type: 'hidden',
    name: 'display',
    value: 1,
  },
  {
    label: '服务名称:',
    type: 'input-text',
    name: 'showName',
    className: 'server-name',
    required: true,
    validations: {
      maxLength: 20,
    },
    validationErrors: {
      maxLength: '长度超出限制，请输入小于20字的名称',
    },
  },
  {
    type: 'hidden',
    name: 'modelId',
  },
  {
    type: 'group',
    mode: 'horizontal',
    body: [
      {
        label: '服务地址:',
        type: 'input-group',
        className: 'methods-group',
        name: 'url',
        required: true,
        body: [
          {
            label: false,
            type: 'select',
            name: 'method',
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
            required: true,
            validations: {
              matchRegexp:
                '/^((https|http)?:\\/\\/)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/',
            },
            validationErrors: {
              matchRegexp: '请输入正确的url',
            },
            placeholder: 'https://',
            name: 'url',
          },
        ],
      },
    ],
  },
  {
    label: false,
    type: 'group',
    body: [
      {
        type: 'tabs',
        className: 'header-tabs',
        tabsMode: 'radio',
        tabs: [
          {
            title: '查询参数',
            body: {
              label: false,
              type: 'input-table',
              name: 'params',
              addable: true,
              editable: true,
              removable: true,
              needConfirm: false,
              columns: paramColumns,
            },
          },
          {
            title: 'Header',
            body: apiHeaderForm,
          },
          {
            title: 'Body',
            body: apiBodyForm,
          },
        ],
      },
    ],
  },
  {
    label: '返回结果',
    type: 'json-editor',
    disabled: true,
    name: 'responseBody',
    placeholder: '测试连接后,此处将展示返回结果',
    required: true,
  },
];
