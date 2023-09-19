import '@/components/amis/components/ModelDataFormRenderer';
import '@/components/amis/components/ModelDataListRenderer';
import '@/components/amis/components/ModelPageRenderer';
import '@/components/amis/components/UploadFileRenderer';
import '@/components/amis/components/UploadImageRenderer';
import '@/components/amis/components/DealtWithIndexRenderer';
import '@/components/amis/components/ComponentSnippet';
import { history } from '@@/core/history';
import React, { useState } from 'react';

import AmisRenderer from '@/components/AmisRenderer';
import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { getBreadcrumbInfo } from '@/services/xuanwu/api';
import { useModel } from '@@/plugin-model/useModel';
import ProLayout, { BasicLayoutProps, MenuDataItem } from '@ant-design/pro-layout';
import { SchemaNode } from '@fex/amis/lib/types';

import defaultSettings from '@/../config/defaultSettings';
import { Link } from 'umi';
import './index.less';
import { getResponse } from '@/api/common';
import { PageBody, PageModule } from '../utils/types';

import SvgIcon from '../../../../components/svgIcon';
import { SmileFilled } from '@ant-design/icons';
import Header from '@/pages/taskPortal/Header';
import './dealwith.less';
import VersionCheck from '@/components/VersionCheck';
const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { initialState } = useModel('@@initialState');
  const { children } = props;
  // footerRender={() => <Footer />}
  return (
    <ProLayout
      rightContentRender={() => <RightContent />}
      menuHeaderRender={undefined}
      waterMarkProps={{
        content: initialState?.currentUser?.name,
      }}
      siderWidth="12.5rem"
      {...initialState?.settings}
      {...defaultSettings}
      {...props}
    >
      {children}
    </ProLayout>
  );
};

const AppPageList: React.FC = () => {
  const { query = {} } = history.location;
  let { appId, pageId } = query;
  //
  const [appName, setAppName] = useState<string>();
  const getAppNameData = async () => {
    const res = await getBreadcrumbInfo(appId);
    if (res.data != null && res.data.app.length > 0 && res.data.app[0]) {
      setAppName(res.data.app[0].name);
    }
  };
  if (appName === undefined) {
    getAppNameData();
  }
  //
  const { initialState } = useModel('@@initialState');

  const logoUrl = initialState?.settings?.logo
 

  // 左侧路由
  const [routes, setRoutes] = useState<MenuDataItem[]>();
  const getData = async () => {
    const data: any = await getResponse('pageList', { appId });
    const collect: any = await getResponse('userResourceCollect', { appId: appId, type: 'page' });
    const modules = (data.modules as PageModule[]) || [];
    const pages = ((data.pages as PageBody[]) || []).filter(
      (item) => collect[item.id] == true || collect[item.id] == undefined,
    );
    if (pageId != undefined) {
      const find = pages.filter((item) => item.id == pageId);
      if (find.length == 0) {
        history.push('/app/page/list?appId=' + appId);
      }
    }
    if (pageId === undefined && pages.length > 0) {
      const hideModuleIds = modules
        .filter((module) => module.hide === 1)
        .map((module) => Number(module.id));
      const page: any = pages
        .filter((item) => item.hide === 0)
        .filter((item) => !hideModuleIds.includes(item.module_id))
        .shift();
      history.push('/app/page/list/' + page.id + '?appId=' + appId + '&pageId=' + page.id);
    }
    let routes = modules
      .filter((module) => module.hide === 0)
      .map((module) => {
        return {
          name: module.module_name,
          icon: <SvgIcon iconClass="menudefault1" className="menu-icon"></SvgIcon>,

          disabled: false,
          children: pages
            .filter((obj) => obj.module_id == module.id && obj.hide === 0)
            .map((obj) => {
              return {
                name: obj.page_name,
                path: '/app/page/list/' + obj.id + '?appId=' + appId + '&pageId=' + obj.id,
                exact: true,
              };
            }),
        };
      });
    routes.filter((it) => it.children.length == 0).forEach((obj) => (obj.disabled = true));
    setRoutes(routes);
  };
  if (routes === undefined) {
    getData();
  }
  // console.log('routes', routes)
  const menuDataRender = (): MenuDataItem[] => routes;
  //
  const schema: SchemaNode = {
    type: 'page',
    data: {
      ...query,
    },
    initApi: {
      method: 'post',
      url: '/api/authority/resource/resourceCollect',
      data: {
        tag: pageId,
        appId: appId,
      },
      responseData: {
        '&': '$$',
        qxXw: true,
      },
    },
    body: [
      {
        type: 'service',
        schemaApi: {
          method: 'post',
          sendOn: 'pageId>0',
          url: '/api/graphql?_=getPageDef&_pageId=${pageId}&__=${qxXw}',
          data: {
            query: `query find(\\$id: ID){
                              item:find_sys_page_view(obj: {id: \\$id}) {
                                body
                              }
                            }`,
            variables: {
              id: '${pageId}',
            },
          },
          adaptor: function (payload: any) {
            // console.log(payload.data);
            if (payload.data.item[0].body == '') {
              return {
                type: 'tpl',
                tpl: '',
              };
            }
            try {
              return JSON.parse(payload.data.item[0].body);
            } catch (e) {
              return JSON.parse(
                payload.data.item[0].body.replace(/\n/g, '\\n').replace(/\r/g, '\\r'),
              );
            }
          },
        },
      },
      {
        type: 'service',
        api: {
          sendOn: 'pageId',
          url: '/api/component/execute?component=cg_7da3195d787608fd&actionName=cg_7da3195d787608fd_83a6fd77&value=${pageId}'
        },
        body:[]
      }
    ],
  };
  const tzProps = appId === '465467026043830272' ? {headerRender:()=><Header/>}:{}
  return (
    <>
    <VersionCheck/>

    <div className="app-issue-wrapper">

      <BasicLayout
        splitMenus={false}
          headerTitleRender={(logo, title, prop) => {
          return (
            <a href="/">
              {logoUrl  ? <img src={logoUrl} /> :logo}
              {title} <h1>{appName}</h1>
            </a>
          );
        }}
        {...tzProps}
        menuDataRender={menuDataRender}
        menuItemRender={(menuItemProps, defaultDom) => {
          let path = menuItemProps.path;
          // return <Link to={path}>{defaultDom}</Link>;
          // console.log('path', path, defaultDom)
          return (
            <Link to={path}>
              <SvgIcon iconClass="menudefault1"></SvgIcon>
              {defaultDom}
            </Link>
          );
        }}
      >
        <AmisRenderer schema={schema} />
      </BasicLayout>
      </div>
      </>
  );
};
export default AppPageList;
