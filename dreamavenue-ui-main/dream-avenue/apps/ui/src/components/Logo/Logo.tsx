import React from 'react'
import DALogo from '../../assets/images/DALogo.jpg';
import DALogosmall from '@/assets/images/DALogosmall.jpg';

type Props = {
    logo?:string,
    className?:string,
    small?:boolean
}

const Logo = (props: Props) => {
  return (
    <div> <img src={props?.small?DALogosmall:DALogo} alt="Logo" className={`${props.className} `} /></div>
  )
}

export default Logo