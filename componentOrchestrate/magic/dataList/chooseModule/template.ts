import { getUUID } from "@/utils";
import { type ListItem } from "..";
import {taskListBody ,dispatcherBody,ls,taskListBodyForDataWorkshop} from './config';
const randomId = ()=>{
  return "fid" + Math.random().toString(36).slice(-6);
}
// 太复杂、复制原先的代码

//进度页面
export const createProgressPage = (item:ListItem, processKey:string) => {
  const  comp = JSON.parse(taskListBody);
  const { applicationid, applicationname} = item
  const { params} = item.detail

  const js = params.filter((item:any) => {
      return item.nodeType === "DATA_SET" || item.nodeType === "ODPS_COMPARE"
  })[0]?.dataSetColumns
  
  const colums:any[] = []
  js?.forEach((obj:any) => {
      const fid = randomId()
      colums.push({
          label: obj.chineseHeader,
          name: "data.data_set[0]." + obj.englishHeader,
          type: "input-text",
          "fid": fid,
          "componentId": getUUID(),
          "id": fid,
          "rid": -1,
          "zids": [
              "fidix5kmv"
          ],
          "czids": [],
          "curField": fid,
          "readOnly": false,
          "disabled": false,
          "required": true,
          "enableTransform": false,
          "showCounter": false,
          "multiple": false,
          "joinValues": true,
          "extractValue": false,
          "mode": "",
          "inline": false,
          "setDisableMode": "staticSet",
          "setMode": "expSet",
          "setRequiredMode": "staticSet",
          "delimiter": ",",
          "value": ""
      })
  })
  const bodyNew = []
  bodyNew.push(...colums)
  const filter = comp.body[0].body[1].body[0].body.filter((each:any) => {
      if (each.label === "筛选") {
          each.label = "提交"
      }
      if (each.label === "筛选" || each.label === "提交") {
          each.api.data['data.application_id'] = applicationid;
      }
      if (each.btnLabel === "导入" || each.label === "导入") {
          each.receiver.data.application_id = applicationid
      }
      if (each?.label === "下载模板" || each?.btnLabel === "下载模板") {
          each.url = "/api/component/execute?component=cg_715c3fd2be6a0a4b&action=cg_715c3fd2be6a0a4b_46956a&application_id=" + applicationid
      }

      return each.type === "input-file" || each.type === "button";
  });

  bodyNew.push(...filter);
  let newComp = comp
  if (colums?.length > 0) {
      newComp.body[0].body[1].body[0].body = bodyNew
  } 
  newComp.body[1].columns[5].buttons[2].link = "/task/create?taskId=${taskid}&processDefinitionId="+processKey
  comp.data.applicationId = applicationid;
  comp.body[1].api.data['obj.applicationid'] = applicationid;
  newComp.title = applicationname + "进度页面";
  newComp.body[1].className ="xz-crud";
  return newComp
}



