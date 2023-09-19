import { useEffect,MutableRefObject, useState } from "react"
import * as echarts from 'echarts/core';
import _ from 'lodash'
const useEChats = (chartRef: MutableRefObject<HTMLElement | null>, option: Record<any, any>) => {

  let [chartIns] = useState<echarts.ECharts>()
 
  useEffect(() => {
    if (!chartIns) {
      chartIns = echarts.init(chartRef.current as unknown as HTMLElement)
    }
    chartIns.setOption(option)

  }, [option])
  
  useEffect(() => {
    const onResize = _.throttle(() => {
      chartIns?.resize()
    },500)
    window.addEventListener("resize", onResize)
    return () => {
      chartIns?.dispose()
      window.removeEventListener("resize",onResize)
    }
  }, [])
}

export default useEChats