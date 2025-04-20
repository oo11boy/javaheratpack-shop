import React from 'react'
import './Footer.css'
export default function Footer() {
  return (
    <div className="flex ccontainer flex-col  items-center justify-between py-6 bg-gray-900 text-gray-300">

<div className='enmad'>


    <a
        className="w-full"
        referrerPolicy="origin"
        target="_blank"
        href="https://trustseal.enamad.ir/?id=599317&Code=wnKMupaQaSbkiAnTQTXsbPP6eczQymJc"
        rel="noopener"
      >
        <img
          referrerPolicy="origin"
          src="/Images/enmad.png"
          alt="enmad"
          className="w-[20em]"
          style={{ cursor: "pointer" }}
          id="wnKMupaQaSbkiAnTQTXsbPP6eczQymJc"
        />
      </a>
        
</div>
<div className='mt-4'>
  
  <span className="text-sm font-medium">طراحی شده توسط</span>
  <a 
    href="https://unicodewebdesign.com" 
    className="mr-2 text-[color:var(--primary-color)]  font-semibold text-base hover:text-[#0bb55a] transition-colors duration-300   decoration-2 decoration-[color:var(--primary-color)]/50"
  >
    یونیکد
    
  </a>
  
</div>
  </div>
  )
}
