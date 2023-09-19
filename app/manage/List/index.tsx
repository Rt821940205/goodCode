import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
import React from 'react';
import './index.less';
import { useModel } from 'umi';
// import {CreateDefaultModuleAndIndexPage} from "@/pages/app/manage/Add/CreateDefaultModuleAndIndexPage";
// import { getIconPicker } from '@/components/amis/schema/IconPicker';
import Footer from '@/components/Footer'
import { createApplication } from '@/components/createApplication';
/**
 * 应用中心 应用列表
 */
const AppList: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  let { userResourceList } = initialState;
  let hiddenDeleteAppButton = true;
  let hiddenSettingAppButton = true;
  let hiddenAddAppButton = true;
  let hiddenAllAppPage = true;
  if (Array.isArray(userResourceList)) {
    userResourceList.forEach((item: any) => {
      if (item.permission == 'deleteAppButton') {
        hiddenDeleteAppButton = false;
      } else if (item.permission == 'settingAppButton') {
        hiddenSettingAppButton = false;
      } else if (item.permission == 'addAppButton') {
        hiddenAddAppButton = false;
      } else if (item.permission == 'allAppPage') {
        hiddenAllAppPage = false;
      }
    });
  }
  // 首页表单json
  const jsonBody = {
    type: 'page',
    body: [
      { type: 'container', className: 'index_container' },
      {
        type: 'container',
        className: 'index_bottom_text',
        body: '欢迎进入应用首页，请开始你的页面搭建吧',
      },
    ],
  };
  const cardItem = [
    {
      type: 'container',
      bodyClassName: 'flex  items-start justify-between px-2 pt-2',
      style: {
        cursor: 'default'
      },
      body: [
        {
          type: 'wrapper',
          className:'mr-4 p-0',
          style: {
            backgroundColor: '${background|default:#4a90e2}',
            borderRadius: '16px',
          },
          body: [
              {
              type: "avatar",
              shape: "rounded",
              icon: '${icon|default:fa fa-telegram}',
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.9)',
                width: '5rem',
                height: '5rem',
                backgroundColor: 'transparent',
                fontSize:'3.5rem'
              },
            }
          ]

        },
        {
          type: 'wrapper',
          className:'p-0 flex-1',
          body: [
            {
              className:"text-lg",
              type: 'tpl',
              tpl:"${app_name}",
              style: {
                color:"#333"
              }
            },
            {
              type: "tooltip-wrapper",
              content:'${description|default:"暂无描述"}',
              "showArrow": false,
              mouseEnterDelay: 1000,
              className: "h-12 flex mt-2 mb-4",
              body: [
                {
                  type: 'container',
                  body: '${description|default:"暂无描述"}',
                  className:"overflow-line-2"
                },
              ]
            },
            {
              type: "wrapper",
              className:'px-0 pt-0 pb-2 text-primary h-8',
              body: [
                {
                  type: "icon",
                  icon: "user",
                  className: 'mr-1 fa-regular',
                  visibleOn: '!!author',
                },
                {
                  type: "tpl",
                  tpl: "${author}",
                  visibleOn: '!!author',
                }
              ],
            }
          ]
        },
        {
          type: 'container',
          body: [
            {
              type: 'container',
              body: "${state == 1 ? '已发布' : '未发布'}",
              className: "py-2 px-2	rounded text-white text-xs",
              style: {
                background: "${state == 1 ? '#4FA96A' : '#EF6F60'}",
              }
            }
          ]
        }

      ]
    },
    {
      type: "divider",
      className:'-mx-4'
    },
    {
      type: 'container',
      bodyClassName: "flex justify-between items-center",
      body: [
        {
          type: 'tpl',
          tpl:" V${version}"
        },
        {
          type: "container",
          className:"text-sm",
          body: [
            {
              type: 'wrapper',
              className: 'px-2 py-0',
              style: {
                display:'inline-block',
                background: 'rgba(48, 92, 208, 0.2)',
                borderRadius:'20px'
              },
              body: [
                {
                  type: 'button',
                  level: 'link',
                  className: "text-primary p-0",
                  hidden: hiddenSettingAppButton,
                  label: '去使用',
                  icon: 'fa fa-square-arrow-up-right',
                  actionType: 'url',
                  url: "${type !== 'add' ? '/app/page/list?appId=' : '/app/manage/template'}${id}",
                },
              ]
            },
            {
              type: 'wrapper',
              className: 'px-2 py-0 ml-3',
              style: {
                display:'inline-block',
                background: 'rgba(48, 92, 208, 0.2)',
                borderRadius:'20px'
              },
              body: [
                {
                  type: 'button',
                  level: 'link',
                  className: "text-primary p-0",
                  hidden: hiddenSettingAppButton,
                  label: '开发',
                  icon: 'fa fa-code',
                  actionType: 'url',
                  url: '/settings/graph?appId=${id}',
                },
              ]
            },
            {
              type: 'wrapper',
              className: 'px-0 py-0',
              style: {
                display:'inline-block',
              },
              body: [
                {
                  "type": "dropdown-button",
                  btnClassName: "pr-0",
                  "level": "link",
                  "icon": "fa fa-ellipsis-v",
                  "hideCaret": true,
                  "tooltip": "更多操作",
                  "buttons": [
                    {
                      hidden: hiddenDeleteAppButton,
                      className:"text-primary",
                      label:'删除',
                      type: 'button',
                      level: 'link',
                      actionType: 'dialog',
                      dialog: {
                        title: '系统消息',
                        body: [
                          '您确认要删除?',
                          {
                            type: 'form',
                            title: '',
                            api: {
                              method: 'post',
                              url: '/api/graphql',
                              data: {
                                query: `mutation{
                               delete_sys_app(id:$id,obj:{})
                               delete_sys_user_app(obj:{app_id:$id})
                               delete_custom_yyrbsysj(obj:{yyid:$id})
                               delete_custom_yhsyyyjl(obj:{yyid:$id})
                               delete_custom_yyljbsysj(id:$id,obj:{})
                               delete_custom_xmkjhyydzjb(obj:{appid:$id})
                              }`,
                                variables: null,
                              },
                              adaptor: function (payload: any) {
                                let backNum = payload.data.delete_sys_app;
                                return {
                                  backNum: backNum,
                                };
                              },
                            },
                            body: [{ type: 'hidden', name: 'id' }],
                          },
                        ],
                      },
                    }
                  ]
                }
              ]
            }
          ]
        }

      ]
    }
  ]
  const cardJson = {
    body:cardItem,
    className:"hover:border-primary mb-6",
    // itemAction: {
    //   type: 'button',
    //   actionType: 'link',
    //   link: "${type !== 'add' ? '/app/page/list?appId=' : '/app/manage/template'}${id}",
    //   // blank: true,
    // }
  }

  const schema: SchemaNode = {
    type: 'page',
    data: {
      obj: {},
    },
    body: [
      {
        type: 'tabs',
        className: '-m-4 white-toolbar-tabs',
        tabs: [
          {
            title: '全部应用',
            hidden: hiddenAllAppPage,
            body: {
              type: 'crud',
              data: {
                pageSize: '${perPage}',
                jsonBody: jsonBody,
              },
              perPage: 8,
              pageField: 'pageNum',
              perPageField: 'pageSize',
              alwaysShowPagination: true,
              defaultParams: {
                pageNum: 1,
              },
              api: {
                method: 'post',
                url: '/api/graphql',
                data: {
                  query:
                    'query pages_sys_app(\\$obj:input_sys_app,\\$perPage: Int, \\$page:Int){pages_sys_app(obj: \\$obj, pageSize:\\$perPage, pageNum:\\$page)  {data{id,app_name,icon,author,description,background,version,state,home_page},pageNum,pageSize,total}}',
                  variables: {
                    obj: '${obj}',
                    "obj.state": 1,
                    page: '${pageNum}',
                    perPage: '${pageSize}',
                  },
                },
                adaptor: function (payload: any, response: any, api: any) {
                  let items = payload.data.pages_sys_app.data
                    ? payload.data.pages_sys_app.data
                    : [];
                  let total = payload.data.pages_sys_app.total;
                  let pageNum = payload.data.pages_sys_app.pageNum;
                  let pageSize = payload.data.pages_sys_app.pageSize;
                  return {
                    pageSize: pageSize,
                    pageNum: pageNum,
                    perPage: pageSize,
                    items: items,
                    total: total,
                  };
                },
              },
              affixHeader: false,
              headerToolbar: [
                {
                  type: 'search-box',
                  name: 'obj.app_name',
                  align: 'left',
                  placeholder: '请输入应用的名称',
                },
                {
                  type: 'button',
                  level: 'primary',
                  label: '＋ 创建新应用',
                  hidden: hiddenAddAppButton,
                  // actionType: 'link',
                  // link: '/app/manage/template',
                  actionType: 'dialog',
                  dialog: createApplication(),
                  align: 'right',
                },

              ],
              footerToolbar: ['pagination'],
              mode: 'cards',
              placeholder: '暂无应用',
              className: '-my-6',
              columnsCount: 4,
              card: cardJson
            },
          },

          {
            title: '他人分享',
            body: {
              type: 'crud',
              data: {
                pageSize: '${perPage}',
              },
              perPage: 8,
              pageField: 'pageNum',
              perPageField: 'pageSize',
              alwaysShowPagination: true,
              defaultParams: {
                pageNum: 1,
              },
              api: {
                method: 'post',
                url: '/api/graphql',
                data: {
                  query:
                    'query find(\\$obj:input_v_user_app,\\$perPage: Int, \\$page:Int, \\$where:Map){pages_v_user_app(obj: \\$obj, pageSize:\\$perPage, pageNum:\\$page, _where: \\$where)  {data{id,app_name,icon,author,description,background,version,state,home_page},pageNum,pageSize,total}}',
                  variables: {
                    obj: {
                      app_name: '${obj.app_name}',
                      userid: initialState?.currentUser?.xid,
                    },
                    where: {
                      and: [
                        {
                          option: 'neq',
                          key: 'create_id',
                          value: initialState?.currentUser?.xid,
                        },
                      ],
                    },
                    page: '${pageNum}',
                    perPage: '${pageSize}',
                  },
                },
                adaptor: function (payload: any, response: any, api: any) {
                  console.log(payload)
                  if(!payload.data.pages_v_user_app){
                    return {
                      items: [],
                      total: 0}
                  }
                  let items = payload.data.pages_v_user_app && payload.data.pages_v_user_app.data
                    ? payload.data.pages_v_user_app.data
                    : [];

                  let total = payload.data.pages_v_user_app.total;
                  let pageNum = payload.data.pages_v_user_app.pageNum;
                  let pageSize = payload.data.pages_v_user_app.pageSize;
                  return {
                    pageSize: pageSize,
                    pageNum: pageNum,
                    perPage: pageSize,
                    items: items,
                    total: total,
                  };
                },
              },
              affixHeader: false,
              headerToolbar: [
                {
                  type: 'search-box',
                  name: 'obj.app_name',
                  align: 'right',
                  placeholder: '请输入应用的名称',
                },
                {
                  type: 'button',
                  level: 'primary',
                  // icon: 'fa fa-plus',
                  label: '＋ 创建新应用',
                  hidden: true, //hiddenAddAppButton,
                  // actionType: 'link',
                  // link: '/app/manage/template',
                  actionType: 'dialog',
                  dialog: createApplication(),
                  align: 'right',
                }
              ],
              footerToolbar: ['pagination'],
              mode: 'cards',
              placeholder: '暂无应用',
              className: '-my-6',
              columnsCount: 4,
              card:cardJson
            },
          },
          {
            title: '我创建的',
            body: {
              type: 'crud',
              data: {
                pageSize: '${perPage}',
                jsonBody: jsonBody,
              },
              perPage: 8,
              pageField: 'pageNum',
              perPageField: 'pageSize',
              alwaysShowPagination: true,
              defaultParams: {
                pageNum: 1,
              },
              api: {
                method: 'post',
                url: '/api/graphql',
                data: {
                  query:
                    'query pages_sys_app(\\$obj:input_sys_app,\\$perPage: Int, \\$page:Int){pages_sys_app(obj: \\$obj, pageSize:\\$perPage, pageNum:\\$page)  {data{id,app_name,icon,author,description,background,version,state,home_page},pageNum,pageSize,total}}',
                  variables: {
                    obj: {
                      app_name: '${obj.app_name}',
                      create_id: initialState?.currentUser?.xid,
                      state: 1
                    },
                    page: '${pageNum}',
                    perPage: '${pageSize}',
                  },
                },
                adaptor: function (payload: any, response: any, api: any) {
                  let items = payload.data.pages_sys_app.data
                    ? payload.data.pages_sys_app.data
                    : [];
                  let total = payload.data.pages_sys_app.total;
                  let pageNum = payload.data.pages_sys_app.pageNum;
                  let pageSize = payload.data.pages_sys_app.pageSize;
                  return {
                    pageSize: pageSize,
                    pageNum: pageNum,
                    perPage: pageSize,
                    items: items,
                    total: total,
                  };
                },
              },
              affixHeader: false,
              headerToolbar: [
                {
                  type: 'search-box',
                  name: 'obj.app_name',
                  align: 'left',
                  placeholder: '请输入应用的名称',
                },
                {
                  type: 'button',
                  level: 'primary',
                  // icon: 'fa fa-plus',
                  label: '＋ 创建新应用',
                  hidden: hiddenAddAppButton,
                  // actionType: 'link',
                  // link: '/app/manage/template',
                  actionType: 'dialog',
                  dialog: createApplication(),
                  align: 'right',
                }
              ],
              footerToolbar: ['pagination'],
              mode: 'cards',
              placeholder: '暂无应用',
              className: '-my-6',
              columnsCount: 4,
              card: cardJson
            },
          },
        ],
      },
    ],
  };
  return <>
    <AmisRenderer schema={schema} />
    <Footer></Footer>
  </>
};
export default AppList;
