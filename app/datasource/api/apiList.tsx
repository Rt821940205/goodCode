import { addServiceForm } from '@/pages/app/datasource/api/addService';
import { apiConnectButton } from '@/pages/app/datasource/api/apiConnectButton';
import { buildApiSourceFields } from '@/pages/app/datasource/util/apiHandle';
import { ApiData } from '@/pages/app/datasource/util/parse';
// import './index.less'
import { setTables } from '@/components/co-table'
const serviceAddForm = {
  type: 'form',
  actions: [],
  className: 'api-data-form',
  reload: 'apiDataForm',
  api: {
    method: 'post',
    url: '/api/def/model/field/batch/add?_=apiEntity',
    requestAdaptor: function (api: any) {
      let modelId = api.data.modelId;
      let appId = api.data.appId;
      let fields = buildApiSourceFields(api, modelId, appId);
      return {
        ...api,
        data: {
          modelId: modelId,
          id: modelId,
          appId: appId,
          fields,
        },
      };
    },
    adaptor: function (payload: any) {
      return {
        data: payload.data,
      };
    },
  },
  body: addServiceForm,
};

const crub = {
  name: 'apiDataForm',
  headerToolbar: [
    {
      type: 'tpl',
      className: 'header-tool-item',
      tpl: '服务源: ${displayName}'
    },
    {
      type: 'tpl',
      className: 'header-tool-item',
      tpl: '<span>认证类型:</span> ${auth_type}'
    },
    {
      label: '添加服务接口',
      type: 'button',
      actionType: 'dialog',
      align: 'right',
      level: 'primary',
      className: 'add-serve',
      reload: 'apiDataForm',
      dialog: {
        title: '添加服务接口',
        className: 'dialog-add-api',
        reload: 'apiDataForm',
        actions: [
          apiConnectButton,
          {
            actionType: 'cancel',
            className: 'cancel-button',
            type: 'button',
            label: '取消',
          },
          {
            actionType: 'submit',
            type: 'button',
            level: 'primary',
            label: '确认',
          },
        ],
        body: serviceAddForm,
      },
    },
  ],
  api: {
    method: 'get',
    url: '/api/def/model/field/list?modelId=${modelId}&appId=${appId}',
    adaptor: function (payload: any, response:any, api:any) {
      let appId = api.query.appId;
      let fields = payload.data;
      let items: Array<any> = [];
      if (Array.isArray(fields)) {
        let apiDatas: Array<any> = [];
        let modelId = '';
        fields.forEach((f) => {
          modelId = f.modelId;
          if (
            f.name.length > 'api__fields__'.length + 1 &&
            f.name.slice(0, 'api__fields__'.length) == 'api__fields__'.toString()
          ) {
            f.name = f.name.substring('api__fields__'.length, f.name.length);
            apiDatas.push(f);
          }
        });
        if (Array.isArray(apiDatas)) {
          apiDatas.forEach((e) => {
            let data = new ApiData(appId, modelId);
            data.parseData(e);
            items.push(data);
          });
        }
      }
      return {
        total: items.length,
        items: items,
      };
    },
  },
  className: 'p-4'
}

const columns = [
  {
    name: '${index+1}',
    label: '序号',
    fixed: 'left',
    width: '56px'
  },
  {
    name: 'name',
    label: '名称',
  },
  {
    name: 'displayName',
    label: '显示名',
  },
]

const operations = [
  {
    label: '删除',
    // className: 'text-button',
    // confirmText: '您确定要删除该服务接口?',
    reload: 'apiDataForm',
    // actionType: 'ajax',
    dialog: {
      title: '系统消息',
      body: [
        '您确定要删除该服务接口?',
        {
          type: 'form',
          title: '',
          api: {
            url: '/api/def/model/field/delete',
            method: 'post',
            adaptor: function (payload: any) {
              let success = payload.success;
              let code = payload.code;
              let msg = undefined;
              if (success != undefined && !success) {
                msg = payload.message;
                return {
                  status: code,
                  msg: msg,
                };
              }
              // 需要返回 否则报错 Response is empty
              return {
                ...payload
              }
            },
          },
        },
      ],
    },
    level: 'link',
  },
  {
    label: '修改',
    actionType: 'dialog',
    dialog: {
      title: '服务接口编辑',
      // reload:'apiSourceForm,apiDataForm',
      size: 'lg',
      actions: [
        apiConnectButton,
        {
          actionType: 'cancel',
          type: 'button',
          label: '取消',
        },
        {
          actionType: 'submit',
          type: 'button',
          level: 'primary',
          label: '确认',
        },
      ],
      body: {
        type: 'form',
        promptPageLeave: true,
        api: {
          method: 'post',
          url: '/api/def/model/field/batch/add?_=apiEntity',
          requestAdaptor: function (api:any) {
            let modelId = api.data.modelId;
            let appId = api.data.appId;
            let fields = buildApiSourceFields(api, modelId, appId);
            return {
              ...api,
              data: {
                modelId: modelId,
                id: modelId,
                appId: appId,
                fields,
              },
            };
          },
          adaptor: function (payload: any) {
            let success = payload.success;
            let code = payload.code;
            let msg = undefined;
            if (success != undefined && !success) {
              msg = payload.message;
              return {
                status: code,
                msg: msg,
              };
            }
            return {
              data: payload.data,
            };
          },
        },
        body: addServiceForm,
      },
    },
    level: 'link',
  },
  {
    label: '提取实体',
    type: 'button',
    actionType: 'link',
    link: '/app/datasource/model/create/api/info?appId=${appId}&biz=api&source_id=${modelId}&api_id=${id}',
    level: 'link',
  },
]


export const apiListBody = [
  setTables(crub, columns, operations)
];
