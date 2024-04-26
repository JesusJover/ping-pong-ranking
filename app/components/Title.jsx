import { Anton } from "next/font/google"

const anton = Anton( { 
   subsets: ['latin'], 
   weight: ['400'],
   
})

export default function Title ({ className, children, size = '3xl'}) {
  return <h1 className={`text-xl md:text-2xl lg:text-${size} ${anton.className} uppercase text-ping-pong-blue ${className} text-center`}>{children}</h1>
}