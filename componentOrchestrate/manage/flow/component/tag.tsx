//条件标签
import React from 'react'
import styles from './tag.less'
const Tag:React.FC = ({children}) => {
  return (
    <span className={styles.tag}>
      {children}
    </span>
  )
}

export default Tag