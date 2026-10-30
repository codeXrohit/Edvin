import ArrivalHero from '@/components/home/ArrivalHero';
import PortServices from '@/components/home/PortServices';
import StoreScene from '@/components/home/StoreScene';
import ProductGrid from '@/components/home/ProductGrid';
import Retailers from '@/components/home/Retailers';
export default function HomePage() {
  return (
    <>
      <ArrivalHero />
      <PortServices />
      <StoreScene />
      <ProductGrid />
      <Retailers />
    </>
  );
}
