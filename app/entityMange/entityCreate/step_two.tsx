/**
 * 创建实体步骤2
 * author
 */
import AmisRenderer from '@/components/AmisRenderer';
import { getEntityProp } from '@/components/entityProp'
import { history } from '@@/core/history';
import {createPageAction, CreatePageService} from "@/pages/app/model/manage/Create/CreatePageService";
import { getSteps } from '@/components/steps';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";
import { SchemaNode } from '@fex/amis/lib/types';
import { setBreadcrumb } from '@/utils';



const { query = {} } = history.location;
const { appId, modelId } = query;

export default function () {
  const breadcrumb = setBreadcrumb(); // 面包屑组件
  const schema : SchemaNode= {
    type: 'page',
    className: 'base-light-page-center page-w1400 bg-white rounded-lg mt-6',
    data: {
      appId: appId,
      modelId:modelId
    },
    initApi:'get:/api/def/model/complete/info?modelId='+modelId+'&_=loadInfo',
    body: [
      breadcrumb,
      CreatePageService,
      {
        type: "container",
        style: {
          width: '25rem',
        },
        className: "",
        body: getSteps(1, { appId, modelId }),
      },
      {
        type: 'form',
        title: '',
        className: '',
        data:{
          modelId:'${modelId}'
        },
        actions: [
          {
            type: 'button',
            label: '上一步',
            primary: true,
            actionType: 'link',
            link: '/app/entityMange/entityCreate/step_one?appId=${appId}&step=1&modelId=${modelId}&subPage=true',
            className: 'ml-0'
          },
          {
          type: 'button',
          label: '生成实体',
          primary: true,
          //  actionType: 'dialog',
          //  dialog: {
          //    title: '提示',
          //    body: '生成实体列表及添加实体页面',
          //    actions: [createPageAction],
          //  },
          actionType: 'ajax',
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
                if (!module?.id) {
                  return {
                    status: 1,
                    msg: '应用默认模块不存在，无法创建页面',
                    moduleId: '',
                  }
                }
                return {
                  moduleId: module.id,
                };
              }
              return errorHandle(payload);
            },
            },

          reload: 'doPageDataAction?appId=${appId}&modelId=${modelId}&moduleId=${moduleId}',
          },
        ],
        body: getEntityProp(appId, modelId)
      }
    ],
  }
  return <AmisRenderer schema={schema} />;
 }
