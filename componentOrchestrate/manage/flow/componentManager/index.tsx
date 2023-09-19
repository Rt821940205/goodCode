import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import ApplyComponent from './ApplyComponent'
import Workflows from './Workflows';
import Execute from './execute';
import GlobalConfig from './GlobalConfig';
import ExecuteBreak from './executeBreak'
import ExecuteSplit from './executeSplit';;

import { NodeData } from '@/@types/orchestrate';
const componentManager: React.FC = () => {
  // 申请组件
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // 节点工作流
  const [open, setOpen] = useState(false);
  const [nodeObj, setNodeObj] = useState({});
  const [globalList, setGlobalList] = useState([]);
  const showDrawer: (event: any, nodeId?: string) => void = (e, nodeId) => {
  };
  const onClose = () => {
    setOpen(false);
  };

  // 执行条件、执行控制
  const [execute, setExecute] = useState(false);
  const executeDrawer = () => {
    setExecute(true);
  };
  const executeClose = () => {
    setExecute(false);
  };
  // 执行终止
  const [executeBreak, setexecuteBreak] = useState(false);
  const executeBreakDrawer = () => {
    setexecuteBreak(true);
  };
  const executeBreakClose = () => {
    setexecuteBreak(false);
  };
  // 循环执行
  const [executeSplit, setexecuteSplit] = useState(false);
  const executeSplitDrawer = () => {
    setexecuteSplit(true);
  };
  const executeSplitClose = () => {
    setexecuteSplit(false);
  };

  // 全局输入
  const [globalConfig, setGlobalConfig] = useState(false);
  const globalConfigDrawer = () => {
    setGlobalConfig(true);
  };
  const globalConfigClose = () => {
    setGlobalConfig(false);
  };
  const setGlobalListBack = (list: any) => {
    console.log(list)
  }

  const onChangeNode = (nodeObj: NodeData) => {
    setNodeObj(nodeObj)
  }
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Button type="primary" onClick={(event: any) => showDrawer(event)}>
        抽屉
      </Button>

      <Button type="primary" onClick={executeDrawer}>
        执行 - 抽屉
      </Button>
      <Button type="primary" onClick={executeBreakDrawer}>
        执行 - 终止
      </Button>
      <Button type="primary" onClick={globalConfigDrawer}>
        全局 配置
      </Button>

      <ApplyComponent
        isModalOpen={isModalOpen}
        onCancel={handleCancel}
      ></ApplyComponent>
      <Workflows
        open={open}
        onCancel={onClose}
        onChangeNode={onChangeNode}
      ></Workflows>

      <Execute
        open={execute}
        onCancel={executeClose}
        svg='execute-condition'
      ></Execute>

      <ExecuteSplit
        open={execute}
        onCancel={executeSplitClose}
        svg='execute-split'
      ></ExecuteSplit>

      <ExecuteBreak
        open={executeBreak}
        onCancel={executeBreakClose}
        svg='execute-condition'
      ></ExecuteBreak>

      <GlobalConfig
        open={globalConfig}
        onCancel={globalConfigClose}
      ></GlobalConfig>
    </>
  );
};

export default componentManager;