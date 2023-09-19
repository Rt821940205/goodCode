import AmisRenderer from '@/components/AmisRenderer';
import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';
import React from 'react';
import ReactBpmn from 'react-bpmn';

const FlowList: React.FC = () => {
  const { query = {} } = history.location;
  const { appId } = query;
  const schema: SchemaNode = {
    type: 'page',
    data: {
      appId: appId,
      allProcessUrl: '/api/flow/manager/list',
      appProcessUrl: '/api/flow/manager/list?key=Process-${appId}',
    },
    title: '流程管理',
    toolbar: [
      {
        type: 'button',
        level: 'primary',
        actionType: 'link',
        label: '新增流程',
        link: '/flow/manage/designer?appId=${appId}',
      },
    ],
    body: [
      {
        type: 'crud',
        api: '${IF(appId,appProcessUrl,allProcessUrl)}',
        syncLocation: false,
        affixHeader: false,
        mode: 'cards',
        switchPerPage: false,
        placeholder: '暂无流程',
        columnsCount: 4,
        card: {
          header: {
            title: '${name}',
          },
          body: {
            type: 'mycustom',
            children: ({ data }) => (
              <ReactBpmn url={`/api/flow/manager/xml?processDefinitionId=${data.id}`} />
            ),
          },
          itemAction: {
            type: 'button',
            actionType: 'link',
            link: '/flow/manage/designer?id=${id}',
          },
          actions: [
            {
              type: 'button',
              label: '设计',
              actionType: 'link',
              link: '/flow/manage/designer?id=${id}',
            },
            {
              label: '删除',
              confirmText: '您确定要移除该流程定义吗?',
              actionType: 'ajax',
              api: {
                method: 'post',
                url: '/api/flow/manager/delete',
                dataType: 'form',
                data: {
                  processDefinitionId: '${id}',
                },
              },
            },
          ],
        },
      },
    ],
  };

  return (
    <>
      <AmisRenderer schema={schema} />
    </>
  );
};

export default FlowList;
