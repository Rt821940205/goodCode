//组件管理页
import React from 'react'
import ManageList from './manageList';
import Flow from './flow';


const Manage: React.FC = () => {
  return (
    <>
      <ManageList />
      <div className='flex-1'>
        <Flow/>
      </div>
    </>
  )
}
export default Manage