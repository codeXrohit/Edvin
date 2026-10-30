import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Cursor from '@/components/common/Cursor';
import BackToTopTruck from '@/components/common/BackToTopTruck';
import PageLoader from '@/components/common/PageLoader';
import PageContent from '@/components/common/PageContent';
import PageErrorBoundary from '@/components/common/PageErrorBoundary';
import { initSmoothScroll } from '@/utils/smoothScroll';
import { updateMetadata } from '@/utils/updateMetadata';
export default function MainLayout() {
  const { pathname } = useLocation();
  useEffect(() => initSmoothScroll(), []);
  useEffect(() => updateMetadata(pathname), [pathname]);
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-5 top-[10px] z-[10003] -translate-y-[160%] rounded-lg bg-white px-5 py-3 text-navy focus:translate-y-0"
      >
        Skip to content
      </a>
      <Cursor />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <PageErrorBoundary key={pathname}>
          <Suspense fallback={<PageLoader />}>
            <PageContent key={pathname}>
              <Outlet />
            </PageContent>
          </Suspense>
        </PageErrorBoundary>
      </main>
      <Footer />
      <BackToTopTruck />
    </>
  );
}