//下发页面
export const  createDispatchPage = (item:ListItem)=>{
  let comp = JSON.parse(dispatcherBody);
  let {  applicationname ,entitytable} = item

  let outputsJSON = item.outputs;
  const crudBody = comp.body[0].tabs[0].body[0];
  const queryGraphql = "query find($obj:input_{0}!,$page:Int!,$perPage:Int!){ pages_{0}(obj:$obj,pageNum:$page,pageSize:$perPage){ data{ {1} } pageNum pageSize total }}";

  entitytable = entitytable || "asdad1";

  if (outputsJSON === undefined ||outputsJSON == ""  ) {
      outputsJSON = "[]"

  }
  let outputs = JSON.parse(outputsJSON)
  const js = outputs
  const filterColumns = []
  const lsinputfid = randomId()
  const lsstaticFid = randomId()
  filterColumns.push({
      label: "下发结果",
      name: "obj.flowResult",
      type: "select",
      options: [
          {label: "全部", value: ""},
          {label: "未下发", value: "未下发"},
          {label: "已下发", value: "已下发"},
          {label: "已完成", value: "已完成"}
      ],
      "fid": lsinputfid,
      "componentId": getUUID(),
      "id": lsinputfid,
      "rid": -1,
      "zids": [
          "fidix5kmv"
      ],
      "czids": [],
      "curField": lsinputfid,
      "readOnly": false,
      "disabled": false,
      // "required": true,
      "enableTransform": false,
      "showCounter": false,
      "multiple": false,
      "joinValues": true,
      "extractValue": false,
      "mode": "",
      "inline": false,
      "setDisableMode": "staticSet",
      "setMode": "expSet",
      "setRequiredMode": "staticSet",
      "delimiter": ",",
      "value": ""
  })
  const bizColumns = []

  let graphqlCoulumns = "flowResult id "
  js?.forEach((obj:any) => {
      const fid = randomId();
      filterColumns.push({
          label: obj.columnCnName,
          name: "obj." + obj.columnName,
          type: "input-text",
          "fid": fid,
          "componentId":  getUUID(),
          "id": fid,
          "rid": -1,
          "zids": [
              "fidix5kmv"
          ],
          "czids": [],
          "curField": fid,
          "readOnly": false,
          "disabled": false,
          // "required": true,
          "enableTransform": false,
          "showCounter": false,
          "multiple": false,
          "joinValues": true,
          "extractValue": false,
          "mode": "",
          "inline": false,
          "setDisableMode": "staticSet",
          "setMode": "expSet",
          "setRequiredMode": "staticSet",
          "delimiter": ",",
          "value": ""
      })

  })

  outputs.forEach((item:any) => {
      const bizFid = randomId()
      graphqlCoulumns = graphqlCoulumns + " " + item.columnName;

      bizColumns.push({
          "type": "static",
          label: item.columnCnName,
          name: item.columnName,
          "componentId": getUUID(),
          "fid": bizFid,
          "id": bizFid,
          "zids": [
              "fid1voze6"
          ],
          "czids": [],
          "originalType": "crud",
          "curField": bizFid,
          "mode": "line",
          "strokeWidth": 10,
          "rid": -1,
          "animate": true,
          "stripe": true,
          "width": "20"
      })
  })
  const bodyNew = []
  const columnsNew = []
  // 下发结果详情页 详情操作弹窗 初始化api  crud  columns
  const dialogCrudColumns:any[] = []
  bodyNew.push(...filterColumns)

  bizColumns.push({
      "type": "static",
      label: "下发结果",
      name: "flowResult",
      "componentId": getUUID(),
      "fid": lsstaticFid,
      "id": lsstaticFid,
      "zids": [
          "fid1voze6"
      ],
      "czids": [],
      "originalType": "crud",
      "curField": lsstaticFid,
      "mode": "line",
      "strokeWidth": 10,
      "rid": -1,
      "animate": true,
      "stripe": true,
      "width": "20"
  })
  columnsNew.push(...bizColumns);
  dialogCrudColumns.push(...bizColumns);

  const filter = crudBody.filter.body.filter((each:any) => {

      return each.type === "submit" || each.type === "button";
  })

  const columns = crudBody.columns.filter((each:any) => {
      return each.label === "操作"
  })

  let shouldReplace = queryGraphql
  shouldReplace = shouldReplace.replaceAll("{0}", entitytable);
  shouldReplace = shouldReplace.replaceAll("{1}", graphqlCoulumns);

  columns.forEach((item:any) => {
      if (item.label === "操作") {
          // 查看按钮只显示当前条数据
          item.buttons[0].dialog.body[0].api.data["obj.id"] = "$id"
          item.buttons[0].dialog.body[0].api.graphql = shouldReplace
          item.buttons[0].dialog.body[0].api.responseData["items"] = "${pages_" + entitytable + ".data}";
          item.buttons[0].dialog.body[0].api.responseData["total"] = "${pages_" + entitytable + ".total}";
          item.buttons[0].dialog.body[0].columns = dialogCrudColumns;
      }
  })
  comp.body[0].tabs[0].body[0].filter.body
  bodyNew.push(...filter)
  columnsNew.push(...columns)

  comp.body[0].tabs[0].body[0].filter.body = bodyNew
  comp.body[0].tabs[0].body[0].columns = columnsNew

  comp.body[0].tabs[0].body[0].api.graphql = shouldReplace
  comp.body[0].tabs[0].body[0].bulkActions[0].api.data.dataTableName = entitytable;
  comp.body[0].tabs[0].body[0].api.responseData["items"] = "${pages_" + entitytable + ".data}";
  comp.body[0].tabs[0].body[0].api.responseData["total"] = "${pages_" + entitytable + ".total}";

  //详情保持老的逻辑
  let dispatcherDetailPageInitColumns = comp.body[0].tabs[1].body[0].columns
  dispatcherDetailPageInitColumns.forEach((item:any, index:any) => {
      if (item.label === "操作") {
          // 详情按钮修改
          comp.body[0].tabs[1].body[0].columns[index].buttons[0].dialog.body[0].api.graphql = shouldReplace;
          comp.body[0].tabs[1].body[0].columns[index].buttons[0].dialog.body[0].api.data["obj.flowId"] = "${PROC_INST_ID_}";
          comp.body[0].tabs[1].body[0].columns[index].buttons[0].dialog.body[0].api.responseData["items"] = "${pages_" + entitytable + ".data}";
          comp.body[0].tabs[1].body[0].columns[index].buttons[0].dialog.body[0].api.responseData["total"] = "${pages_" + entitytable + ".total}";
          comp.body[0].tabs[1].body[0].columns[index].buttons[0].dialog.body[0].columns = dialogCrudColumns
      }
  })

  comp.title = applicationname + "下发页面";
  comp.body[0].tabs[0].body[0].title = applicationname + "查询";
  comp.body[0].tabs[0].body[0].className = "xz-crud";
  comp.body[0].tabs[0].body[0].perPage = 20;
  comp.body[0].tabs[1].body[0].className = "xz-crud";
  return comp
}

