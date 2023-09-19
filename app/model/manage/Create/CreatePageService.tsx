import { history } from '@@/core/history';
import { message } from 'antd';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";

/**
 * 生成页面按钮 json
 */
export const createPageAction = {
  type: 'button',
  actionType: 'ajax',
  label: '确认',
  primary: true,
  close: true,
  api: {
    method: 'post',
    url: '/api/graphql?_=loadDefaultModuleId',
    data: {
      query: '{ find_sys_module(obj:{app_id:"$appId", non_default: 0}){id}}',
      variables: {},
    },
    adaptor: function (payload:any) {
      if(beforeHandle(payload)){
        let module = payload.data.find_sys_module[0];
        let moduleId = '';
        if (module != undefined) {
          moduleId = module.id;
        }
        return {
          moduleId: moduleId,
        };
      }
      return errorHandle(payload);
    },
  },
  reload: 'doPageDataAction?appId=${appId}&modelId=${modelId}&moduleId=${moduleId}',
};

/**
 * 创建实体后自动生成实体数据列表与表单两张页面
 */
export const CreatePageService = {
  name: 'doPageDataAction',
  type: 'service',
  initFetch: false,
  api: {
    method: 'get',
    url: '/api/def/model/complete/info?modelId=${modelId}&_=${moduleId}&appId=${appId}',
    adaptor: function (payload: any) {
      const fields = payload.data.fields;
      let customFields = fields.filter((item:any) => {
        return item.nonDefault !== 0;
      });
      if (customFields.length === 0) {
        message.info('请至少添加一个属性再生成页面');
        return {
          ...payload,
        };
      }
      console.log(fields, 'fields');
      const filterArr = [
        'create_id',
        'create_name',
        'modify_id',
        'modify_name',
        'create_time',
        'modify_time',
        'action_type',
      ];
      let label = [];
      let searchFields = [];
      for (let i = 0; i < fields.length; i++) {
        if (fields[i].localName && filterArr.indexOf(fields[i].name) < 0) {
          let objOption = {
            label: fields[i].displayName,
            name: fields[i].name,
            align: 'center',
          };
          label.push(objOption);
          let inputType = '';
          if (fields[i].typeName === 'String' || fields[i].typeName === 'Long') {
            inputType = 'input-text';
          } else {
            inputType = 'input-number';
          }
          let inputObj = {
            type: inputType,
            name: 'obj.' + fields[i].name,
            label: fields[i].displayName,
            clearable: true,
            className: 'mr-5 mb-3',
          };
          searchFields.push(inputObj);
        }
      }
      //
      const filterNoNeedColumns = [
        'create_time',
        'modify_time',
        'create_id',
        'create_name',
        'action_type',
        'modify_name',
        'modify_id',
        'state',
      ];
      const formFields = payload.data.fields
        .filter((obj:any) => filterNoNeedColumns.indexOf(obj.name) == -1)
        .map((obj:any) => {
          if (obj.name == 'id') {
            return {
              type: 'hidden',
              name: obj.name,
            };
          }
          switch (obj.typeName) {
            case 'Float':
            case 'BigDecimal':
              return {
                type: 'input-number',
                name: obj.name,
                label: obj.displayName,
              };
            case 'Int':
            case 'Long':
              return {
                type: 'input-number',
                name: obj.name,
                label: obj.displayName,
                precision: 0,
              };
            case 'Timestamp':
              return {
                type: 'input-datetime',
                format: 'yyyy-MM-DD HH:mm:ss',
                name: obj.name,
                label: obj.displayName,
              };
            case 'Date':
              return {
                type: 'input-date',
                format: 'yyyy-MM-DD HH:mm:ss',
                name: obj.name,
                label: obj.displayName,
              };
            case 'String':
            default:
              return {
                type: 'input-text',
                name: obj.name,
                label: obj.displayName,
              };
          }
        });
      return {
        displayName: payload.data.displayName,
        modelName: payload.data.name,
        searchFields: searchFields,
        listQueryParamsObjType: payload.data.actions.filter(
          (obj:any) => obj.name.indexOf('create_') == 0,
        )[0].params.obj.type,
        listQueryName: payload.data.actions.filter(
          (obj:any) => !obj.nonDefault && obj.name.indexOf('pages_') == 0,
        )[0].name,
        deleteMutationName: payload.data.actions.filter(
          (obj:any) => !obj.nonDefault && obj.name.indexOf('delete_') == 0,
        )[0].name,
        columns: label,
        //
        formFields: formFields,
        createMutationName: payload.data.actions.filter(
          (obj:any) => !obj.nonDefault && obj.name.indexOf('create_') == 0,
        )[0].name,
        createMutationParamsObjType: payload.data.actions.filter(
          (obj:any) => !obj.nonDefault && obj.name.indexOf('create_') == 0,
        )[0].params.obj.type,
        updateMutationName: payload.data.actions.filter(
          (obj:any) => !obj.nonDefault && obj.name.indexOf('update_') == 0,
        )[0].name,
        findQueryName: payload.data.actions.filter(
          (obj:any) => !obj.nonDefault && obj.name.indexOf('find_') == 0,
        )[0].name,
      };
    },
  },
  body: {
    type: 'service',
    initFetch: false,
    name: 'create_sys_page_view',
    api: {
      method: 'post',
      url: '/api/graphql?_=create_sys_page_view&_2=${listQueryParamsObjType}',
      requestAdaptor: function (api:any) {
        const objListData = {
          page_name: api.data.displayName + '列表',
          app_id: api.data.appId,
          title: api.data.displayName + '列表',
          module_id: api.data.moduleId,
          body: '{}',
        };
        const objFormData = {
          page_name: api.data.displayName + '表单',
          app_id: api.data.appId,
          title: api.data.displayName + '表单',
          module_id: api.data.moduleId,
          body: '{}',
        };
        return {
          ...api,
          data: {
            query: `mutation create(\$obj: input_sys_page_view!, \$obj2: input_sys_page_view!){
                list_page:create_sys_page_view(obj: \$obj)
                form_page:create_sys_page_view(obj: \$obj2)
            }`,
            variables: {
              obj: objListData,
              obj2: objFormData,
            },
          },
        };
      },
      adaptor: function (payload: any) {
        console.log('create_page', payload.data);
        return {
          formPageId: payload?.data?.form_page,
          listPageId: payload?.data?.list_page,
        };
      },
    },
    body: {
      type: 'service',
      initFetch: false,
      name: 'update_sys_page_view',
      messages: {
        fetchSuccess: '页面创建成功',
      },
      api: {
        method: 'post',
        url: '/api/graphql?_=update_sys_page_view&_2=${formPageId}&appId=${appId}',
        requestAdaptor: function (api:any) {
          let appId = api.query.appId
          const modelListPage = JSON.stringify({
            type: 'model-data-list',
            searchFields: api.data.searchFields,
            listQueryParamsObjType: api.data.listQueryParamsObjType,
            modelId: api.data.modelId,
            modelName: api.data.displayName,
            listQueryName: api.data.listQueryName,
            deleteMutationName: api.data.deleteMutationName,
            columns: api.data.columns,
            formPageId: api.data.formPageId,
          });
          const objListData = {
            id: api.data.listPageId,
            page_name: api.data.displayName + '列表',
            app_id: api.data.appId,
            title: api.data.displayName + '列表',
            module_id: api.data.moduleId,
            body: modelListPage,
          };
          const modelFormPage = JSON.stringify({
            type: 'model-data-form',
            modelId: api.data.modelId,
            modelName: api.data.displayName,
            formFields: api.data.formFields,
            createMutationName: api.data.createMutationName,
            createMutationParamsObjType: api.data.createMutationParamsObjType,
            updateMutationName: api.data.updateMutationName,
            findQueryName: api.data.findQueryName,
            columns: api.data.columns,
            //
            searchFields: api.data.searchFields,
            listQueryParamsObjType: api.data.listQueryParamsObjType,
            listQueryName: api.data.listQueryName,
            deleteMutationName: api.data.deleteMutationName,
            redirectPageId: api.data.listPageId,
          });
          const objFormData = {
            id: api.data.formPageId,
            page_name: api.data.displayName + '表单',
            app_id: api.data.appId,
            title: api.data.displayName + '表单',
            module_id: api.data.moduleId,
            body: modelFormPage,
          };
          console.log({
            objListData: objListData,
            objFormData: objFormData,
            listPageId: api.data.listPageId,
            formPageId: api.data.formPageId,
          });
          return {
            ...api,
            data: {
              query: `mutation update(\$listPageId: Long!,\$formPageId: Long!, \$objListData: input_sys_page_view!, \$objFormData: input_sys_page_view!){
                list_page:update_sys_page_view(id: \$listPageId, obj: \$objListData)
                form_page:update_sys_page_view(id: \$formPageId, obj: \$objFormData)
            }`,
              variables: {
                objListData: objListData,
                objFormData: objFormData,
                listPageId: api.data.listPageId,
                formPageId: api.data.formPageId,
                appId:appId
              },
            },
          };
        },
        adaptor: function (payload: any,response:any,api:any) {
          console.log('update_page_id', payload.data);
          console.log('api', api);
          let appId = api.data.variables.appId
          history.replace('/app/entityMange/entityMange?appId=' + appId);
          return {};
        },
      },
    },
  },
};
