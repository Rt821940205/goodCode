import React from 'react';

import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
/**
 * 流程任务-我已处理列表
 *
 * @constructor
 */
const FlowDoneList: React.FC = () => {
  //
  const schema: SchemaNode = {
    type: 'page',
    className: 'base-light-page p-4',
    body: [
      {
        type: "fieldSet",
        title: "我已处理",
      },
      {
        title: '',
        type: 'crud',
        api: '/api/flow/task/list/done',
        autoGenerateFilter: false,
        columnsTogglable:false,
        syncLocation: false,
        affixHeader: false,
        toolbarClassName:"p-0",
        filter: {
          title: '',
          actions: [],
          body: [
            {
              type: 'input-text',
              name: 'name',
              label: '流程名称:',
              value: '',
            },
            {
              type: 'input-datetime-range',
              name: 'endDateRange',
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
              level:'enhance'
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
          {
            label: '编号',
            type: 'tpl',
            tpl: '${page*perPage - perPage + index+1}',
          },
          {
            name: 'startUser.realName',
            label: '发起人',
          },
          {
            name: 'process.name',
            label: '流程名称',
          },
          {
            name: 'lastAssignee',
            label: '上一处理人',
          },
          {
            label: '当前待办人',
            type: 'tpl',
            tpl: '${process.endTime?"已结束": currentAssignee}',
          },
          {
            type: 'date',
            format: 'YYYY-MM-DD HH:mm:ss',
            name: 'process.startTime',
            label: '发起时间',
          },
          {
            type: 'date',
            format: 'YYYY-MM-DD HH:mm:ss',
            name: 'task.endTime',
            label: '处理时间',
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
                size:"md",
                actionType: 'link',
                link: '/task/view?processInstanceId=${process.id}',
              },
            ],
          },
        ],
      },
    ],
  };

  return <AmisRenderer schema={schema} breadcrumb={{ routes: [] }} />;
};
export default FlowDoneList;
