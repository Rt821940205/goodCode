import React from 'react';

import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
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
    body: [
      {
        type: "fieldSet",
        title: "待我处理",
        body: [
          {
            title: '',
            type: 'crud',
            api: '/api/flow/task/list/pending',
            syncLocation: false,
            autoGenerateFilter: false,
            affixHeader: false,
            filter: {
              title: '',
              actions: [],
              body: [
                {
                  type: 'input-datetime-range',
                  name: 'startDateRange',
                  label: '发起时间:',
                  format: 'YYYY-MM-DD HH:mm:ss',
                  inputFormat: 'YYYY-MM-DD HH:mm:ss',
                  timeFormat: 'HH:mm:ss',
                  value: '',
                },
                {
                  type: 'reset',
                  label: '重置',
                  icon: 'fa fa-refresh',
                  level:'enhance'
                },
                {
                  type: 'button',
                  label: '筛选 ',
                  level:'enhance',
                  icon: 'fa fa-search',
                },
              ],
            },
            columns: [
              {
                label: '编号',
                type: 'tpl',
                tpl: '${page*perPage - perPage + index+1}'
              },
              {
                name: 'processInstance.startUser.realName',
                label: '发起人',
                width:'10rem'
              },
              {
                name: 'processInstance.name',
                label: '流程名称',
              },
              {
                type: 'date',
                format: 'YYYY-MM-DD HH:mm:ss',
                name: 'task.createTime',
                label: '发起时间',
              },
              {
                type: 'operation',
                label: '操作',
                width:"6.25rem",
                buttons: [
                  {
                    label: '处理',
                    type: 'button',
                    size:"md",
                    level: 'link',
                    actionType: 'link',
                    link: '/task/view?processInstanceId=${processInstance.id}&taskId=${task.id}',
                  },
                ],
              },
            ],
          },
        ]
      },

    ],
  };

  return <AmisRenderer schema={schema} breadcrumb={{ routes: [] }} />;
};
export default FlowPendingList;
