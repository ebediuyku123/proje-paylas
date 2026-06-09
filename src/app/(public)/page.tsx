import HeroSection from '@/components/home/HeroSection';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import CategorySection from '@/components/home/CategorySection';
import TechStackSection from '@/components/home/TechStackSection';
import StatsSection from '@/components/home/StatsSection';
import CTASection from '@/components/home/CTASection';
import AnnouncementSection from '@/components/home/AnnouncementSection';
import { safeGetProjects, safeGetDashboardStats, safeGetSiteSettings } from '@/lib/firebase/firestore';
import ClientAnalytics from '@/components/shared/ClientAnalytics';

export const revalidate = 3600;

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
      {/* Announcement + CTA side by side on large screens, stacked on mobile */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row items-stretch gap-6">
        {settings?.announcement && (
          <div className="flex-1">
            <AnnouncementSection text={settings.announcement} />
          </div>
        )}
        <div className={settings?.announcement ? 'flex-1' : 'w-full'}>
          <CTASection />
        </div>
      </div>
    </>
  );
}
