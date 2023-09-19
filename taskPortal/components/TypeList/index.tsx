import Card  from '../Card';
import React, { CSSProperties, useEffect, useState } from 'react'
import styles from './index.less';
import { Statistic,Select } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { TaskRole } from '@/@types/global';

type ListItem = {
  wait: string,
  done: string,
  import: string,
  delay:string
}

const fetchList = (): Promise<ListItem[]> =>{
  return new Promise((resolve, reject) => {
    resolve([
      {
        wait: '227',
        done: '123',
        delay: "16",
        import:"327"
      },
      {
        wait: '120',
        done: '14',
        delay: "16",
        import:"180"
      },
      {
        wait: '70',
        done: '20',
        delay: "10",
        import:"100"
      },
      {
        wait: '80',
        done: '17',
        delay: "13",
        import:"120"
      },
      {
        wait: '44',
        done: '80',
        delay: "20",
        import:"144"
      },
      
    ])
  });
}
type TypeListProps = {
  className?: string,
  style?: CSSProperties,
  type?:TaskRole
}
const TypeList: React.FC<TypeListProps> = ({className,style,type}) => {
  
  const [list, setList] = useState<ListItem[]>([])

  useEffect(() => {
    (async () => {
      const list = await fetchList()
      setList(list)
    })()
  }, [])
  
  return (
    <Card
      title="任务类型"
      className={classNames(styles.card,className)}
      icon='tz-sign-back'
      style={style}
      extra={
        type === TaskRole.Manager?
        <Select
          defaultValue="新河派出所"
          style={{ width: '9.5625rem' }}
          options={[
            { value: '新河派出所', label: '新河派出所' }
          ]}
        />
          :null
      }
    >
      {
        list.map((item,idx) => {
          return <section key={idx} className={styles.item}>
            <h4 className={styles.title}>
               <span>重点人指令:</span>
               <Statistic
                  value={item.import}
                valueStyle={{ fontSize: "1.25rem", color: '#333', margin: "0 0.625rem" }}
                suffix={<ArrowUpOutlined style={{color:'#EB4B38',fontSize:'0.875rem'}}/>}
                />
            </h4>
            <div className={styles.content}>
              <div className={styles.col}>
                <Statistic
                  className='text-black'
                  valueStyle={{fontSize:"1rem"}}
                  value={item.wait}
                />
                <span>待签收</span>
              </div>
              <div className={styles.col}>
                <Statistic
                  value={item.done}
                  valueStyle={{fontSize:"1rem",color: '#06C270' }}
                />
                <span>已完成</span>
              </div>
              <div className={styles.col}>
                <Statistic
                  value={item.delay}
                  valueStyle={{fontSize:"1rem",color: '#DB3333' }}
                />
                <span>已超期</span>
              </div>
            </div>
          </section>
        })
      }
    </Card>
  )
}

export default TypeList