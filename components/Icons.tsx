'use client';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass,faBagShopping,faChevronDown,faXmark,faBars,faArrowRight,faArrowLeft,faMinus,faPlus,faTrash,faGlobe,faMessage,faLocationDot,faEnvelope,faChevronRight,faCheck} from '@fortawesome/free-solid-svg-icons';
import {faWhatsapp} from '@fortawesome/free-brands-svg-icons';
export const Icon=({name,size='sm'}:{name:string,size?:'xs'|'sm'|'lg'})=>{const m:any={search:faMagnifyingGlass,bag:faBagShopping,chevron:faChevronDown,x:faXmark,bars:faBars,arrow:faArrowRight,left:faArrowLeft,minus:faMinus,plus:faPlus,trash:faTrash,globe:faGlobe,message:faMessage,location:faLocationDot,email:faEnvelope,chevronRight:faChevronRight,check:faCheck,whatsapp:faWhatsapp};return <FontAwesomeIcon icon={m[name]||faArrowRight} size={size}/>}
