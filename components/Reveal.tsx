'use client';
import {motion} from 'framer-motion';
export default function Reveal({children,className='',delay=0,style}:{children:React.ReactNode;className?:string;delay?:number;style?:React.CSSProperties}){
  return <motion.div className={className} style={style} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.7,delay,ease:[.16,1,.3,1]}}>{children}</motion.div>
}