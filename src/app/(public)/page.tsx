import HeroSection from '@/components/home/HeroSection';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import CategorySection from '@/components/home/CategorySection';
import TechStackSection from '@/components/home/TechStackSection';
import StatsSection from '@/components/home/StatsSection';
import CTASection from '@/components/home/CTASection';
import AnnouncementSection from '@/components/home/AnnouncementSection';
import { safeGetProjects, safeGetDashboardStats, safeGetSiteSettings } from '@/lib/firebase/firestore';
import ClientAnalytics from '@/components/shared/ClientAnalytics';

export const revalidate = 0;

export default async function HomePage() {
  const [featuredProjects, stats, allProjects, settings] = await Promise.all([
    safeGetProjects({ published: true, featured: true, limitCount: 6 }),
    safeGetDashboardStats(),
    safeGetProjects({ published: true }),
    safeGetSiteSettings(),
  ]);

  const categoryCounts = allProjects.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <ClientAnalytics type="view" projectId="home" projectTitle="Ana Sayfa" />
      <HeroSection />
      <FeaturedProjects projects={featuredProjects} />
      <CategorySection counts={categoryCounts} />
      <TechStackSection />
      <StatsSection stats={stats} linesOfCode={settings?.linesOfCode || ''} />
      {/* Announcement + CTA */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          <div className="flex-1">
            <AnnouncementSection text={settings?.announcement || ''} />
          </div>
          <div className="hidden md:block w-px bg-[#1a1a1a]" />
          <div className="flex-1">
            <CTASection />
          </div>
        </div>
      </div>
    </>
  );
}
