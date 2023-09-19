import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';

/**
 * 跨应用实体关系创建
 */
export default function () {
  const schema: SchemaNode = {
    type: 'page',
    title: '跨应用实体关系创建（源实体属性和目标实体属性类型要一致，切记，切记）',
    data: {
      items: [],
    },
    body: [
      {
        type: 'form',
        mode: 'horizontal',
        api: {
          method: 'post',
          url: '/api/def/model/relation/save',
          data: {
            relType: '${relType}',
            sourceModelId: '${sourceModelId}',
            targetModelId: '${targetModelId}',
            sourceFieldId: '${sourceFieldId}',
            targetFieldId: '${targetFieldId}',
          },
        },
        body: [
          {
            type: 'group',
            body: [
              {
                label: '源应用',
                type: 'select',
                required: true,
                searchable: true,
                name: 'sourceAppId',
                source: {
                  method: 'post',
                  url: '/api/graphql',
                  graphql: 'query{find_sys_app(obj:{state:1}){id app_name}}',
                  responseData: {
                    items: '${find_sys_app|pick:label~app_name,value~id}',
                  },
                },
              },
              {
                label: '源实体',
                type: 'select',
                initFetchOn: 'this.sourceAppId',
                required: true,
                searchable: true,
                name: 'sourceModelId',
                source: {
                  method: 'post',
                  url: '/api/def/model/pages?_=modelSelect&_sourceAppId=${sourceAppId}',
                  data: {
                    appId: '${sourceAppId}',
                    pageNum: 1,
                    pageSize: 10000,
                    state: 1,
                    categories:
                      '${IF(sourceAppId=="396681748983001088",[30, 102012, 101110, 102013], [30])}', // [30, 102012, 101110, 102013],
                  },
                  responseData: {
                    items: '${data|pick:label~displayName,value~id}',
                  },
                },
              },
              {
                label: '源实体属性',
                searchable: true,
                required: true,
                type: 'select',
                initFetchOn: 'this.sourceModelId',
                name: 'sourceFieldId',
                source: {
                  method: 'get',
                  url: '/api/def/model/complete/info?modelId=${sourceModelId}',
                  adaptor:function (payload:any){
                    let fields = payload.data.fields
                    let items = fields.map((item:any)=>{return {
                      label: item.displayName + "("+  item.typeName + ")",
                      value: item.id
                    }});
                    return {
                      items: items
                    }
                  }
                },
              },
            ],
          },
          // 目标
          {
            type: 'group',
            body: [
              {
                label: '目标应用',
                type: 'select',
                required: true,
                searchable: true,
                name: 'targetAppId',
                source: {
                  method: 'post',
                  url: '/api/graphql',
                  graphql: 'query{find_sys_app(obj:{state:1}){id app_name}}',
                  responseData: {
                    items: '${find_sys_app|pick:label~app_name,value~id}',
                  },
                },
              },
              {
                label: '目标实体',
                type: 'select',
                initFetchOn: 'this.targetAppId',
                required: true,
                searchable: true,
                name: 'targetModelId',
                source: {
                  method: 'post',
                  url: '/api/def/model/pages?_=modelSelect&_sourceAppId=${targetAppId}',
                  data: {
                    appId: '${targetAppId}',
                    pageNum: 1,
                    pageSize: 10000,
                    state: 1,
                    categories: [30], // [30, 102012, 101110, 102013],
                  },
                  responseData: {
                    items: '${data|pick:label~displayName,value~id}',
                  },
                },
              },
              {
                label: '目标实体属性',
                searchable: true,
                required: true,
                type: 'select',
                initFetchOn: 'this.targetModelId',
                name: 'targetFieldId',
                source: {
                  method: 'get',
                  url: '/api/def/model/complete/info?modelId=${targetModelId}',
                  adaptor: function (payload: any) {
                    let items = payload.data.fields.filter((item: any) => {
                      return (
                        item.primary === 1 ||
                        (item.nonDefault === 1 &&
                          (item.typeName === 'Long' ||
                            item.typeName === 'Int' ||
                            item.typeName === 'String'))
                      );
                    });
                    items = items.map((item: any) => {
                      return { label: item.displayName, value: item.id };
                    });
                    return { items };
                  },
                },
              },
            ],
          },
          //
          {
            type: 'group',
            body: [
              {
                type: 'radios',
                name: 'relType',
                label: '实体关系',
                required: true,
                options: [
                  { label: '一对一', value: 1 },
                  { label: '一对多', value: 2 },
                  { label: '多对多', value: 3 },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  return <AmisRenderer schema={schema} />;
}
