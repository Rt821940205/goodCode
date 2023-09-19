// action 编辑表单
import { SchemaNode } from '@fex/amis/lib/types';
import './index.less';
import {modelComponentActionAdd} from "@/pages/app/model/manage/Setting/modelComponentAction";
export const modelActionBody = [
  {
    type: 'hidden',
    name: 'id',
  },
  {
    type: 'hidden',
    name: 'modelId',
  },
  {
    type: 'input-text',
    name: 'name',
    validations: {
      matchRegexp: '/^(?!_)(?!.*?_$)[a-zA-Z][a-zA-Z0-9_]*$/',
      maxLength: 20,
    },
    validationErrors: {
      matchRegexp: '请以英文字母开头，只能包含英文字母、数字、下划线,不能以下划线开头和结尾',
      maxLength: '长度超出限制，请输入小于20字的名称',
    },
    placeholder: '请以英文字母开头，只能包含英文字母、数字、下划线,不能以下划线开头和结尾',
    label: '行为名称:',
    required: true,
  },
  {
    type: 'input-text',
    name: 'displayName',
    validations: {
      maxLength: 20,
    },

    validationErrors: {
      maxLength: '长度超出限制，请输入小于20字的名称',
    },
    placeholder: '请输入一个长度小于20的名称',
    label: '显示名:',
    required: false,
  },
  {
    type: 'select',
    name: 'actionType',
    label: '行为类型:',
    required: true,
    value: '${actionType}',
    options: [
      {
        label: '查询',
        value: 'onQuery',
      },
      {
        label: '执行',
        value: 'ScriptAction',
      },
    ],
  },
  {
    type: 'select',
    name: 'returnType',
    label: '返回类型:',
    required: true,
    options: [
      {
        label: '当前实体',
        value: '当前实体',
      },
    ],
  },
  {
    type: 'radios',
    name: 'nonList',
    label: '返回数组:',
    disabled: true,
    value: false,
    options: [
      {
        label: '是',
        value: false,
      },
      {
        label: '否',
        value: true,
      },
    ],
  },
  {
    type: 'input-text',
    name: 'order',
    label: '排序号:',
  },
  {
    type: 'input-text',
    name: 'code',
    label: '方法名:',
  },
  {
    type: 'textarea',
    name: 'codeFile',
    label: '脚本:',
  },
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
    label: '行为描述:',
  },
];

/**
 * 实体action 添加
 */
export const modelActionAdd = {
  type: 'form',
  api: {
    method: 'post',
    url: '/api/def/model/action/save',
    adaptor: function (payload: any) {
      let data = payload.data;
      return {
        data: data,
      };
    },
  },
  reload: 'actionsForm',
  data: {
    name: '',
    actionType: '',
    displayName: '',
    description: '',
    nonList: false,
    returnType: '$modelName',
    modelId: '$id',
    id: '',
  },
  mode: 'horizontal',
  body: modelActionBody,
};

/**
 * 实体action 编辑
 */
export const modelActionEdit: SchemaNode = {
  type: 'form',
  api: {
    method: 'post',
    url: '/api/def/model/action/save',
    requestAdaptor: function (api: any) {
      let modelId = api.data.modelId;
      let returnType = api.data.name;
      return {
        ...api,
        data: {
          modelId: modelId,
          ...api.data,
          returnType: returnType,
        },
      };
    },
    adaptor: function (payload: any) {
      let data = payload.data;
      return {
        data: data,
      };
    },
    reload: 'actionsForm',
  },
  mode: 'horizontal',
  body: modelActionBody,
};

/**
 * action 列表
 */
export const modelActionsForm: SchemaNode = {
  type: 'crud',
  columnsTogglable: false,
  api: {
    url: '/api/def/model/complete/info?modelId=${modelId}',
    method: 'get',
    adaptor: function (payload: any) {
      let actions = payload.data.actions;
      actions.forEach((item:any) => {
        item.returnType = '当前实体';
      });
      let modelId = payload.data.id;
      let modelName = payload.data.modelName;
      console.log('=================' + actions);
      return {
        items: actions,
        modelId: modelId,
        modelName: modelName,
      };
    },
  },
  syncLocation: false,
  headerToolbar: [
    {
      type: 'dropdown-button',
      label: '添加行为',
      level: 'primary',
      // iconOnly: true,
      // closeOnClick: true, 该属性会导致react渲染异常报错
      // closeOnOutside: true, 该属性会导致react渲染异常报错
      align: 'right',
      menuClassName: 'chinaoly-dropdown-menu',
      btnClassName: 'chinaoly-dropdown-button',
      buttons: [
        {
          type: 'button',
          actionType: 'dialog',
          label: '添加行为',
          level: 'primary',
          dialog: {
            title: '添加实体行为',
            body: modelActionAdd,
          },
        },
        {
          type: 'button',
          actionType: 'dialog',
          label: '绑定组件行为',
          level: 'primary',
          dialog: {
            title: '绑定组件行为',
            body: modelComponentActionAdd,
          }
        }
      ],
    }
  ],
  name: 'actionsForm',
  columns: [
    {
      name: 'id',
      type: 'hidden'
    },
    {
      name: 'displayName',
      label: '行为名',
    },
    {
      name: 'actionType',
      label: '行为类型',
    },
    {
      name: 'returnType',
      label: '返回类型',
    },
    {
      name: 'nonList',
      label: '是否返回数组',
      type: 'status',
      map: {
        0: 'fa fa-check-circle',
        1: 'fa fa-times-circle',
      },
      labelMap: {
        0: '是',
        1: '否',
      },
    },
    {
      name: 'description',
      label: '行为描述',
      showCounter: true,
      maxLength: 500,
      validations: {
        maxLength: 500,
      },
      validationErrors: {
        maxLength: '长度应该小于500',
      },
      width: 'string',
    },
    {
      type: 'operation',
      label: '操作',
      width:"7.5rem",
      buttons: [
        {
          label: '编辑',
          type: 'button',
          level: 'link',
          disabledOn: '${nonDefault === false}',
          actionType: 'dialog',
          dialog: {
            title: '编辑实体行为',
            body: modelActionEdit,
          },
        },
        {
          label: '删除',
          type: 'button',
          level: 'link',
          disabledOn: '${nonDefault === false}',
          actionType: 'dialog',
          dialog: {
            title: '系统消息',
            body: [
              '你确认要删除[${displayName}]行为吗？',
              {
                type: 'form',
                title: '',
                api: {
                  url: '/api/def/model/action/delete',
                  method: 'post',
                  adaptor: function (payload: any) {
                    let code = payload.code;
                    return {
                      code: code,
                    };
                  },
                },
                body: [
                  {
                    type: 'hidden',
                    name: 'id',
                  },
                  {
                    type: 'hidden',
                    name: 'modelId',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  ],
};
