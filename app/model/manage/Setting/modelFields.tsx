import {apiFieldList} from '@/pages/app/model/manage/Setting/apiModelFields';
import {jdbcFieldList} from '@/pages/app/model/manage/Setting/jdbcModelFields';
import {componentFieldList} from '@/pages/app/model/manage/Setting/componentFieldList';
import {SchemaNode} from '@fex/amis/lib/types';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";
import './index.less'
// import {getRelation, getSystemProp} from "@/pages/app/entityMange/entityCreate/step_two";
// import '../../../../app/entityMange/entityCreate/step_two.less'

/**
 * 实体属性下拉列表
 */
export const modelFieldsTypeSelect = {
  label: '类型:',
  type: 'select',
  name: 'typeName',
  mode: 'horizontal',
  searchable: true,
  sortable: true,
  value: 'String',
  options: [
    {
      label: '数字',
      value: 'Long',
    },
    {
      label: '小数',
      value: 'Float',
    },
    {
      label: '日期',
      value: 'Date',
    },
    {
      label: '时间',
      value: 'Timestamp',
    },
    {
      label: '布尔',
      value: 'Boolean',
    },
    {
      label: '文本',
      value: 'String',
    },
    {
      label: '大文本',
      value: 'Longtext',
    },
  ],
};

/**
 * 模型属性表单body
 */
export const modelFieldFormBody = [
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
    label: '显示名:',
    required: true,
    mode: 'horizontal',
    validations: {
      maxLength: 20,
    },

    validationErrors: {
      maxLength: '长度超出限制，请输入小于20字的名称',
    },
    type: 'input-text',
    name: 'displayName',
  },
  {
    name: 'notNull',
    type: 'radios',
    mode: 'horizontal',
    required: true,
    label: '非空:',
    value: 0,
    options: [
      {
        label: '是',
        value: 1,
      },
      {
        label: '否',
        value: 0,
      },
    ],
  },
  modelFieldsTypeSelect,
  {
    label: '默认值:',
    mode: 'horizontal',
    hiddenOn: 'this.typeName != "String"',
    value: '',
    type: 'input-text',
    name: 'defaultValue',
  },
  {
    label: '默认值:',
    mode: 'horizontal',
    hiddenOn: 'this.typeName != "Longtext"',
    value: '',
    type: 'input-text',
    name: 'defaultValue',
  },
  {
    label: '默认值:',
    mode: 'horizontal',
    hiddenOn: 'this.typeName != "Boolean"',
    options: [
      {
        label: 'true',
        value: true,
      },
      {
        label: 'false',
        value: false,
      },
    ],
    value: '',
    type: 'select',
    name: 'defaultValue',
  },
  {
    label: '默认值:',
    hiddenOn: 'this.typeName != "Int"',
    mode: 'horizontal',
    value: 0,
    type: 'input-number',
    name: 'defaultValue',
  },
  {
    label: '默认值:',
    mode: 'horizontal',
    hiddenOn: 'this.typeName != "Float"',
    value: 0.0,
    type: 'input-number',
    precision: '${precision}',
    name: 'defaultValue',
  },
  {
    label: '默认值:',
    mode: 'horizontal',
    hiddenOn: 'this.typeName != "Date"',
    type: 'input-date',
    name: 'defaultValue',
  },
  {
    label: '默认值:',
    mode: 'horizontal',
    hiddenOn: 'this.typeName != "Timestamp"',
    type: 'input-datetime',
    name: 'defaultValue',
  },
  {
    label: '精度:',
    required: true,
    mode: 'horizontal',
    type: 'input-number',
    hiddenOn: 'this.typeName != "Float"',
    name: 'precision',
    value: 2,
    min: 1,
    max: 6,
    onChange: function (newValue: any, oldValue: any, props: any) {
      if (newValue != '' && newValue != undefined) {
        let defaultValue = props.form.getValueByName('defaultValue');
        let defaultValueNum = Number(defaultValue);
        if (defaultValue != '' && defaultValue != undefined) {
          props.form.setValueByName('defaultValue', defaultValueNum.toFixed(newValue));
        }
      }
    },
  },
  {
    label: '长度:',
    required: true,
    mode: 'horizontal',
    type: 'input-number',
    hiddenOn: 'this.typeName != "String"',
    name: 'length',
    value: 200,
    min: 20,
    max: 2000,
  },
  {
    label: '描述:',
    mode: 'horizontal',
    type: 'textarea',
    showCounter: true,
    maxLength: 500,
    validations: {
      maxLength: 500,
    },
    validationErrors: {
      maxLength: '长度应该小于500',
    },
    name: 'description',
  },
];

