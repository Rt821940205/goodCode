import { jdbcTableSelectApi } from '@/pages/app/datasource/jdbc/jdbcSelect';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";
export const chooseJdbcTableDialog = {
  title: '选择数据表',
  actions: [
    {
      type: 'button',
      actionType: 'link',
      label: '提取',
      // 选中数据源 并且 选中 表方可放开
      // 没有选中数据表 不放开
      disabledOn: '${OR(table_id === "",table_id === undefined)}',
      level: 'primary',
      link: '/app/datasource/model/create/jdbc/info?appId=${appId}&biz=jdbc&source_id=${jdbc_id}&table_id=${table_id}&subPage=true',
    },
  ],
  body: {
    type: 'form',
    data: {
      jdbc_id: '${id}',
    },
    initApi: {
      method: 'post',
      url: '/api/def/model/pages?_=apiSourceSelect',
      data: {
        pageNum: '1',
        appId: '${appId}',
        pageSize: '100',
        categories: [1016],
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
    promptPageLeave: true,
    body: [
      {
        type: 'hidden',
        name: 'hasSource',
      },
      {
        type: 'tpl',
        hiddenOn: 'this.hasSource === 1',
        tpl: '还没有数据源，请先<a href="/app/datasource/jdbc?appId=${appId}"/>创建数据源<a/>',
      },
      {
        label: '数据源',
        type: 'input-group',
        hiddenOn: 'this.hasSource === 0',
        body: [
          {
            type: 'select',
            source: '$options',
            name: 'jdbc_id',
            size: 'lg',
            value: '',
            required: true,
          },
        ],
      },
      {
        label: '数据表',
        type: 'input-group',
        hiddenOn: 'this.jdbc_id === ""',
        body: [
          {
            label: '选择数据表',
            type: 'select',
            size: 'lg',
            required: true,
            labelClassName: 'text-muted',
            name: 'table_id',
            value: '',
            searchable: true,
            source: jdbcTableSelectApi,
            initFetchOn: 'this.jdbc_id',
          },
        ],
      },
    ],
  },
};
