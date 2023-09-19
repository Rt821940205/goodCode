
import User from "./components/User"
import ImportantTask from './components/ImportantTask'
import Count from './components/Count'
import WaitTodo from './components/WaitTodo'
import TypePie from './components/TypePie'
import TimeBar from './components/TimeBar'
import SignBack from './components/SignBack'
import CompeleteRate from './components/CompeleteRate'
import TypeList from './components/TypeList'
import styles from './index.less';
import { TaskRole } from '@/@types/global';
import Header from './Header';
import { useModel } from 'umi'
import {queryRoleList} from '@/services/xuanwu/taskPortal';
import { useEffect, useState } from "react"
import {Spin} from 'antd';
import _ from 'lodash';
import VersionCheck from '@/components/VersionCheck';
const Office =  () => {
    return <>
      <div className={styles.wrapper}>
        <div >
            <User  type={ TaskRole.Office}/>
            <ImportantTask/>
       </div>
        <div>
            <Count />
            <WaitTodo style={{ margin: "1.5rem 0" }} type={ TaskRole.Office} />
    
            <div className="flex justify-between">
                <TypePie />
                <TimeBar/>
            </div>
       </div>
       <div>
            <SignBack />
            <div className="mt-6">
              <CompeleteRate type={TaskRole.Office}/>
            </div>
       </div>
    </div>
    </>
}
const Station =  () => {
    return <div className={styles.wrapper}>
        <div >
            <User  type={ TaskRole.Station}/>
            <ImportantTask/>
       </div>
        <div>
            <Count />
            <WaitTodo style={{ margin: "1.5rem 0", height: "40.99rem" }} type={ TaskRole.Station} />
       </div>
       <TypeList type={ TaskRole.Station}/>
    </div>
}

const Manager =  () => {
    return <div className={styles.wrapper}>
        <div >
            <User  type={ TaskRole.Manager}/>
            <ImportantTask/>
       </div>
        <div>
            <Count />
            <WaitTodo style={{margin:"1.5rem 0"}} type={ TaskRole.Manager}/>
    
            <div className="flex justify-between">
                <TypePie />
                <TimeBar/>
            </div>
       </div>
       <div>
            <TypeList style={{height:"27.75rem"}} type={TaskRole.Manager}/>
            <div className="mt-6">
                <CompeleteRate type={TaskRole.Manager} />
            </div>
       </div>
    </div>
}

const OFFICE_ID = '480076031592497152' //分局管理员
const MANAGE_ID = '480076219086274560' //管理员

export default () => {
  
    const { initialState } = useModel('@@initialState');
    
    const id = initialState && initialState.currentUser && (initialState.currentUser as any).id
   
    const [role, setRole] = useState<TaskRole>(TaskRole.Station)
    
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const init = async () => {
            try {
                let roles: Array<number | string> = await queryRoleList({ id })
                roles = roles.map(r => r && r.toString())
                const interRoles = _.intersection(roles,[OFFICE_ID,MANAGE_ID])
                if (interRoles.includes(OFFICE_ID)) {
                    setRole(TaskRole.Office)
                } else if(interRoles.includes(MANAGE_ID)){
                    setRole(TaskRole.Manager)
                }
            } finally {
                setLoading(false)
            }
        }
        id && init()
    },[id])
    
    if (!id) {
        return null
    }
    const roleMapper = {
        [TaskRole.Office]: () => <Office />,
        [TaskRole.Station]: () => <Station />,
        [TaskRole.Manager]:()=><Manager/>
    }
   
    const Role = roleMapper[role]
    return <>
        <Header />
        <VersionCheck/>
        {
            loading ?
            <div className="w-full text-center pt-20">
                <Spin/>
            </div>
            : <Role/>
        }
    </>
}