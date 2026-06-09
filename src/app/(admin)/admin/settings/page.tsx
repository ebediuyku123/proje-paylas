'use client';

import { useState } from 'react';
import { Save, User, Mail, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/shared/BrandIcons';
import { getSiteSettings, updateSiteSettings, initSiteSettings } from '@/lib/firebase/firestore';
import { useWhenAuthed } from '@/hooks/useWhenAuthed';
import { DEFAULT_SITE_SETTINGS } from '@/lib/firebase/defaults';
import { useUpload } from '@/hooks/useUpload';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { ACCEPTED_IMAGE_TYPES } from '@/lib/constants';

export default function AdminSettings() {
  const { uploadAvatarFile, uploading, progress } = useUpload();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    developerName: '',
    developerTitle: '',
    developerBio: '',
    developerAvatar: '',
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    email: '',
    websiteUrl: '',
    heroTitle: '',
    heroSubtitle: '',
    seoTitle: '',
    seoDescription: '',
    ogImage: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useWhenAuthed(async () => {
    try {
      const data = await getSiteSettings();
      if (data) {
        setFormData({
          developerName: data.developerName || '',
          developerTitle: data.developerTitle || '',
          developerBio: data.developerBio || '',
          developerAvatar: data.developerAvatar || '',
          githubUrl: data.githubUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          twitterUrl: data.twitterUrl || '',
          email: data.email || '',
          websiteUrl: data.websiteUrl || '',
          heroTitle: data.heroTitle || '',
          heroSubtitle: data.heroSubtitle || '',
          seoTitle: data.seoTitle || '',
          seoDescription: data.seoDescription || '',
          ogImage: data.ogImage || '',
        });
      } else {
        await initSiteSettings(DEFAULT_SITE_SETTINGS);
      }
    } catch (error) {
      console.error('Settings load failed:', error);
      toast.error('Ayarlar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  });

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) setAvatarFile(acceptedFiles[0]);
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let avatarUrl = formData.developerAvatar;
      if (avatarFile) {
        toast.info('Profil fotoğrafı yükleniyor...');
        avatarUrl = await uploadAvatarFile(avatarFile);
      }

      await updateSiteSettings({
        ...formData,
        developerAvatar: avatarUrl,
      });

      toast.success('Ayarlar başarıyla kaydedildi.');
    } catch (error) {
      toast.error('Ayarlar kaydedilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-[#A1A1AA]">Yükleniyor...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Site Ayarları</h1>
          <p className="text-[#A1A1AA] text-sm">Genel site bilgilerini ve profilinizi güncelleyin.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Section */}
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-[#222222] pb-2 flex items-center gap-2">
            <User className="w-5 h-5 text-[#3B82F6]" /> Profil Bilgileri
          </h2>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <label className="block text-sm font-medium text-[#A1A1AA] mb-2">Profil Fotoğrafı</label>
              <div 
                {...getRootProps()} 
                className={`w-32 h-32 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden ${
                  isDragActive ? 'border-[#3B82F6] bg-[#3B82F6]/10' : 'border-[#333333] hover:border-[#444444] bg-[#161616]'
                }`}
              >
                <input {...getInputProps()} />
                {avatarFile ? (
                  <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="w-full h-full object-cover" />
                ) : formData.developerAvatar ? (
                  <img src={formData.developerAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-[#52525B]" />
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#A1A1AA] mb-1">Ad Soyad</label>
                  <input
                    type="text"
                    value={formData.developerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, developerName: e.target.value }))}
                    className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A1A1AA] mb-1">Unvan</label>
                  <input
                    type="text"
                    value={formData.developerTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, developerTitle: e.target.value }))}
                    className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6]"
                    placeholder="Full Stack Developer"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-1">Biyografi (Hakkımda)</label>
                <textarea
                  rows={4}
                  value={formData.developerBio}
                  onChange={(e) => setFormData(prev => ({ ...prev, developerBio: e.target.value }))}
                  className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6] resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-[#222222] pb-2 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-[#3B82F6]" /> Sosyal Medya & İletişim
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1 flex items-center gap-2"><GithubIcon className="w-4 h-4"/> GitHub URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1 flex items-center gap-2"><LinkedinIcon className="w-4 h-4"/> LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1 flex items-center gap-2"><TwitterIcon className="w-4 h-4"/> Twitter URL</label>
              <input
                type="url"
                value={formData.twitterUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1 flex items-center gap-2"><Mail className="w-4 h-4"/> E-posta Adresi</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>
        </div>

        {/* SEO Setup */}
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-[#222222] pb-2 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#3B82F6]" /> SEO & Meta
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1">Site SEO Başlığı</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1">Site SEO Açıklaması</label>
              <textarea
                rows={2}
                value={formData.seoDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6] resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            {saving || uploading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : <Save className="w-5 h-5" />}
            {uploading ? `Yükleniyor (${progress}%)` : 'Ayarları Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Importing lucide icon here since it's missing in the imports of the component
import { Globe } from 'lucide-react';
