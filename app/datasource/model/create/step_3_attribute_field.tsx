// import { SchemaNode } from '@fex/amis/lib/types';
// import { FieldList } from './step3/field_list';
// import { ModelRelationship } from './step3/relationship';
// import { FieldAdd } from './step3/field_add';
// import './style/index.less';
//
// export const modelAttributeField: SchemaNode = {
//   type: 'page',
//   body: [
//     {
//       type: 'grid',
//       columns: [
//         {
//           md: 5,
//           body: [
//             {
//               type: 'panel',
//               title: '${displayName}',
//               name: 'modelAttribute',
//               body: [
//                 {
//                   type: 'tpl',
//                   className: 'tpl_font_css',
//                   tpl: '字段',
//                 },
//                 FieldList,
//                 {
//                   type: 'divider',
//                 },
//                 {
//                   type: 'tpl',
//                   className: 'tpl_font_css',
//                   tpl: '关系',
//                 },
//                 ModelRelationship,
//                 {
//                   type: 'divider',
//                 },
//                 {
//                   type: 'tpl',
//                   className: 'tpl_font_css',
//                   tpl: '操作',
//                 },
//                 {
//                   type: 'flex',
//                   justify: 'space-between',
//                   items: [
//                     {
//                       label: '添加属性',
//                       type: 'button',
//                       level: 'link',
//                       actionType: 'drawer',
//                       drawer: {
//                         title: '实体属性添加',
//                         body: FieldAdd,
//                       },
//                     },
//                     {
//                       label: '添加关系',
//                       type: 'button',
//                       level: 'link',
//                       actionType: 'dialog',
//                       dialog: {
//                         body: {
//                           type: 'wrapper',
//                           title: '添加关系',
//                           name: 'relationship_add',
//                           wrapWithPanel: true,
//                           size: 'md',
//                           actions: [{ label: '保存', type: 'submit', primary: true }],
//                           body: [
//                             {
//                               label: '目标实体',
//                               mode: 'horizontal',
//                               type: 'select',
//                               size: 'md',
//                               name: 'target',
//                               options: [
//                                 {
//                                   label: '用户详细',
//                                   value: 'detail',
//                                 },
//                               ],
//                             },
//                             {
//                               label: '目标属性',
//                               mode: 'horizontal',
//                               type: 'select',
//                               size: 'md',
//                               name: 'target_attribute',
//                               options: [
//                                 {
//                                   label: 'pid',
//                                   value: '1',
//                                 },
//                               ],
//                             },
//                             {
//                               label: '本实体属性',
//                               mode: 'horizontal',
//                               type: 'select',
//                               size: 'md',
//                               name: 'attribute',
//                               options: [
//                                 {
//                                   label: 'name',
//                                   value: '2',
//                                 },
//                               ],
//                             },
//                           ],
//                         },
//                       },
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
