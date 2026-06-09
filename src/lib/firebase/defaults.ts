import type { DashboardStats, SiteSettings } from '@/types';

export const EMPTY_DASHBOARD_STATS: DashboardStats = {
  totalProjects: 0,
  totalViews: 0,
  totalDownloads: 0,
  publishedProjects: 0,
  featuredProjects: 0,
  draftProjects: 0,
};

export const DEFAULT_SITE_SETTINGS: Omit<SiteSettings, 'id' | 'updatedAt'> = {
  developerName: 'Geliştirici',
  developerTitle: 'Full Stack Developer',
  developerBio: 'Henüz bir biyografi eklenmedi.',
  developerAvatar: '',
  githubUrl: '',
  linkedinUrl: '',
  twitterUrl: '',
  email: '',
  websiteUrl: '',
  techStack: [],
  categories: [],
  heroTitle: 'Yazılım Projelerini Keşfet',
  heroSubtitle: 'Modern açık kaynak ve kişisel projeler',
  seoTitle: 'ProjePaylaş — Yazılım Projeleri',
  seoDescription: 'Modern yazılım projelerini keşfet, incele ve indir.',
  ogImage: '',
  announcement: '🚀 Yenilikler — Yeni projeler ve güncellemeler burada!',
  linesOfCode: '',
};
