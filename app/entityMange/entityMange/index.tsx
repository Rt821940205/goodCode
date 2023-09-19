/**
 * 实体管理
 * author
 */
import AmisRenderer from '@/components/AmisRenderer';
import {chooseApiDialog} from '@/pages/app/datasource/api/apiServiceSelectDialog';
import {chooseJdbcTableDialog} from '@/pages/app/datasource/jdbc/jdbcTableDialog';
import {SchemaNode} from '@fex/amis/lib/types';
import {guide} from './guide';
import {history} from '@@/core/history';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";

interface buttonObj {
  label: String,
  link: String,
}

const settingBtn = (appId: String): Array<buttonObj> => {
  return [
    // { label: '智能服务管理', link: `/app/datasource/service?appId=${appId}` },
    {label: 'API服务管理', link: `/app/datasource/api?appId=${appId}`},
    {label: '外部数据源管理', link: `/app/datasource/jdbc?appId=${appId}`},
    // {label: '组件配置管理', link: `/app/datasource/component?appId=${appId}`},
  ]
}

function getButtons(list: Array<buttonObj>) {
  return list.map(item => {
    return {
      ...item,
      type: 'button',
      actionType: 'link',
      blank: false,
      className: 'flex justify-center'
    }
  })
}

// 顶部标题和dropdown组件
const toolbar = (appId: any) => {
  return [
    {
      type: 'dropdown-button',
      label: '创建实体',
      level: 'primary',
      // iconOnly: true,
      // closeOnClick: true, 该属性会导致react渲染异常报错
      // closeOnOutside: true, 该属性会导致react渲染异常报错
      align: 'left',
      menuClassName: 'chinaoly-dropdown-menu',
      btnClassName: 'chinaoly-dropdown-button',
      buttons: [
        {
          label: '普通实体',
          children: [
            {
              type: 'button',
              label: '创建实体',
              actionType: 'link',
              link: `/app/entityMange/entityCreate/step_one?appId=${appId}&step=1&subPage=true`,
              blank: false,
            },
          ],
        },
        {
          label: '高级实体',
          children: [
            {
              type: 'button',
              label: '创建API服务实体',
              actionType: 'dialog',
              dialog: chooseApiDialog,
              blank: false,
            },
            {
              type: 'button',
              label: '创建外部数据源实体',
              actionType: 'dialog',
              dialog: chooseJdbcTableDialog,
            },
            // {
            //   type: 'button',
            //   label: '创建组件实体',
            //   actionType: 'link',
            //   link: `/app/datasource/component/config/list?appId=${appId}&subPage=true`,
            //   // dialog: chooseComponentDialog,
            //   blank: false,
            // },
          ],
        },
      ],
    },
    {
      type: 'dropdown-button',
      icon: 'fa fa-gear',
      align: 'left',
      level: 'primary',
      className: 'ml-4',
      iconOnly: true,
      hideCaret: true, // 隐藏右侧下拉图标
      btnClassName: '',
      menuClassName: '',
      buttons: getButtons(settingBtn(appId))
    }
  ]
}

