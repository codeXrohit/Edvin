import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import AboutStory from '@/components/about-us/about-story';

export default function AboutUs() {
  return (
    <div className="bg-[#fdfaf6] pb-14 pt-[108px] sm:pb-20">
      <div className="mx-auto w-[calc(100%_-_40px)] max-w-7xl md:w-[calc(100%_-_64px)] lg:w-[calc(100%_-_96px)]">
        <PageBreadcrumb label="About us" />
        <AboutStory />
      </div>
    </div>
  );
}
