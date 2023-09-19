import { chooseApi } from '@/pages/app/datasource/util/apiHandle';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";
import './index.less';
export const chooseApiDialog = {
  title: '选择API服务',
  className: 'dialog-api-serve',
  actions: [
    {
      type: 'button',
      actionType: 'link',
      label: '提取',
      // 选中api源 并且 选中 api方可放开
      // 没有选中api 不放开
      disabledOn: '${OR(api_id === "",api_id == undefined)}',
      level: 'primary',
      link: '/app/datasource/model/create/api/info?appId=${appId}&biz=api&source_id=${service_id}&api_id=${api_id}&subPage=true',
    },
  ],
  body: {
    type: 'form',
    data: {
      service_id: '${id}',
      appId: '${appId}',
    },
    initApi: {
      method: 'post',
      url: '/api/def/model/pages?_=apiSourceSelect',
      data: {
        pageNum: '1',
        appId: '${appId}',
        pageSize: '100',
        categories: [1012],
        state: '1',
      },
      adaptor: function (payload: any) {
        if(beforeHandle(payload)){
          let items = payload.data.data;
          if (!Array.isArray(items)) {
            return {
              data: [],
            };
          }
          let options:any = [];
          items.forEach((item) => {
            let obj = { label: item.displayName, value: item.id };
            options.push(obj);
          });
          let hasSource = 0;
          if (options.length > 0) {
            hasSource = 1;
          }
          return {
            data: {
              hasSource: hasSource,
              options: options,
            },
          };
        }
        return errorHandle(payload);
      },
    },
    body: [
      {
        type: 'hidden',
        name: 'hasSource',
      },
      {
        type: 'tpl',
        hiddenOn: 'this.hasSource === 1',
        className: 'tpl-api-source',
        tpl: '还没有服务源，请先<a href="/app/datasource/api?appId=${appId}"/>创建API源<a/>',
      },
      {
        label: 'API服务源',
        hiddenOn: 'this.hasSource === 0',
        type: 'input-group',
        body: [
          {
            type: 'select',
            name: 'service_id',
            size: 'lg',
            required: true,
            value: '',
            source: '$options',
          },
        ],
      },
      {
        label: 'API服务',
        type: 'input-group',
        hiddenOn: 'this.service_id === ""',
        body: [
          {
            label: '选择api服务',
            type: 'select',
            required: true,
            size: 'lg',
            labelClassName: 'text-muted',
            name: 'api_id',
            value: '',
            source: {
              method: 'get',
              url: '/api/def/model/field/list?modelId=${service_id}&appId=${appId}',
              adaptor: function (payload:any, response:any, api:any) {
                let appId = api.query.appId;
                return chooseApi(api, payload, appId);
              },
            },
            initFetchOn: 'this.service_id',
          },
        ],
      },
      {
        type: 'flex',
        justify: 'space-between',
        items: [
          {
            type: 'button',
            actionType: 'link',
            level: 'link',
            className: 'btn-api-link',
            hiddenOn: '${OR(service_id === "" , api_id != "")}',
            //app/datasource/api/list?modelId=356552036294279168&appId=354015102967689216&biz=api&source_id=356552036294279168&api_id=&displayName=ChinaolyAuthApiSource&auth_type=chinaoly
            link: '/app/datasource/api/list?appId=${appId}&modelId=${service_id}&source_id=${service_id}',
            label: '创建API服务接口',
          },
        ],
      },
    ],
  },
};
