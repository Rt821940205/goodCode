/**
 * 组件行为参数列表
 */


import {isDefaultField} from '@/pages/component/Setting/component/ComponentHelper'


export function ModelInfoDialog(key: string) {
  return {
    type: 'page',
    initApi: {
      method: 'get',
      url: '/api/def/model/complete/info/key?key=' + key,
      adaptor: function (payload: any) {
        let data = payload.data;
        return {
          ...payload,
          data: {
            modelInfo: data,
            modelFields: data.fields.filter((f: any) => !isDefaultField(f.name) && f.category !=1),
          },
        };
      },
    },
    body: [
      {
        type: 'html',
        html: '<p><b>${modelInfo.displayName}</b> &nbsp;${modelInfo.description}</p>',
      },

      {
        type: 'table',
        source: '$modelFields',
        columns: [
          {
            name: 'name',
            label: '参数',
          },
          {
            name: 'defaultValue',
            label: '数据',
          },
          {
            name: 'typeName',
            label: '类型',
          },
          {
            name: 'displayName',
            label: '名称',
          },

          {
            name: 'description',
            label: '介绍',
          },
        ],
      },
      {
        visibleOn: '${modelInfo != null}',
        type: 'html',
        html: '<p>当前版本:${modelInfo.version}；元数据ID:${modelInfo.id}；元数据标识:${modelInfo.name}</p>',
      },
    ],
  };
}
