import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Eye, Calendar, Tag, ArrowLeft, ExternalLink, ShieldCheck, FileArchive } from 'lucide-react';
import { GithubIcon } from '@/components/shared/BrandIcons';
import ReactMarkdown from 'react-markdown';
import { getAllSlugs, safeGetProjectBySlug, safeGetProjects } from '@/lib/firebase/firestore';
import { formatDate, formatNumber } from '@/lib/utils';
import TechBadge from '@/components/shared/TechBadge';
import ShareButtons from '@/components/shared/ShareButtons';
import GallerySlider from '@/components/projects/GallerySlider';
import ProjectCard from '@/components/projects/ProjectCard';
import ClientAnalytics from '@/components/shared/ClientAnalytics';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static pages for all published projects
export async function generateStaticParams() {
  try {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const project = await safeGetProjectBySlug(resolvedParams.slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const project = await safeGetProjectBySlug(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  // Fire-and-forget view count increment (client-side ideally, but doing it here for simplicity in App Router)
  // Note: Next.js fetch cache might bypass this for static pages, so client-side API route is better for real analytics.
  // For now, we'll just show the static view count.

  // Fetch related projects (same category)
  const relatedProjects = (await safeGetProjects({ category: project.category, published: true, limitCount: 4 }))
    .filter((p) => p.id !== project.id)
    .slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://projepaylas.vercel.app';
  const projectUrl = `${siteUrl}/project/${project.slug}`;

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.shortDescription,
    applicationCategory: project.category,
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    softwareVersion: project.version,
    datePublished: project.releaseDate || project.createdAt,
    image: project.coverImage,
  };

  return (
    <>
      <ClientAnalytics type="view" projectId={project.id} projectTitle={project.title} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-white mb-8 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Projelere Dön
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                {project.category}
              </span>
              <div className="flex items-center gap-1.5 text-[#A1A1AA] text-sm">
                <Calendar className="w-4 h-4" />
                <time dateTime={project.releaseDate || project.createdAt}>
                  {formatDate(project.releaseDate || project.createdAt)}
                </time>
              </div>
              <div className="flex items-center gap-1.5 text-[#A1A1AA] text-sm">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                v{project.version}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {project.title}
            </h1>

            <p className="text-xl text-[#A1A1AA] leading-relaxed mb-8">
              {project.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-4 border-y border-[#222222] py-4">
              {/* Stats */}
              <div className="flex items-center gap-6 mr-auto">
                <div className="flex items-center gap-2 text-[#A1A1AA]">
                  <Eye className="w-5 h-5 text-[#52525B]" />
                  <span className="font-medium text-white">{formatNumber(project.viewCount)}</span>
                  <span className="text-sm">görüntüleme</span>
                </div>
                {project.zipFile && (
                  <div className="flex items-center gap-2 text-[#A1A1AA]">
                    <Download className="w-5 h-5 text-[#52525B]" />
                    <span className="font-medium text-white">{formatNumber(project.downloadCount)}</span>
                    <span className="text-sm">indirme</span>
                  </div>
                )}
              </div>

              {/* Share */}
              <ShareButtons url={projectUrl} title={project.title} />
            </div>
          </header>

          {/* Cover & Gallery */}
          <div className="mb-12">
            {project.galleryImages?.length > 0 ? (
              <GallerySlider images={[project.coverImage, ...project.galleryImages].filter(Boolean)} title={project.title} />
            ) : project.coverImage ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-[#222222]">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Proje Detayları</h2>
                <div className="prose prose-dark max-w-none prose-lg">
                  <ReactMarkdown>{project.longDescription}</ReactMarkdown>
                </div>
              </section>

              {/* Tags */}
              {project.tags?.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#52525B]" />
                    Etiketler
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 bg-[#161616] border border-[#222222] rounded-lg text-sm text-[#A1A1AA]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Actions Card */}
              <div className="bg-[#111111] border border-[#222222] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Bağlantılar</h3>
                <div className="space-y-3">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg font-medium transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Canlı Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-[#161616] hover:bg-[#1a1a1a] text-white border border-[#333333] hover:border-[#444444] rounded-lg font-medium transition-colors"
                    >
                      <GithubIcon className="w-4 h-4" />
                      Kaynak Kod (GitHub)
                    </a>
                  )}
                  {project.zipFile && (
                    <a
                      href={project.zipFile}
                      download
                      className="flex items-center justify-center gap-2 w-full py-3 bg-white hover:bg-gray-100 text-black rounded-lg font-medium transition-colors"
                    >
                      <FileArchive className="w-4 h-4" />
                      Dosyaları İndir
                    </a>
                  )}
                </div>
              </div>

              {/* Technologies Card */}
              {project.technologies?.length > 0 && (
                <div className="bg-[#111111] border border-[#222222] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Teknolojiler</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <TechBadge key={tech} name={tech} size="md" />
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <section className="mt-20 pt-10 border-t border-[#222222]">
              <h2 className="text-2xl font-bold text-white mb-6">Benzer Projeler</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((rp) => (
                  <ProjectCard key={rp.id} project={rp} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
