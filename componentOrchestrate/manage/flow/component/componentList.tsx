
import React from 'react'
import {Tabs,TabsProps,Avatar} from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import styles from './componentList.less';
import classnames from 'classnames';
import SvgIcon from '@/components/svgIcon'
const items = [
  { label: '常用', key: '' },
  { label: '文件传输', key: '1' },
  { label: '数据库', key: '2' },
  { label: '网络交互', key: '3' },
  { label: '数据转换', key: '4' },
  { label: '任务调度', key: '5' },
  { label: '消息队列', key: '6' },
]
export const ComponentTabs: React.FC<TabsProps> = ({...props}) => {
  return <Tabs
    items={items}
    tabBarGutter={8}
    tabBarStyle={{ background: '#F3F3F3', color: '#999', border: 'none', margin: 0 }}
    moreIcon={<DoubleRightOutlined />}
    className={styles['component-tabs']}
    {...props}
  />
}


type ComponentItemProps = {
  data: API.ComponentItem,
  onClick?:(e:React.MouseEvent)=>void
}
export const ComponentItem: React.FC<ComponentItemProps> = ({data,children,onClick}) => {
  const {title,description} = data
  return <div className={styles['component-item']} onClick={onClick}>
    <Avatar
      shape="square"
      size={48}
      className={styles['component-icon']}
      icon={<SvgIcon iconClass='default-node-choose' style={{fontSize: '3rem'}} />}
      src={data['x-icon']}
    />
    <div className={styles['component-content']}>
      <div className={styles['component-title']}>{title}</div>
      <div className={classnames(styles['component-description'],'overflow-line-2')}>{description}</div>
    </div>
    {children}
  </div>
}