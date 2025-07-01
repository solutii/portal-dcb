
import React from 'react'
//@ts-ignore
import { Rings } from 'react-loader-spinner'
import '../styles/FullPageLoader.scss'

const FullPageLoader = () => (
  <div className='full-page-loader'>
    <Rings
      visible={true}
      color='#6a69ff'
      ariaLabel="rings-loading"
      height={100}
      width={100}
    />
  </div>
)

export default FullPageLoader