


import React, { useEffect, useState ,CSSProperties} from 'react'
import Card from '../Card';
import styles from './index.less';
import classNames from 'classnames';
import {Button} from 'antd'
const fetchList = ():Promise<ListItem[]> => {
  return new Promise((resolve, reject) => { 
    return resolve([
      {
        id:'1',
        level: Level.Rush,
        taskName: '多次报警',
        user: '张丽',
        time: "2022.11.07",
        affix:true
      },
      {
        id:'2',
        level: Level.Urgent,
        taskName: '多次报警，需列黄色管控',
        user: '周平',
        time: "2022.12.07",
        affix:true
      },
      {
        id:'3',
        level: Level.Urgent,
        taskName: '债务纠纷',
        user: '赵国瑞',
        time: "2022.12.17",
        affix:true
      },
      {
        id:'4',
        level: Level.Normal,
        taskName: '涉及多次警情',
        user: '李新',
        time: "2023.01.07",
        affix:true
      },
      {
        id:'5',
        level:Level.Normal,
        taskName: '人员编辑',
        user: '王晓心',
        time: "2023.02.01",
        affix:true
      },
      {
        id:'6',
        level:Level.Normal,
        taskName: '级别变更',
        user: '金巧颜',
        time: "2023.03.11",
        affix:true
      },
     ]
    )
  })
}
type ListItem = {
  id:string,
  level: Level,
  taskName: string,
  user:string,
  time: string,
  affix:boolean
}
type LevelUi = CSSProperties & {
  label: string,
  textColor:string
}
enum Level  {
  Rush = '0',
  Urgent = '1',
  Normal = '2'
}

const rush:LevelUi = {
  border: "1px solid #FFDBD9",
  background: "linear-gradient(0deg, #FDEDEC, #FDEDEC), #FFFFFF",
  textColor: "#DB3333",
  label:'加急'
}
const urgent:LevelUi = {
  border: "1px solid #FED9C5",
  background: "linear-gradient(0deg, #FFF1E8, #FFF1E8), #FFFFFF",
  textColor: "#EC6A23",
  label:'紧急'
}
const normal:LevelUi = {
  border: "1px solid #EBEBEB",
  background: "linear-gradient(0deg, #F4F7FC, #F4F7FC), #FFFFFF",
  textColor: "#06C270",
  label:'普通'
}


const levelMapper:Record< Level,LevelUi> = {
  [Level.Rush]: rush,
  [Level.Urgent]: urgent,
  [Level.Normal]:normal
} 

const ImportTasks: React.FC = () => {
  const [list, setList] = useState<ListItem[]>([])

  useEffect(() => {
    (async function render() {
      const list: ListItem[] = await fetchList()
      setList(list)
    })()
  },[])

  return (
    <Card
      className={styles.card}
      icon='tz-import-task'
      title="重点任务"
      extra={<Button
        type='link'
        className='text-gray'
        href='/app/page/list/465476807232061440?appId=465467026043830272&pageId=465476807232061440&page=1'>
        查看更多
      </Button>}
      bodyStyle={{height:"27.475rem",overflow:'auto'}}
    >
      {
        list.map((item) => {
          const {background,border,textColor,label} = levelMapper[item.level] || {}
          return <section
            className={styles.item} key={item.id}
            style={{
              background,
              border
            }}
          >
              <div className={styles.col} style={{width:"2.725rem"}}>
                <label>等级</label>
                <div className='text-danger' style={{color:textColor}}>{ label }</div>
              </div>
              <div className={classNames(styles.col,'flex-1')}>
                <label>任务名称</label>
                <div className='overflow-line-1 text-center' title={item.taskName}>{item.taskName}</div>
              </div>
              <div className={styles.col} style={{width:"4.25rem"}}>
                <label>处理人</label>
                <div className='overflow-line-1 text-center' title={item.user}>{item.user}</div>
              </div>
              <div className={styles.col} style={{width:"5.625rem"}}>
                <label>时间</label>
                <div>{item.time}</div>
              </div>
          </section>
         }
      )
     }
    </Card>
  )
}

export default ImportTasks