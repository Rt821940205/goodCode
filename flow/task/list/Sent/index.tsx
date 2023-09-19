import React from 'react';

import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
/**
 * 流程任务-我发送的列表
 *
 * @constructor
 */
const FlowSentList: React.FC = () => {
  //
  const schema: SchemaNode = {
    type: 'page',
    className: 'base-light-page p-4',
    body: [
      {
        type: "fieldSet",
        title: "我发起的",
      },
      {
        title: '',
        type: 'crud',
        api: '/api/flow/task/list/sent',
        syncLocation: false,
        autoGenerateFilter: false,
        affixHeader: false,
        filter: {
          title: '',
          actions: [],
          body: [
            {
              type: 'input-text',
              name: 'name',
              label: '流程名称:',
              size: 'sm',
              value: '',
            },
            {
              type: 'input-datetime-range',
              name: 'startDateRange',
              label: '处理时间:',
              format: 'YYYY-MM-DD HH:mm:ss',
              inputFormat: 'YYYY-MM-DD HH:mm:ss',
              timeFormat: 'HH:mm:ss',
              value: '',
            },
            {
              type: 'reset',
              label: '重 置',
              icon: 'fa fa-refresh',
              level:"enhance"
            },
            {
              type: 'submit',
              label: '筛 选 ',
              icon: 'fa fa-filter',
              level:'enhance',
            },
          ],
        },
        columns: [
          // {
          //   name: 'id',
          //   label: 'ID',
          //   align: 'center',
          // },
          {
            label: '编号',
            type: 'tpl',
            tpl: '${page*perPage - perPage + index+1}',
          },
          {
            name: 'name',
            label: '流程名称',
          },
          {
            label: '当前待办人',
            type: 'tpl',
            tpl: '${endTime?"已结束": currentAssignee}',
          },
          {
            type: 'date',
            format: 'YYYY-MM-DD HH:mm:ss',
            name: 'startTime',
            label: '发起时间',
          },
          {
            type: 'operation',
            label: '操作',
            width:"6.25rem",
            buttons: [
              {
                label: '查看',
                type: 'button',
                level: 'link',
                actionType: 'link',
                size:"md",
                link: '/task/view?processInstanceId=${id}',
              },
            ],
          },
        ],
      },
    ],
  };

  return <AmisRenderer schema={schema} breadcrumb={{ routes: [] }} />;
};
export default FlowSentList;
