import HeroSection from '@/components/home/HeroSection';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import CategorySection from '@/components/home/CategorySection';
import TechStackSection from '@/components/home/TechStackSection';
import StatsSection from '@/components/home/StatsSection';
import CTASection from '@/components/home/CTASection';
import { safeGetProjects, safeGetDashboardStats } from '@/lib/firebase/firestore';

export const revalidate = 3600;

export default async function HomePage() {
  const [featuredProjects, stats, allProjects] = await Promise.all([
    safeGetProjects({ published: true, featured: true, limitCount: 6 }),
    safeGetDashboardStats(),
    safeGetProjects({ published: true }),
  ]);

  const categoryCounts = allProjects.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <HeroSection />
      <FeaturedProjects projects={featuredProjects} />
      <CategorySection counts={categoryCounts} />
      <TechStackSection />
      <StatsSection stats={stats} />
      <CTASection />
    </>
  );
}