//落实页面
export const createFullFillPage = (item:ListItem)=>{
  let comp = JSON.parse(ls);
  const crudBody =comp.body[0];
  var { applicationname ,entitytable} = item
  const queryGraphql = "query find($obj:input_{0}!,$page:Int!,$perPage:Int!){ pages_{0}(obj:$obj,pageNum:$page,pageSize:$perPage){ data{ {1} } pageNum pageSize total }}";
  const updateGraphql = "mutation update($id:Long!,$obj:input_{0}!){ update_{0}(id:$id,obj:$obj)}";
      var outputsJSON = item.outputs &&JSON.parse(item.outputs);
      if(outputsJSON === undefined||outputsJSON == ''){
          outputsJSON = []
      }
      var outputs = outputsJSON

      const bizColumns = []

      const bizFid =  randomId()
      let graphqlCoulumns = "flowResult id flowNote "
      

      outputs.forEach((item:any)=>{
      const bizFid =  randomId()
      graphqlCoulumns = graphqlCoulumns + " " + item.columnName;

      bizColumns.push({
              "type": "static",
              label: item.columnCnName,
              name: item.columnName,
              "componentId": getUUID(),
              "fid": bizFid,
              "id": bizFid,
              "zids": [
                  "fid1voze6"
              ],
              "czids": [],
              "originalType": "crud",
              "curField": bizFid,
              "mode": "line",
              "strokeWidth": 10,
              "rid": -1,
              "animate": true,
              "stripe": true,
              "width": "20"
          })
     })
      
      const columnsNew = []
      bizColumns.push({
              "type": "static",
              label: "落实结果",
              name: "flowNote",
              "componentId": getUUID(),
              "fid": bizFid,
              "id": bizFid,
              "zids": [
                  "fid1voze6"
              ],
              "czids": [],
              "originalType": "crud",
              "curField": bizFid,
              "mode": "line",
              "strokeWidth": 10,
              "rid": -1,
              "animate": true,
              "stripe": true,
              "width": "20"
          })
      columnsNew.push(...bizColumns);

      

      const columns = crudBody.columns.filter((each:any) => {
          return each.label === "操作"
      })

      let shouldReplace = queryGraphql
      shouldReplace = shouldReplace.replaceAll("{0}",entitytable);
      shouldReplace = shouldReplace.replaceAll("{1}",graphqlCoulumns);
      let shouldReplaceUpdate = updateGraphql
      shouldReplaceUpdate = shouldReplaceUpdate.replaceAll("{0}",entitytable);

      columns.forEach((item:any)=>{
      if(item.label === "操作"){
      // 处理按钮	
      item.buttons[0].dialog.body[0].api.graphql = shouldReplaceUpdate		

      }
      })
            
      columnsNew.push(...columns)
          
          
      comp.body[0].columns = columnsNew

      comp.body[0].api.graphql = shouldReplace
      comp.body[0].api.responseData["items"] = "${pages_" + entitytable + ".data}";
      comp.body[0].api.responseData["total"] = "${pages_" + entitytable + ".total}";
      comp.title = applicationname + "落实页面";
      comp.body[0].className = "xz-crud";
      comp.body[0].title = applicationname;
      return comp
}


