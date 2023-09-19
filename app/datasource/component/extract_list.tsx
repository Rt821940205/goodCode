import AmisRenderer from '@/components/AmisRenderer';
import {history} from '@@/core/history';
import {SchemaNode} from '@fex/amis/lib/types';
import {beforeHandle, errorHandle} from '@/services/xuanwu/api';
import {configAction} from "@/pages/app/datasource/component/configAction";


//组件列表提取转化实体页面
export default function () {
  const {query = {}} = history.location;
  const {appId} = query;
  const schema: SchemaNode = {
    type: 'page',
    title: '',
    body: {
      type: 'crud',
      title: '',
      syncLocation: false,
      filter: filter(),
      api: {
        method: 'post',
        url: '/api/def/model/pages?_=components',
        requestAdaptor: function (api: any) {
          // 数据深拷贝
          const data = JSON.parse(JSON.stringify(api.data));
          data.pageSize = data.perPage;
          data.pageNum = data.page;
          //组件appId
          data.appId = '396320893233737728';
          data.categories = ['101016'];
          data.state = 1;
          return {...api, data};
        },
        adaptor: function (payload: any, response: any, api: any) {
          if (beforeHandle(payload)) {
            const {data, total} = payload.data
            data.forEach(e => {
              e.currentAppId = appId
            });
            return {items: data, total}
          }
          return errorHandle(payload);
        },
      },
      columns: [
        {
          name: 'id',
          width: 200,
          label: 'ID',
        },
        {
          name: 'displayName',
          label: '组件名',
        },
        {
          name: 'description',
          label: '说明',
        },
        {
          type: "button-group",
          label: "操作",
          buttons: [
            {
              type: 'button',
              label: '提取实体',
              level: "link",
              className: "text-danger",
              actionType: 'dialog',
              dialog: configAction,
            },
          ]
        }

      ],
    },
  };
  return <AmisRenderer schema={schema}/>;
}

// 搜索栏
const filter = () => {
  return {
    title: '',
    actions: [],
    className: 'search-row',
    body: [
      {
        type: 'input-text',
        name: 'name',
        label: '组件名称:',
        value: '',
        size: 'sm',
      },
      {
        type: 'reset',
        label: '重 置',
        className: 'btn-common',
        icon: 'fa fa-refresh',
      },
      {
        type: 'submit',
        label: '筛 选 ',
        className: 'btn-common',
        icon: 'fa fa-search',
      },
    ],
  }
}