/**
 * 模型属性编辑
 */
export const modelFieldEdit = {
  type: 'form',
  promptPageLeave: true,
  api: {
    method: 'post',
    url: '/api/def/model/field/save?_=modelFieldsEdit',
    adaptor: function (payload: any) {
      let data = payload.data;
      return {
        data: data,
      };
    },
  },
  reload: 'fieldsForm',
  body: modelFieldFormBody,
};

/**
 * 实体属性添加表单
 */
export const modelFieldAdd = {
  type: 'form',
  size: 'md',
  promptPageLeave: true,
  messages: {
    saveSuccess: '属性添加成功',
  },
  api: {
    method: 'post',
    url: '/api/def/model/field/save?_=modelFieldsAdd',
    adaptor: function (payload: any) {
      if (beforeHandle(payload)) {
        return {
          data: payload.data,
        };
      }
      return errorHandle(payload);
    },
  },
  reload: 'customFieldsForm',
  data: {
    name: '',
    displayName: '',
    localName: '',
    description: '',
    modelId: '$modelId',
    id: '',
  },
  body: modelFieldFormBody,
};

export function buildFieldsForCRUDForm(items: any[], field: any) {
  items.push({
    name: field.name,
    bizNo: field.bizNo,
    defaultValue: field.defaultValue,
    displayName: field.displayName,
    description: field.description,
    displayOrder: field.displayOrder,
    foreign: field.foreign,
    id: field.id,
    indexed: field.indexed,
    length: field.length,
    localName: field.localName,
    modify: field.modify,
    notNull: field.notNull,
    primary: field.primary,
    sampleVal: field.sampleVal,
    show: field.show,
    state: field.state,
    typeName: field.typeName,
    unique: field.unique,
    val: field.typeName,
    nonDefault: field.nonDefault,
  });
}

/**
 * 实体属性列表表单
 */
