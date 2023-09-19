
/**
 * 组织架构树
 */
export const navTree = {
  type: 'container',
  className: 'h-full',
  bodyClassName:"h-full flex flex-col",
  body: [
    {
      type: 'tpl',
      className: 'flex justify-center text-black py-2',
      tpl: '组织架构树',
    },
    {
      type: 'input-text',
      name: 'organize_name',
      inputControlClassName: 'w-full',
      className:"mx-2",
      placeholder: '请输入组织名称',
      clearable: true
    },
    {
      type: 'container',
      bodyClassName: 'flex items-center justify-between	mx-2',
      body: [
      {
        type: 'tpl',
        tpl: '添加单位',
        className:"text-primary"
      },
      {
        type: 'button',
        level: 'link',
        className:"p-0 text-lg",
        align: 'right',
        icon: 'fa-regular fa-square-plus',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'clear',
                componentId: "orgFormChange"
              },
              {
                actionType: 'setValue',
                componentId: "orgCategory",
                args: {
                  value:'office'
                }
              },
              {
                actionType: 'setValue',
                componentId: "editable",
                args: {
                  value: false
                }
              },
              {
                actionType: 'setValue',
                componentId: "rootNode",
                args: {
                  value: true
                }
              },
              {
                actionType: 'setValue',
                componentId: "editStatus",
                args: {
                  value: true
                }
              },
              {
                actionType: 'setValue',
                componentId: "saveAble",
                args: {
                  value: true
                }
              },
              {
                actionType: 'changeActiveKey',
                componentId: 'orgTab',
                args: {
                  'activeKey': 1
                }
              }
            ]
          }
        },
        },
      ]
    },
    {
      type: "divider",
      className:"mt-0"
     },
    {
      type:'service',
      name: 'organizeNav',
      className: 'flex-1 overflow-auto mx-2 mb-2',
      api: {
        method: 'post',
        url: '/api/graphql?organize_name=${organize_name}&init=${addOff}',
        data: {
          query: `query find(\\$obj:input_sys_organize!){
            find_sys_organize(obj:\\$obj){
            id code organize_name level parent_id category}
          }`,
          variables: {
            obj:{
              organize_name:"$organize_name",
              parent_id: 0
            }
          }
        },
        requestAdaptor:function (api:any){
            if(api.data.variables.obj.organize_name !== ""){
              delete api.data.variables.obj.parent_id
            }
            return {...api}
        },
        adaptor: function (payload:any) {
          let list = payload.data.find_sys_organize;
          let options: Array<any> = [];
          if(list == undefined){
            return {
              links:options
            }
          }
          list.forEach((item: any,index:any) => {
            item.parent_id = item.parent_id ? item.parent_id.toString() : 0;
            options.push({
              label: item.organize_name,
              value: item.id,
              id:item.id,
              category:item.category,
              biz:item.category,
              to:'?organizeId='+item.id,
              organize_name:item.organize_name,
              unfolded:false,
              // 1 没有叶子节点  0 有叶子节点
              leaf:list.length === 0?1:0,
              defer:true,
              level:0
            })
          });

          return {
            links: options,
          };
        },
      },
      body:{
        type: 'nav',
        stacked: true,
        draggable: true,
        dragOnSameLevel: true,
        biz: 'office',
        deferApi:{
          method: 'post',
          url: '/api/graphql?organize_name=${organize_name}&init=${addOff}&_=defer',
          data: {
            query: `{
            find_sys_organize(obj:{parent_id:"$id"}){
            id code organize_name level parent_id category}
          }`,
            variables: {
            },
          },
          adaptor:function (payload:any) {
            const options:Array<any> = []
            payload.data.find_sys_organize.forEach((i:any)=>{
              options.push({
                label: i.organize_name,
                value: i.id,
                id:i.id,
                category:i.category,
                biz:i.category,
                to:'?organizeId='+i.id,
                organize_name:i.organize_name,
                unfolded:false,
                // 1 没有叶子节点  0 有叶子节点
                leaf:payload.data.find_sys_organize.length === 0?1:0,
                defer:true,
                level:0
              })
            })
            return {
              links: options
            }
          }
        },
        source: '${links}',
        className: 'org-nav-list',
        itemActions: [
          {
            type: 'tooltip-wrapper',
            className: 'org-btn-delete hidden',
            tooltip: '删除',
            body: {
              icon: 'fa fa-trash-can',
              className: 'text-danger',
              size:'large',
              type: 'button',
              level: 'link',
              reload:'organizeNav?addOff=123',
              actionType: 'dialog',
              dialog: {
                title: '系统消息',
                closeOnEsc: true,
                reload:'organizeNav?addOff=123',
                type: 'form',
                actionType: 'ajax',
                body: {
                  body: '删除组织[${organize_name}]将删除组织下所有关联成员身份及角色，是否确认删除',
                  title: '',
                  type: 'form',
                  initApi:{
                    method: 'post',
                    url: '/api/graphql?organize_name=${organize_name}&init=${addOff}&_=defer',
                    data: {
                      query: `{
            find_sys_organize(obj:{parent_id:"$id"}){
            id code organize_name level parent_id category}
          }`,
                      variables: {
                      },
                    },
                    adaptor:function(payload:any){
                      let leaf = true
                      if(payload.data.find_sys_organize?.length> 0){
                          leaf = false
                      }
                      return {...payload,data:{leaf:leaf}}
                    }
                  },
                  message: {
                    success: '删除成功!',
                    failed: '删除失败!',
                  },
                  reload:'organizeNav?addOff=123',
                  api: {
                    method: 'post',
                    url: '/api/graphql',
                    data: {
                      leaf: '${leaf}',
                      query: 'mutation{delete_sys_organize(id:${id},obj:{})}',
                      variables: null,
                    },
                    requestAdaptor:function (api:any){
                      let leaf = api.data.leaf
                      // 如果不是叶子节点
                      if(leaf != true){
                        return {
                          ...api,
                          data:{
                            undeletable: 1
                          }
                        }
                      }
                    },
                    adaptor: function (payload: any,response:any,api:any) {
                      let undeletable = api.data.undeletable
                      if (undeletable == 1){
                        return {
                          status:2,
                          msg: '当前节点非叶子节点不可删除，请先删除叶子节点'
                        }
                      }
                      let backNum = payload.data.delete_sys_organize;
                      return {
                        backNum: backNum,
                      };
                    },
                  },
                }
              },
            },
          },
          {
            type: 'button',
            icon: 'fa-regular fa-square-plus', // fa-ellipsis-h
            className:"pl-0",
            hideCaret: true,
            level: 'link',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'clear',
                    componentId: "orgFormChange"
                  },
                  {
                    actionType: 'setValue',
                    componentId: "orgCategory",
                    args: {
                      value:'${category}'
                    }
                  },
                  {
                    actionType: 'setValue',
                    componentId: "parentCategory",
                    args: {
                      value:'${category}'
                    }
                  },
                  {
                    actionType: 'setValue',
                    componentId: "orgParentId",
                    args: {
                      value:'${id}__${category}'
                    }
                  },
                  {
                    actionType: 'setValue',
                    componentId: "rootNode",
                    args: {
                      value: false
                    }
                  },
                  {
                    actionType: 'setValue',
                    componentId: "editable",
                    args: {
                      value: false
                    }
                  },
                  {
                    actionType: 'setValue',
                    componentId: "editStatus",
                    args: {
                      value: true
                    }
                  },
                  {
                    actionType: 'setValue',
                    componentId: "saveAble",
                    args: {
                      value: true
                    }
                  },
                  {
                    actionType: 'changeActiveKey',
                    componentId: 'orgTab',
                    args: {
                      'activeKey': 1
                    }
                  }
                ]
              }
            },
          }
        ]
      }
    }
  ]
};
