import {beforeHandle, errorHandle} from "@/services/xuanwu/api";

export function jdbcTablesSelectTree(payload: any) {
  let items = payload.data.data;
  if (!Array.isArray(items)) {
    return {
      data: [],
    };
  }
  return items.map((value) => {
    let obj = {
      label: undefined,
      value: undefined,
    };
    obj.value = value.name;
    obj.label = value.displayName;
    if (value.displayName === '' || value.displayName === undefined) {
      obj.label = value.name;
    }
    return obj;
  });
}

export const jdbcTableSelectApi = {
  method: 'post',
  url: '/api/ext/model/jdbc/table/pages?_=tableSelect&?jdbc_id=${jdbc_id}',
  data: {
    modelId: '${jdbc_id}',
    pageNum: 1,
    pageSize: 1000,
  },
  adaptor: function (payload: any) {
    if(beforeHandle(payload)){
      return jdbcTablesSelectTree(payload);
    }
    return errorHandle(payload);
  },
};
