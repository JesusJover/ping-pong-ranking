import dynamic from "next/dynamic";
const Marcador = dynamic(() => import('@/app/components/Marcador'), { ssr: false });

export default function page() {

   return (
      <Marcador />
   );
}