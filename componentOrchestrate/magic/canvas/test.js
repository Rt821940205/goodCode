export const data = [
  {
    type: "app",
    id: '应用',
    name:'我是主页啊啊啊',
    hide: false,
    style: {
      top:'380px',
      left: '20px'
    },
    open: true,
    count: 2
  },
  {
    id:'模块1',
    type: "module",
    hide: false,
    name:'模块1',
    style: {
      top:'280px',
      left: '220px'
    },
    parent_id: '应用',
    open: true,
    
  },
  {
    id:'模块2',
    type: "module",
    hide: true,
    style: {
      top:'580px',
      left: '220px'
    },
    name: '模块2',
    parent_id: '应用',
    open: true,
    count:1
  },
  {
    type: "page",
    hide: false,
    style: {
      top:'140px',
      left: '420px'
    },
    id:"模块2-页面1",
    name: '流动人口场所码扫码核查-落实流程',
    parent_id: '模块1',
    open:false
  },
  {
    id:'模块1-页面2',
    type: "page",
    hide: true,
    name:'模块1-页面2',
    style: {
      top:'380px',
      left: '420px'
    },
    parent_id: '模块1',
    open:true
  },
  {
    type: "flow",
    id:"模块2-流程1",
    style: {
      top:'580px',
      left: '420px'
    },
    name: '页面设置啊啊啊啊啊',
    parent_id:'模块2'
  },
]
