

/**
 * 组织架构树 source
 */
export const organizeMemberSelectSource = {
  method: 'post',
  url: '/api/graphql',
  data: {
    query:`query find(\\$obj1:input_sys_organize!,\\$obj2:input_sys_organize_user!){
              organizes:find_sys_organize(obj:\\$obj1){id code organize_name level parent_id category leader_id}
              userInfos:find_sys_organize_user(obj: \\$obj2) {
                        organize_id
                        user_id
                        id
                        sys_organize_user_just_sys_user_info{
                          real_name
                        }
              }
                        }`,
    variables: {
      obj1:{
        state:1,
        parent_id:0
      },
      obj2:{
        state:1
      }
    },
  },
  adaptor: function (payload:any, response:any, api:any) {
    let list = payload.data.organizes;
    let options: Array<any> = [];
    if(Array.isArray(list) && list.length == 0){
      return {
        options: options
      }
    }
    let userInfos = payload.data.userInfos;
    userInfos.filter((it:any) => {
      return it.sys_organize_user_just_sys_user_info != undefined
    }).forEach((item:any) =>{
      if(item.sys_organize_user_just_sys_user_info != undefined){
        item.real_name = item.sys_organize_user_just_sys_user_info?.real_name
      }
    })
    list.forEach((item: any) => {
      item.parent_id = item.parent_id ? item.parent_id.toString() : null;
    });
    const makeTree = (pid: any, arr: any) => {
      const res: Array<any> = [];
      arr.forEach((i: any) => {
        if (i.parent_id === pid) {
          // 本身调用本身，递归查归属于本身的 children
          const children = makeTree(i.id, list);
          // 将原有的数据按照 element 的格式进行重构
          let obj: any = {
            label: i.organize_name,
            value: i.id,
            id:i.id,
            category:i.category,
            biz:i.category,
            defer:true,
            leaderId:i.leader_id,
            organize_name:i.organize_name,
            children: [],
          };
          // 若是有 children 则插入 obj 中
          if (children.length) {
            obj.children = children;
          }
          res.push(obj);
        }
      });
      return res;
    };
    let leftOptions: Array<any> = [];
    if (list.length === 1) {
      leftOptions = [
        {
          label: list[0].organize_name,
          value: list[0].id,
          id:list[0].id,
          category:list[0].category,
          biz:list[0].category,
          leaderId:list[0].leader_id,
          organize_name:list[0].organize_name,
          children: []
        },
      ];
      leftOptions[0].value = list[0].id;
    } else {
      leftOptions = JSON.parse(JSON.stringify(makeTree(null, list)));
    }
    list.forEach( (org:any) => {
      let childMemberList = userInfos.filter((item:any) => {return item.organize_id == org.id && item.sys_organize_user_just_sys_user_info != undefined})

      let node: Array<any> = []
      childMemberList.forEach((user:any) =>{
        node.push({
          label: user?.real_name,
          value: user.user_id?.toString()
        })
      })
      options.push({
        ref: org.id,
        children: node
      })

    })
    options = JSON.parse(JSON.stringify(options));
    console.log(JSON.stringify(options))
    console.log(JSON.stringify(leftOptions))
    // leftOptions 动态加载，默认 source 接口是返回 options 部分，而 leftOptions 是没有对应的接口可以动态返回了。为了方便，目前如果 source 接口返回的选中中，第一个 option 是以下这种格式则也会把 options[0].leftOptions 当成 leftOptions, options[0].children 当 options。同时 options[0].leftDefaultValue 可以用来配置左侧选项的默认值。
    let resultOptions: Array<any> = [];
    resultOptions.push({
      leftOptions: leftOptions,
      children: options,
      leftDefaultValue: ''
    })
    return {
      options: resultOptions
    };
  }
}
