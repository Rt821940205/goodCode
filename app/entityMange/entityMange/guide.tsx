
import './guide.less';

// guide实体类
class GuideObj {
  private title: String;
  private content: Array<String>;
  private align: String;
  constructor(title: String, content: Array<String>, align: String) {
    this.title = title;
    this.content = content;
    this.align = align
  }
  setView() {
    // 通过内容生成内容组件
    const itemBody = this.content.map(item => {
      return {
        type: 'container',
        // flex py-0 px-6 relative  content-item-wrapper
        //  break-all break-normal text-sm text-black p-0       link-button
        bodyClassName: 'content-item-wrapper',
        body: [
          // 左侧图标
          {
            type: 'container',
            className: `left-icon left-icon-${this.align}`
          },
          // 右侧文案
          {
            type: 'button',
            className: 'link-button',
            actionType: 'link',
            link: '#',
            label: item,
            level: 'link'
          }
        ]
      }
    })
    return {
      type: 'container',
      className: `img-container img-container-${this.align}`,
      body: [
        // 标题
        {
          type: 'container',
          body: this.title,
          className: `guide-title title-${this.align}`
        },
        ...itemBody
      ]
    }
  }
}

export function guide() {
  const leftList = [
    '支持自定义创建数据实体',
    '支持对实体数据字段属性、行为、权限进行配置',
    '支持实体间一对一、一对多的关系绑定'
  ]
  const centerList = [
    'API服务具备灵活性、拓展性和跨平台性I服务参数',
    '支持应用程序之间、程序与数据之间、服务端与服务端之间的数据交互',
    '串联业务数据，确保您在体验所有业务环节畅通无阻'
  ]
  const rightList = [
    '通过对外部数据库关联，接入相应的数据库表',
    '支持常用的观测数据、分析测定数据、图形数据等数据类型',
    '提供JDBC数据源链接方式，预设若干常用数据库连接实例',
  ]
  const left = new GuideObj('普通实体', leftList, 'left')
  const center = new GuideObj('API服务实体', centerList, 'center')
  const right = new GuideObj('外部数据源实体', rightList, 'right')
  return {
    type: 'flex',
    justify: 'space-around',
    items: [
      left.setView(),
      center.setView(),
      right.setView(),
    ]
  }
}

