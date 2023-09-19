import Card  from '../Card'
import React, { CSSProperties, useEffect, useState } from 'react'
import styles from './index.less';
import { Tag ,Radio,Button} from 'antd';
import classNames from 'classnames';
import { TaskRole } from '@/@types/global';
import { Empty } from 'antd';
import { queryTodoList } from '@/services/xuanwu/taskPortal';
import {useHistory} from 'umi';
import moment from 'moment';
type ListItem = {
  source?: string,
  type?: string,
  name?: string,
  time?: string,
  status?: Status,
  taskId?: String,
  link?:string,
}

enum Status{
  Delay = '0',
  Normal = '1'
}
type StatusUi = {
  color: string,
  label:string
}
const delay:StatusUi = {
  color: "#EC6A23",
  label:"超时"
}
const normal: StatusUi = {
  color: "#305CD0",
  label:"正常"
}
const statusMapper: Record<Status, any> = {
  [Status.Delay]:delay,
  [Status.Normal]:normal
}
const TODO_URL = '/app/page/list/480707634148671488?appId=465467026043830272&pageId=480707634148671488'
const Extra: React.FC<{
  type:TaskRole
}> = ({ type }) => {
  if (type === TaskRole.Station) {
    return <Button
      type='link'
      style={{ color: "#666" }}
      href={ TODO_URL}>
      查看待办日历
    </Button>
  }
  return <div className={styles.extra}>
    <Radio.Group defaultValue="a" buttonStyle="solid" size='small' className={styles.choose}>
      <Radio.Button value="a">部门任务</Radio.Button>
      <Radio.Button value="b">我的任务</Radio.Button>
    </Radio.Group>
    <Button
      type='link'
      style={{ color: "#666" }}
      href={ TODO_URL}>
      查看更多
    </Button>
  </div>
}

type WaitTodoProps = {
  className?: string,
  style?: CSSProperties,
  type?: TaskRole
}
const WaitTodo: React.FC<WaitTodoProps> = ({className, style, type = TaskRole.Office}) => {
  const [list, setList] = useState<ListItem[]>([])

  const [loading, setLoading] = useState(false)

  const history = useHistory()

  const render = async () => { 
    setLoading(true)
    try {
      let { tasks } = await queryTodoList({
        oneDay: true,
        startTime: moment().startOf('day').format("YYYY-MM-DD")
      })
      const list :ListItem[] = tasks.reverse().map((item:any) => {
        return {
          source:item.project?.app?.name,
          name: item.content,
          time: item.startTime,
          status: Status.Normal,
          type: "",
          taskId: item.taskId,
          link:item.operations[0].value
        }
      })
      setList(list)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    render()
  }, [])
  

  return (

    <Card
      title="今日待办"
      icon='icon-icondaibanrenwu'
      extra={<Extra type={type} />}
      className={classNames(styles.card, className)}
      style={style}
      loading={loading}
    >
      {!loading && !list.length && <Empty/>}
      {
        list.map((item, idx) => {
          const { label, color } = item.status && statusMapper[item.status] || {}
          return <section
            key={idx}
            className={styles.item}
            onClick={() => {
              history.push(`${item.link}`)
            }}>
            <span>
              <Tag style={{ borderRadius: "4rem", color: 'white', border: "none" }} color={color}>{ label}</Tag>
              {item.source && <span>【{item.source}】</span>}
              {item.type && <span>【{item.type}】</span>}
              <span>{item.name}</span>
            </span>
            <span className='text-gray'>{ item.time }</span>
          </section>
        })
      }
    </Card>
    
  )
}

export default WaitTodo