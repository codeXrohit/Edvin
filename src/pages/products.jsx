import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import ProductGrid from '@/components/home/ProductGrid';

export default function Products() {
  return (
    <div className="bg-white pb-12 pt-[108px] sm:pb-20">
      <div className="mx-auto w-[min(1400px,_calc(100%_-_112px))] tablet-down:w-[calc(100%_-_64px)] phone-down:w-[calc(100%_-_40px)]">
        <PageBreadcrumb label="Products" />
      </div>
      <ProductGrid standalone />
    </div>
  );
}
