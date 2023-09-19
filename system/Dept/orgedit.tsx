import {parentOfficeSelect, parentOrganizeSelect} from '@/pages/system/Dept/component';
import {beforeGraphQlHandle, graphQlerrorsHandle} from '@/services/xuanwu/api';
import {history} from '@@/core/history';


const officeAddApiQuery =
  'mutation create($obj:input_sys_organize!){create_sys_organize(obj:$obj)}';
const departmentQuery = 'mutation create($obj:input_sys_organize!){create_sys_organize(obj:$obj)}';

/**
 * 组织编辑
 */
export const orgedit = {
  type: 'form',
  id: 'orgFormChange',
  name: 'orgFormChange',
  reload: 'organizeNav',
  panelClassName:"wrap-with-panel-false",
  // initFetchOn: 'this.organizeId',
  initApi: {
    method: 'post',
    url: '/api/graphql?query=${organizeId}',
    data: {
      query: `query find($id:Long!){
              pages_sys_organize(obj: {id:$id}, pageNum: 1, pageSize:100) {
                data {
                  id
                  code
                  organize_name
                  simple_name
                  level
                  parent_id
                  leader_id
                  remark
                  category
                  sys_organize_just_sys_organize{
                    organize_name
                  }
                  sys_organize_reverse_sys_organize{
                    category
                  }
                }
                pageNum
                pageSize
                total
              }
            }`,
      variables: {
        id: '${organizeId}',
      },
    },
    requestAdaptor:function (api:any){
      if(api.data.variables.id == "" || api.data.variables.id == undefined){
        api.data.query = "query find{pages_sys_organize(obj:{parent_id:0},pageNum:1,pageSize:100){data{id code organize_name simple_name level parent_id leader_id remark category sys_organize_just_sys_organize{organize_name}sys_organize_reverse_sys_organize{category}}pageNum pageSize total}}"
      }else {
        api.data.query = `query find($id: ID!) {
  pages_sys_organize(obj: { id: $id }, pageNum: 1, pageSize: 100) {
    data {
      id
      code
      organize_name
      simple_name
      level
      parent_id
      leader_id
      remark
      category
      member: sys_organize_just_sys_organize {
        id
        organize_name
      }
      leader: sys_organize_just_sys_user_info {
        real_name
        id
      }
      parent: sys_organize_reverse_sys_organize {
        category
        organize_name
        id
      }
    }
    pageNum
    pageSize
    total
  }
}`
      }
      return {...api}
    },
    adaptor: function (payload: any,response:any,api:any) {
      if (
        Array.isArray(payload?.data?.pages_sys_organize?.data) &&
        payload?.data.pages_sys_organize?.data.length == 0
      ) {
        return {
          ...payload,
        };
      }
      let rootNode = false;
      let parent_id:any = "";
      if(payload?.data.pages_sys_organize?.data[0]?.parent?.organize_name){
        parent_id =  {
          label:payload?.data.pages_sys_organize?.data[0]?.parent?.organize_name,
          value:payload?.data.pages_sys_organize?.data[0]?.parent_id + '__' + payload?.data.pages_sys_organize?.data[0]?.parent?.category
        }
      }

      if (payload?.data.pages_sys_organize?.data[0]?.code == '001') {
        parent_id = "";
        rootNode = true;
      }

      let organizeList = payload?.data.pages_sys_organize?.data.filter((item: any) => {
        return item.parent_id == 0;
      });

      let parentCategory =
        organizeList != undefined && organizeList?.length == 0
          ? payload?.data.pages_sys_organize?.data[0].category
          : organizeList[0].category;

      if(api.data.variables.id == "" || api.data.variables.id == undefined){
        history.replace('/system/dept?organizeId=' +  payload?.data?.pages_sys_organize?.data[0]?.id);
      }
      let leader_id:any = "";
      if(payload?.data?.pages_sys_organize?.data[0]?.leader_id){
        leader_id = {
          label: payload?.data?.pages_sys_organize?.data[0]?.leader?.real_name,
          value:payload?.data?.pages_sys_organize?.data[0]?.leader_id + ''
        }
      }
      return {
        data: {
          ...payload?.data.pages_sys_organize?.data[0],
          parent_id: parent_id,
          rootNode: rootNode,
          categoryShow: payload?.data.pages_sys_organize?.data[0].category,
          // 编辑功能开启
          editable: true,
          parentCategory: parentCategory,
          // 当前为不可编辑状态
          editStatus: false,
          saveAble: false,
          leaderId:leader_id
        },
      };
    },
  },
  title: '',
  data:{
    "organizeId" :"$organizeId"
  },
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
      level:"light",
      label: '取消',
      // 编辑功能 可编辑状态时展示
      visibleOn: '${AND(editable == true,editStatus == true)}',
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
          ],
        },
      },
    },
    {
      type: 'button',
      label: '编辑',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'editStatus',
              args: {
                // 置为可编辑状态
                value: true,
              },
            },
          ],
        },
      },
      // 编辑功能开启 且 编辑状态关闭时展示
      visibleOn: '${AND(editable== true,editStatus == false)}',
      level: 'primary',
    },
    {
      type: 'button',
      label: '保存',
      visibleOn: '${AND(editable === true,editStatus == true)}',
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
            }
          ]
        }
      },
      actionType: 'submit',
      level: 'primary',
    },
    {
      type: 'button',
      label: '保存',
      visibleOn: '${AND(saveAble == true,editStatus == true)}',
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
                url: "/system/dept",
                blank: false,
              }
            },
          ]
        }
      },
      actionType: 'submit',
      level: 'primary',
    },
  ],
  api: {
    method: 'post',
    url: '/api/graphql?_=update_organization',
    data: {
      editable: '$editable',
      saveAble: '$saveAble',
      query:
        'mutation update(\\$id:Long!,\\$obj:input_sys_organize!){update_sys_organize(id:\\$id,obj:\\$obj)}',
      variables: {
        id: '$id',
        obj: {
          organize_name: '$organize_name',
          simple_name: '$simple_name',
          category: '$category',
          leader_id: '$leaderId',
          code: '$code',
          remark: '$remark',
          parent_id: '$parent_id',
          office_id: '$parent_id',
        },
      },
    },
    requestAdaptor: function (api: any) {
      let editable = api.data.editable;
      let saveAble = api.data.saveAble;
      let category = api.data.variables.obj.category;
      // 编辑模式
      if (editable == true) {
        if (
          api.data.variables.obj.leader_id == '' ||
          api.data.variables.obj.leader_id == undefined
        ) {
          delete api.data.variables.obj.leader_id;
        }
        if(api.data.variables.obj.leader_id?.label){
          api.data.variables.obj.leader_id = api.data.variables.obj.leader_id?.value
        }
        // 当前为单位时
        let parentValue = api.data.variables.obj.parent_id;

        if(api.data.variables.obj.parent_id?.label){
          parentValue = api.data.variables.obj.parent_id.value
        }
        let parentId = parentValue.substring(0, parentValue.indexOf('__'));

        let leaderValue = api.data.variables.obj.leader_id;

        if(api.data.variables.obj.leader_id?.label){
          leaderValue = api.data.variables.obj.leader_id.value
          api.data.variables.obj.leader_id = leaderValue
        }

        //如果他的父为单位，则parent_id和office_id相同
        if (-1 != parentValue.indexOf('office')) {
          let variables = api.data.variables;
          variables.obj.parent_id = parentId;
          variables.obj.office_id = parentId;
          return {
            ...api,
            data: {
              query: api.data.query,
              variables: variables,
            },
          };
        }
        if (-1 != parentValue.indexOf('department')) {
          let variables = api.data.variables;
          variables.obj.parent_id = parentId;
          // 父为部门时，不需要更新office_id
          delete variables.obj.office_id;
          return {
            ...api,
            data: {
              query: api.data.query,
              variables: variables,
            },
          };
        }
        // 适配一级单位 既没有上级单位也没有上级部门的情况
        if (parentValue == '') {
          delete api.data.variables.obj.parent_id;
          delete api.data.variables.obj.office_id;
          return {
            ...api,
            data: {
              query: api.data.query,
              variables: api.data.variables,
            },
          };
        }
        return {
          ...api,
        };
      }
      // 新增模式
      if (saveAble == true) {
        delete api.data.variables.id;
        let leader_id = api.data.variables.obj.leader_id
        if (
          leader_id == '' ||
          leader_id == undefined
        ) {
          delete api.data.variables.obj.leader_id;
        } else {
         
          leader_id = leader_id?.label ? leader_id.value : leader_id
          api.data.variables.obj.leader_id = leader_id
        }

        if (category == 'office') {
        
          let parent_id = api.data.variables.obj.parent_id;
          if(parent_id?.label){
            parent_id = parent_id?.value
          }
          // 一级单位没有上级单位
          if (parent_id == undefined || parent_id == '') {
            delete api.data.variables.obj.parent_id;
            delete api.data.variables.obj.office_id;
          } else {

            if (-1 != parent_id.indexOf('__')) {
              let newParentId = parent_id.substring(0, parent_id.indexOf('__'));
              if (-1 != parent_id.indexOf('__office')) {
                api.data.variables.obj.office_id = newParentId;
              } else {
                delete api.data.variables.obj.office_id;
              }
              api.data.variables.obj.parent_id = newParentId;
            }
          }
          return {
            ...api,
            data: {
              query: officeAddApiQuery,
              variables: {
                ...api.data.variables,
              },
            },
          };
        }
        if (category == 'department') {
          let parent_id = api.data.variables.obj.parent_id;
          let chooseOrganizeCategory = parent_id.substring(parent_id.indexOf('__') + 2);
          let chooseParentId = parent_id.substring(0, parent_id.indexOf('__'));
          if (chooseOrganizeCategory == 'department') {
            api.data.variables.obj.parent_id = chooseParentId;
            delete api.data.variables.obj.office_id;
          }
          if (chooseOrganizeCategory == 'office') {
            api.data.variables.obj.parent_id = chooseParentId;
            api.data.variables.obj.office_id = chooseParentId;
          }
          return {
            ...api,
            data: {
              query: departmentQuery,
              variables: {
                obj: {
                  ...api.data.variables.obj,
                },
              },
            },
          };
        }
      }
    },
    adaptor: function (payload: any, response: any, api: any) {
      if (beforeGraphQlHandle(payload)) {
        let editable = api.data.editable;
        console.log('editable :>> ', api.data);
        if (editable == '1') {
          let parent_id =
            payload?.data.pages_sys_organize?.data[0]?.parent_id +
            '__' +
            payload?.data.pages_sys_organize?.data[0]?.sys_organize_reverse_sys_organize?.category;
          if (payload?.data.pages_sys_organize?.data[0]?.code == '001') {
            parent_id = '';
          }
          let organizeId = api?.data?.variables?.organizeId;
          history.replace('/system/dept?organizeId=' + organizeId);
          return {
            data: {
              ...payload?.data.pages_sys_organize?.data[0],
              parent_id: parent_id,
              categoryShow: payload?.data.pages_sys_organize?.data[0].category,
              leaderId:
                payload?.data?.pages_sys_organize?.data[0]?.leader_id == undefined
                  ? ''
                  : payload?.data?.pages_sys_organize?.data[0]?.leader_id + '',
            },
          };
        }
      }
      return graphQlerrorsHandle(payload);
    },
  },
  mode: 'horizontal',
  columnCount: 2,
  body: [
    {
      type: 'hidden',
      name: 'id',
    },
    {
      type: 'input-text',
      label: '组织名称:',
      // 非编辑状态时隐藏
      visibleOn: '${OR(saveAble == true,editStatus == true)}',
      required: true,
      showCounter: true,
      name: 'organize_name',
      maxLength: 20,
      validations: {
        maxLength: 20,
      },
      validationErrors: {
        maxLength: '长度超出限制，请输入小于20字的名称',
      },
      placeholder: '请输入一个长度小于20的名称',
    },
    {
      type: 'static',
      label: '组织名称:',
      // 非编辑状态时隐藏
      visibleOn: '${AND(saveAble == false,editStatus == false)}',
      name: 'organize_name',
    },
    {
      type: 'input-text',
      label: '组织简称:',
      showCounter: true,
      visibleOn: '${OR(saveAble == true,editStatus == true)}',
      name: 'simple_name',
      maxLength: 20,
      validations: {
        maxLength: 20,
      },
      validationErrors: {
        maxLength: '长度超出限制，请输入小于20字的名称',
      },
      placeholder: '请输入一个长度小于20的名称',
    },
    {
      type: 'static',
      label: '组织简称:',
      visibleOn: '${AND(saveAble == false,editStatus == false)}',
      name: 'simple_name',
    },
    {
      type: 'select',
      label: "管理者: ",
      // 编辑功能开启 编辑状态关闭时禁用
      // disabledOn: '${AND(editable == true,editStatus == false)}',
      visibleOn: '${OR(saveAble == true,editStatus == true)}',
      name: 'leaderId',
      selectMode: 'associated',
      leftMode: 'tree',
      sortable: true,
      searchable: true,
      searchPlaceholder: '请选择',
      value: '',
      multiple: false,
      source: {
        method: 'post',
        url: '/api/graphql',
        data: {},
        graphql: "{find_sys_organize(obj:{parent_id:0}){id organize_name parent_id category}}",
        responseData:{
          "options":[],
          "options[0][leftOptions]": "${find_sys_organize|pick:label~organize_name,value~id,defer~organize_name}",
          "options[0][children]": "${find_sys_organize|pick:ref~id,defer~id}",
          "options[0][leftDefaultValue]": ''
        }
      },
      deferApi:{
        method: 'post',
        url: '/api/graphql?ref=${ref}&dep=${value}',
        data: {
          variables:{
            "ref": "${ref}",
            "dep": "${value}",
            "organize_id": "${ref|isTrue:ref:value}",
            "orgOptionLabel": "${value|isTrue:'orgOptions':'options'}",
            "userOptionLabel": "${ref|isTrue:'userOptions':'options'}",
          },
          query: `
              query find(\\$organize_id:Long!) {
                \${value|isTrue:'find_sys_organize(obj: { state: 1, parent_id: \$organize_id }) {id organize_name}':''}
                \${ref|isTrue:'find_sys_organize_user(obj: { state: 1, organize_id: \$organize_id }) { user:sys_organize_user_just_sys_user_info {id real_name} }': ''}
              }
            `
        },
        adaptor: function (payload:any){
          return {...payload, data: {options: payload.data.find_sys_organize?payload.data.find_sys_organize.map((it:any)=>{return {label: it.organize_name, value: it.id, defer: true}}): payload.data.find_sys_organize_user.map((it:any)=>{return {label: it.user?.real_name, value: it.user?.id}})}}}
      }
    },

    {
      type: 'static-mapping',
      label: '管理者:',
      visibleOn: '${AND(editable== true,editStatus == false)}',
      // user_id real_name
      value: '通配值'
    },
    {
      type: 'select',
      label: '类型:',
      placeholder: '请选择',
      name: 'category',
      disabledOn: '${AND(editable == true,editStatus == true)}',
      visibleOn: '${OR(saveAble == true,editStatus == true)}',
      id: 'orgCategory',
      options: [
        {
          label: '单位',
          hiddenOn: 'parentCategory == "department"',
          value: 'office',
        },
        {
          label: '部门',
          value: 'department',
        },
      ],
    },
    {
      type: 'hidden',
      label: '类型:',
      visibleOn: '${AND(editable== true,editStatus == false)}',
      name: 'categoryShow',
    },
    {
      type: 'static-mapping',
      label: '类型:',
      visibleOn: '${AND(editable== true,editStatus == false)}',
      name: 'categoryShow',
      map: {
        office: '单位',
        department: '部门',
      },
    },
    {
      type: 'input-text',
      required: true,
      visibleOn: '${OR(saveAble == true,editStatus == true)}',
      label: '唯一编码:',
      name: 'code',
    },
    {
      type: 'static',
      required: true,
      visibleOn: '${AND(saveAble == false,editStatus == false)}',
      label: '唯一编码:',
      name: 'code',
    },
    parentOfficeSelect,
    {
      label: '上级单位:',
      type: 'static-mapping',
      id: 'orgParentId',
      placeholder: '请选择',
      // 只有单位才可以直接取上级单位 ， 部门需要是一颗树
      hiddenOn: '${OR(rootNode == true,category=="department")}',
      // // 编辑功能开启 编辑状态关闭时禁用 不允许给根节点添加上级单位
      // disabledOn: '${AND(editable == true,editStatus == false)}',
      visibleOn: '${AND(editable== true,editStatus == false)}',
      value: '通配值',
      sortable: true
    },
    parentOrganizeSelect,
    {
      type: 'static-mapping',
      label: '上级组织:',
      id: 'orgParentId',
      // 只有部门才可以直接取上级组织
      hiddenOn: 'this.category == "office" ',
      visibleOn: '${AND(editable== true,editStatus == false)}',
      placeholder: '请选择',
      value: '通配值',
      sortable: true
      // selectMode: 'tree',
      // pickerSize: 'md'
    },
    {
      type: 'textarea',
      name: 'remark',
      visibleOn: '${OR(saveAble == true,editStatus == true)}',
      showCounter: true,
      maxLength: 500,
      validations: {
        maxLength: 500,
      },
      validationErrors: {
        maxLength: '长度应该小于500',
      },
      label: '组织描述:',
    },
    {
      type: 'static',
      name: 'remark',
      visibleOn: '${AND(saveAble == false,editStatus == false)}',
      label: '组织描述:',
    },
    {
      type: 'static',
      // 是否是编辑功能
      name: 'editable',
      id: 'editable',
      value: '',
      style: {
        color: 'white',
      },
    },
    {
      type: 'static',
      // 是否是可编辑状态
      name: 'editStatus',
      id: 'editStatus',
      value: '',
      style: {
        color: 'white',
      },
    },
    {
      type: 'static',
      // 是否是可编辑状态
      name: 'saveAble',
      id: 'saveAble',
      value: '',
      style: {
        color: 'white',
      },
    },
    {
      type: 'static',
      // 是否是根节点
      name: 'rootNode',
      id: 'rootNode',
      style: {
        color: 'white',
      },
    },
    {
      type: 'static',
      name: 'category',
      id: 'orgCategory',
      style: {
        color: 'white',
      },
    },
    {
      type: 'static',
      // 父节点类型
      id: 'parentCategory',
      name: 'parentCategory',
      style: {
        color: 'white',
      },
    },
  ],
};
