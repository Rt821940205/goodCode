import classNames from 'classnames'
import React from 'react'
import styles from './index.less'

const Count: React.FC = () => {
  return (
    
    <section className={styles.wrapper}>
      <div className={classNames(styles.image,styles['wait-sign'])}>
        <div className={styles.item}>
          <span>待签收</span>
          <span className={styles.count}>10</span>
        </div>
      </div>
      <div className={classNames(styles.image,styles['wait-back'])}>
        <div className={styles.item}>
          <span>待反馈</span>
          <span className={styles.count}>16</span>
        </div>
      </div>
      <div className={classNames(styles.image,styles['signed'])}>
        <div className={styles.item}>
          <span>已签收</span>
          <span className={styles.count}>21</span>
        </div>
      </div>
      <div className={classNames(styles.image,styles['backed'])}>
        <div className={styles.item}>
          <span>已反馈</span>
          <span className={styles.count}>51</span>
        </div>
      </div>
    </section>
  )
}

export default Count