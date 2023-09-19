import React from 'react'
import Card from '../Card'
import {Select,Progress} from 'antd'
import styles from './index.less'
import {TaskRole} from '@/@types/global'
const CompeleteRate: React.FC<
  {
    type?:TaskRole
  }
  > = ({ type }) => {

    const options  = type === TaskRole.Manager ? [{ value: '当天', label: '当天' }]:[{ value: '全部任务', label: '全部任务' }]
    const defaultValue = options[0].value
  
  return (
    <Card
      className={styles.card}
      title='任务完成率'
      icon='tz-compelete-rate'
      bodyStyle={{textAlign:'center'}}
      extra={
        <Select
          defaultValue={defaultValue}
          style={{ width: '9.5625rem' }}
          options={options}
        />
      }
    >
      <Progress
        type='circle'
        percent={56}
        strokeWidth={20}
        trailColor="#EC6A23"
        strokeLinecap='butt'
        className={styles.progress}
      />
    </Card>
  )
}

export default CompeleteRate