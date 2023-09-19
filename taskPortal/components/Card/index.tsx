import React from 'react'
import styles from './index.less';
import { Card as AntdCard, CardProps as AntdProps } from 'antd';
import SvgIcon from '@/components/svgIcon';
import classNames from 'classnames';

type CardProps = {
  icon?:string
} & AntdProps
const Card: React.FC<CardProps> = ({ children,icon,title,className,headStyle,bodyStyle,...rest }) => {
  const realTitle = icon  && typeof title === 'string'? (<div className={styles.title }>
    <SvgIcon iconClass={icon} className={styles.icon}></SvgIcon><span>{title}</span>
  </div>) : title
  return  <AntdCard
      className={classNames(styles.card,className)}
      title={realTitle}
      headStyle={{ padding: '0 1rem', borderBottom: "none" ,...headStyle}}
      bodyStyle={{ padding: '0 1rem' ,...bodyStyle}}
      {...rest}
    >
      {children}
  </AntdCard>
}
export default Card