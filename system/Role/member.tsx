
/**
 * 个人信息
 */
export  const  member = {
  title: '个人成员',
  reload:true,
  tab: [{
    type: 'crud',
    columnsTogglable: false,
    name: 'personalMember',
    api: {
      method: 'post',
      url: '/api/graphql?query=${chooseId}',
      data: {
        query: `query find(\\$chooseId:Long!,\\$page:Int!,\\$perPage:Int!){
                            pages_sys_role_user(obj:{role_id: \\$chooseId,state:1 },pageNum:\\$page,pageSize:\\$perPage) {
                              data{id
                              role_id
                              sys_role_user_just_sys_user_info{
                                real_name
                                mobile
                                email
                                staff_card
                                id
                                leader_id
                              }
                              }
                              pageNum
                              pageSize
                              total
                            }
                          }`,
        variables: {
          chooseId:"$chooseId",
          page:"$page",
          perPage:"$perPage",
        },
      },
      adaptor: function (payload: any) {
        let items: Array<any> = []
        let role_users = payload?.data?.pages_sys_role_user.data
        role_users?.filter((item:any) => {
          return item.sys_role_user_just_sys_user_info != undefined
        }).forEach((item: any) => {
          items.push({
            id: item?.id,
            real_name: item.sys_role_user_just_sys_user_info?.real_name,
            mobile: item.sys_role_user_just_sys_user_info?.mobile,
            email: item.sys_role_user_just_sys_user_info?.email,
            staff_card: item.sys_role_user_just_sys_user_info?.staff_card
          })
        })
        return {
          items: items
        };
      },
    },
    syncLocation: false,
    autoGenerateFilter: true,
    headerToolbar:[
      {
        type: 'button',
        level: 'primary',
        label:'添加',
        align: 'right',
        actionType: 'dialog',
        reload: 'personalMember',
        dialog: {
          title: '添加成员',
          size: 'lg',
          reload: 'personalMember',
          body: [
            {
              type: 'form',
              initApi:{
                method: 'post',
                url: '/api/graphql?_=initRoleOrganize&role_id=${chooseId}',
                data:{
                  query: `{
                            find_sys_role_user(obj: {role_id:"$chooseId"}){
                              role_id
                              user_id
                              sys_role_user_just_sys_user_info{
                                real_name
                                id
                              }
                            }
                          }`,
                  variables: {
                  }
                },
                adaptor:function (payload:any,response:any,api:any){
                  let user_id = ''
                  let userMapper = {}
                  
                  payload.data.find_sys_role_user.filter((item:any) => {
                    return item.sys_role_user_just_sys_user_info != undefined
                  }).forEach((item: any) => {
                    const { sys_role_user_just_sys_user_info: { id, real_name } } = item
                    if (id) {
                      userMapper[id] = real_name
                    }
                    
                    if(user_id == ''){
                      user_id = item.user_id?.toString()
                    }else {
                      user_id =  user_id + ',' + item.user_id
                    }
                  })
                  return {
                    ...payload,
                    data:{
                      user_id:user_id,
                      chooseUserId: user_id,
                      userMapper
                    }
                  }
                }
              },
              api:{
                method: 'post',
                url: '/api/graphql?_=createRoleUser&role_id=${chooseId}',
                data:{
                  role_id: '${chooseId}',
                  user_id: '${user_id}',
                  chooseUserId: '${chooseUserId}',
                  query: `mutation {
                                        create_sys_role_user(obj: {role_id:"$chooseId",user_id:"$user_id"})
                                      }`,
                  variables: {
                    role_id: '${chooseId}'
                  }
                },
                requestAdaptor:function (api:any){
                  let userIds = api.data.user_id.split(',')
                  let choosedUserIds:Array<any> = []
                  if(api.data.chooseUserId !=undefined && api.data.chooseUserId != ''){
                    choosedUserIds = api.data.chooseUserId.split(',')
                  }
                  let query = `mutation create(`
                  let queryBody = ''
                  let role_id = api.data.role_id
                  const objs:Array<any> = []
                  userIds.forEach((userId:any) => {
                    if(-1 == choosedUserIds.indexOf(userId)){
                      objs.push({
                        role_id: role_id,
                        user_id: userId
                      })
                    }
                  })
                  let variables = {}
                  objs.forEach((obj, index) => {
                    query = query + '$obj' + index + ':input_sys_role_user!,'
                    variables['obj' + index] = obj
                    queryBody = queryBody + 'role_user' + index + ':' + 'create_sys_role_user(obj: $obj' + index + ')  '
                  })
                  query = query.substring(0, query.length - 1)
                  query = query + '){' + queryBody + '}'
                  console.log('=== query: ', query)
                  console.log('=== variables: ', variables)
                  return {
                    ...api,
                    data: {
                      query: query,
                      variables: variables
                    }
                  }
                },
                adaptor:function (payload:any,response:any,api:any){
                  if(api.data.skip != undefined && api.data.skip == true){
                    return {
                      status: 0,
                      msg: '保存成功'
                    }
                  }
                  return {
                    ...payload
                  }
                }
              },
              body: [
                {
                  type: 'hidden',
                  name : 'chooseId'
                },
                {
                  type: 'transfer',
                  required: true,
                  label: '请选择一个成员',
                  placeholder: '请选择',
                  name: 'user_id',
                  selectMode: 'associated',
                  leftMode: 'tree',
                  sortable: true,
                  searchable: true,
                  searchPlaceholder: '请选择',
                  value: '',
                  valueTpl: {
                    type: "tpl",
                    tpl:"<span class='text-black'>${IF(${userMapper\.${value}}, ${userMapper\.${value}}, ${label})}</span>"
                  },
                  multiple: true,
                  searchApi:{
                    method: 'post',
                    url: '/api/graphql',
                    data: {
                      query: `{
                          userInfos:pages_sys_user_info(obj: {real_name:"$term" ,state:1},pageNum:1,pageSize:100) {
                          data{
                                  real_name
                                  id
                                  state
                                  }
                                  pageNum
                                  pageSize
                                  total
                                }
                        }`,
                      variables: {},
                    },
                    adaptor: function (payload: any) {
                      let userInfos = payload.data.userInfos.data;
                      let options: Array<any> = userInfos.map((item: any) => {
                        return {
                          label: item?.real_name,
                          value: item.id
                        }
                      })
                      console.log('options', options)
                      options = JSON.parse(JSON.stringify(options));
                      return {
                        options: options
                      };
                    }
                  },
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
                      ": payload.data.find_sys_organize_user.map(it=>{return {label: it.user?.real_name, value: it.user?.id}})" +
                      "}}"
                  }
                },
                {
                  type: 'hidden',
                  name: 'chooseUserId'
                }
              ]
            }
          ]
        }
      }
    ],
    columns: [
      {
        name: '${index+1}',
        label: '序号',
      },
      {
        name: 'real_name',
        label: '成员名称',
      },
      {
        name: 'staff_card',
        label: '工号',
      },
      {
        name: 'mobile',
        label: '手机号',
      },
      {
        name: 'email',
        label: '邮箱',
      },
      {
        type: 'operation',
        label: '操作',
        width:"6.25rem",
        buttons: [
          {
            label: '删除',
            type: 'button',
            level: 'link',
            actionType: 'dialog',
            size:"md",
            className: "text-danger",
            reload: 'roleForm,personalMember',
            dialog: {
              title: '系统消息',
              body: [
                '确认要删除吗?',
                {
                  type: 'form',
                  title: '',
                  api: {
                      method: 'post',
                      url: '/api/graphql',
                      data: {
                        query: 'mutation{delete_sys_role_user(id:"$id",obj:{})}',
                        variables: null,
                      },
                      adaptor: function (payload: any) {
                        let backNum = payload.data.delete_sys_role_user;
                        return {
                          backNum: backNum,
                        };
                      },
                    },
                  body: [
                    {type: 'hidden', name: 'id'},
                  ]
                }
              ]
            }
          },
        ],
      },
    ],
  }]
}
