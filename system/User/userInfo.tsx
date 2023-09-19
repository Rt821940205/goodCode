import {history} from '@@/core/history';

const userAddQuery = 'mutation create($obj:input_sys_user_info!){create_sys_user_info(obj:$obj)}'

export const userInfoForm = {
  type: 'form',
  name: 'userInfo',
  id: 'userFormChange',
  panelClassName:"wrap-with-panel-false",
  // initFetchOn: 'this.userId',
  data:{
    userId: "$userId"
  },
  initApi: {
    method: 'post',
    url: '/api/graphql?query=${userId}',
    data: {
      query: `query find($id:ID!){
               userInfo:find_sys_user_info(obj: {id:$id}) {
                  id_card
                  staff_card
                  real_name
                  id
                  state
                  email
                  sex
                  mobile
                  avatar
                  short_no
                  leader_id
                  leader:sys_user_info_just_sys_user_info{
                    real_name
                  }
                  #关联sys_account
                  account:sys_user_info_just_sys_account{
                    account_name
                  }
                }
              }
             `,
      variables: {
        "id":"$userId"
      },
    },
    requestAdaptor:function (api:any){
      if(api.data.variables.id == "" || api.data.variables.id == undefined){
        api.data.query = "query find{userInfo:pages_sys_user_info(pageNum:1,pageSize:10,obj:{}){data{id_card staff_card real_name id state email sex mobile avatar short_no leader_id leader:sys_user_info_just_sys_user_info{real_name}account:sys_user_info_just_sys_account{account_name}}pageNum pageSize total pageSize}}"
      }else {
        api.data.query = `query find($id:ID!){userInfo:pages_sys_user_info(pageNum:1,pageSize:10,obj:{id:$id}){data{id_card staff_card real_name id state email sex mobile avatar short_no leader_id leader:sys_user_info_just_sys_user_info{real_name}account:sys_user_info_just_sys_account{account_name}}pageNum pageSize total pageSize}}`
      }
      return {...api}
    },
    adaptor: function (payload: any,response:any,api:any) {
      let leaderId:any = "";
      if (payload.data.userInfo.data[0].leader) {
        leaderId = {
          label: payload?.data.userInfo?.data[0]?.leader?.real_name,
          value: payload?.data.userInfo?.data[0]?.leader_id + ''
        }
      }
      if(api.data.variables.id == "" || api.data.variables.id == undefined){
        history.replace('/system/user?userId=' + payload?.data?.userInfo?.data[0]?.id);
      }
      return {
        data: {
          ...payload?.data.userInfo.data[0],
          leaderId: leaderId,
          editable: true,
          editStatus: false,
          saveAble: false,
          account_name: payload?.data?.userInfo.data[0]?.account.account_name
        }
      };
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
                url: "/system/user?page=1",
                blank: false,
              }
            },
          ]
        }
      }
    },
    
  ],
  api: {
    method: 'post',
    url: '/api/graphql?_=update_sys_user_info',
    data: {
      editable:'$editable',
      editStatus:'$editStatus',
      saveAble:'$saveAble',
      query:
        'mutation update(\\$id:Long!,\\$obj:input_sys_user_info!){update_sys_user_info(id:\\$id,obj:\\$obj)}',
      variables: {
        account_name: "$account_name",
        id: "$id",
        obj: {
          real_name: "$real_name",
          mobile: "$mobile",
          staff_card: "$staff_card",
          sex: "$sex",
          email: "$email",
          leader_id: "$leaderId",
          id_card: "$id_card",
        }
      },
    },
    requestAdaptor: function (api: any) {
      let repeated = api.data.repeated
      // let editable = api.data.editable
      let saveAble = api.data.saveAble
      // let editStatus = api.data.editStatus
      if (repeated) {
        return {
          ...api,
          data: {}
        }
      }
      let leader_id = api.data.variables.obj.leader_id
      if(leader_id == '' || leader_id == undefined){
        delete api.data.variables.obj.leader_id
      }
      if(leader_id?.label){
        api.data.variables.obj.leader_id = api.data.variables.obj.leader_id?.value
      }
      if(saveAble == true){
        let obj = api.data.variables.obj
        obj.sys_user_info_just_sys_account = {
          account_name:api.data.variables.account_name
        }
        return {
          ...api,
          data:{
            query:userAddQuery,
            variables:{
              obj:obj
            }
          }
        }
      }
      return {
        ...api
      }
    },
    adaptor: function (payload: any,response:any,api:any) {
      if(Array.isArray(payload.errors)){
        let errors = payload.errors
        let extensions = errors[0].extensions
        if('重复唯一值' == extensions.message){
          return {
            status: 2,
            msg: '不能添加重复用户'
          }
        }
      }
      return {
        ...payload,
        data: {
          repeated:false
        }
      };
    },
  },
  reload: 'userInfoList',
  mode: "horizontal",
  columnCount: 2,
  body: [
    {
      type:'hidden',
      name: 'repeated',
      value: false
    },
    {
      type: 'hidden',
      name: 'id'
    },
    {
      type: 'input-text',
      label: '用户账号:',
      showCounter: true,
      required: true,
      // 编辑功能 但是编辑状态打开时
      visibleOn: '${AND(editable== true,editStatus == true)}',
      // 用户账号不可编辑
      disabled: true,
      name: 'account_name',
    },
    {
      type: 'input-text',
      label: '用户账号:',
      required: true,
      maxLength: 64,
      validations: { maxLength: 64  ,matchRegexp: '/^[a-zA-Z][0-9a-zA-Z_]{1,}$/',},
      placeholder: '最大长度64字符，允许英文字母、数字、下划线',
      validationErrors: { maxLength: '长度超出限制，请输入小于64字的账号' , matchRegexp: '请以字母开头，允许英文字母、数字、下划线',},
      showCounter: true,
      // 新增时可以输入
      visibleOn: 'this.saveAble == true',
      name: 'account_name',
    },
    {
      type: 'static',
      label: '用户账号:',
      // 编辑状态时只能静态查看
      visibleOn: '${AND(saveAble == false,editStatus == false)}',
      name: 'account_name',
    },
    {
      type: 'input-text',
      label: '用户名称:',
      showCounter: true,
      required: true,
      visibleOn: '${OR(saveAble== true,editStatus == true)}',
      maxLength: 64,
      validations: {
        maxLength: 64,
        matchRegexp: '/^[a-zA-Z_\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]*$/',
      },
      validationErrors: {
        maxLength: '长度超出限制，请输入小于64字的名称',
        matchRegexp: '允许包含中文、英文字母、数字、下划线不能以数字开头',
      },
      placeholder: '最大长度64字符，允许英文字母、中文、数字、下划线',
      name: 'real_name'
    },
    {
      type: 'static',
      label: '用户名称:',
      // 编辑状态时只能静态查看
      visibleOn: '${AND(saveAble == false,editStatus == false)}',
      showCounter: true,
      name: 'real_name'
    },
    {
      type: 'input-text',
      label: '手机号码:',
      showCounter: true,
      validations: {
        isPhoneNumber: true
      },
      maxLength: 11,
      validationErrors: {
        isPhoneNumber: '只允许填写11位数字'
      },
      visibleOn: '${OR(saveAble== true,editStatus == true)}',
      name: 'mobile',
      required: true,
      placeholder: '只允许填写11位数字',
    },
    {
      type: 'static',
      label: '手机号码:',
      visibleOn: '${AND(saveAble == false,editStatus == false)}',
      name: 'mobile'
    },
    {
      type: 'input-text',
      label: '工号:',
      visibleOn: '${OR(saveAble== true,editStatus == true)}',
      name: 'staff_card',
      onEvent: {
        blur: {
          actions: [
            {
              actionType: 'custom',
              script: function (props: any, doAction: any, event: any) {
                const staff_card = event.context.data.value
                // 新增模式
                const saveAble = event.context.data.__super.saveAble
                // 编辑状态
                const editStatus = event.context.data.__super.editStatus
                const id = event.context.data.__super.id
                doAction({
                  actionType: 'ajax',
                  args: {
                    api: {
                      method: 'post',
                      url: '/api/graphql?_=checkIdCard',
                      data: {
                        query: `{
                            pages_sys_user_info(obj: {staff_card: "` + staff_card + `" ,state:1 }, pageNum: 1, pageSize: 1) {
                              data {
                                id
                                staff_card
                                state
                              }
                              pageNum
                              pageSize
                              total
                            }
                          }`,
                        variables: {
                          staff_card: staff_card
                        }
                      },
                      adaptor: function (payload: any,response:any,api:any) {
                        // 如果根据输入的id查到了记录 新增时直接判定为重复数据
                        // 编辑时需要再次判定是否是自己 即 id是否相同
                        let repeat = payload.data.pages_sys_user_info.data
                        if (staff_card!='' && staff_card != undefined && Array.isArray(repeat) && repeat.length > 0) {
                          if(saveAble){
                            api.data.repeated = true
                            console.log('工号已重复')
                            return {
                              status: 2,
                              msg: '不能添加重复用户'
                            }
                          }
                          if(editStatus){
                            const other = repeat.filter((item: any) => {
                              return item.id != id
                            })
                            if(Array.isArray(other) && other.length >0){
                              api.data.repeated = true
                              console.log('工号已重复')
                              return {
                                status: 2,
                                msg: '不能添加重复用户'
                              }
                            }
                          }
                        }
                        return {
                          ...payload,
                          data:{
                            repeated: true
                          }
                        }
                      }
                    }
                  }
                })
              }
            }
          ]
        }
      }
    },
    {
      type: 'static',
      label: '工号:',
      visibleOn: '${AND(saveAble == false,editStatus == false)}',
      name: 'staff_card'
    },
    {
      type: 'select',
      name: 'sex',
      label: '性别:',
      required: true,
      // 编辑功能时不可编辑 编辑状态及新增功能时可以编辑
      // disabledOn: '${AND(editable== true,editStatus == false)}',
      visibleOn: '${OR(saveAble== true,editStatus == true)}',
      options: [
        {
          label: '男',
          value: 1,
        },
        {
          label: '女',
          value: 2,
        },
        {
          label: '未知',
          value: 0,
        },
      ],
    },
    {
      type: 'static-mapping',
      label: '性别:',
      visibleOn: '${AND(saveAble == false,editStatus == false)}',
      name: 'sex',
      map: {
        "1": "男",
        "2": "女",
        "0": "未知",
      }
    },
    {
      type: 'input-email',
      label: '电子邮箱:',
      visibleOn: '${OR(saveAble== true,editStatus == true)}',
      name: 'email',
      placeholder: '允许中文、英文字母、数字或特殊符号，请填写正确的电子邮箱',
    },
    {
      type: 'static',
      label: '电子邮箱:',
      visibleOn: '${AND(saveAble == false,editStatus == false)}',
      name: 'email'
    },
    {
      type: 'input-text',
      required: true,
      visibleOn: '${OR(saveAble== true,editStatus == true)}',
      label: '身份证号:',
      validations: {  isId : true, },
      placeholder: '请输入身份证号码',
      validationErrors: { isId: '请输入正确的身份证号码' },
      onEvent: {
        blur: {
          actions: [
            {
              actionType: 'custom',
              script: function (props: any, doAction: any, event: any) {
                const idCard = event.context.data.value
                // 新增模式
                const saveAble = event.context.data.__super.saveAble
                // 编辑状态
                const editStatus = event.context.data.__super.editStatus
                const id = event.context.data.__super.id
                doAction({
                  actionType: 'ajax',
                  args: {
                    api: {
                      method: 'post',
                      url: '/api/graphql?_=checkIdCard',
                      data: {
                        query: `{
                            pages_sys_user_info(obj: {id_card: "` + idCard + `" ,state:1}, pageNum: 1, pageSize: 1) {
                              data {
                                id
                                id_card
                                state
                              }
                              pageNum
                              pageSize
                              total
                            }
                          }`,
                        variables: {
                          idCard: idCard
                        }
                      },
                      adaptor: function (payload: any,response:any,api:any) {
                        // 如果根据输入的id查到了记录 新增时直接判定为重复数据
                        // 编辑时需要再次判定是否是自己 即 id是否相同
                        let repeat = payload.data.pages_sys_user_info.data
                        if (idCard!='' && idCard != undefined && Array.isArray(repeat) && repeat.length > 0) {
                            if(saveAble){
                              api.data.repeated = true
                              console.log('身份证号已重复')
                              return {
                                status: 2,
                                msg: '不能添加重复用户'
                              }
                            }
                            if(editStatus){
                              const other = repeat.filter((item: any) => {
                                return item.id != id
                              })
                              if(Array.isArray(other) && other.length >0){
                                api.data.repeated = true
                                console.log('身份证号已重复')
                                return {
                                  status: 2,
                                  msg: '不能添加重复用户'
                                }
                              }
                            }
                        }
                        return {
                          ...payload,
                          data:{
                            repeated: true
                          }
                        }
                      }
                    }
                  }
                })
              }
            }
          ]
        }
      },
      name: 'id_card'
    },
    {
      type: 'static',
      label: '身份证号:',
      visibleOn: '${AND(saveAble == false,editStatus == false)}',
      name: 'id_card'
    },
    {
      type: 'select',
      selectMode: 'associated',
      leftMode: 'tree',
      // 编辑功能开启 编辑状态关闭时禁用
      // disabledOn: '${AND(editable == true,editStatus == false)}',
      visibleOn: '${OR(saveAble== true,editStatus == true)}',
      label: '汇报对象:',
      placeholder: '请选择',
      name: 'leaderId',
      value: '',
      sortable: true,
      searchable: true,
      searchPlaceholder: '请选择',
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
        adaptor: "return {...payload, data: {options: " +
          "payload.data.find_sys_organize?payload.data.find_sys_organize.map(it=>{return {label: it.organize_name, value: it.id, defer: true}})" +
          ": payload.data.find_sys_organize_user.map(it=>{return {label: it.user?.real_name, value: it.user.id}})" +
          "}}"
      }

    },
    {
      type: 'static-mapping',
      label: '汇报对象:',
      visibleOn: '${AND(saveAble == false,editStatus == false)}',
      value: "通配值"

    },
    {
      type: 'static',
      // 是否是编辑功能
      name: 'editable',
      id: 'editable',
      style:{
        color: 'white'
      }
    },
    {
      type: 'static',
      // 是否是可编辑状态
      name: 'editStatus',
      id: 'editStatus',
      style:{
        color: 'white'
      }
    },
    {
      type: 'static',
      // 是否是可保存功能
      name: 'saveAble',
      id: 'saveAble',
      style:{
        color: 'white'
      }
    }
  ]
};