//数据工坊进度页面
export const createProgressPageByShop = (item:ListItem, processKey:string)=>{
    const taskListBody = taskListBodyForDataWorkshop
    let comp = JSON.parse(taskListBody);
    let { applicationid,  name} = item
    let params = item.detail
    // params
    const js = params?.dataparams?.[0]?.columns || []
    const colums:any[] = []
    js?.forEach((obj:any) => {
      const fid = randomId()
      colums.push({
        label: obj.comment,
        name: "data.items[0]." + obj.field,
        type: "input-text",
        "fid": fid,
        "componentId": getUUID(),
        "id": fid,
        "rid": -1,
        "zids": [
          "fidix5kmv"
        ],
        "czids": [],
        "curField": fid,
        "readOnly": false,
        "disabled": false,
        "required": true,
        "enableTransform": false,
        "showCounter": false,
        "multiple": false,
        "joinValues": true,
        "extractValue": false,
        "mode": "",
        "inline": false,
        "setDisableMode": "staticSet",
        "setMode": "expSet",
        "setRequiredMode": "staticSet",
        "delimiter": ",",
        "value": ""
      })
    })
    const bodyNew = []
    bodyNew.push(...colums)
    const filter = comp.body[0].body[0].body.filter((each:any) => {
      if (each.label === "筛选") {
        each.label = "提交"
      }
      if (each.label === "筛选" || each.label === "提交") {
        each.api.data['data.application_id'] = applicationid;
        each.api.url = '/api/component/execute?component=cg_e3efe06f1dc08170&action=cg_e3efe06f1dc08170_b17210';
      }
      if (each.btnLabel === "导入" || each.label === "导入") {
        each.receiver.data.application_id = applicationid
        each.receiver.url = "/api/component/execute?component=cg_8d33396bc7ca113d&action=cg_8d33396bc7ca113d_625389",
        each.receiver.data.component = 'cg_8d33396bc7ca113d'
        each.receiver.data.actionName = 'cg_8d33396bc7ca113d_625389'
      }
      if (each?.label === "下载模板" || each?.btnLabel === "下载模板") {
        each.url = "/api/component/execute?component=cg_f383ab9bc555f44d&action=cg_f383ab9bc555f44d_da9d85&application_id=" + applicationid
      }

      return each.type === "input-file" || each.type === "button";
    });

    bodyNew.push(...filter);

    let newComp = comp
    if (bodyNew?.length > 0) {
      newComp.body[0].body[0].body = bodyNew
    }
    newComp.body[1].columns[5].buttons[2].link = "/task/create?taskId=${taskid}&processDefinitionId="+processKey
    newComp.body[1].columns[5].buttons[0].hidden = true
    comp.body[1].api.data['obj.applicationid'] = applicationid;
    comp.body[1].api.graphql = 'query find($obj: input_custom_fwdygz!, $page: Int, $perPage: Int){ pages_custom_zsrwst:pages_custom_fwdygz(obj:$obj,pageNum:$page,pageSize:$perPage){data{id xx orcpath querystat pageid sharedresourceid datamsg cxjsq ftpsrdz state applicationid taskid xzwjdz bdjgzipwjlj scwjm ftpscwjj ztid sjl appid downloadstatus jd zt czid bdjgexcellj modify_name create_id modify_id create_name modify_time create_time}pageNum pageSize total}}';
    comp.body[1].columns[1].label = '数据量'
    comp.body[1].columns[1].name = 'sjl'
    newComp.title = name + "进度页面";
    newComp.className = "xz-crud";
    newComp.body[1].className = "xz-crud";
    console.log("1my class Name is "+newComp.body[0].className);
    return newComp
}
  

