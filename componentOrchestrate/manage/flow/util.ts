
import { NodeData, IfNodeConfig, IfConditionItem, SplitNodeConfig } from '@/@types/orchestrate'
import { getUUID } from '@/utils'
import { COMPLETE } from '../../const'
//深度遍历编排节点
export const loop = (data: NodeData[], nodeId: string, callback: (item: NodeData, idx: number, data: NodeData[]) => void) => {
  for (const [idx, item] of data.entries()) {
    if (item.nodeId === nodeId) {
      return callback(item, idx, data)
    }
    if (item.children && item.children.length) {
      loop(item.children, nodeId, callback)
    }
  }
}

export const addIndexNodes = (nodes: NodeData[] = []) => {
  let index = 1
  const loop = (nodes: NodeData[]) => {
    nodes.forEach((item) => {
      item._index = index++
      if (item.children && item.children.length) {
        loop(item.children)
      }
    })
  }
  loop(nodes)
  return nodes
}
export const addLevelNodes = (nodes: NodeData[] = []) => {
  let level = 0
  let arr: NodeData[] = nodes
  while (arr.length) {
    level++
    let nextNodes: NodeData[] = []
    arr.forEach((item: NodeData) => {
      item._level = level

      if (item.children && item.children.length) {
        nextNodes.push(...item.children)
      }
    })
    arr = nextNodes
  }
  return nodes
}


export const generateDefaultNode = (): NodeData => {
  return {
    nodeId: getUUID(),
    note:undefined,
    isComplete: '0',
    nodeType: 'func',
    nextNodeId: undefined,
    parentNodeId: undefined,
    title: undefined,
    name: undefined,
    description: undefined,
    icon: undefined,
    action: undefined,
    actionTitle: undefined,
    configId: undefined,
    configTitle: undefined,
    out: {
      properties: {},
    },
    input: {
      title: '输入',
      properties: {}
    },
    output: {
      title: '输出',
      properties: {}
    }
  }
}

export const generateIfNodeConfig = (items?: IfConditionItem[][]): IfNodeConfig => {
  return {
    title: "配置",
    description: "",
    properties: {
      if: {
        type: "array",
        title: '条件设置',
        description: '支持且、或条件处理',
        format: "x-case",
        required: true,
        minitems: 1,
        items: items || []
      }
    }
  }
}

export const SplitNodeConfigSchema = {
  title: "配置",
  description: "",
  properties: {
    "source": {
      "title": "待遍历数据",
      "description": "目前支持数组、列表、字符串结构",
      "type": "array",
      "required": true,
      "format": "x-split"
    },
    "parallelProcessing": {
      "title": "并发执行",
      "description": "如果没有顺序执行的需求，并发执行",
      "type": "boolean",
      "default": "false"
    },
    "stopOnException": {
      "title": "错误时停止",
      "description": "默认行为是不停止而是继续处理直到结束。",
      "type": "boolean",
      "default": "false"
    },
    "aggregate": {
      "title": "聚合结果",
      "description": "开启后，会收集对循环处理后的结果",
      "type": "boolean",
      "default": "false"
    }
  }
}

export const generateSplitNodeConfig = (items?: IfConditionItem[][]): SplitNodeConfig => {
  return SplitNodeConfigSchema
}

export const generateIfNode = (): NodeData => {
  return {
    ...generateDefaultNode(),
    nodeType: 'if',
    title: '条件执行',
    nodeConfig: generateIfNodeConfig(),
    children: [
      {
        ...generateDefaultNode(),
        nodeType: 'func'
      }
    ]
  }
}




export const generateElseNode = (): NodeData => {
  return {
    ...generateDefaultNode(),
    nodeType: 'else',
    title: '其它执行控制',
    children: [
      {
        ...generateDefaultNode(),
        nodeType: 'func'
      }
    ],
    isComplete: COMPLETE
  }
}

export const generateFunNode = (): NodeData => {
  return {
    ...generateDefaultNode(),
    title: '待选择组件',
    nodeType: 'func'
  }
}

export const generateEndNode = (): NodeData => {
  return {
    ...generateDefaultNode(),
    nodeType: 'end',
    title: '执行终止',
    nodeConfig: {
      title: '',
      properties: {
        status: {},
        message: {}
      }
    }
  }
}


export const generateLoopSplitNode = (): NodeData => {
  return {
    nodeId: getUUID(),
    isComplete: '0',
    nextNodeId: undefined,
    parentNodeId: undefined,
    "containerName":"轮循",
    "nodeType": "func",
    "title": "循环执行",
    "name": "eg_e88f_loop_node_plugin",
    "description": "用于数据循环处理",
    "icon": "",
    "action": "eg_e88f8655_split_action",
    "actionTitle": "遍历处理",
    "configId": "0",
    "configTitle": "使用组件默认配置",
    "out": {
      "type": "object",
      "properties": {
        "data": {
          "title": "示例数据项",
          "description": "此输出取分片数据第1条，用于测试对接",
          "type": "object"
        }
      },
      "title": "遍历示例输出",
    },
    "input": {
      "type": "object",
      "properties": {
        "data": {
          "required":true,
          "title": "待遍历数据",
          "description": "目前支持数组、列表、字符串结构",
          "type": "object"
        },
       
        "delimiter": {
          "type": "string",
          "title": "字符分片符",
          "description": "仅对字符串数据有效，将使用分片符对字符串进行分片",
          "default": ","
        },
        "parallelProcessing": {
          "x-ui-simple": true,
          "type": "boolean",
          "title": "是否并发执行",
          "description": "如果没有顺序执行的需求，并发执行",
          "default": false
        },
       
        "stopOnException": {
          "x-ui-simple": true,
          "type": "boolean",
          "title": "错误时停止",
          "description": "默认行为是不停止而是继续处理直到结束",
          "default": false
        },
        "resultAggregate": {
          "x-ui-simple": true,
          "type": "boolean",
          "title": "聚合结果",
          "description": "开启后，会收集对循环处理后的结果",
          "default": false
        }
      },
      "required": ["data"],
      "title": "遍历执行参数",
    },
    "output": {
      "title": "输出",
      "properties": {}
    }
  }
}



// export const generateSplitNode = (): NodeData => {
//   return {
//     ...generateDefaultNode(),
//      nodeType: 'split', 
//      title:'循环执行',
//      nodeConfig: {
//       title: '',
//       properties: {
//         status: {},
//         message: {}
//       }
//     },  children: [
//       {
//         ...generateDefaultNode(),
//         nodeType: 'func'
//       }
//     ]
//   }
// }

export const generateSplitNode = (): NodeData => {
  return {
    ...generateLoopSplitNode(),
    children: [
      {
        ...generateDefaultNode(),
        nodeType: 'func'
      }
    ]
  }
}


export const getTreeData = (nodes: NodeData[], nodeId: string, propertiesInp: any) => {
  for (let node of nodes) {
    let { children } = node
    if (node.nodeId === nodeId) {
      node.input = {
        ...node.input,
        ...{
          properties: { ...propertiesInp }
        }
      }
    }
    if (children && children.length > 0) {
      getTreeData(children, nodeId, propertiesInp)
    }
  }
  return nodes

}