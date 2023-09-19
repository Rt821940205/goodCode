// 2023-06-02 吕继勇 循环（遍历）逻辑节点配置
import React, { useState, useEffect, useRef } from "react";
import {  Form, Button, Switch } from "antd";
import styles from './index.less'
import SvgIcon from '@/components/svgIcon'
import { CustomInput } from "../components/CustomInput";
import { useSelector } from "umi";
import { ConnectState } from '@/models/connect';
import { NodeData } from '@/@types/orchestrate'
import { SplitNodeConfigSchema } from '@/pages/componentOrchestrate/manage/flow/util';
import { COMPLETE } from '@/pages/componentOrchestrate/const';
import TipModal from "../../component/tipModal";
import VariableModal from "../components/VariableModal";
import { CheckObj } from '@/@types/orchestrate';
import Drawer  from '@/pages/componentOrchestrate/manage/flow/component/drawer';
interface Props {
  open: boolean,
  onCancel: () => void,
  svg: string,
  onChange?: (data: NodeData) => void
}

const executeSplit: React.FC<Props> = (Props) => {
  var { open, onCancel, svg, onChange } = Props
  const activeNode: NodeData = useSelector(({ orchestrate: { activeNode } }: ConnectState) => activeNode)
  const [openModal, setOpenModal] = useState(false)


  const { nodeId: activeNodeId, nodeType: activeNodeType } = activeNode || {};
  let nodeChoosed: boolean = !!activeNodeId;

  const [form] = Form.useForm();


  const isChangeRef = useRef(false)

  useEffect(() => {

    if (open) {
      isChangeRef.current = false
    }
  }, [open])



  const sourceKey = 'source';
  const parallelProcessingKey = 'parallelProcessing';
  const stopOnExceptionKey = 'stopOnException';
  const aggregateKey = 'aggregate';
  const switchList = [parallelProcessingKey, stopOnExceptionKey, aggregateKey];
  const nodeConfig = SplitNodeConfigSchema;


  const onSave = async () => {
    try {
      const values = await form.validateFields();
      var nodeConfigCopy = JSON.parse(JSON.stringify(nodeConfig))
      nodeConfigCopy.properties[sourceKey]['value'] = values[sourceKey];

      switchList.forEach(key => {
        nodeConfigCopy.properties[key]['value'] = values[key];
      })

      console.debug('nodeConfigCopy', nodeConfigCopy)
      const newNode: NodeData = {
        ...activeNode,
        nodeConfig: nodeConfigCopy,
        isComplete: COMPLETE
      }
      onChange?.(newNode)
      onCancel()
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  useEffect(() => {
    const properties = activeNode?.nodeConfig?.properties
    var initialValues = {}
    for (let key in properties) {
      initialValues[key] = properties[key].value
    }

    console.debug('initialValues', initialValues)


    form.setFieldsValue(initialValues)

  }, [activeNode])

  const superVariable = useSelector(({ orchestrate: { superVariable } }: ConnectState) => superVariable)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const variableClick = (checkObj: CheckObj) => {
    const key = sourceKey;
    var { parentKey } = checkObj
    const old = form.getFieldValue(key)
    var { parentKey } = checkObj
    var serialNumber = "全局输入"
    if (parentKey != 'in') {
      serialNumber = superVariable.findIndex((item: any) => item.key === parentKey)
      if (serialNumber != undefined) {
        serialNumber = serialNumber + 1
      } else {
        serialNumber = ''
      }
    }
    form.setFieldsValue({
      [key]: [...old || [], { ...checkObj, serialNumber }]
    });

  }

  const onVariable = () => {
    setIsModalOpen(true);
  }

  return (
    <>
      <TipModal
        open={openModal}
        onCancel={() => {
          setOpenModal(false)
          onCancel()
        }}
        okText='保存'
        onOk={() => {
          setOpenModal(false)
          onSave()
        }}
      >
        循环配置参数中编辑了新内容，是否要保存？
      </TipModal>

      <VariableModal
        isModalOpen={nodeChoosed && isModalOpen && activeNodeType === 'split'}
        onCancel={handleCancel}
        variableClick={variableClick}
        isFastBind={false}
        style={{ right: '32rem' }}
      ></VariableModal>

      <Drawer
        mask={false}
        placement="right"
        onClose={() => {
          isChangeRef.current ? setOpenModal(true) : onCancel()
        }}
        open={open}
        headerStyle={{ 'display': 'none' }}
        className={styles['execute']}
      >
        <div className={styles['drawer-wrapper']}>
          <div className={styles['title']}>
            <SvgIcon iconClass={svg}></SvgIcon> <span>循环执行</span>
          </div>
          <div className={styles['content']}>

            <div className={styles['content-form']}>
              <Form layout="vertical" form={form} name="control-hooks"
                onValuesChange={() => isChangeRef.current = true}
              >
                <Form.Item name={sourceKey}
                  tooltip={{
                    title:
                      <div>
                        <div>描述:{nodeConfig.properties[sourceKey].description} </div>
                        <div>字段:{sourceKey}</div>
                      </div>
                  }}
                  label={nodeConfig.properties[sourceKey].title} rules={[{ required: true }]}>

                  <CustomInput
                    inputClick={() => onVariable()}
                  ></CustomInput>
                </Form.Item>


                {
                  switchList.map(key => {
                    return <Form.Item name={key}
                      tooltip={{
                        title:
                          <div>
                            <div>描述:{nodeConfig.properties[key].description} </div>
                            <div>字段:{key}</div>
                          </div>
                      }}
                      valuePropName="checked"
                      label={nodeConfig.properties[key].title}>
                      <Switch />
                    </Form.Item>
                  })
                }

              </Form>
            </div>
          </div>
          <div className={styles['footer']}>
            <Button type="primary" onClick={onSave}>保存</Button>
          </div>
        </div>
      </Drawer>

    </>
  )
}

export default executeSplit