import {beforeHandle, errorHandle} from "@/services/xuanwu/api";

export const jdbcList = [
  {
    type: 'tpl',
    tpl: '外部数据源: ${displayName}',
    className: 'flex mb-4'
  },
  // {
  //   type: 'divider',
  // },
  {
    type: 'crud',
    orderBy: 'name',
    orderDir: 'asc',
    autoGenerateFilter: true,
    columnsTogglable: false,
    filter: {
      title: '',
      actions: [],
      body: [
        {
          type: 'input-text',
          name: 'tableName',
          label: '表名:',
          placeholder: '输入表名',
          value: '',
        },
        {
          type: 'reset',
          label: '重 置',
          icon: 'fa fa-refresh',
          level:'enhance'
        },
        {
          type: 'submit',
          label: '筛 选 ',
          icon: 'fa fa-search',
          level:'primary',
        },
      ],
    },
    api: {
      method: 'post',
      url: '/api/ext/model/jdbc/table/pages?_=datasourceList',
      data: {
        modelId: '${id}',
        pageNum: '${page}',
        pageSize: '${perPage}',
        tableName: '${tableName}',
      },
      adaptor: function (payload:any) {
        if(beforeHandle(payload)){

          let items = payload.data.data;
          let total = payload.data.total;
          if (!Array.isArray(items)) {
            return {
              data: [],
            };
          }
          let tables = items.map((value, index, array) => {
            let obj:any = {
              index: undefined,
              name: undefined,
              displayName: undefined,
            };
            obj.index = index + 1;
            obj.name = value.name;
            obj.displayName = value.displayName;
            if (value.displayName === '' || value.displayName === undefined) {
              obj.displayName = value.name;
            }
            return obj;
          });
          return {
            items: tables,
            total: total,
          };
        }

        return errorHandle(payload);
      },
    },
    source: '$items',
    defaultParams: {
      perPage: 10,
    },
    data: {
      pageField: 'pageNum',
      perPageField: 'pageSize',
    },
    title: '',
    columns: [
      {
        name: 'index',
        label: '序号',
      },
      {
        name: 'name',
        label: '表名',
        // searchable: {
        //   type: 'input-text',
        //   name: 'tableName',
        //   label: '表名',
        //   placeholder: '输入表名',
        // },
      },
      {
        name: 'displayName',
        label: '显示名',
      },
      {
        type: 'operation',
        label: '操作',
        buttons: [
          {
            label: '提取实体',
            type: 'button',
            actionType: 'link',
            level: 'link',
            link: '/app/datasource/model/create/jdbc/info?appId=${appId}&biz=jdbc&source_id=${source_id}&table_id=${name}&startStep=1',
          },
        ],
      },
    ],
  },
];
