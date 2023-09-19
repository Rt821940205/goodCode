
import React, { useState, useEffect, useRef } from "react";
import {  Form, Input, Button, Select } from "antd";
import styles from './index.less'
import SvgIcon from '@/components/svgIcon'
const { Option } = Select;

import { useSelector } from "umi";
import { ConnectState } from '@/models/connect';
import { EndNodeConfig, NodeData } from '@/@types/orchestrate'
import { COMPLETE } from '@/pages/componentOrchestrate/const';
import TipModal from "../../component/tipModal";
import Drawer  from '@/pages/componentOrchestrate/manage/flow/component/drawer';
interface Props {
  open: boolean,
  onCancel: () => void,
  svg: string,
  onChange?: (data: NodeData) => void
}

const executeBreak: React.FC<Props> = (Props) => {
  var { open, onCancel, svg, onChange } = Props
  const activeNode: NodeData = useSelector(({ orchestrate: { activeNode } }: ConnectState) => activeNode)
  const [openModal, setOpenModal] = useState(false)

  const [form] = Form.useForm();

  const [fail, setFail] = useState<boolean>(false)

  const isChangeRef = useRef(false)

  useEffect(() => {

    if (open) {
      const fail = (activeNode.nodeConfig as EndNodeConfig)?.properties?.status?.value === 'fail'
      setFail(fail)
      isChangeRef.current = false
    }
  }, [open])

  const onSave = async () => {
    try {
      const values = await form.validateFields();
      const newNode: NodeData = {
        ...activeNode,
        nodeConfig: {
          "title": "配置",
          "properties": {
            "status": {
              name: "",
              "title": "终止的状态",
              "description": "将执行状态标记为选择的结果",
              "type": "string",
              "default": "success",
              "enum": [
                "success",
                "fail"
              ],
              "value": values.status
            },
            "message": {
              name: "",
              "title": "消息",
              "description": "终止后返回的消息",
              "type": "string",
              "value": values.message
            }
          }
        },
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
    var initialValues = { status: 'success' }
    for (let key in properties) {
      if (properties[key].value) {
        initialValues[key] = properties[key].value
      }
    }
    console.debug('initialValues', initialValues)
    form.setFieldsValue(initialValues)

  }, [activeNode])

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
        终止配置参数中编辑了新内容，是否要保存？
      </TipModal>

      <Drawer
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
            <SvgIcon iconClass={svg}></SvgIcon> <span>执行终止</span>
          </div>
          <div className={styles['content']}>
            <div className={styles['content-form']}>
              <Form layout="vertical" form={form} name="control-hooks"
                onValuesChange={() => isChangeRef.current = true}
              >
                <Form.Item name='status' label="终止状态" rules={[{ required: true }]}>
                  <Select onChange={(val) => {
                    setFail(val === 'fail')
                  }}>
                    <Option value='success' label='成功' >成功</Option>
                    <Option value='fail' label='失败' >失败</Option>
                  </Select>
                </Form.Item>
                {
                  fail && <Form.Item name='message' label="失败原因" rules={[{ required: true }]}>
                    <Input maxLength={20} />
                  </Form.Item>
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

export default executeBreak