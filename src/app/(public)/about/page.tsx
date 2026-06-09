import Image from 'next/image';
import { safeGetSiteSettings } from '@/lib/firebase/firestore';
import { DEFAULT_SITE_SETTINGS } from '@/lib/firebase/defaults';
import { Mail, Code2, Cpu } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/shared/BrandIcons';
import ReactMarkdown from 'react-markdown';
import TechBadge from '@/components/shared/TechBadge';

export const revalidate = 0;

export const metadata = {
  title: 'Hakkımda',
  description: 'Geliştirici hakkında bilgiler, yetenekler ve deneyimler.',
};

export default async function AboutPage() {
  const settings = (await safeGetSiteSettings()) ?? { id: 'main', ...DEFAULT_SITE_SETTINGS, updatedAt: '' };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        <section className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#222222] flex-shrink-0 relative bg-[#111111]">
            {settings.developerAvatar ? (
              <Image
                src={settings.developerAvatar}
                alt={settings.developerName || 'Geliştirici'}
                fill
                className="object-cover"
                sizes="192px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-[#52525B] font-bold">
                {settings.developerName?.charAt(0) || 'G'}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {settings.developerName}
            </h1>
            <p className="text-xl text-[#3B82F6] font-medium mb-6">
              {settings.developerTitle}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
              {settings.githubUrl && (
                <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-[#161616] border border-[#222222] rounded-lg text-[#A1A1AA] hover:text-white transition-colors">
                  <GithubIcon className="w-4 h-4" /> GitHub
                </a>
              )}
              {settings.linkedinUrl && (
                <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-[#161616] border border-[#222222] rounded-lg text-[#A1A1AA] hover:text-white transition-colors">
                  <LinkedinIcon className="w-4 h-4" /> LinkedIn
                </a>
              )}
              {settings.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-[#161616] border border-[#222222] rounded-lg text-[#A1A1AA] hover:text-white transition-colors">
                  <TwitterIcon className="w-4 h-4" /> Twitter
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-[#161616] border border-[#222222] rounded-lg text-[#A1A1AA] hover:text-white transition-colors">
                  <Mail className="w-4 h-4" /> E-posta
                </a>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <h2 className="text-2xl font-bold text-white">Hakkımda</h2>
          </div>
          <div className="prose prose-dark max-w-none bg-[#111111] border border-[#222222] rounded-2xl p-8">
            <ReactMarkdown>{settings.developerBio}</ReactMarkdown>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#10B981]" />
            </div>
            <h2 className="text-2xl font-bold text-white">Yetenekler & Teknolojiler</h2>
          </div>
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8">
            {settings.techStack && settings.techStack.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {settings.techStack.map((tech) => (
                  <TechBadge key={tech.id} name={tech.name} size="lg" />
                ))}
              </div>
            ) : (
              <p className="text-[#A1A1AA]">Henüz teknoloji eklenmedi.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