// 搜索栏
const filter = (appId: any) => {
  return {
    title: '',
    actions: [],
    className: 'search-row flex',
    body: [
      {
        type: 'input-text',
        name: 'name',
        label: '实体名称:',
        size: 'sm',
      },
      {
        type: 'select',
        label: '实体分类:',
        name: 'category',
        size: 'sm',
        value: '',
        source: {
          method: 'get',
          url: '/api/model/category/list',
          adaptor: function (payload: any) {
            const options = payload.data.map((item: { code: any; desc: any; }) => {
              return {value: item.code, label: item.desc}
            })
            options.length > 0 && options.unshift({value: '', label: '全部'})
            return {options}
          },
        },
      },
      {
        type: 'select',
        label: '实体状态:',
        name: 'state',
        value: 1,
        size: 'sm',
        options: [
          {value: 1, label: '启用'},
          {value: 0, label: '禁用'},
        ],
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
      {
        type: 'container',
        className: 'flex-1 flex justify-end',
        body: toolbar(appId)
      }
    ],
  }
}

const ModelList: React.FC = () => {
  const {query = {}} = history.location;
  const {appId} = query;
  const schema: SchemaNode = {
    type: 'page',
    title: '', // 实体管理
    className: 'base-light-page-center page-w1400 bg-white rounded-lg mt-6  p-6',
    data: {appId},
    initApi: {
      method: 'post',
      url: '/api/graphql?_=initAppInfo',
      data: {
        query: `{
          find_sys_app(obj: {id:` + appId + `}) {
            author
            icon
            app_name
            background
            state
          }
        }`,
        variables: {}
      },
      adaptor: function (payload: any) {
        const icon = payload.data.find_sys_app[0].icon
        const background = payload.data.find_sys_app[0].background
        return {
          ...payload,
          data: {
            icon: icon,
            background: background
          }
        }
      }
    },
    // toolbar: toolbar(appId),
    body: [
      {
        api: {
          method: 'post',
          url: `/api/def/model/pages?appId=${appId}&_=modelList`,
          requestAdaptor: function (api: any) {
            // 数据深拷贝
            const data = JSON.parse(JSON.stringify(api.data))
            data.pageSize = data.perPage
            data.pageNum = data.page
            data.appId = appId
            data.displayName = data.likeName
            data.categories = (data.category || data.category === 0) ? [Number(data.category)] : [
              30, 101210, 101610, 101017, 101020,
            102010,102011,102012,102013,102015,102017,102018,102019,102020,102021,102022
            ]
            return {...api, data}
          },
          adaptor: function (payload: any) {
            if (beforeHandle(payload)) {
              // 业务逻辑
              const {data, total} = payload.data
              return {items: data, total}
            }
            return errorHandle(payload);
          },
        },
        type: 'crud',
        defaultParams: {
          perPage: 8
        },
        syncLocation: false,
        filter: filter(appId),
        footerToolbar: ['statistics', 'pagination'],
        mode: 'cards',
        placeholder: guide(),
        columnsCount: 4,
        className: 'cards-style',
        card: {
          className: 'card-bg-blue border-0 p-2 rounded-lg',
          toolbar: [
            {
              type: 'wrapper',
              className: 'flex w-full',
              body: [
                // 头像
                {
                  type: 'container',
                  className: '',
                  body: [
                    {
                      type: 'avatar',
                      className: '',
                      style: {
                        // color: '${background|default:#4a90e2}',
                        fontSize: '2.5rem',
                        color: '#fff',
                        background: '#2A52CC',
                      },
                      icon: '${icon|default:fa fa-telegram}'
                    }
                  ]
                },
                // 标题
                {
                  type: 'container',
                  className: 'text-white text-base ml-2',
                  body: '${displayName}'
                },
                {
                  type: 'container',
                  className: 'flex-1 text-white',
                  body: "${display == true ? '展示' : '存储'}"
                }
              ]
            }
          ],
          body: [
            {
              type: 'flex',
              justify: 'space-between',
              className: '',
              items: [
                {
                  type: 'container',
                  body: "${category == 30 ? '自定义' : '系统实体'}",
                  className: {
                    'common-label': true,
                    'warning-label': '${category != 30}'
                  },
                },
                {
                  type: 'container',
                  body: "${state == 1 ? '已启用' : '未启用'}",
                  className: "${state == 1 ? '' : ''} py-2 px-2	rounded text-white text-xs",
                  style: {
                    background: "${state == 1 ? 'rgba(14, 208, 33, 0.8)' : '#EF6F60'}",
                  }
                },
              ],
            },
            {
              type: 'container',
              body: '${description}',
              style: {
                height: '4.125rem'
              },
              className: 'mt-4',
            },
            {
              type: 'container',
              body: [
                {
                  type: 'icon',
                  icon: 'fa-regular fa-user-o'
                },
                '&nbsp;&nbsp;创建者：${createName}'
              ],
              className: '',
            },
          ],
          bodyClassName: 'mx-1 bg-white rounded-t-md',
          itemAction: {
            type: 'button',
            actionType: 'link',
            link: '/app/entityMange/entityInfo?appId=${appId}&modelId=${id}&subPage=true',
          },
          actions: [
            {
              type: 'button',
              label: '设置',
              hiddenOn: 'this.category != 30',
              actionType: 'link',
              link: '/app/entityMange/entityInfo?appId=${appId}&modelId=${id}&category=${category}&subPage=true',
            },
            {
              type: 'button',
              label: '设置',
              hiddenOn: 'this.category != 101210',
              actionType: 'link',
              link: '/app/model/Setting?appId=${appId}&modelId=${id}&category=${category}&subPage=true',
            },
            {
              type: 'button',
              label: '设置',
              hiddenOn: 'this.category != 101020',
              actionType: 'link',
              link: '/app/model/Setting?appId=${appId}&modelId=${id}&category=${category}&subPage=true',
            },
            {
              type: 'button',
              label: '设置',
              hiddenOn: 'this.category != 101610',
              actionType: 'link',
              link: '/app/model/Setting?appId=${appId}&modelId=${id}&category=${category}&subPage=true',
            },
            {
              type: 'button',
              label: '数据',
              actionType: 'link',
              link: '/app/model/data/list?appId=${appId}&modelId=${id}&subPage=true',
            },
            {
              type: 'button',
              label: "${IF(state > 0, '禁用', '启用')}",
              actionType: 'dialog',
              hiddenOn: 'this.category == 101017',
              dialog: {
                title: '提示',
                body: [
                  {
                    type: 'form',
                    api: 'get:/api/def/model/update/$id/${IF(state > 0, 0, 1)}',
                    body: "确定要${IF(state > 0, '禁用', '启用')}该实体吗？",
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };
  return <AmisRenderer schema={schema}/>;
};

export default ModelList;
