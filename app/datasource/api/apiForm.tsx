import { ApiSourceAddForm } from '@/pages/app/datasource/api/form';
import { buildFields } from '@/pages/app/datasource/util/apiHandle';
import { Constants } from '@/pages/app/datasource/util/modelField';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";
// import './index.less'

/**
 * edit form
 */
export const apiFormEdit = {
  type: 'form',
  promptPageLeave: true,
  // reload:'apiSourceForm',
  api: {
    method: 'post',
    url: '/api/def/model/complete/save?_=editApiForm',
    requestAdaptor: function (api: any) {
      let modelId = api.data.id;
      let timestamp = new Date().getTime();
      let name = 'apiSource__' + timestamp;
      let displayName = api.data.displayName;
      let appId = api.data.appId;
      let add = false;
      let fields = buildFields(api, modelId, appId, add);
      return {
        ...api,
        data: {
          ...api.data,
          localName: displayName,
          id: modelId,
          name: name,
          displayName: displayName,
          fields: fields,
        },
        fields: fields,
      };
    },
    adaptor: function (payload: any) {
      if(beforeHandle(payload)){
        return {
          data: payload.data,
        };
      }
      return errorHandle(payload);
    },
  },
  body: ApiSourceAddForm,
};

/**
 * form headerToolbar
 */
export const headerBar = [
  {
    type: 'button',
    actionType: 'dialog',
    label: '添加API源',
    level: 'primary',
    align: 'right',
    dialog: {
      title: '添加API源',
      className: 'dialog-api-serve',
      body: {
        type: 'form',
        promptPageLeave: true,
        reload: 'apiSourceForm',
        api: {
          method: 'post',
          url: '/api/def/model/complete/save',
          requestAdaptor: function (api: any) {
            console.log(api.data);
            let modelId = api.data.id;
            let appId = api.data.appId;
            let add = true;
            let fields = buildFields(api, modelId, appId, add);
            console.log('fields');
            console.log(fields);
            let timestamp = new Date().getTime();
            let name = Constants.ApiServiceDataPrefix + timestamp;
            let bizNo = Constants.ApiServiceDataPrefix + timestamp;
            return {
              ...api,
              data: {
                ...api.data,
                name: name,
                biz_no: bizNo,
                fields: fields,
              },
              fields: fields,
            };
          },
          adaptor: function (payload: any) {
            if(beforeHandle(payload)){
              return {
                data: payload.data,
              };
            }
            return errorHandle(payload);
          },
        },
        body: ApiSourceAddForm,
      },
    },
  },
];

// let serviceEditForm = {
//   type: "form",
//   actions:[],
//   reload:'apiSourceForm,apiDataForm',
//   api: {
//     method: 'post',
//     url: '/api/def/model/field/batch/add',
//     requestAdaptor: function (api) {
//       let modelId = api.data.id
//       let fields = buildApiSourceFields(api, modelId, appId)
//       return {
//         ...api,
//         data: {
//           fields
//         },
//       };
//     },
//     adaptor: function (payload: any) {
//       return {
//         data: payload.data
//       };
//     },
//   },
//   body: addServiceForm
// };

/**
 * form operations
 */
export const operation = {
  type: 'operation',
  label: '操作',
  buttons: [
    {
      label: '编辑',
      type: 'button',
      reload: 'apiSourceForm',
      actionType: 'dialog',
      dialog: {
        title: '编辑Api',
        reload: 'apiSourceForm',
        size: 'lg',
        body: apiFormEdit,
      },
    },
    {
      label: '删除',
      type: 'button',
      reload: 'apiSourceForm',
      level: 'danger',
      actionType: 'ajax',
      confirmText: '确认要删除该服务吗？',
      api: 'get:/api/def/model/real/delete?modelId=${id}',
    },
    {
      label: '服务列表',
      type: 'button',
      actionType: 'link',
      link: '/app/datasource/api/list?modelId=${id}&appId=${appId}&source_id=${id}',
    },
  ],
};
export const operations = [
  {
    label: '编辑',
    type: 'button',
    reload: 'apiSourceForm',
    actionType: 'dialog',
    level: 'link',
    dialog: {
      className: 'dialog-api-serve',
      title: '编辑Api',
      reload: 'apiSourceForm',
      body: apiFormEdit,
    },
  },
  {
    label: '删除',
    type: 'button',
    reload: 'apiSourceForm',
    // actionType: 'ajax',
    level: 'link',
    // confirmText: '确认要删除该服务吗？',
    // api: 'get:/api/def/model/real/delete?modelId=${id}',
    actionType: 'dialog',
    dialog: {
      title: '系统消息',
      body: [
        '确认要删除该服务吗?',
        {
          type: 'form',
          title: '',
          api: 'get:/api/def/model/real/delete?modelId=${id}'
        },
      ],
    },
  },
  {
    label: '服务列表',
    type: 'button',
    actionType: 'link',
    level: 'link',
    link: '/app/datasource/api/list?modelId=${id}&appId=${appId}&source_id=${id}',
  },
]
