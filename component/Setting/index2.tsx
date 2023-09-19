import '@/components/amis/components/EngineComponent/EngineUiRenderer';
import '@/components/amis/components/EngineComponent/EngineUiTestRenderer';
import AmisRenderer, { setBreadcrumb } from '@/components/AmisRenderer';
import { MockBizModel } from '@/pages/app/datasource/util/bizModel';
import { ModelField, modelFieldCategory } from '@/pages/app/datasource/util/modelField';
import { ComponentConfigCheckAction } from '@/pages/component/Setting/component/ComponentConfigCheckAction';
import { ComponentConfigCreateAction } from '@/pages/component/Setting/component/ComponentConfigCreateAction';
import { ComponentActions } from '@/pages/component/Setting/component/ComponentActions';
import { ComponentConfigDialog } from '@/pages/component/Setting/component/ComponentConfigDialog';
import { ComponentEditConfig } from '@/pages/component/Setting/component/ComponentEditConfig';
import { ComponentAddConfigBody } from '@/pages/component/Setting/component/ComponentAddConfigBody';
import { ComponentHelperContent } from '@/pages/component/Setting/component/ComponentHelperContent';
import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';
import React from 'react';
// import './index.less';


/**
 * 应用中心 应用列表
 */
export default class ComponentSetting extends React.Component {
  render(): any {
    const { query = {} } = history.location;
    const { componentId } = query;
    const breadcrumb = setBreadcrumb(); // 面包屑组件
    const fieldPrefix = 'field__';
    const fieldDisplayNamePrefix = '__displayField__';
    const fieldDescPrefix = '__descField__';
    const fieldTypePrefix = '__typeField__';

    const schema: SchemaNode = {
      type: 'page',
      className:'supermarket-details',
      initApi: {
        method: 'get',
        url: '/api/def/model/complete/info?modelId=' + componentId,
        adaptor: function (payload: any) {
          console.log(payload);

          return {
            ...payload,
            data: {
              id: payload.data.id,
              componentModel: payload.data,
              name: payload.data.displayName,
              description: payload.data.description,
              icon: '/images/component/' + payload.data.name + '.png',
              actions: payload.data.actions,
            },
          };
        },
      },
      body: [
        breadcrumb,

        {
          type: 'divider',
        },
      //    {
      //     type: 'service',
      //     api: '/api/component/plugins',
      // },

        // {
        //   type: 'service',
        //   api: 'https://aisuda.bce.baidu.com/amis/api/mock2/page/initData',
        //   body: [
        //     {
        //       type: 'panel',
        //       title: '$title',
        //       body: '现在是：${date}',
        //     },
        //     {
        //       type: 'button',
        //       label: '发送一个 http 请求',
        //       level: 'primary',
        //       onEvent: {
        //         click: {
        //           actions: [
        //             {
        //               actionType: 'custom',
        //               script:
        //                 "doAction({actionType: 'ajax', args: {api: '/amis/api/mock2/form/saveForm'}});\n //event.stopPropagation();",
        //             },
        //           ],
        //         },
        //       },
        //     },
        //     {
        //       type: 'service',
        //       title: '$title',
        //       schemaApi: 'jsonp:/api/component/jsonp?s=${title}&date=' + '${data}',
        //     },
        //   ],
        // },
        // {
        //   type: 'service',
        //   schemaApi: 'jsonp:/mock/jsonp.js',
        // },
        // {
        //   type: 'service',
        //   schemaApi: {
        //     url: '/api/component/schema?name=1',
        //     method: 'get',
        //     adaptor: function (payload: any) {
        //       let data = payload.data;
        //       console.log('schemaApi', payload);
        //       return {
        //         ...payload,
        //       };
        //     },
        //   },
        // },
        // {
        //   type: 'form',
        //   api: '/amis/api/mock2/form/saveForm',
        //   body: [
        //     // {
        //     //   type: 'service',
        //     //   title: '$title',
        //     //   schemaApi: 'jsonp:/api/component/jsonp?s=${title}&date=' + '${data}',
        //     // },
        //     {
        //       type: 'engine-ui',
        //       name: 'image',
        //       label: '图片',
        //       _componentName: 'eg_fd98_file_plugin',
        //       accept: '.jpg,.pdf,.png',
        //       _actionName: 'eg',
        //     },
        //     {
        //       type: 'text',
        //       name: 'myUrl',
        //       label: 'url',
        //     },
        //   ],
        // },
        // {
        //   type: 'tpl',
        //   tpl: 'hello',
        // },

        // {
        //   type: 'form',
        //   api: '/amis/api/mock2/form/saveForm',
        //   body: [
        //     {
        //       type: 'input-image',
        //       name: '${name}',
        //       // maxLenght: 1,
        //       // multiple: true,

        //       autoFill: {
        //         myUrl: '${value}',
        //       },
        //       receiver: {
        //         url: '/api/component/execute',
        //         method: 'post',
        //         data: {
        //           configId: '380746977702514688',
        //           actionName: 'eg_engine_upload',
        //         },
        //         // adaptor:
        //         //   "return {...api, {data:{ value: '/' + api.data.path + '/' + api.data.new_name,}}}",
        //         adaptor: function (payload: any) {
        //           let data = payload.data;
        //           return {
        //             ...payload,
        //             data: {
        //               value: '/' + data.path + '/' + data.new_name,
        //             },
        //           };
        //         },
        //       },
        //     },
        //     {
        //       type: 'text',
        //       name: 'myUrl',
        //       label: 'url',
        //     },
        //     {
        //       type: 'static',
        //       name: 'result',
        //       visibleOn: "typeof data.result !== 'undefined'",
        //       label: '提交数据',
        //     },
        //   ],
        // },

        // {
        //   type: 'panel',
        //   title: '$title',
        //   body: '现在id是：${id}',
        // },
        // {
        //   type: 'engine-ui',
        //   name: 'image',
        //   label: '图片',
        //   componentName: 'eg_fd98_file_plugin',
        //   // fileField: 'engine-image',
        //   accept: '.jpg,.pdf',
        // },
        // {
        //   type: 'service',
        //   // api: '/api/component/getUiDefaultConfig?name=eg_fd98_file_plugin&n=${id}',

        //   api: {
        //     method: 'get',
        //     url: '/api/component/getUiDefaultConfig?name=eg_fd98_file_plugin&id=${id}',
        //     sendOn: '${id}',
        //     requestAdaptor: 'return {    ...api, data: { maxSize: 100000}}',
        //     adaptor: 'return {    ...api, data: { ...api.data, maxSize: 100000}}',

        //     // adaptor: function (payload: any) {
        //     //   let data = payload.data;
        //     //   console.log(payload);
        //     //   return {
        //     //     ...payload,
        //     //     data: {
        //     //       accept: data.accept || '.png',
        //     //       maxSize: 1000, // parseInt(data.max_size), // * 1024 * 1024,
        //     //     },
        //     //   };
        //     // },
        //   },

        //   body: [
        //     {
        //       type: 'panel',
        //       title: '$id',
        //       body: '现在大小限制是：${max_size} | ${maxSize} | ${data}',
        //     },

        //     {
        //       type: 'input-image',
        //       // maxSize: '${max_size}',
        //       accept: '${id}',
        //       maxLenght: 1,
        //       receiver: {
        //         url: '/api/file/upload?n=${id}',
        //         method: 'post',
        //         data: {
        //           configModelId: '$id',
        //           actionName: 'eg_engine_upload${maxSize} | ${max_size}',
        //         },
        //         adaptor: function (payload: any) {
        //           console.log(payload.data);
        //           let value = payload.data.httpUrl;
        //           return {
        //             value: value,
        //           };
        //         },
        //       },
        //     },
        //   ],
        // },

        {
          type: 'card',
          // href: '/',
          header: {
            title: '${name}',
            description: '${description}',
            avatarClassName: 'pull-left thumb-md avatar b-3x m-r',
            avatar: '${icon}',
            className:'card-info',
          },
          className:'supermarket-card',
          body: [
            ComponentActions,
            {
              type: 'html',
              html: '<p>当前版本: ${componentModel.version}；组件ID: ${componentModel.id}；组件标识: ${componentModel.name}</p>',
            },
            // {
            //   type: 'input-image',
            // },
            // {
            //   type: 'engine-input-image',
            //   name: 'image',
            //   label: '图片',
            //   fileField: 'engine-image',
            //   // accept: '.jpg,.pdf',
            // },
            // {
            //   type: 'page',
            //   title: '自定义组件示例',
            //   body: {
            //     type: 'my-renderer',
            //     tip: '简单示例',
            //   },
            // },
            // {
            //   type: 'page',
            //   title: '自定义组件示例',
            //   body: {
            //     type: 'form',
            //     body: [
            //       {
            //         type: 'input-text',
            //         label: '用户名',
            //         name: 'usename',
            //       },
            //       {
            //         name: 'mycustom',
            //         asFormItem: true,
            //         children: ({ value, onChange, data }) => (
            //           <div>
            //             <p>这个是个自定义组件</p>
            //             <p>当前值：{value}</p>
            //             <a
            //               className="btn btn-default"
            //               onClick={() => onChange(Math.round(Math.random() * 10000))}
            //             >
            //               随机修改
            //             </a>
            //           </div>
            //         ),
            //       },
            //     ],
            //   },
            // },
          ],
          // toolbar: [
          //   {
          //     type: 'button',
          //     level: 'primary',
          //     align: 'right',
          //     label: '新增配置',
          //     actionType: 'dialog',
          //     dialog: {
          //       title: '新增配置',
          //       size: 'lg',
          //       actions: [
          //         // {
          //         //   type: 'button',
          //         //   label: '测试',
          //         // },
          //         {
          //           type: 'button',
          //           label: '取消',
          //           actionType: 'cancel',
          //         },
          //         {
          //           type: 'button',
          //           label: '确认',
          //           actionType: 'confirm',
          //           level: 'primary',
          //         },
          //       ],
          //       body: [
          //         ComponentAddConfigBody(componentId),

          //       ],
          //     },
          //   },
          // ],
        },




        {
          type: 'tpl',
          tpl: '配置信息',
          className:'supermarket-text',
            // toolbar: [
          //   {
          //     type: 'button',
          //     level: 'primary',
          //     align: 'right',
          //     label: '新增配置',
          //     actionType: 'dialog',
          //     dialog: {
          //       title: '新增配置',
          //       size: 'lg',
          //       actions: [
          //         // {
          //         //   type: 'button',
          //         //   label: '测试',
          //         // },
          //         {
          //           type: 'button',
          //           label: '取消',
          //           actionType: 'cancel',
          //         },
          //         {
          //           type: 'button',
          //           label: '确认',
          //           actionType: 'confirm',
          //           level: 'primary',
          //         },
          //       ],
          //       body: [
          //         ComponentAddConfigBody(componentId),

          //       ],
          //     },
          //   },
          // ],
        },
        {
          type: 'divider',
        },

        {
          type: 'crud',
          name:'configListCrud',
          id:'configListCrud',
          data: {
            pageSize: '${perPage}',
          },

          api: {
            method: 'post',
            url: '/api/def/model/pages?_=componentConfig',
            requestAdaptor: function (api: any) {
              return {
                ...api,
                data: {
                  appId: "396320893233737728",

                  pageNum: 1,
                  parentId: componentId,
                  pageSize: 100,
                  categories: [101015],
                  state: 1,
                },
              };
            },
            adaptor: function (payload: any) {
              let result = payload?.data?.data;
              result.forEach((item: any) => {
                item.component_name = item.displayName;
              });
              let pageNum = payload?.data?.pageNum;
              let pageSize = payload?.data?.pageSize;
              let total = payload?.data?.total;

              result.push({
                component_name:'',
                description:'',
                id:0

              })

              return {
                ...payload,
                data: {
                  pageNum: pageNum,
                  pageSize: pageSize,
                  total: total,
                  items: result,
                },
              };
            },
          },
          affixHeader: false,
          pageField: 'pageNum',
          perPageField: 'pageSize',
          defaultParams: {
            pageNum: 1,
          },
          footerToolbar: ['pagination'],
          mode: 'cards',
          placeholder: '暂无组件配置',
          className: 'card-wrapper-details-j',
          columnsCount: 4,
          card: {
            body: [
              {
                type: 'container',
                className: '',
                bodyClassName: 'flex',
                body: [
                  // {
                  //   type: 'container',
                  //   className: 'details-name',
                  //   // style: {
                  //   //   flex: 1,
                  //   // },
                  //   body: '${component_name} V ${version}',
                  // },
                  // {
                  //   type: 'container',
                  //   className: 'details-version',
                  //   // style: {
                  //   //   flex: 1,
                  //   // },
                  //   body: 'V ${version}',
                  // },
                ],
              },
              {
                type: 'container',
                className: 'details-name',
                // style: {
                //   flex: 1,
                // },
                visibleOn: "id && id.length>10",


                body: '${component_name} V ${version}',
              },
              {
                type: 'container',
                body: '${description}',
                className: 'details-desc',
              },
              {
                type: 'hidden',
                name: 'id',
              },
            ],
            // actionsCount: 10,
            className: 'custom-card-item supermarket-box',
            // className: {
            //   'custom-card-item': "${type !== 'add'}",
            // },
            // itemAction: {
            //   type: 'button',
            //   level: 'link',
            //   actionType: 'dialog',
            //   dialog: ComponentConfigDialog,
            //   className: 'supermarket-btns'
            //   // actionType: 'link',
            //   // link: '/component/detail?componentId=' + componentId,
            // },
            actions: [
              // {
              //   type: 'button',
              //   label: '详情',
              //   actionType: 'link',
              //   link: '/component/detail?componentId=${id}',
              //   tooltip: '详情',
              //   tooltipPlacement: 'top',
              //   tooltipTrigger: 'hover',
              // },

              {
                label: '详情',
                visibleOn: "id && id.length>10",
                type: 'button',
                level: 'link',
                actionType: 'dialog',
                className:'supermarket-details supermarket-btn',
                dialog: ComponentConfigDialog,
              },

         {
              type: 'button',
              level: 'primary',
              visibleOn: "!id || id.length ==1",
              label: '新增配置',
              className:'supermarket-details supermarket-btn',

              actionType: 'dialog',
              dialog: {
                title: '新增配置',
                size: 'lg',
                actions: [
                  // {
                  //   type: 'button',
                  //   label: '测试',
                  // },
                  ComponentConfigCheckAction(componentId),

                  {
                    type: 'button',
                    label: '取消',
                    actionType: 'cancel',
                  },
                  // {
                  //   type: 'button',
                  //   label: '确认',
                  //   actionType: 'confirm',
                  //   level: 'primary',
                  // },
                  ComponentConfigCreateAction(componentId),
                ],
                body: [
                  ComponentAddConfigBody(componentId),

                ],
              },
            },


              // {
              //   // "type": "button",
              //   // "disabled": true,
              //   // "label": "",
              //   // "icon": "fa fa-share-alt"
              //   className: 'noHand action_btn_color',
              // },
              // {
              //   // "type": "button",
              //   // "disabled": true,
              //   // "label": "",
              //   // "icon": "fa fa-send-o"
              //   className: 'noHand action_btn_color',
              // },
              // {
              //   // "type": "button",
              //   // "disabled": true,
              //   // "label": "",
              //   // "icon": "fa fa-eye",
              //   className: 'noHand action_btn_color',
              // },
              // {
              //   className: 'noHand',
              // },
              // {
              //   className: 'noHand',
              // },
              // {
              //   className: 'noHand',
              // },
              // {
              //   className: 'noHand',
              // },
              ComponentEditConfig(componentId),
              // {
              //   type: 'button',
              //   label: '移除',
              //   level: 'danger',
              //   tooltip: '移除',
              //   tooltipPlacement: 'top',
              //   tooltipTrigger: 'hover',
              //   actionType: 'ajax',
              //   confirmText: '您确认要删除?',
              //   api: {
              //     method: 'post',
              //     url: '/api/graphql',
              //     data: {
              //       query: '\n\nmutation{\n  delete_sys_app(id:$id,obj:{})\n}',
              //       variables: null,
              //     },
              //     adaptor: function (payload: any) {
              //       let backNum = payload.data.delete_sys_app;
              //       return {
              //         backNum: backNum,
              //       };
              //     },
              //   },
              // },
            ],
          },
        },
        ComponentHelperContent(),


        // '</br>',
        // {
        //   type: 'tpl',
        //   tpl: '帮助文档',
        //   className:'supermarket-text',
        // },
        // {
        //   type: 'divider',
        // },
        // {
        //   type: 'button',
        //   label: '组件开发者主页(待补充)',
        //   level: 'link',
        //   actionType: 'link',
        //   link: '',
        // },
      ],
    };
    return <AmisRenderer schema={schema} />;
  }
}
