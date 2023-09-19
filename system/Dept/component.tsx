
/**
 * 上级单位下拉框
 */
export const parentOfficeSelect = {
  label: '上级单位:',
  type: 'tree-select',
  id: 'orgParentId',
  placeholder: '请选择',
  // 只有单位才可以直接取上级单位 ， 部门需要是一颗树
  hiddenOn:'${OR(rootNode == true,category=="department")}',
  // 编辑功能开启 编辑状态关闭时禁用 不允许给根节点添加上级单位
  disabledOn: '${AND(editable == true,editStatus == false)}',
  visibleOn: '${OR(saveAble == true,editStatus == true)}',
  name: 'parent_id',
  value: '',
  sortable: true,
  // selectMode: 'tree',
  // pickerSize: 'md',
  deferApi:{
    method: 'post',
    url: '/api/graphql',
    data: {

      query:`{
                offices:find_sys_organize(obj:{parent_id:"$id"}){id code organize_name level parent_id category}
              }`,
      variables: {
      },
    },
    adaptor:function (payload:any) {
      const options:Array<any> = []
      payload.data.offices.forEach((item:any)=>{
        options.push({
          label: item.organize_name,
          value: item.id + '__' + item.category,
          id:item.id,
          category:item.category,
          biz:item.category,
          organize_name:item.organize_name,
          defer:true
        })
      })
      return {
        options: options
      }
    }
  },
  source:{
    method: 'post',
    url: '/api/graphql',
    data: {

      query:`{
                offices:find_sys_organize(obj:{category:"office",parent_id:0}){id code organize_name level parent_id category}
              }`,
      variables: {
      },
    },
    adaptor: function (payload:any) {
      let list = payload.data.offices;
      let options: Array<any> = [];
      if(Array.isArray(list) && list.length == 0){
        return {
          options: options
        }
      }
      list.forEach((item: any) => {
        item.parent_id = item.parent_id ? item.parent_id.toString() : 0;
        options.push({
          label: item.organize_name,
          value: item.id + '__' + item.category,
          id:item.id,
          category:item.category,
          biz:item.category,
          organize_name:item.organize_name,
          defer:true
        })
      });
      return {
        options: options
      };
    },
  }
};
/**
 * 上级组织source
 */
export const parenOrganizeSelectSource = {
  method: 'post',
  url: '/api/graphql',
  data: {

    query:`{
                offices:find_sys_organize(obj:{parent_id:0}){id code organize_name level parent_id category}
              }`,
    variables: {
    },
  },
  adaptor: function (payload:any) {
    let list = payload.data.offices;
    let options: Array<any> = [];
    if(Array.isArray(list) && list.length == 0){
      return {
        options: options
      }
    }
    list.forEach((item: any) => {
      item.parent_id = item.parent_id ? item.parent_id.toString() : 0;
      options.push({
        label: item.organize_name,
        value: item.id + '__' + item.category,
        id:item.id,
        category:item.category,
        biz:item.category,
        organize_name:item.organize_name,
        defer: true
      });
    });
    return {
      options: options
    };
  }
};
/**
 * 上级组织下拉框
 */
export const parentOrganizeSelect = {
  type: 'tree-select',
  label: '上级组织:',
  id: 'orgParentId',
  // 只有部门才可以直接取上级组织
  disabledOn: '${AND(editable == true,editStatus == false)}',
  hiddenOn:'this.category == "office" ',
  visibleOn: '${OR(saveAble == true,editStatus == true)}',
  placeholder: '请选择',
  name: 'parent_id',
  value: '',
  sortable: true,
  deferApi:{
    method: 'post',
    url: '/api/graphql',
    data: {

      query:`{
                offices:find_sys_organize(obj:{parent_id:$id}){id code organize_name level parent_id category}
              }`,
      variables: {
      },
    },
    adaptor: function (payload:any) {
      let list = payload.data.offices;
      let options: Array<any> = [];
      if(Array.isArray(list) && list.length == 0){
        return {
          options: options
        }
      }
      list.forEach((item: any) => {
        item.parent_id = item.parent_id ? item.parent_id.toString() : 0;
        options.push({
          label: item.organize_name,
          value: item.id + '__' + item.category,
          id:item.id,
          category:item.category,
          biz:item.category,
          organize_name:item.organize_name,
          defer: true
        });
      });
      return {
        options: options
      };
    }
  },
  // selectMode: 'tree',
  // pickerSize: 'md',
  source: parenOrganizeSelectSource
};
