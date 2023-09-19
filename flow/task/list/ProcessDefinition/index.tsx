import React from 'react';

import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
import './index.less';
import Footer from '@/components/Footer';
/**
 * 流程任务-我的待办列表
 *
 * @constructor
 */
const FlowPendingList: React.FC = () => {
  //
  const schema: SchemaNode = {
    type: 'page',
    className: 'base-light-page p-4',
    bodyClassName:"h-screen-sub-140 overflow-auto",
    body: [
      {
        type: "fieldSet",
        title: "发起流程",
      },
      {
        title: '',
        type: 'crud',
        className:"process-card-wrapper",
        api: '/api/flow/manager/list',
        affixHeader: false,
        mode: 'cards',
        placeholder: '没有可用的流程定义',
        columnsCount: 4,
        card: {
          className: "text-primary border-none process-definition-image",
          bodyClassName:"p-0",
          itemAction: {
            type: 'button',
            actionType: 'link',
            link: '/task/create?processDefinitionId=${id}',
          },
          body: [

            {
              type: "container",
              bodyClassName: "flex flex-col items-center",
              body: [
                {
                  type: "tooltip-wrapper",
                  content: "${name}",
                  className:"mt-44 text-center",
                  body: [
                    {
                      className:"overflow-line-1 text-2xl mb-8 font-medium mx-6",
                      type: 'tpl',
                      tpl:"${name}"
                    },
                  ]
                },
                {
                  type: 'button',
                  level: "primary",
                  className:"pointer-events-none bg-blue-100  border-blue-100 text-black",
                  label: '去发起',
                }
              ]
            }
          ],
        },
      },
    ],
  };

  return <>
    <AmisRenderer schema={schema} breadcrumb={{ routes: [] }} />
    <Footer/>
  </>

};
export default FlowPendingList;
