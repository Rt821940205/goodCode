export class tdObj {
  body = {};
  fill(item: any) {
    this.body = { ...item };
  }
}

export class Tds {
  tds:any = [];
  push(td: tdObj) {
    this.tds.push(td);
  }
}
export const apiParamTHead = {
  background: '#F7F7F7',
  tds: [
    {
      body: {
        type: 'tpl',
        tpl: '序号',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '参数位置',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '显示名',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '字段名',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '值',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '类型',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '是否生效',
      },
    },
  ],
};
export const apiResultThead = {
  background: '#F7F7F7',
  tds: [
    {
      body: {
        type: 'tpl',
        tpl: '序号',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '显示名',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '参数名',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '提取路径',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '类型',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '是否生效',
      },
    },
  ],
};
export const jdbcResultTHead = {
  background: '#F7F7F7',
  tds: [
    {
      body: {
        type: 'tpl',
        tpl: '序号',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '显示名',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '字段名',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '字段类型',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '实体属性',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '过滤条件',
      },
    },
  ],
};
export const componentResultTHead={
  background: '#F7F7F7',
  tds: [
    {
      body: {
        type: 'tpl',
        tpl: '序号',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '显示名',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '字段名',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '字段类型',
      },
    },
    {
      body: {
        type: 'tpl',
        tpl: '实体属性',
      },
    },
  ],
};

export class ParamsTables {
  type = 'table-view';
  trs:any[] = [];
  captionSide = 'bottom';
  constructor(head?:any) {
    if (head === undefined) {
      this.trs.push(apiParamTHead);
    } else {
      this.trs.push(head);
    }
  }
  push(tds: Tds) {
    this.trs.push(tds);
  }
}

export class ResultTables {
  type = 'table-view';
  captionSide = 'bottom';
  trs:any[] = [];
  constructor(head?:any) {
    if (head === undefined) {
      this.trs.push(apiResultThead);
    } else {
      this.trs.push(head);
    }
  }
  push(tds: Tds) {
    this.trs.push(tds);
  }
}
