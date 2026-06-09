export const SITE_NAME = 'ProjePaylaş';
export const SITE_DESCRIPTION = 'Modern yazılım projelerini keşfet ve indir';

export const CATEGORIES = [
  { id: 'web', name: 'Web Uygulaması', icon: 'Globe', color: '#3B82F6' },
  { id: 'mobile', name: 'Mobil Uygulama', icon: 'Smartphone', color: '#8B5CF6' },
  { id: 'desktop', name: 'Masaüstü', icon: 'Monitor', color: '#10B981' },
  { id: 'api', name: 'API / Backend', icon: 'Server', color: '#F59E0B' },
  { id: 'cli', name: 'CLI Araçları', icon: 'Terminal', color: '#EF4444' },
  { id: 'library', name: 'Kütüphane', icon: 'Package', color: '#06B6D4' },
  { id: 'game', name: 'Oyun', icon: 'Gamepad2', color: '#EC4899' },
  { id: 'other', name: 'Diğer', icon: 'Layers', color: '#6B7280' },
] as const;

export const TECHNOLOGIES = [
  'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte',
  'Node.js', 'Express', 'NestJS', 'FastAPI', 'Django',
  'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C#', 'C++',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite',
  'Firebase', 'Supabase', 'AWS', 'GCP', 'Azure',
  'Docker', 'Kubernetes', 'Terraform',
  'Tailwind CSS', 'Shadcn/UI', 'Material UI', 'Chakra UI',
  'GraphQL', 'REST', 'WebSocket', 'gRPC',
  'React Native', 'Flutter', 'Swift', 'Kotlin',
  'Electron', 'Tauri',
] as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'oldest', label: 'En Eski' },
  { value: 'most-viewed', label: 'En Çok Görüntülenen' },
  { value: 'most-downloaded', label: 'En Çok İndirilen' },
] as const;

export const NAV_LINKS = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/projects', label: 'Projeler' },
  { href: '/about', label: 'Hakkımda' },
  { href: '/contact', label: 'İletişim' },
] as const;

export const ADMIN_NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/admin/projects', label: 'Projeler', icon: 'FolderOpen' },
  { href: '/admin/media', label: 'Medya', icon: 'Image' },
  { href: '/admin/analytics', label: 'Analitik', icon: 'BarChart2' },
  { href: '/admin/settings', label: 'Ayarlar', icon: 'Settings' },
] as const;

export const ACCEPTED_IMAGE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
};

export const ACCEPTED_ZIP_TYPES = {
  'application/zip': ['.zip'],
  'application/x-zip-compressed': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
  'application/x-7z-compressed': ['.7z'],
};

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_ZIP_SIZE = 500 * 1024 * 1024; // 500MB
export const MAX_GALLERY_IMAGES = 10;
