import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
import { getAppList } from '@/components/ApplicationList';
import { getUpcommingTask } from './components/UpcomingTask';
import { getSubTitle } from './components/SubTitle';
import { getBulletin } from './components/Bulletin';
import { getSelfTask } from './components/SelfTask';
import { getTitle } from './components/Title';
import { getStatistics } from './components/Statistics';
import { getHotApp } from './components/HotApp';
import { latestUesrAPI, commonAPPAPI } from './utils/service';
import React  from 'react';
import { useModel } from '@@/plugin-model/useModel';
import './index.less';
import Footer from '@/components/Footer';
import VersionCheck from '@/components/VersionCheck';

// 使用者
class UserLayout {
  userId: string;
  userName: string;
  constructor(userName: string, userId: string) {
    this.userName = userName;
    this.userId = userId;
  }
  getLayout() {
    return {
      type: 'container',
      className: 'page-home-bg',
      bodyClassName:'',
      body: [
        {
          type: 'container',
          className:'p-6',
          bodyClassName: 'flex',
          body: [
            {
              type: "container",
              style: {
                width:'22.5rem'
              },
              bodyClassName: "flex flex-col",
              body: [
                getTitle(this.userName,false),
                {
                  type: 'container',
                  style: {
                    height:'30rem'
                  },
                  body: [
                    getSubTitle({
                      title: '最近使用',
                      icon: 'icon-iconziyuantongji',
                      linkName: '更多应用',
                      url: '/app/manage/list?pageNum=1',
                      isTab:false
                    }),
                    getAppList({
                      column: 1,
                      prePage: 4,
                      cardClass: 'w-full  h-24  mb-4 hover:border-primary',
                      discripClass: 'overflow-line-1',
                      api: commonAPPAPI(this.userId,4),
                    }),
                  ],
                },
              ]
            },
            {
              type: 'container',
              className: 'mx-6 flex-1',
              body: [
                {
                  type: 'container',
                  style: {
                    width: '100%',
                  },
                  className: 'card-shadow-container flex-grow mr-6 px-0',
                  body: [
                    getSubTitle({ title: '我的任务', icon: 'icon-icondaibanrenwu' }),
                    getSelfTask(false)
                  ],
                },
                {
                  type: 'container',
                  style: {
                    width: '100%',
                    height:'29.2rem'
                  },
                  className: 'card-container flex-grow mr-6 p-0',
                  body: [
                    getSubTitle({ title: '待办任务', icon: 'icon-icondaibanrenwu' }),
                    getUpcommingTask(8),
                  ],
                }
              ]
            },
            {
              type: 'container',
              style: {
                width:"36.75rem"
              },
              body: [
                {
                  type: 'container',
                  style: {
                    width: '100%',
                    height: '44.56rem'
                  },
                  className: 'card-shadow-vertival-container px-0',
                  body: [
                    getSubTitle({
                      title: '公告',
                      icon: 'icon-icongonggao',
                      linkName: '全部公告',
                      url: '/system/noticeManage?obj[ggbt]=&page=1',
                    }),
                    getBulletin(12),
                  ],
                },
              ]
            }
          ]
        }
      ],
    };
  }
}

class DeveloperLayout {
  userId: string;
  userName: string;
  constructor(userName: string, userId: string) {
    this.userName = userName;
    this.userId = userId;
  }
  getLayout() {
    return {
      type: 'container',
      className: 'page-home-bg',
      body: [
        {
          type: 'container',
          className:'p-6',
          bodyClassName: 'flex',
          body: [
            {
              type: "container",
              style: {
                width:'22.5rem'
              },
              bodyClassName: "flex flex-col",
              body: [
                getTitle(this.userName),
                {
                  type: 'container',
                  style: {
                    height:'30rem'
                  },
                  body: [
                    getSubTitle({
                      title: '最近使用',
                      icon: 'icon-iconziyuantongji',
                      linkName: '更多应用',
                      url: '/app/manage/list?pageNum=1',
                      isTab:false
                    }),
                    getAppList({
                      column: 1,
                      prePage: 4,
                      cardClass: 'w-full  h-24  mb-4 hover:border-primary',
                      discripClass: 'overflow-line-1',
                      api: latestUesrAPI(this.userId),
                    }),
                  ],
                },
              ]
            },
            {
              type: 'container',
              className: 'mx-6 flex-1',
              body: [
                {
                  type: 'container',
                  style: {
                    width: '100%',
                    height:"21.875rem"
                  },
                  className: 'card-shadow-container flex-grow mr-6 px-0',
                  body: [
                    getSubTitle({ title: '待办任务', icon: 'icon-icondaibanrenwu' }),
                    getSelfTask(true),
                    getUpcommingTask(3),
                  ],
                },
                {
                  type: 'container',
                  style: {
                    width: '100%',
                    height:"26.375rem"
                  },
                  className: 'card-container p-0 mr-6',
                  body: [
                    getSubTitle({ title: '热门应用', icon: 'icon-iconremenyingyong' }),
                    getHotApp(),
                  ],
                },
              ]
            },
            {
              type: 'container',
              style: {
                width:"36.75rem"
              },
              body: [
                {
                  type: 'container',
                  style: {
                    width: '100%',
                    height:"21.875rem"
                  },
                  className: 'card-shadow-container  px-0',
                  body: [
                    getSubTitle({ title: '资源统计', icon: 'icon-iconziyuantongji' }),
                    getStatistics(),
                  ],
                },
                {
                  type: 'container',
                  style: {
                    width: '100%',
                    height:"26.375rem"
                  },
                  className: 'card-container p-0',
                  body: [
                    getSubTitle({
                      title: '公告',
                      icon: 'icon-icongonggao',
                      linkName: '全部公告',
                      url: '/system/noticeManage?obj[ggbt]=&page=1',
                    }),
                    getBulletin(7),
                  ],
                },
              ]
            }
          ]
        },
      ],
    };
  }
}

const homePage: React.FC = () => {


  const { initialState } = useModel('@@initialState');
  if (!initialState?.currentUser) return <></>;
  let { id, realName, purview } = initialState?.currentUser;
  const userLayout = new UserLayout(realName, id.toString());
  if (typeof id === 'number') {
    id = BigInt(id)
  }
  let layout: any = userLayout;
  if (purview === 'DEVELOPER') {
    const developerLayout = new DeveloperLayout(realName, id.toString());
    layout = developerLayout;
  }
  const schema: SchemaNode = {
    type: 'page',
    className: 'h-screen-sub-110 overflow-auto',
    body: [layout.getLayout()],
  };
  return <>
    <VersionCheck/>
    <AmisRenderer schema={schema} />
    <Footer/>
  </>
};

export default homePage;