export const modelFieldList = [
  {
    type: 'flex',
    justify: 'space-between',
    className: 'flex-title',
    items: [
      { type: 'tpl', tpl: '系统属性' },
      {
        type: 'container',
        body: [
          {
            label: '添加属性',
            type: 'button',
            className: 'btn-step-add',
            actionType: 'dialog',
            dialog: {
              title: '实体属性添加',
              size: 'lg',
              className: 'dialog-cancel-button',
              body: [modelFieldAdd],
            },
          },
          {
            label: '添加关系',
            type: 'button',
            className: 'btn-step-add',
            actionType: 'dialog',
            dialog: {
              title: '添加关系',
              className: 'dialog-cancel-button',
              body: {
                type: 'form',
                title: '添加关系',
                name: 'relationship_add',
                api: {
                  method: 'post',
                  url: '/api/def/model/relation/save?_=relAdd',
                  requestAdaptor: function (api: any) {
                    let sourceModel = api.data.modelId;
                    let target = api.data.target;
                    let target_attribute = api.data.target_attribute;
                    let attribute = api.data.attribute;
                    let relType = api.data.relType;
                    return {
                      ...api,
                      data: {
                        relType: relType,
                        sourceModelId: sourceModel,
                        targetModelId: target,
                        sourceFieldId: attribute,
                        targetFieldId: target_attribute,
                      },
                    };
                  },
                  adaptor: function (payload: any) {
                    if (beforeHandle(payload)) {
                      return {
                        data: payload.data,
                      };
                    }
                    return errorHandle(payload);
                  },
                },
                reload: 'relForm',
                size: 'md',
                body: [
                  {
                    name: 'modelId',
                    type: 'hidden',
                  },
                  {
                    label: '本实体属性',
                    mode: 'horizontal',
                    searchable: true,
                    required: true,
                    type: 'select',
                    size: 'md',
                    name: 'attribute',
                    source: {
                      method: 'get',
                      url: '/api/def/model/complete/info?modelId=${modelId}',
                      adaptor: function (payload: any) {
                        let list = payload.data.fields;
                        let items = list
                          .filter((item: any) => {
                            return item.primary == 1;
                          })
                          .map((item: any) => {
                            return { label: item.displayName, value: item.id };
                          });
                        return {
                          items: items,
                        };
                      },
                    },
                  },
                  {
                    label: '目标实体',
                    mode: 'horizontal',
                    type: 'select',
                    size: 'md',
                    required: true,
                    searchable: true,
                    value: '',
                    name: 'target',
                    id: 'target',
                    source: {
                      method: 'post',
                      url: '/api/def/model/pages?_=modelSelect',
                      requestAdaptor: function (api: any) {
                        let appId = api.data.appId;
                        let pageNum = 1;
                        let pageSize = 100;
                        let state = 1;
                        let category = api.data.category;
                        let categories = [30];
                        if (category !== '') {
                          categories = [Number(category)];
                        }
                        return {
                          ...api,
                          data: {
                            appId: appId,
                            pageNum: pageNum,
                            pageSize: pageSize,
                            state: state,
                            categories: categories,
                          },
                        };
                      },
                      adaptor: function (payload: any) {
                        let list = payload.data.data;
                        let items = list
                          .filter((item: any) => {
                            return item != null;
                          })
                          .map((item: any) => {
                            return { label: item.displayName, value: item.id };
                          });
                        let total = payload.data.total;
                        return {
                          items: items,
                          hasTarget: true,
                          total: total,
                        };
                      },
                    },
                  },
                  {
                    label: '目标属性',
                    mode: 'horizontal',
                    hiddenOn: 'this.target === ""',
                    searchable: true,
                    type: 'select',
                    initFetchOn: 'this.target',
                    value: '',
                    size: 'md',
                    required: true,
                    name: 'target_attribute',
                    source: {
                      method: 'get',
                      url: '/api/def/model/complete/info?modelId=${target}&hasTarget=${hasTarget}',
                      adaptor: function (payload: any) {
                        let list = payload.data.fields;
                        let items = list
                          .filter((item: any) => {
                            return (
                              item.primary === 1 ||
                              (item.nonDefault === 1 &&
                                (item.typeName === 'Long' ||
                                  item.typeName === 'Int' ||
                                  item.typeName === 'String'))
                            );
                          })
                          .map((item: any) => {
                            return { label: item.displayName, value: item.id };
                          });
                        return {
                          items: items,
                        };
                      },
                    },
                  },
                  {
                    type: 'radios',
                    name: 'relType',
                    label: '实体关系',
                    required: true,
                    value: 1,
                    options: [
                      {
                        label: '一对一',
                        value: 1,
                      },
                      {
                        label: '一对多',
                        value: 2,
                      },
                      {
                        label: '多对多',
                        value: 3,
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  },
  // getSystemProp('systemFieldsForm','loadSysFields'),
  {
    type: 'static',
    value: '自定义属性',
  },
  // getSystemProp('customFieldsForm','loadFields'),
  {
    type: 'static',
    value: '关系',
  },
  // getRelation()
];
/**
 * 实体属性表单
 */
export const modelFieldsForm: SchemaNode = {
  type: 'page',
  data: {
    modelId: '${modelId}',
  },
  body: [
    {
      type: 'grid',
      hiddenOn: 'this.category != 30',
      columns: [
        {
          body: modelFieldList,
        },
      ],
    },
    {
      type: 'grid',
      hiddenOn: 'this.category != 101210',
      columns: [
        {
          body: [
            // api实体 101210 source_id api_id
            apiFieldList,
          ],
        },
      ],
    },
    {
      type: 'grid',
      hiddenOn: 'this.category != 101610',
      columns: [
        {
          body: [
            // jdbc实体 101610 source_id tableName
            jdbcFieldList,
          ],
        },
      ],
    },
    {
      type: 'grid',
      hiddenOn: 'this.category != 101020',
      columns: [
        {
          body: [componentFieldList],
        },
      ],
    },
  ],
};
