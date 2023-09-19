// /**
//  * 个人角色
//  */
// export const userRole = {
//   title: '个人角色',
//   className: 'user-tabs-info',
//   tab: [{
//     type: 'service',
//     name: 'roleForm',
//     className: 'user-tabs-info-table',
//     api: {
//       method: 'post',
//       url: '/api/graphql?query=${userId}',
//       data: {
//         query: `{find_sys_role_user(obj: {user_id:$userId}) {
//                             role_id
//                             user_id
//                             id
//                             sys_role_user_just_sys_role{
//                               name
//                               description
//                               remark
//                               id
//                             }
//                           }}`,
//         variables: {
//           userId: "${userId}"
//         },
//       },
//       adaptor: function (payload: any,response,api) {
//         debugger
//         let relList = payload.data.find_sys_role_user
//         let find_sys_role: Array<any> = []
//         if (Array.isArray(relList) && relList.length > 0) {
//           find_sys_role = relList.map((item: any) => {
//             return {
//               id: item.sys_role_user_just_sys_role.id,
//               name: item.sys_role_user_just_sys_role.name,
//               description: item.sys_role_user_just_sys_role.description
//             }
//           })
//         }
//         return {
//           find_sys_role: find_sys_role,
//         };
//       },
//     },
//     body: {
//       type: 'crud',
//       source: '$find_sys_role',
//       syncLocation: false,
//       autoGenerateFilter: true,
//       columns: [
//         {
//           name: 'id',
//           label: '序号',
//         },
//         {
//           name: 'name',
//           label: '角色',
//         },
//         {
//           name: 'description',
//           label: '描述',
//           showCounter: true,
//           maxLength: 500,
//           validations: {
//             maxLength: 500,
//           },
//           validationErrors: {
//             maxLength: '长度应该小于500',
//           },
//         },
//         {
//           type: 'operation',
//           label: '操作',
//           buttons: [
//             {
//               label: '删除',
//               type: 'button',
//               level: 'link',
//               className: "btn-red",
//               reload: 'roleForm',
//               actionType: 'ajax',
//               confirmText: '确认要删除该数据源吗？',
//               api: {
//                 method: 'post',
//                 url: '/api/graphql',
//                 data: {
//                   query: 'mutation{delete_sys_role(id:"$id",obj:{})}',
//                   variables: null,
//                 },
//                 adaptor: function (payload: any) {
//                   let backNum = payload.data.delete_sys_role;
//                   return {
//                     backNum: backNum,
//                   };
//                 },
//               },
//             },
//           ],
//         },
//       ],
//     },
//   }
//   ]
// }
