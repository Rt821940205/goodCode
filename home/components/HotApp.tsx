/**
 * 热门应用
 * author rencj@chinaoly.com
 */
 import { getCustomIcon } from './CustomIcon'
 import { hotAPPAPI } from '../utils/service'
 import './HotApp.less'
 
 // const list: any = [
 //   { icon: 'icon-a-11', appName: 'OA系统管理', count: '已使用8次' },
 //   { icon: 'icon-a-21', appName: '应用名称应用名称', count: '已使用7次' },
 //   { icon: 'icon-a-31', appName: '系统配置', count: '已使用6次' },
 //   { icon: 'icon-a-4', appName: '视频教程', count: '已使用5次' },
 //   { icon: 'icon-a-51', appName: '组件管理', count: '已使用4次' },
 // ]
 
 
 export function getHotApp() {
   return {
     type: 'service',
     api: hotAPPAPI(),
     body: {
       type: 'each',
       name: 'list',
       items: {
         type: 'flex',
         justify: 'start',
         className: 'hot-app-flex px-6',
         items: [
           getCustomIcon('icon-hot-${index+1}', 'hot-app-icon'),
           {
             type: 'container',
             className: 'hot-app-wrapper',
             body: [
               {
                 type: 'flex',
                 justify: 'space-between',
                 className: 'hot-app-inner',
                 items: [
                   {
                     type: 'container',
                     bodyClassName: 'flex',
                     body: [
                       {
                         type: 'container',
                         style: {
                           backgroundColor: '${background|default:#4a90e2}',
                           borderRadius: '8px',
                         },
                         body: [
                           {
                             type: 'avatar',
                             className: 'avatar-icon',
                             icon: '${icon|default:fa fa-telegram}',
                           },
                         ],
                       },
                       {
                         type: 'container',
                         className: 'ha-appName',
                         body: '${app_name}',
                       },
                     ]
                   },
                   {
                     type: "tag",
                     displayMode: "rounded",
                     label: '已使用${sycs}次',
                     style: {
                      fontSize:'0.75rem',
                      backgroundColor: "#305cd033",
                      borderColor: 'none',
                      color: "#305CD0"
                    }
                  }
                 ],
               }
             ]
           }
         ]
       }
     }
   }
 }