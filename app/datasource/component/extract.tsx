import AmisRenderer from '@/components/AmisRenderer';
import {history} from '@@/core/history';
import {SchemaNode} from '@fex/amis/lib/types';
import {component_field_mapping} from "@/pages/app/datasource/component/componentFields";
import {ModelField, modelFieldCategory} from "@/pages/app/datasource/util/modelField";

/**
 * 组件提取实体保存页面实体及属性
 */
export default function () {
  const {query = {}} = history.location;
  const {appId} = query;
  const schema: SchemaNode = {
    type: 'page',
    title: '组件提取实体信息',
    body: {
      type: 'form',
      title: '',
      api: {
        method: 'post',
        url: '/api/def/model/complete/save',
        requestAdaptor: function (api: any) {
          const {displayName, description} = api.data;
          let fields = buildComponentFields(api, appId);
          if (fields.length === 0) {
            return {
              status: 2,
              msg: '请刷新重试',
            };
          }
          return {
            ...api,
            data: {
              appId: appId,
              displayName: displayName,
              localName: displayName,
              description: description,
              generate: true,
              add: true,
              fields: fields,
              name: api.data.name,
              status: 1,
              display: true,
              category: 101020,
            },
          };
        },
        adaptor: function (payload: any, response: any, api: any) {
          if (payload.code === 500) {
            return {
              status: payload.code,
              msg: '实体生成失败',
            };
          }
          history.replace('/app/entityMange/entityMange?appId=' + appId);
          return {
            data: {
              ...payload.data,
              add: api.data.add,
            },
          };
        },
      },
      body: component_field_mapping

    },
  };
  return <AmisRenderer schema={schema}/>;
}


export function buildComponentFields(api:any, appId:any){
  let fields = [];
  const {modelId, columns} = api.data;
  if (columns === undefined) {
    return fields;
  }

  for (let k in columns) {
    let column = new ModelField(modelFieldCategory.RESULT, '', modelId, appId);
    for (let f in columns[k]) {
      let value = columns[k][f];
      switch (f) {
        case 'name':
          column.setLocalName(value);
          column.setName(value);
          break;
        case 'displayName':
          column.setDisplayName(value);
          break;
        case 'typeName':
          column.setValueType(value);
          break;
        case 'id':
          column.id = value;
          break;
        case 'state':
          column.state = value;
          break;
        case 'category':
          column.category = value;
          break;
        case 'defaultValue':
          column.defaultValue = value;
          break;
        default:
          break;
      }
    }
    fields.push(column);
  }
  return fields;
}
