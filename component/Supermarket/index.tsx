import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
import React from 'react';
import { crudCards } from '@/pages/component/Supermarket/componentList';
import  Footer  from '@/components/Footer';

/**
 * 流程任务-我发送的列表
 *
 * @constructor
 */
const Supermarket: React.FC = () => {
  const schema: SchemaNode = {
    type: 'page',
    initApi: {
      method: 'post',
      url: '/api/def/model/pages?_=componentAll&keywords=${keywords}',
      requestAdaptor: function (api: any) {
        return {
          ...api,
          data: {
            appId: "396320893233737728",
            name: api?.data?.keywords,
            categories: [101016],
            state: 1,
            pageSize: 1000
          },
        };
      },
      adaptor: function (payload: any, response: any, api: any) {
        let componentTypeArray: Array<any> = ['1', '2', '3', '4', '5', '6'];
        let componentType = '';
        let list: Array<any> = payload.data.data;
        let result: Array<any> = [];
        list.forEach((model: any) => {
          const fields = model.fields.filter((item: any) => {
            // 文件传输
            return item.defaultValue != null && -1 != componentTypeArray.indexOf(item.defaultValue);
          });
          if (Array.isArray(fields) && fields.length > 0) {
            model.component_name = model.displayName;
            componentType = fields[0].defaultValue;
            model.componentType = componentType;
            model.icon = '/images/component/' + model.name + '.png';
            result.push(model);
          }
        });
        let fileComponent = result.filter((item: any) => {
          return item.componentType == '1';
        });
        let dbComponents = result.filter((item: any) => {
          return item.componentType == '2';
        });
        let networkComponent = result.filter((item: any) => {
          return item.componentType == '3';
        });
        let dtComponent = result.filter((item: any) => {
          return item.componentType == '4';
        });
        let taskComponent = result.filter((item: any) => {
          return item.componentType == '5';
        });
        let mqComponent = result.filter((item: any) => {
          return item.componentType == '6';
        });
        console.log(fileComponent)
        return {
          fileComponents: fileComponent,
          dbComponents: dbComponents,
          networkComponents: networkComponent,
          dtComponents: dtComponent,
          taskComponents: taskComponent,
          mqComponents: mqComponent,
        };
      },
    },
    bodyClassName:'bg-white p-0 m-4 h-screen-sub-130',
    body: [
      {
        type: 'service',
        api:{
          method: 'post',
          url: '/api/authority/resource/listByUserId',
          adaptor:function (payload:any){
            let result = payload.data
            result = result.filter((item:any)=>{ return item.type == 'module' && -1 != item.permission.indexOf('/componentSupermarket')})
            return {
              ...payload,
              data:{
                result:result
              }
            }
          }
        },
        body:{
          type: 'service',
          schemaApi:{
            method: 'post',
            url: '/api/authority/resource/listByUserId',
            adaptor:function (payload:any){
              const componentSupermarketList = payload.data.filter((item:any) => {return item.type == 'module' && -1 != item.permission.indexOf('/componentSupermarket')}).map((item:any)=> {return item.name})
              let componentLinks = [{
                   title: '文件传输',
                   name: 'file',

                   body: [
                    {
                      type: "fieldSet",
                      title: "文件传输",
                    },
                    {
                      type: 'crud',
                      source: '${fileComponents}',
                      affixHeader: false,
                      mode: 'cards',
                      placeholder: '暂无组件',
                      columnsCount: 4,
                      card: crudCards,
                    },
                  ],
                },
                {
                  title: '消息中间件',
                  name: 'mq',
                  body: [
                    {
                      type: "fieldSet",
                      title: "消息中间件",
                    },
                    {
                      type: 'crud',
                      source: '${mqComponents}',
                      affixHeader: false,
                      mode: 'cards',
                      placeholder: '暂无组件',
                      columnsCount: 4,
                      card: crudCards,
                    },
                  ],
                },
                {
                  title: '数据库',
                  name: 'db',
                  body: [
                    {
                      type: "fieldSet",
                      title: "数据库",
                    },
                    {
                      type: 'crud',
                      source: '${dbComponents}',
                      affixHeader: false,
                      mode: 'cards',
                      placeholder: '暂无组件',
                      columnsCount: 4,
                      card: crudCards,
                    },
                  ],
                },
                {
                  title: '网络交互',
                  name: 'networkTools',
                  body: [
                    {
                      type: "fieldSet",
                      title: "网络交互",
                    },
                    {
                      type: 'crud',
                      source: '${networkComponents}',
                      affixHeader: false,
                      mode: 'cards',
                      placeholder: '暂无组件',
                      columnsCount: 4,
                      card: crudCards,
                    },
                  ],
                },
                {
                  title: '数据转换组件',
                  name: 'dataConversionComponent',
                  body: [
                    {
                      type: "fieldSet",
                      title: "数据转换组件",
                    },
                    {
                      type: 'crud',
                      source: '${dtComponents}',
                      affixHeader: false,
                      mode: 'cards',
                      placeholder: '暂无组件',
                      columnsCount: 4,
                      card: crudCards,
                    },
                  ],
                },
                {
                  title: '调度任务',
                  name: 'schedulingTask',
                  body: [
                    {
                      type: 'fieldSet',
                      title: '调度任务',
                    },
                    {
                      type: 'crud',
                      source: '${taskComponents}',
                      affixHeader: false,
                      mode: 'cards',
                      placeholder: '暂无组件',
                      columnsCount: 4,
                      card: crudCards,
                    },
                  ],
                }]
              let result = componentLinks.filter((item:any) => {return -1 != componentSupermarketList.indexOf(item.title)});
              return {
                type: 'anchor-nav',
                active: 0,
                className: 'ml-8 mt-8',
                sectionClassName: 'bg-transparent ml-8 -mt-6 h-screen-sub-140',
                links: result,
              }
            }
          }
        }
      }
    ],
  };

  return <>
    <AmisRenderer schema={schema} breadcrumb={{ routes: [] }} />
    <Footer/>
  </>
};
export default Supermarket;
