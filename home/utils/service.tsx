/**
 * 最近使用应用请求
 * @returns
 */
export function latestUesrAPI(yhid: string,pageSize:number = 4) {
  return {
    method: 'POST',
    url: '/api/graphql',
    data: {
      query: `{pages_custom_yhsyyyjl(obj:{yhid:${yhid},state:1},pageNum:1,pageSize:${pageSize}){data{reverse_custom_yhsyyyjl_yyid_sys_app_id{icon app_name description id background}}pageNum pageSize total}}`,
    },
    adaptor: function (payload: any) {
      const { data, pageNum, pageSize, total } = payload.data.pages_custom_yhsyyyjl;
      const list = data.map((item: any) => {
        const { id, icon, background, app_name, description } =
          item.reverse_custom_yhsyyyjl_yyid_sys_app_id;
        return { id, icon, background, app_name, description };
      });
      return { list, pageNum, pageSize, total };
    },
  };
}

/**
 * 热门应用请求
 * @returns
 */
export function hotAPPAPI() {
  return {
    method: 'POST',
    url: '/api/graphql',
    data: {
      query:
        '{pages_custom_yyljbsysj(obj:{state:1},_sort:{sycs:"desc"},pageNum:1,pageSize:5){data{sycs reverse_custom_yyljbsysj_id_sys_app_id{id icon background app_name}}pageNum pageSize total}}',
    },
    adaptor: function (payload: any) {
      const { data, pageNum, pageSize, total } = payload.data.pages_custom_yyljbsysj;
      const list = data.map((item: any) => {
        return {
          sycs: item.sycs,
          ...item.reverse_custom_yyljbsysj_id_sys_app_id,
        };
      });
      return { list, pageNum, pageSize, total };
    },
  };
}

/**
 * 常用应用请求
 */
export function commonAPPAPI(yhid: string,pageSize:number = 5) {
  return {
    method: 'POST',
    url: '/api/graphql',
    data: {
      query: `{pages_custom_yhsyyyjl(obj:{yhid:${yhid},state:1}pageNum:1 pageSize:${pageSize}){data{reverse_custom_yhsyyyjl_yyid_sys_app_id{id app_name icon background description}}pageNum pageSize total}}`,
    },
    adaptor(payload: any) {
      const { data, pageNum, pageSize, total } = payload.data.pages_custom_yhsyyyjl;
      const list = data.map((item: any) => {
        return item.reverse_custom_yhsyyyjl_yyid_sys_app_id;
      });
      return {
        list,
        pageNum,
        pageSize,
        total,
      };
    },
  };
}

/**
 * 资源统计-应用使用周环比
 */
export function huanbiAPPAPI() {
  return {
    method: 'POST',
    url: '/api/graphql',
    data: {
      query: `{data:exec_custom_yysyzhb(obj: {}) {zhou_yccs huanbi_yccs zhou_sycs huanbi_sycs}}`,
    },
    adaptor(payload: any) {
      const data = payload.data.data[0];
      if (data.huanbi_yccs != null) {
        data.huanbi_yccs = 100 * data.huanbi_yccs;
      } else {
        data.huanbi_yccs = '--';
      }
      if (data.huanbi_sycs != null) {
        data.huanbi_sycs = 100 * data.huanbi_sycs;
      } else {
        data.huanbi_sycs = '--';
      }
      return { ...payload, data: data };
    },
  };
}
