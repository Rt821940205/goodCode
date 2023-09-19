import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import styles from './selectConfig.less'
import CardBox from "../../components/CardBox";
import AddConfig from "./addConfig";


import { queryShareConfigsComponent } from '@/services/xuanwu/orcherate'
import { useDispatch, useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
import { ConfigObj, Car} from '@/@types/orchestrate';
import {Button} from 'antd'
interface Props{
  isModalOpen: boolean,
  onCancel: () => void,
  updateThereData: ()=>void,
}
const selectConfig: React.FC<Props> = (Props) => {
  var {isModalOpen, onCancel,updateThereData}= Props
  const activeNode = useSelector(({ orchestrate: { activeNode } }: ConnectState) => activeNode)
  const [cardData, setCardData] = useState<ConfigObj[]>([]);
  const updateData =async ()=>{
    const payload = {
      componentId: activeNode.name,
    }
    try {
      const {configs} = await queryShareConfigsComponent({ ...payload })
      setCardData(configs)
    } finally{
    }
  }
  useEffect(() => {
    isModalOpen && updateData()
  }, [isModalOpen]);

  const handleOk = () => {
    showModalForm()
  };
  const handleCancel = () => {
    onCancel()
  };

  const [isModalForm, setIsModalForm] = useState<boolean>(false)
  const [config, setConfig] = useState({})
  const showModalForm = ()=>{
    setIsModalForm(true)
  }
  const cancelForm = ()=>{
    setIsModalForm(false)
  }

  const selectComp: (car: Car)=> void = (car) => {
    setConfig(car)
    showModalForm()
  }

  return (
    <div>
      <Modal title="添加配置" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} 
        className={styles['add-config']}
        okText="下一步"
        cancelText="返回"
        footer={[
          <Button key="back" onClick={handleCancel}>
            返回
          </Button>,
        ]}
      >
        <div className={styles['component-title']}>
          <span>请选择一个组件超市基本配置</span>
        </div>
        <div className={styles['card-wrappper']}>
          {
          }
          {cardData.map((car: ConfigObj) => {

console.debug('car',car)


            var {  title, description, dataId: id, properties,configDefault } = car
            return (
              <CardBox key={id} id={id} title={title} description={description} properties={properties} isDefault={configDefault} selectComp={()=>selectComp(car)}/>
            )
          })}
        </div>
      </Modal>
      <AddConfig
        isModalForm={isModalForm}
        onCancel={cancelForm}
        onConfigCancel={handleCancel}
        config={config}
        title="新增组件配置"
        updateThereData={updateThereData}
      ></AddConfig>
    </div>
  )
}

export default selectConfig