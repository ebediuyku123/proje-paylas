export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  coverImage: string;
  galleryImages: string[];
  zipFile?: string;
  zipFileName?: string;
  githubUrl?: string;
  demoUrl?: string;
  tags: string[];
  category: string;
  technologies: string[];
  version: string;
  releaseDate: string;
  featured: boolean;
  published: boolean;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  coverImage: string;
  galleryImages: string[];
  zipFile: string;
  zipFileName: string;
  githubUrl: string;
  demoUrl: string;
  tags: string[];
  category: string;
  technologies: string[];
  version: string;
  releaseDate: string;
  featured: boolean;
  published: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  projectCount: number;
}

export interface SiteSettings {
  id: string;
  developerName: string;
  developerTitle: string;
  developerBio: string;
  developerAvatar: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  email: string;
  websiteUrl: string;
  techStack: TechItem[];
  categories: Category[];
  heroTitle: string;
  heroSubtitle: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  updatedAt: string;
}

export interface TechItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
}

export interface AnalyticsEvent {
  id: string;
  type: 'view' | 'download' | 'github_click' | 'demo_click';
  projectId: string;
  projectTitle: string;
  timestamp: string;
  userAgent?: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalViews: number;
  totalDownloads: number;
  publishedProjects: number;
  featuredProjects: number;
  draftProjects: number;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'zip' | 'other';
  size: number;
  path: string;
  projectId?: string;
  createdAt: string;
}

export type SortOption = 'newest' | 'oldest' | 'most-viewed' | 'most-downloaded';

export interface ProjectFilters {
  search: string;
  category: string;
  technology: string;
  sort: SortOption;
}
