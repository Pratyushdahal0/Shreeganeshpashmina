'use client';
import {motion} from 'framer-motion';

export default function TextReveal({children,className='',delay=0}:{children:React.ReactNode;className?:string;delay?:number}){
  return <motion.div
    className={className}
    initial="hidden"
    animate="show"
    variants={{show:{transition:{staggerChildren:.055,delayChildren:delay}},hidden:{}}}
  >
    {typeof children === 'string' ? children.split(' ').map((word,i)=><span key={i} style={{display:'inline-block',overflow:'hidden',marginRight:'.24em'}}><motion.span style={{display:'inline-block'}} variants={{hidden:{y:'105%',opacity:0},show:{y:0,opacity:1}}} transition={{duration:.72,ease:[.16,1,.3,1]}}>{word}</motion.span></span>) : children}
  </motion.div>
}