//数据工坊下发页面
export const   createDispatchPageByShop = (item:ListItem)=>{
    let comp = JSON.parse(dispatcherBody);
    var { name ,entitytable} = item
    let outputsJSON = item.outputs;
    const crudBody = comp.body[0].tabs[0].body[0];
    const queryGraphql = "query find($obj:input_{0}!,$page:Int!,$perPage:Int!){ pages_{0}(obj:$obj,pageNum:$page,pageSize:$perPage){ data{ {1} } pageNum pageSize total }}";
    entitytable = entitytable || "asdad1";
    if (outputsJSON === undefined ||outputsJSON == ""  ) {
      outputsJSON = "[]"
    }
    let outputs = JSON.parse(outputsJSON)
    const js = outputs
    const filterColumns = []
    const lsinputfid = randomId()
    const lsstaticFid = randomId()
    filterColumns.push({
      label: "下发结果",
      name: "obj.flowResult",
      type: "select",
      options: [
        {label: "全部", value: ""},
        {label: "未下发", value: "未下发"},
        {label: "已下发", value: "已下发"},
        {label: "已完成", value: "已完成"}
      ],
      "fid": lsinputfid,
      "componentId":getUUID(),
      "id": lsinputfid,
      "rid": -1,
      "zids": [
        "fidix5kmv"
      ],
      "czids": [],
      "curField": lsinputfid,
      "readOnly": false,
      "disabled": false,
      // "required": true,
      "enableTransform": false,
      "showCounter": false,
      "multiple": false,
      "joinValues": true,
      "extractValue": false,
      "mode": "",
      "inline": false,
      "setDisableMode": "staticSet",
      "setMode": "expSet",
      "setRequiredMode": "staticSet",
      "delimiter": ",",
      "value": ""
    })
    const bizColumns = []

    let graphqlCoulumns = "flowResult id "
    js?.forEach((obj:any) => {
      const fid = randomId();
      filterColumns.push({
        label: obj.comment,
        name: "obj." + obj.field,
        type: "input-text",
        "fid": fid,
        "componentId": getUUID(),
        "id": fid,
        "rid": -1,
        "zids": [
          "fidix5kmv"
        ],
        "czids": [],
        "curField": fid,
        "readOnly": false,
        "disabled": false,
        // "required": true,
        "enableTransform": false,
        "showCounter": false,
        "multiple": false,
        "joinValues": true,
        "extractValue": false,
        "mode": "",
        "inline": false,
        "setDisableMode": "staticSet",
        "setMode": "expSet",
        "setRequiredMode": "staticSet",
        "delimiter": ",",
        "value": ""
      })

    })

    outputs.forEach((item:any) => {
      const bizFid = randomId()
      graphqlCoulumns = graphqlCoulumns + " " + item.field;

      bizColumns.push({
        "type": "static",
        label: item.comment,
        name: item.field,
        "componentId":getUUID(),
        "fid": bizFid,
        "id": bizFid,
        "zids": [
          "fid1voze6"
        ],
        "czids": [],
        "originalType": "crud",
        "curField": bizFid,
        "mode": "line",
        "strokeWidth": 10,
        "rid": -1,
        "animate": true,
        "stripe": true,
        "width": "20"
      })
    })
    const bodyNew = []
    const columnsNew = []
    // 下发结果详情页 详情操作弹窗 初始化api  crud  columns
    const dialogCrudColumns:any[] = []
    bodyNew.push(...filterColumns)

    bizColumns.push({
      "type": "static",
      label: "下发结果",
      name: "flowResult",
      "componentId": getUUID(),
      "fid": lsstaticFid,
      "id": lsstaticFid,
      "zids": [
        "fid1voze6"
      ],
      "czids": [],
      "originalType": "crud",
      "curField": lsstaticFid,
      "mode": "line",
      "strokeWidth": 10,
      "rid": -1,
      "animate": true,
      "stripe": true,
      "width": "20"
    })
    columnsNew.push(...bizColumns);
    dialogCrudColumns.push(...bizColumns);

    const filter = crudBody.filter.body.filter((each:any) => {

      return each.type === "submit" || each.type === "button";
    })

    const columns = crudBody.columns.filter((each:any) => {
      return each.label === "操作"
    })

    let shouldReplace = queryGraphql
    shouldReplace = shouldReplace.replaceAll("{0}", entitytable);
    shouldReplace = shouldReplace.replaceAll("{1}", graphqlCoulumns);

    columns.forEach((item:any) => {
      if (item.label === "操作") {
        // 查看按钮只显示当前条数据
        item.buttons[0].dialog.body[0].api.data["obj.id"] = "$id"
        item.buttons[0].dialog.body[0].api.graphql = shouldReplace
        item.buttons[0].dialog.body[0].api.responseData["items"] = "${pages_" + entitytable + ".data}";
        item.buttons[0].dialog.body[0].api.responseData["total"] = "${pages_" + entitytable + ".total}";
        item.buttons[0].dialog.body[0].columns = dialogCrudColumns;
      }
    })
    comp.body[0].tabs[0].body[0].filter.body
    bodyNew.push(...filter)
    columnsNew.push(...columns)

    comp.body[0].tabs[0].body[0].filter.body = bodyNew
    comp.body[0].tabs[0].body[0].columns = columnsNew

    comp.body[0].tabs[0].body[0].api.graphql = shouldReplace
    comp.body[0].tabs[0].body[0].bulkActions[0].api.data.dataTableName = entitytable;
    comp.body[0].tabs[0].body[0].api.responseData["items"] = "${pages_" + entitytable + ".data}";
    comp.body[0].tabs[0].body[0].api.responseData["total"] = "${pages_" + entitytable + ".total}";


    let dispatcherDetailPageInitColumns = comp.body[0].tabs[1].body[0].columns
    dispatcherDetailPageInitColumns.forEach((item:any, index:number) => {
      if (item.label === "操作") {
        // 详情按钮修改
        comp.body[0].tabs[1].body[0].columns[index].buttons[0].dialog.body[0].api.graphql = shouldReplace;
        comp.body[0].tabs[1].body[0].columns[index].buttons[0].dialog.body[0].api.data["obj.flowId"] = "${PROC_INST_ID_}";
        comp.body[0].tabs[1].body[0].columns[index].buttons[0].dialog.body[0].api.responseData["items"] = "${pages_" + entitytable + ".data}";
        comp.body[0].tabs[1].body[0].columns[index].buttons[0].dialog.body[0].api.responseData["total"] = "${pages_" + entitytable + ".total}";
        comp.body[0].tabs[1].body[0].columns[index].buttons[0].dialog.body[0].columns = dialogCrudColumns
      }
    })

    comp.title = name + "下发页面";
    comp.body[0].tabs[0].body[0].className = "xz-crud";
    comp.body[0].tabs[1].body[0].className = "xz-crud";
    comp.body[0].tabs[0].body[0].perPage = 20;
    console.log("2my class Name is "+comp.body[0].tabs[0].body[0].className);
    return comp
}

