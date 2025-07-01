
import React, { CSSProperties } from 'react'
import { TailSpin } from 'react-loader-spinner'

interface LoaderProps {
  height?: number
  width?: number
  color?: string
  containerStyle?: CSSProperties
}

const Loader = ({ height = 100, width = 100, color = '#f6f6fade', containerStyle }: LoaderProps) => 
  <div style={containerStyle}>
    <TailSpin
      ariaLabel="tail-spin-loading"
      color={color}
      height={height}
      width={width}
    />
  </div>
  
export default Loader
