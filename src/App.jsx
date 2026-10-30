import { lazy } from 'react';
import { MotionConfig } from 'motion/react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
const Home = lazy(() => import('@/pages/Home'));
const ContactUs = lazy(() => import('@/pages/contact-us'));
const AboutUs = lazy(() => import('@/pages/about-us'));
const Products = lazy(() => import('@/pages/products'));
const NotFound = lazy(() => import('@/pages/not-found'));
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="contact-us" element={<Navigate to="/contact" replace />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="products" element={<Products />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </MotionConfig>
  );
}
