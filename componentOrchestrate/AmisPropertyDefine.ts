
import axios from 'axios';
import { render as renderAmis } from '@fex/amis';


export const Define = {

  amisTextNode: [
    {
      "type": "textarea",
      "name": "value"
    }],

  amisUploadFileNode: {
    "type": "input-file",
    "id":"input-file",
    "label": "该参数可能为上传文件类型，你可以上传测试文件提供示例值",
    "name": "file",
    "level": "primary",
    "accept": "*",
    "receiver": {
      "url": "/api/component/execute",
      "method": "post",
      "headers": {
        "xw-action": "eg_f26c_submit_file_action",
        "xw-component": "eg_f26c_component_debug_plugin",
        "xw-appId": "${appId}",
        "xw-flat": 1,
        "xw-debug": 1,
        "xw-file-debug": 1
      },
      "data": {}
    },
    "autoFill": {
      "value": "${multipartFileSchema || value}"
    }
  },

  tplNode: {
    "type": "tpl",
    "tpl": "当前属性关联“${item.serialNumber}”的“${item.title}”，可使用链式方法读取内部数据"
  },
  jsonSchemaNode: (schema: any) => {
    return {
      "type": "json-schema",
      "name": "value",
      "schema": schema,
      "value": "${value|toJson}"
    }
  },

  jsonViewNode: (schema: any) => {

    return {
      "type": "json",
      "name": "schema",
      "value": schema,
      "levelExpand": 10,
      // "mutable": true
    }
  },

  // {
  //   "name": "inputSchema",
  //   "type": "editor",
  //   "language": "json",
  //   "value": "${schema}"
  // }

  jsonEditorNode: [

    {
      "name": "value",
      "type": "editor",
      "language": "json",
      "options": {
        "lineNumbers": "off"
      },
      // "value": "${value}"
    }, {
      "type": "page",
      "body": "JSON（JavaScript Object Notation, JS对象简谱）是一种轻量级的数据交换格式，在组件编排过程中，JAVA对象等信息也将被转译为JSON格式，方便数据处理"
    }],

  isJson: (json: any) => {

    if (typeof json == 'object') {
      return true;
    }

    try {
      if (typeof JSON.parse(json) == 'object') {
        return true;
      }

    } catch (e) {
    }
    return false;
  },

  isAmisValueJson: (amisValue: any, valueType: string) => {

    let isJson = false;
    try {
      isJson = amisValue.parentKey == 'static' && (valueType == 'object' || typeof JSON.parse(amisValue.value) == 'object')
    } catch (e) {
    }
    return isJson;
  },


  parseSchema: (amisSchema: any) => {
    return amisSchema ? (typeof (amisSchema) == 'string' ? JSON.parse(amisSchema) : amisSchema) : null;
  },

  fetcher: ({
    url, // 接口地址
    method, // 请求方法 get、post、put、delete
    data, // 请求数据
    responseType,
    config, // 其他配置
    headers // 请求头
  }: any) => {
    config = config || {};
    config.withCredentials = true;
    responseType && (config.responseType = responseType);

    if (config.cancelExecutor) {
      config.cancelToken = new (axios as any).CancelToken(
        config.cancelExecutor
      );
    }

    config.headers = headers || {};

    if (method !== 'post' && method !== 'put' && method !== 'patch') {
      if (data) {
        config.params = data;
      }

      return (axios as any)[method](url, config);
    } else if (data && data instanceof FormData) {
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'multipart/form-data';
    } else if (
      data &&
      typeof data !== 'string' &&
      !(data instanceof Blob) &&
      !(data instanceof ArrayBuffer)
    ) {
      data = JSON.stringify(data);
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'application/json';
    }

    return (axios as any)[method](url, data, config);
  },

  getAmisRender: (_schema: any, amisValue: any) => {

    console.debug('amisValue', amisValue);
    return renderAmis(_schema, {
      data: { item: amisValue, value: amisValue.key }
    },
      {
        fetcher: Define.fetcher
      })
  },

  isDeprecated: (title: string) => {
    console.log('title', title);
    return title.indexOf('弃用') >= 0 || title.indexOf('废弃') >= 0
  },

  isExclude: (title: any) => {
    return Define.isDeprecated(title);
  },


  getAmisServiceSchema: (_schema: any, _tranform: any, _customBtnSchema: any) => {
    console.log('typeof(_schema)', typeof (_schema), _schema instanceof Array);
    if (!(_schema instanceof Array)) {
      _schema = [_schema]

    }


    console.debug('schema', _schema);


    return {
      "type": "form",
      "id": "form_data",
      "title": "",
      "wrapWithPanel": false,
      "debug": false,
      body: {
        "type": "container",
        "data": {},
        "body": [
          ..._schema,
          _customBtnSchema
        ]
      }

    }
  },
  getAmisServiceRender: (_schema: any, _tranform: any, amisValue: any, _reactBtn: any) => {
    return Define.getAmisRender(Define.getAmisServiceSchema(_schema, _tranform, _reactBtn), amisValue)
  },

  getAmisValue: (value: any) => {
    return value.length > 0 ? { ...value[value.length - 1], value: value[value.length - 1]['key'] } : { node: "static", parentKey: "static" };

  },

  getAmisDataValue: (data: any) => {
    return data.value || (data.item ? data.item.value : undefined);

  },

  groovySupportError: '引用节点输出作为参数，暂不支持Groovy复杂处理，只支持链式属性读取，如 data.name，表示读取输出节点data属性下的name属性',
  confirmName: '确认',
  settingName: '配置',
  errorJson: '不是有效的JSON格式',
  jsonEditName: 'Json编辑器',
  fileUploadName: '测试文件上传',
  jsonSchemaEditName: '结构化编辑',
  schemaEditViewName: '属性定义',
  textEditName: '文本编辑',
  propertyEditName: '属性辅助编辑器',
  // nodeSettingNotice: '如需绑定其它节点的输出，请从输入参数关联的左侧面板选择点击绑定。',
  nodeSettingNotice: '如需绑定其它节点的输出，请从关联的左侧变量面板选择。',
  inSettingNotice: '全局输入设置，示例值将做为节点测试的模拟输入数据'
}
