import React from 'react'
import Card from '../Card';
import {Avatar,Divider,Button} from 'antd';
import { UserOutlined } from "@ant-design/icons";
import styles from './index.less';
import SvgIcon from '@/components/svgIcon';
import { useModel } from 'umi'
import { TaskRole } from '@/@types/global';
const nameMapper:Record<TaskRole,string> = {
  [TaskRole.Office]: "分局管理员",
  [TaskRole.Station]: "派出所民警",
  [TaskRole.Manager]: "管理员",
}
const User: React.FC<{type:TaskRole}> = ({type}) => {
  const { initialState } = useModel('@@initialState');
  const { realName } = initialState?.currentUser || {}

  const roleName = nameMapper[type]

  return (
    <Card
      className={styles.card}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
     
    >
      <Avatar
        size={110}
        icon={<UserOutlined />}
        style={{ width: '6.875rem', height: '6.875rem', lineHeight: '6.875rem' }}
      />
      <h4 className={styles.name}>{ realName }</h4>
      <div className={styles.detail}>
        <div>{ roleName }</div>
        <Divider type="vertical" className={styles.divider}/>
        <div>暂无</div>
      </div>
      <Button
        type="primary"
        href='/app/page/list/465473687135453184?appId=465467026043830272&pageId=465473687135453184&page=1'
        className={styles.send}
        icon={<SvgIcon iconClass='beenInitiate' style={{ fontSize: "1.0625rem" ,marginBottom:"-2px"} } />}>
          发起任务
      </Button>
    </Card>
  )
}

export default User