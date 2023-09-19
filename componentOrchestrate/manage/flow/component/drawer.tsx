import React from 'react'
import { Drawer as AntdDrawer,DrawerProps} from "antd";
const Drawer:React.FC<DrawerProps> = (props) => {
  return (
    <AntdDrawer
      getContainer={()=>document.querySelector('#arrage-flow-wrapper') as HTMLElement}
      {...props}
    >
    </AntdDrawer>
  )
}
export default Drawer