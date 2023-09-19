import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
import React from 'react';

/**
 * 流程接口-流程任务管理
 *
 * @constructor
 */
const FlowMonitorList: React.FC = () => {
  //
  const schema: SchemaNode = {
    type: 'page',
    title: '流程任务管理',
    toolbar: [],
    body: [
      // 运行中的任务列表
      {
        title: '运行中的任务列表',
        type: 'crud',
        api: '/api/flow/monitor/active/list',
        syncLocation: false,
        affixHeader: false,
        columns: [
          {
            name: 'id',
            label: 'ID',
          },
          {
            name: 'processDefinitionName',
            label: '流程名称',
          },
          {
            name: 'name',
            label: '任务名称',
          },
          {
            type: 'date',
            name: 'startTime',
            format: 'YYYY-MM-DD HH:mm:ss',
            label: '发起时间',
          },
          // {
          //   name: 'startUserId',
          //   label: '发起人',
          // },
          {
            type: 'operation',
            label: '操作',
            width:"7.5rem",
            buttons: [
              {
                type: 'button',
                label: '查看',
                level: 'link',
                actionType: 'url',
                url: '/flow/monitor/task/view?processInstanceId=${id}&allTask=true',
                blank: true
              },
              {
                type: 'button',
                label: '撤销',
                level: 'link',
                confirmText: '确认要撤销该流程实例？',
                actionType: 'ajax',
                api: {
                  method: 'post',
                  dataType: 'form',
                  url: '/api/flow/monitor/deleteProcessInstance',
                  data: {
                    processInstanceId: '${id}',
                    reason: '流程监控撤销'
                  }
                }
              }
            ],
          },
        ],
      },
      // 已完成的任务列表
      {
        title: '已完成的任务列表',
        type: 'crud',
        api: '/api/flow/monitor/finished/list',
        syncLocation: false,
        affixHeader: false,
        columns: [
          {
            name: 'id',
            label: 'ID',
          },
          {
            name: 'processDefinitionName',
            label: '流程名称',
          },
          {
            name: 'name',
            label: '任务名称',
          },
          {
            type: 'date',
            name: 'startTime',
            format: 'YYYY-MM-DD HH:mm:ss',
            label: '发起时间',
          },
          {
            type: 'date',
            name: 'endTime',
            format: 'YYYY-MM-DD HH:mm:ss',
            label: '结束时间',
          },
          // {
          //   name: 'startUserId',
          //   label: '发起人',
          // },
          {
            type: 'operation',
            label: '操作',
            width:"6.25rem",
            buttons: [
              {
                type: 'button',
                label: '查看',
                level: 'link',
                actionType: 'url',
                url: '/flow/monitor/task/view?processInstanceId=${id}&allTask=true',
                blank: true
              },
            ],
          },
        ],
      },
    ],
  };

  return <AmisRenderer schema={schema} breadcrumb={{ routes: [] }} />;
};
export default FlowMonitorList;
