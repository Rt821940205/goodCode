import React, { useState, useEffect } from "react";
import styles from './index.less'
import SvgIcon from '@/components/svgIcon'
import { Button } from 'antd';
import CardBox from "../../components/CardBox";
import SelectConfig from "./selectConfig";
import AddConfig from "./addConfig";
import { NodeData, ActionObj, ConfigObj, Car, StringCompat } from '@/@types/orchestrate';
import { queryActionsComponent, queryAppConfigsComponent } from '@/services/xuanwu/orcherate'
import { useAppId } from '@/pages/componentOrchestrate/hooks'
import { NOCOMPLETE } from '@/pages/componentOrchestrate/const';
import Loading from '@/components/loading/index';
import { useDispatch, useSelector } from "umi";
import { ConnectState } from '@/models/connect';
import { Define } from "@/pages/componentOrchestrate/AmisPropertyDefine";
interface Props {
  isConfig?: boolean,
  title: string,
  current: number,
  onChangeCurrent: (current: number) => void,
  onChangeNode: (nodeObj: NodeData) => void
}
const StepTwo: React.FC<Props> = (Props) => {
  const activeNode: NodeData = useSelector(({ orchestrate: { activeNode } }: ConnectState) => activeNode)
  let { isConfig = false, title, current, onChangeCurrent, onChangeNode } = Props
  const appId = useAppId()
  const [loading, setLoading] = useState(false)
  const [cardData, setCardData] = useState<(ActionObj | ConfigObj)[]>([]);
  const [highlight, setHighlight] = useState<StringCompat>('')
  const updateData = async (name?: StringCompat) => {
    setLoading(true)
    if (isConfig) {
      const payload = {
        app_id: appId,
        componentId: name as string,
        selectedId: activeNode?.configId
      }
      try {
        const { configs } = await queryAppConfigsComponent({ ...payload })
        setCardData(configs)
      } finally {
        setLoading(false)
      }
    } else {
      const payload = {
        appId,
        componentId: name as string,
      }
      try {
        const { component } = await queryActionsComponent({ ...payload })

        // ||  a['x-tags']?.filter((t: any) => Define.isExclude(t.name)).length == 0)

        let actions = component?.actions.filter((a: any) => !Define.isExclude(a.summary));
        console.debug('筛选组件行为清单:', actions)

        actions = actions?.filter((a: any) => !a['x-tags'] || a['x-tags']?.filter((t: any) => Define.isExclude(t.name) || t.name == '编排辅助').length == 0);

        console.debug('筛选组件行为清单:', actions)

        // 弃用、废弃、index=0和trigger

        if ((activeNode._index ? activeNode._index : 0) > 1) {
          actions = actions.filter((a: any) => !a['x-consumer']);
        }

        setCardData(actions)
      } finally {
        setLoading(false)
      }
    }
  }
  useEffect(() => {
    var { name } = activeNode
    updateData(name)
    if (!isConfig) {
      var { action } = activeNode
      setHighlight(action)
    } else {
      var { configId } = activeNode
      setHighlight(configId)
    }
  }, [isConfig]);
  const selectComp: (car: Car) => void = (car) => {
    if (!isConfig) {
      var { title, id, im, out } = car
      activeNode.actionTitle = title
      activeNode.action = id
      activeNode.input = im
      activeNode.out = out
      onChangeNode({
        ...activeNode,
        configId: undefined,
        configTitle: undefined,
        output: {
          title: '输出',
          properties: {}
        },
        isComplete: NOCOMPLETE
      })
    } else {
      var { title, id } = car
      activeNode.configTitle = title
      activeNode.configId = id
      onChangeNode({ ...activeNode })
    }
    onChangeCurrent(current + 1)
  }
  // 添加配置
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // 修改配置
  const [isModalConfig, setIsModalConfig] = useState<boolean>(false)
  const [config, setConfig] = useState({})
  const showModalConfig = () => {
    setIsModalConfig(true)
  }
  const cancelModalConfig = () => {
    setIsModalConfig(false)
  }
  const editModalConfig: (car: ActionObj | ConfigObj) => void = (car) => {
    setConfig(car)
    showModalConfig()
  }

  var { 'icon': img = '', title: titleOne, actionTitle } = activeNode
  return (
    <>
      <div className={styles['component-title']}>
        {img ? <span className={styles['component-img']}>
          <img src={img} alt="" />
        </span> : <SvgIcon iconClass="default-node-choose" style={{ fontSize: '1rem' }}></SvgIcon>}
        <span>{!isConfig ? title : `${titleOne}:${actionTitle}`}</span>
      </div>

      {isConfig && cardData.length > 10 ? <div className={styles['config']}>
        <Button onClick={showModal}>
          ＋添加配置
        </Button><br /><br />
      </div> : ''}

      <div className={styles['card-wrappper']}>
        {cardData.map((car: ActionObj | ConfigObj, index: number) => {
          if (isConfig) {
            console.debug('car',car)
            var { 'title': title, description, 'dataId': id, 'configDefault': isDefault } = (car as ConfigObj)
          } else {
            var { 'summary': title, description, 'operationId': id, in: im, out } = (car as ActionObj)
          }
          return (
            <CardBox isDefault={isDefault} key={index} id={id} title={title} description={description} im={im} out={out} highlight={highlight} isConfig={isConfig}
              editModalConfig={() => editModalConfig(car)} selectComp={selectComp} />
          )
        })}
      </div>
      {isConfig ? <div className={styles['config']}>
        <Button onClick={showModal}>
          ＋添加配置
        </Button>
      </div> : ''}


      <SelectConfig
        isModalOpen={isModalOpen}
        onCancel={handleCancel}
        updateThereData={() => {
          updateData(activeNode.name)
        }}
      ></SelectConfig>
      <AddConfig
        isModalForm={isModalConfig}
        onCancel={cancelModalConfig}
        updateThereData={() => {
          updateData(activeNode.name)
        }}
        title="编辑组件配置"
        config={config}
      ></AddConfig>
    </>
  )
}

export default StepTwo