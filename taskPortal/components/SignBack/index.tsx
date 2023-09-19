import React, {  useRef } from 'react'
import Card from '../Card'
import {Select} from 'antd'
import styles from './index.less'
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import useEChats from '../../hooks/useEharts';

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
]);
const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: (values: Array<any>) => {
      const date = values?.[0].name
      const str =  values.reduce((res, { marker,seriesName,data }) => {
        res += `${marker}${seriesName}:${Math.abs(data)}<br/>`
        return res
      }, '')
      return `${date}<br/>${str}`
    },
  },
  legend: {
    data: ['待签收', '已超时', '已完成'],
    itemWidth: 14,
    itemHeight: 14,
    itemGap: 10,
    textStyle: { //图例文字的样式
      fontSize: '1rem'
    }
  },
  grid: {
    top:"7%",
    left: '3%',
    right: '3%',
    bottom: '0',
    containLabel: true
  },
  xAxis: [
    {
      type: 'value',
      axisLabel: {
        formatter: function (value: number) {
          return Math.abs(value);
        },
      }
    },
  ],
  yAxis: [
    {
      type: 'category',
      axisTick: {
        show: false
      },
      data: ['03/11', '03/12', '03/13',  '03/13',  '03/14',  '03/15',  '03/16']
    }
  ],
  series: [
    {
      name: '待签收',
      type: 'bar',
      label: {
        show: true,
        position: 'inside'
      },
      emphasis: {
        focus: 'series'
      },
      data: [11, 10, 24, 44, 20, 22, 21]
    },
    {
      name: '已超时',
      type: 'bar',
      stack: 'Total',
      label: {
        show: true,
        position: 'inside',
        color:"white"
      },
      emphasis: {
        focus: 'series'
      },
      data: [32, 30, 34, 37, 39, 45, 42]
    },
    {
      name: '已完成',
      type: 'bar',
      stack: 'Total',
      label: {
        show: true,
        position: 'inside',
        color:"white",
        formatter: ({ data }: any) => {
          return Math.abs(data)
        },
      },
      emphasis: {
        focus: 'series'
      },
      data: [-12, -13, -10, -13, -19, -23, -21]
    }
  ]
};
const SignBack: React.FC = () => {
  const ref = useRef(null)

  useEChats(ref,option)

  return (
    <Card
      className={styles.card}
      title='任务签收反馈'
      icon='tz-sign-back'
      extra={
        <Select
          defaultValue="新河派出所"
          style={{ width: '9.5625rem' }}
          options={[
            { value: '新河派出所', label: '新河派出所' }
          ]}
        />
      }
    >
      <div ref={ref} style={{height:"22.5rem"}}></div>
    </Card>
  )
}

export default SignBack