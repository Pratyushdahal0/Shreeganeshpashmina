'use client';
import {motion} from 'framer-motion';
export default function Reveal({children,className='',delay=0}:{children:React.ReactNode;className?:string;delay?:number}){
  return <motion.div className={className} initial={{opacity:0,y:28,filter:'blur(4px)'}} whileInView={{opacity:1,y:0,filter:'blur(0px)'}} viewport={{once:true,amount:.14}} transition={{duration:.95,delay,ease:[.16,1,.3,1]}}>{children}</motion.div>
}
