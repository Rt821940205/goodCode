import React from 'react'
import { AliveScope } from 'react-activation';
import SlideMenu from './components/slideMenu';
import Tabs from './components/tabs';

const Settings: React.FC = ({ children }) => {
  return (
    <AliveScope>
     <div className='flex'>
      <SlideMenu/>
      <div className='flex-1 bg-white'>
        <Tabs/>
        <div>
            { children }
        </div>
      </div>
     </div>
    </AliveScope>
  )
}

export default Settings