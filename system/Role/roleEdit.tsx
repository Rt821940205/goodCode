import {history} from "@@/core/history";
import {graphQlerrorsHandle} from "@/services/xuanwu/api";

const roleAddQuery = 'mutation create($obj:input_sys_role!){ create_sys_role(obj:$obj) }'

/**
 * 角色信息编辑
 */
export const roleInfoForm = {
  type: 'form',
  id:'roleFormChange',
  name: 'roleInfo',
  panelClassName:"wrap-with-panel-false",
  reload: 'roleList',
  initApi: {
    method: 'post',
    url: '/api/graphql?query=${chooseId}',
    data: {
      query: `{
              pages_sys_role(obj: {id:"$chooseId"}, pageNum: 1, pageSize:100) {
                data {
                  parent_id
                  name
                  description
                  remark
                  id
                }
                pageNum
                pageSize
                total
              }
            }`,
      variables: {
        chooseId: '$chooseId'
      },
    },
    adaptor: function (payload: any, response: any, api: any) {
      if(api.data.variables.id == "" || api.data.variables.id == undefined){
        let chooseId = payload?.data.pages_sys_role?.data[0]?.id
        history.replace('/system/role?chooseId='+chooseId)
      }
      
      return {
        data: {
          ...payload?.data.pages_sys_role?.data[0],
          // chooseId: chooseId,
          editable: true,
          editStatus: false,
          saveAble: false
        },
        // chooseId: chooseId
      };
    },
  },
  api: {
    method: 'post',
    url: '/api/graphql?_=role',
    data: {
      saveAble:'$saveAble',
      query: `mutation update(\\$id:Long!,\\$obj:input_sys_role!){ update_sys_role(id:\\$id,obj:\\$obj) }`,
      variables: {
        id: "$id",
        obj:{
          name:"$name",
          description:"$description"
        }
      },
    },
    requestAdaptor:function (api:any){
      let saveAble = api.data.saveAble
      if(saveAble == true){
        return {
          ...api,
          data:{
            query:roleAddQuery,
            variables:api.data.variables
          }
        }
      }
      return {
        ...api
      }
    },
    adaptor: function (payload: any) {
      return graphQlerrorsHandle(payload)
    },
  },
  title: '',
  actions: [
    {
      type: 'button',
      label: '取消',
      // 新增功能时展示 即编辑功能时隐藏
      visibleOn:  '${AND(saveAble == true,editStatus == true)}',
      actionType: 'cancel',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'saveAble',
              args: {
                // 置为不可编辑状态
                value: false,
              },
            },
            {
              actionType: 'setValue',
              componentId: 'editStatus',
              args: {
                // 置为不可编辑状态
                value: false,
              },
            },
          ],
          
        },
      }
    },
    {
      type: 'button',
      label: '取消',
      level:"light",
      // 编辑功能 可编辑状态时展示
      visibleOn: '${AND(editable == true,editStatus == true)}',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: "editStatus",
              args: {
                // 置为不可编辑状态
                value:false
              }
            }
          ]
        }
      }
    },
    {
      type: 'button',
      label: '编辑',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: "editStatus",
              args: {
                // 置为可编辑状态
                value:true
              }
            }
          ]
        }
      },
      // 编辑功能开启 且 编辑状态关闭时展示
      visibleOn: '${AND(editable== true,editStatus == false)}',
      level: 'primary'
    },
    {
      type: 'button',
      label: '保存',
      visibleOn: '${AND(editable === true,editStatus == true)}',
      actionType: 'submit',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'editStatus',
              args: {
                // 置为不可编辑状态
                value: false,
              },
            },
          ]
        }
      }
    },
    {
      type: 'button',
      label: '保存',
      visibleOn: '${AND(saveAble == true,editStatus == true)}',
      actionType: 'submit',
      level: 'primary',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'editStatus',
              args: {
                // 置为不可编辑状态
                value: false,
              },
            },
            {
              actionType: "url",
              args: {
                url: "/system/role",
                blank: false,
              }
            },
          ]
        }
      }
    }
  ],
  mode: "horizontal",
  body: [
    {
      type: 'hidden',
      name: 'id'
    },
    {
      type: 'input-text',
      label: '角色名称:',
      visibleOn: '${OR(saveAble== true,editStatus == true)}',
      showCounter: true,
      maxLength: 20,
      validations: {
        maxLength: 20,
      },
      validationErrors: {
        maxLength: '长度超出限制，请输入小于20字的名称',
      },
      placeholder: '请输入一个长度小于20的名称',
      required: true,
      name: 'name',
    },
    {
      type: 'static',
      label: '角色名称:',
      showCounter: true,
      visibleOn: '${AND(saveAble == false,editStatus == false)}',
      name: 'name'
    },
    {
      label: '角色描述:',
      visibleOn: '${OR(saveAble== true,editStatus == true)}',
      showCounter: true,
      maxLength: 500,
      validations: {
        maxLength: 500,
      },
      validationErrors: {
        maxLength: '长度应该小于500',
      },
      
      size: 'md',
      type: 'textarea',
      name: 'description',
    },
    {
      label: '角色描述:',
      showCounter: true,
      visibleOn: '${AND(saveAble == false,editStatus == false)}',
      size: 'md',
      type: 'static',
      name: 'description',
    },
    {
      type: 'hidden',
      // 是否是编辑功能
      name: 'editable',
      id: 'editable',
      style:{
        color: 'white'
      }
    },
    {
      type: 'hidden',
      // 是否是可编辑状态
      name: 'editStatus',
      id: 'editStatus',
      style:{
        color: 'white'
      }
    },
    {
      type: 'hidden',
      // 是否是可保存功能
      name: 'saveAble',
      id: 'saveAble',
      style:{
        color: 'white'
      }
    }
  ]
};
