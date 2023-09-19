import { getIconPicker } from '@/components/amis/schema/IconPicker';
import AmisRenderer from '@/components/AmisRenderer';
import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';
import React from 'react';

/**
 * 应用设置
 *
 * @constructor
 */
const AppSetting: React.FC = () => {
  const { query = {} } = history.location;
  const { appId } = query;
  console.log(appId);
  const schema: SchemaNode = {
    type: 'page',
    className: 'base-light-page-center page-w1400 bg-white rounded-lg mt-6',
    data: {
      appId: appId,
    },
    body: {
      type: 'container',
      className: '',
      body: {
        type: 'form',
        title: '',
        // className: 'wrap-with-panel-false',
        // "mode": "horizontal",
        panelClassName: 'border-0 mb-0',
        initApi: {
          method: 'post',
          url: '/api/graphql',
          data: {
            query:
              '{\n  find_sys_app(obj: {id:${appId}}) {\n    id\n    app_name\n    icon\n    background\n   author\n    description\n    version\n    state\n    home_page\n  }\n}',
            variables: null,
          },
          adaptor: function (payload: any) {
            let items = payload.data.find_sys_app[0];
            return {
              ...payload.data,
              data: items,
            };
          },
        },
        api: {
          method: 'post',
          url: '/api/graphql',
          data: {
            query:
              'mutation{update_sys_app(id:${appId},obj:{app_name:"${app_name}",icon:"${icon}",background:"${background}",description:"${description}",version:"${version}",author:"${author}",state:${state},})}',
            variables: null,
          },
          adaptor: function (payload: any) {
            let backNum = payload.data.update_sys_app;
            return {
              backNum: backNum,
            };
          },
        },
        redirect: '/app/manage/list',
        body: [
          {
            type: 'input-text',
            name: 'app_name',
            label: '1.应用名称',
            required: true,
            className: 'w-2/5',
          },
          {
            type: 'container',
            style: {
              zoom: 1,
            },
            // bodyClassName: 'overflow-hidden',
            body: [
              {
                type: 'tpl',
                tpl: '2.为你的应用选择一个图标',
                className: 'my-3 block',
              },
              {
                type: 'wrapper',
                className: 'flex flex-row p-0',
                body:[
                  {
                    type: 'container',
                    className: 'bg-gray-300 choose_icon_background flex justify-center items-center	mr-2 rounded',
                    style: {
                      backgroundColor: '${background}',
                      width:'3rem',
                      height:'3rem'
                    },
                    body: {
                      type: 'avatar',
                      className: 'bg-none choose_icon_btn flex justify-center items-center text-white',
                      icon: '${icon}',
                    },
                  },
                  getIconPicker()
                ]
              }
            ],
            className: 'w-2/5',
          },
          {
            name: 'description',
            type: 'textarea',
            showCounter: true,
            maxLength: 500,
            validations: {
              maxLength: 500,
            },
            validationErrors: {
              maxLength: '长度应该小于500',
            },
            label: '3.应用描述',
            className: 'w-2/5',
          },
          // {
          //   type: 'input-text',
          //   name: 'author',
          //   label: '4.应用开发者',
          // },
          {
            "type": "static",
            name: 'author',
            label: '4.应用开发者',
            className: 'w-2/5',
          },
          {
            type: 'input-text',
            name: 'version',
            label: '5.版本号',
            className: 'w-2/5',
          },
        ],
      },
    },
  };
  return <AmisRenderer schema={schema} />;
};

export default AppSetting;
