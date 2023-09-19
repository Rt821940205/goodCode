import React from 'react'
import { Input,type InputProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const SearchInput: React.FC<InputProps> = (props) => {
  return (
    <Input
    size='large'
    suffix={<SearchOutlined style={{ color: '#999' }} />}
    className="rounded"
    {...props}
  />
  )
}
export default SearchInput

