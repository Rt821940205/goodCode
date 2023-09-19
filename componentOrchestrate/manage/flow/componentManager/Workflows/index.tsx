import React, { useState, useEffect, useRef } from 'react'
import styles from './index.less'
import {  Steps, message } from 'antd';
const { Step } = Steps
import StepOne from './StepOne'
import StepTwo from './StepTwo';
import StepFour from './StepFour'
import VariableModal from "../components/VariableModal";
import { useDispatch, useSelector } from "umi";
import { ConnectState } from '@/models/connect';
import { GlobalList, NodeData, CheckObj, DynamicFormFour } from '@/@types/orchestrate';

import TipModal from '../components/TipModal'
import Drawer  from '@/pages/componentOrchestrate/manage/flow/component/drawer';
interface Props {
  open: boolean,
  onCancel: () => void,
  nodeObj?: NodeData,
  onChangeNode: (nodeObj: NodeData) => void,
}


const Workflows: React.FC<Props> = (Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const activeNode: NodeData = useSelector(({ orchestrate: { activeNode } }: ConnectState) => activeNode)
  const { nodeId: activeNodeId, nodeType: activeNodeType } = activeNode || {};
  const nodeChoosed: boolean = !!activeNodeId;
  var { open, onCancel, nodeObj, onChangeNode } = Props

  const stepFourRef = useRef(null);
  const isChangeRef = useRef(false)
  const isMessageChange = (bool: boolean) => {
    isChangeRef.current = bool
    // 临时添加，控制变量保存后，不弹窗
    console.debug('临时添加，控制变量保存后，不弹窗', bool)
    if (!bool) {
      setConfirmOpen(bool)
    }
  }
  // 选择变量
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // GlobalList 不足以支撑JsonSchema，去除。
  const [dynamic, setDynamic] = useState<any>({
    key: '',
    title: '',
    value: '',
  })
  const showModal = (dynamic: DynamicFormFour | undefined) => {

    console.log('dynamic变量', dynamic)

    // var { key, title,type,description }=  dynamic || {}
    // setDynamic({ 
    //   key, title,type,description
    // })

    var dynamicData = { ...dynamic }
    delete dynamicData['value'];
    delete dynamicData['required'];


    setDynamic({ ...dynamicData });

    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const variableClick = (item: CheckObj) => {
    isMessageChange(true)
    stepFourRef?.current?.dynamicClick(item)
  }
  // 步骤条
  const [current, setCurrent] = useState(0);
  const onChangeCurrent = (current: number) => {
    if (current === 1) {
      setStepOneBool(false)
    }
    if (current === 2) {
      setStepTwoBool(false)
    }
    if (current === 3) {
      setStepThreeBool(false)
    }
    setCurrent(current)
  }
  const [stepOneBool, setStepOneBool] = useState(true)
  const [stepTwoBool, setStepTwoBool] = useState(true)
  const [stepThreeBool, setStepThreeBool] = useState(true)
  const CountStep = (
    current == 0 ? <StepOne current={current} onChangeCurrent={onChangeCurrent} onChangeNode={onChangeNode} /> :
      current == 1 ? <StepTwo key={1} title="请选择一个触发行为" current={current} onChangeCurrent={onChangeCurrent} onChangeNode={onChangeNode} /> :
        current == 2 ? <StepTwo key={2} isConfig={true} title="请选择一个组件配置" current={current} onChangeCurrent={onChangeCurrent} onChangeNode={onChangeNode} /> :
          current == 3 ? <StepFour ref={stepFourRef} isMessageChange={isMessageChange} onChangeNode={onChangeNode} showModal={showModal} onCancel={onCancel} /> : <div></div>);
  const onChange = (value: number) => {
    var { name, action, configId } = activeNode
    var current = 0
    switch (value) {
      case 1:
        !name ? messageApi.open({
          type: 'warning',
          content: '需先选择组件',
        }) : setCurrent(value);
        break;
      case 2:
        !action ? messageApi.open({
          type: 'warning',
          content: '需先触发行为',
        }) : setCurrent(value);
        break;
      case 3:
        !configId ? messageApi.open({
          type: 'warning',
          content: '需先组件配置',
        }) : setCurrent(value);
        break;
      default:
        setCurrent(current)
    }

  };

  // 会显
  useEffect(() => {
    var { name, action, configId } = activeNode
    var value = 0
    setStepOneBool(true)
    setStepTwoBool(true)
    setStepThreeBool(true)
    if (name) {
      value = 1
      setStepOneBool(false)
    }
    if (action) {
      value = 2
      setStepTwoBool(false)
    }
    if (configId) {
      value = 3
      setStepThreeBool(false)
    }
    setCurrent(value);
    handleCancel()
  }, [activeNode])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const confirmOk = () => {
    console.log('保存', isChangeRef.current)
    isChangeRef.current = false;
    setConfirmOpen(false)
    console.debug('stepFourRef?.current?.onSave', stepFourRef?.current?.onSave)
    stepFourRef?.current?.onSave(isChangeRef)
    // 弹窗不停弹，先关闭，待前端确认

  }
  const confirmCancel = () => {
    setConfirmOpen(false)
    onCancel()
    handleCancel()
    isChangeRef.current = false
  }
  const handleClick = (e: any) => {


    console.log('关闭', isChangeRef.current)
    if (isChangeRef.current) {
      setConfirmOpen(true)
    } else {
      onCancel()
      isChangeRef.current = false
    }
    console.log(isChangeRef.current)
  };
  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    }
  }
    , []);
  // useEffect(() => {
  //   console.log('activeNode', activeNode)
  // }, [activeNode]);
  const stopEvent = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
  }
  return (
    <>
      {contextHolder}
      <div onClick={stopEvent} className="work-wrapper">
        <Drawer
          destroyOnClose
          mask={false}
          placement="right" onClose={onCancel} open={open} className={styles['workflows']}>
          <Steps
            type="navigation"
            current={current}
            onChange={onChange}
            className={styles['steps-wrapper']}
          >
            <Step title="选择组件"></Step>
            <Step title="触发行为" disabled={stepOneBool}></Step>
            <Step title="组件配置" disabled={stepTwoBool}></Step>
            <Step title="配置参数" disabled={stepThreeBool}></Step>
          </Steps>
          <div className={styles['step-content']}>
            {CountStep}
          </div>
        </Drawer>
        <VariableModal
          isModalOpen={nodeChoosed && isModalOpen && ['trigger', 'func'].includes(activeNodeType)}
          onCancel={handleCancel}
          variableClick={variableClick}
          dynamic={dynamic}
        ></VariableModal>


        <TipModal
          destroyOnClose={true}
          open={confirmOpen} onOk={confirmOk} onCancel={confirmCancel}
        >
          <div>配置参数中编辑了新的内容，是否需要保存？</div>
        </TipModal>
      </div>
    </>
  )
}

export default Workflows;