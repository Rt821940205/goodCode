import React from 'react'
import { Button } from 'antd';
import { KeepAlive } from 'umi';
import {ServerPath} from '@/pages/settings/path';
import styles from './index.less';
const Tip:React.FC = () => {
  return (
    <KeepAlive name={ServerPath.TIP}>
        <div className={styles.content}>
          <Button type='link'>创建</Button>或选取组件进行编排
        </div>
    </KeepAlive>
  )
}

export default Tip


