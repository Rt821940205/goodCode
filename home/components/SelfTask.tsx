/**
 * 我的任务
 * author rencj@chinaoly.com
 */

 import './SelfTask.less'

export function getSelfTask(isDevlop: boolean = true) {
   const selfTask: any = {
     type: 'service',
     api: {
       method: 'GET',
       url: '/api/flow/task/list/portal',
       adaptor: function (payload: any) {
         const data = payload.data
         return {
           count: data?.count,
         };
       },
     },
     body: {
       type: 'grid',
       align: 'between',
       className:'px-6',
       columns: [
         {
           type: 'action',
           actionType: 'link',
           link: '/task/list/pending',
           className: 'st-link-common bg-pedding st-link-margin st-link-small',
           body: {
             type: 'container',
             className: 'st-link-font',
             style: {
               color:"#4B6BD7"
             },
             body: [
               { type: 'container', className: 'st-link-label', body: '全部待办' },
               { type: 'container', className: 'st-link-count', body: '${count.pending}' }
             ]
           }
         },
         {
           type: 'action',
           actionType: 'link',
           link: '/task/list/done',
           className: 'st-link-common bg-processed st-link-margin st-link-small',
           body: {
             type: 'container',
             className: 'st-link-font',
             style: {
              color:"#E8882A"
             },
             body: [
               { type: 'container', className: 'st-link-label', body: '我已处理' },
               { type: 'container', className: 'st-link-count', body: '${count.done}' }
             ]
           }
         },
         {
           type: 'action',
           actionType: 'link',
           link: '/task/list/sent',
           className: 'st-link-common bg-initiate st-link-small',
           body: {
             type: 'container',
             className: 'st-link-font',
             style: {
              color:"#4BAC6A"
             },
             body: [
               { type: 'container', className: 'st-link-label', body: '我发起的' },
               { type: 'container', className: 'st-link-count', body: '${count.sent}' }
             ]
           }
         },
       ]
     }
   }
   return selfTask
 }