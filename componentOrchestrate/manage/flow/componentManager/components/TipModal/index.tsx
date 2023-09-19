//阻止冒泡、统一样式
import React from 'react'
import { Modal ,ModalProps} from 'antd';
const TipModal:React.FC<ModalProps> = ({children,...props}) => {
  return (
    <div onClick={(e)=>e.stopPropagation()}>
      <Modal
        title="提示"
        {...props}
      >
        {children}
      </Modal>
   </div>
  )
}

export default TipModal