//数据工坊落实页面
export const createFullFillPageByShop = (item:ListItem)=>{
    let comp = JSON.parse(ls);
    const crudBody =comp.body[0];
    var { name ,entitytable} = item
    const queryGraphql = "query find($obj:input_{0}!,$page:Int!,$perPage:Int!){ pages_{0}(obj:$obj,pageNum:$page,pageSize:$perPage){ data{ {1} } pageNum pageSize total }}";
    const updateGraphql = "mutation update($id:Long!,$obj:input_{0}!){ update_{0}(id:$id,obj:$obj)}";
    var outputsJSON = item.outputs &&JSON.parse(item.outputs);
    if(outputsJSON === undefined||outputsJSON == ''){
      outputsJSON = []
    }
    var outputs = outputsJSON;
    const bizColumns = []

    const bizFid =  randomId()
    let graphqlCoulumns = "flowResult id flowNote "


    outputs.forEach((item:any)=>{
      const bizFid =  randomId()
      graphqlCoulumns = graphqlCoulumns + " " + item.field;

      bizColumns.push({
        "type": "static",
        label: item.comment,
        name: item.field,
        "componentId": getUUID(),
        "fid": bizFid,
        "id": bizFid,
        "zids": [
          "fid1voze6"
        ],
        "czids": [],
        "originalType": "crud",
        "curField": bizFid,
        "mode": "line",
        "strokeWidth": 10,
        "rid": -1,
        "animate": true,
        "stripe": true,
        "width": "20"
      })
    })
   
    const columnsNew = []



    bizColumns.push({
      "type": "static",
      label: "落实结果",
      name: "flowNote",
      "componentId": getUUID(),
      "fid": bizFid,
      "id": bizFid,
      "zids": [
        "fid1voze6"
      ],
      "czids": [],
      "originalType": "crud",
      "curField": bizFid,
      "mode": "line",
      "strokeWidth": 10,
      "rid": -1,
      "animate": true,
      "stripe": true,
      "width": "20"
    })
    columnsNew.push(...bizColumns);



    const columns = crudBody.columns.filter((each:any) => {
      return each.label === "操作"
    })

    let shouldReplace = queryGraphql
    shouldReplace = shouldReplace.replaceAll("{0}",entitytable);
    shouldReplace = shouldReplace.replaceAll("{1}",graphqlCoulumns);
    let shouldReplaceUpdate = updateGraphql
    shouldReplaceUpdate = shouldReplaceUpdate.replaceAll("{0}",entitytable);

    columns.forEach((item:any)=>{
      if(item.label === "操作"){
        // 处理按钮
        item.buttons[0].dialog.body[0].api.graphql = shouldReplaceUpdate

      }
    })


    columnsNew.push(...columns)


    comp.body[0].columns = columnsNew

    comp.body[0].api.graphql = shouldReplace
    comp.body[0].api.responseData["items"] = "${pages_" + entitytable + ".data}";
    comp.body[0].api.responseData["total"] = "${pages_" + entitytable + ".total}";
    comp.body[0].title = name + "落实页面";
    comp.body[0].className = "xz-crud";
    return comp
}