/**
 * 待办任务
 * author rencj@chinaoly.com
 */

 import './UpcomingTask.less'
 import { formatDate } from '@/utils'
 
 export function getUpcommingTask(count:number = 3) {
   const task: any = {
     type: 'service',
     className: count === 3 ? 'short-task-service' : 'long-task-service',
     api: {
       method: 'GET',
       url: '/api/flow/task/list/portal?latestLimit=' + count,
       adaptor: function (payload: any) {
         const list = payload.data.latestPendingTasks.map((item:any) => {
           item.processInstance.startTime = formatDate(item.processInstance.startTime, 'yyyy.MM.dd hh:mm:ss')
           return item.processInstance
         })
         return { list }
       },
     },
     body: [
      {
        visibleOn: '${list.length === 0}',
        type: 'flex',
        justify: 'center',
        alignItems: 'center',
        className: 'no-task-wrapper',
        items: {
          type: 'container',
          body: [
            { type: 'container', className: 'no-task' },
            { type: 'container',  body: '暂无任务～', className: 'no-task-label' }
          ]
        }
      },
      { 
        visibleOn: '${list.length > 0}',
        type: 'each',
        name: 'list',
        className: '',
        items: {
          type: 'action',
          actionType: 'link',
          className: 'upcomming-action px-6',
          link: '/task/view?processInstanceId=${id}',
          body: {
            type: 'flex',
            justify: 'space-between',
            className: 'task-wrapper-rencj',
            items: [
              { type: 'tpl', tpl: '${name}' },
              { type: 'container', body: [
                { type: 'tpl', tpl: '${startTime}', className: 'task-createTime' },
                { type: 'tpl', tpl: '去处理>' }
              ]}
            ]
          }
        }
      }
     ]
   }
   return task
 }