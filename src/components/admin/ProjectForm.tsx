'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Save, ArrowLeft, Image as ImageIcon, FileArchive, X, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { createProject, updateProject } from '@/lib/firebase/firestore';
import { useUpload } from '@/hooks/useUpload';
import { CATEGORIES, TECHNOLOGIES, ACCEPTED_IMAGE_TYPES, ACCEPTED_ZIP_TYPES } from '@/lib/constants';
import { generateSlug, formatFileSize } from '@/lib/utils';
import { toast } from 'sonner';
import type { Project } from '@/types';

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface ProjectFormProps {
  initialData?: Project;
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const { uploadCover, uploadGallery, uploadZip, progress, uploading } = useUpload();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    shortDescription: initialData?.shortDescription || '',
    longDescription: initialData?.longDescription || '',
    category: initialData?.category || '',
    version: initialData?.version || '1.0.0',
    releaseDate: initialData?.releaseDate || new Date().toISOString().split('T')[0],
    githubUrl: initialData?.githubUrl || '',
    demoUrl: initialData?.demoUrl || '',
    tags: initialData?.tags?.join(', ') || '',
    technologies: initialData?.technologies || [],
    published: initialData?.published || false,
    featured: initialData?.featured || false,
    coverImage: initialData?.coverImage || '',
    galleryImages: initialData?.galleryImages || [],
    zipFile: initialData?.zipFile || '',
    zipFileName: initialData?.zipFileName || '',
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [zipFileObj, setZipFileObj] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-generate slug from title if new project
  useEffect(() => {
    if (!initialData && formData.title && !formData.slug) {
      setFormData(prev => ({ ...prev, slug: generateSlug(prev.title) }));
    }
  }, [formData.title, initialData]);

  // Dropzone for cover
  const onDropCover = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) setCoverFile(acceptedFiles[0]);
  }, []);
  const { getRootProps: getCoverProps, getInputProps: getCoverInputProps, isDragActive: isCoverDrag } = useDropzone({
    onDrop: onDropCover,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
  });

  // Dropzone for gallery
  const onDropGallery = useCallback((acceptedFiles: File[]) => {
    setGalleryFiles(prev => [...prev, ...acceptedFiles].slice(0, 10)); // max 10
  }, []);
  const { getRootProps: getGalleryProps, getInputProps: getGalleryInputProps, isDragActive: isGalleryDrag } = useDropzone({
    onDrop: onDropGallery,
    accept: ACCEPTED_IMAGE_TYPES,
  });

  // Dropzone for ZIP
  const onDropZip = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) setZipFileObj(acceptedFiles[0]);
  }, []);
  const { getRootProps: getZipProps, getInputProps: getZipInputProps, isDragActive: isZipDrag } = useDropzone({
    onDrop: onDropZip,
    accept: ACCEPTED_ZIP_TYPES,
    maxFiles: 1,
  });

  const toggleTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech]
    }));
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...formData.galleryImages];
    newGallery.splice(index, 1);
    setFormData(prev => ({ ...prev, galleryImages: newGallery }));
  };

  const removeGalleryFile = (index: number) => {
    const newFiles = [...galleryFiles];
    newFiles.splice(index, 1);
    setGalleryFiles(newFiles);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.category) {
      toast.error('Lütfen zorunlu alanları doldurun (Başlık, Slug, Kategori).');
      return;
    }

    setIsSaving(true);
    try {
      const projectId = initialData?.id || crypto.randomUUID(); // Mock ID for path if new
      let finalCover = formData.coverImage;
      let finalGallery = [...formData.galleryImages];
      let finalZipUrl = formData.zipFile;
      let finalZipName = formData.zipFileName;

      // Upload files
      if (coverFile) {
        toast.info('Kapak görseli yükleniyor...');
        finalCover = await uploadCover(coverFile, projectId);
      }
      
      if (galleryFiles.length > 0) {
        toast.info('Galeri görselleri yükleniyor...');
        const urls = await uploadGallery(galleryFiles, projectId);
        finalGallery = [...finalGallery, ...urls];
      }

      if (zipFileObj) {
        toast.info('ZIP dosyası yükleniyor...');
        finalZipUrl = await uploadZip(zipFileObj, projectId);
        finalZipName = zipFileObj.name;
      }

      const projectData = {
        title: formData.title,
        slug: formData.slug,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        category: formData.category,
        version: formData.version,
        releaseDate: formData.releaseDate,
        githubUrl: formData.githubUrl,
        demoUrl: formData.demoUrl,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        technologies: formData.technologies,
        published: formData.published,
        featured: formData.featured,
        coverImage: finalCover,
        galleryImages: finalGallery,
        zipFile: finalZipUrl,
        zipFileName: finalZipName,
      };

      if (initialData) {
        await updateProject(initialData.id, projectData);
        toast.success('Proje güncellendi.');
      } else {
        await createProject(projectData);
        toast.success('Proje oluşturuldu.');
      }

      router.push('/admin/projects');
    } catch (error) {
      console.error(error);
      toast.error('Kaydedilirken hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#111111] p-4 rounded-xl border border-[#222222] sticky top-4 z-40">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects" className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#161616] rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-white">
            {initialData ? 'Projeyi Düzenle' : 'Yeni Proje'}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="w-4 h-4 rounded border-[#333333] text-[#3B82F6] focus:ring-[#3B82F6] bg-[#161616]"
            />
            <span className="text-sm font-medium text-white">Yayında</span>
          </label>
          <button
            type="submit"
            disabled={isSaving || uploading}
            className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {isSaving || uploading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : <Save className="w-4 h-4" />}
            {uploading ? `Yükleniyor (${progress}%)` : 'Kaydet'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-[#222222] pb-2">Temel Bilgiler</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-1">Başlık *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-1">Kısa Açıklama *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6] resize-none"
                  placeholder="Projenin 1-2 cümlelik özeti"
                />
              </div>

              <div data-color-mode="dark">
                <label className="block text-sm font-medium text-[#A1A1AA] mb-1">Detaylı Açıklama (Markdown)</label>
                <MDEditor
                  value={formData.longDescription}
                  onChange={(val) => setFormData(prev => ({ ...prev, longDescription: val || '' }))}
                  height={400}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-[#222222] pb-2">Medya ve Dosyalar</h2>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-2">Kapak Görseli</label>
              
              {/* URL Input */}
              <div className="mb-3">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => { setFormData(prev => ({ ...prev, coverImage: e.target.value })); setCoverFile(null); }}
                    placeholder="https://i.imgur.com/... veya herhangi bir görsel URL"
                    className="flex-1 bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#3B82F6] placeholder-[#52525B]"
                  />
                  {formData.coverImage && (
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {formData.coverImage && !coverFile && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-[#333333] aspect-video max-h-40">
                    <img src={formData.coverImage} alt="Cover preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>

              <p className="text-xs text-[#52525B] mb-2">veya dosya yükle</p>
              <div 
                {...getCoverProps()} 
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  isCoverDrag ? 'border-[#3B82F6] bg-[#3B82F6]/10' : 'border-[#333333] hover:border-[#444444] bg-[#161616]'
                }`}
              >
                <input {...getCoverInputProps()} />
                {coverFile ? (
                  <p className="text-[#3B82F6] font-medium text-sm">Seçildi: {coverFile.name}</p>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#A1A1AA]">
                    <ImageIcon className="w-6 h-6" />
                    <p className="text-sm">Görsel sürükleyin veya seçin</p>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery */}
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-2">Galeri Görselleri</label>
              
              {/* URL Input for gallery */}
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  id="galleryUrlInput"
                  placeholder="Görsel URL ekle ve + butonuna bas"
                  className="flex-1 bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#3B82F6] placeholder-[#52525B]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) { setFormData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, val] })); (e.target as HTMLInputElement).value = ''; }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('galleryUrlInput') as HTMLInputElement;
                    const val = input?.value.trim();
                    if (val) { setFormData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, val] })); input.value = ''; }
                  }}
                  className="px-3 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#52525B] mb-2">veya dosya yükle</p>
              <div 
                {...getGalleryProps()} 
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors mb-4 ${
                  isGalleryDrag ? 'border-[#3B82F6] bg-[#3B82F6]/10' : 'border-[#333333] hover:border-[#444444] bg-[#161616]'
                }`}
              >
                <input {...getGalleryInputProps()} />
                <div className="flex flex-col items-center gap-2 text-[#A1A1AA]">
                  <Plus className="w-6 h-6" />
                  <p className="text-sm">Görselleri sürükleyin veya seçin</p>
                </div>
              </div>

              {/* Gallery Preview */}
              {(formData.galleryImages.length > 0 || galleryFiles.length > 0) && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {formData.galleryImages.map((url, i) => (
                    <div key={url} className="relative aspect-video rounded-lg overflow-hidden border border-[#333333] group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 p-1 bg-red-500 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {galleryFiles.map((file, i) => (
                    <div key={i} className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed border-[#3B82F6] opacity-70 group">
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeGalleryFile(i)} className="absolute top-1 right-1 p-1 bg-red-500 rounded text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ZIP File */}
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-2">İndirilebilir ZIP Dosyası</label>
              <div 
                {...getZipProps()} 
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  isZipDrag ? 'border-green-500 bg-green-500/10' : 'border-[#333333] hover:border-[#444444] bg-[#161616]'
                }`}
              >
                <input {...getZipInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <FileArchive className="w-6 h-6 text-[#A1A1AA]" />
                  {zipFileObj ? (
                    <p className="text-green-500 font-medium">Seçildi: {zipFileObj.name} ({formatFileSize(zipFileObj.size)})</p>
                  ) : formData.zipFileName ? (
                    <p className="text-green-500 font-medium">Mevcut: {formData.zipFileName}</p>
                  ) : (
                    <p className="text-[#A1A1AA]">ZIP dosyası yüklemek için sürükleyin veya tıklayın</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white border-b border-[#222222] pb-2">Meta & Sınıflandırma</h2>
            
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1">Kategori *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6]"
              >
                <option value="">Seçiniz...</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1">Sürüm</label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6]"
                placeholder="1.0.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1">Çıkış Tarihi</label>
              <input
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
                className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer mt-4 p-3 bg-[#161616] border border-[#333333] rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 rounded border-[#333333] text-purple-500 focus:ring-purple-500 bg-[#111111]"
                />
                <div>
                  <span className="text-sm font-medium text-white block">Öne Çıkan Proje</span>
                  <span className="text-xs text-[#A1A1AA]">Ana sayfada sergile</span>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white border-b border-[#222222] pb-2">Bağlantılar & Etiketler</h2>

            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1">GitHub URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6]"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1">Canlı Demo URL</label>
              <input
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))}
                className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6]"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1">Etiketler (Virgülle ayırın)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6]"
                placeholder="react, tailwind, portfolio..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-2">Teknolojiler</label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-[#161616] border border-[#333333] rounded-lg">
                {TECHNOLOGIES.map(tech => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      formData.technologies.includes(tech)
                        ? 'bg-[#3B82F6]/20 border-[#3B82F6] text-[#3B82F6]'
                        : 'bg-[#111111] border-[#333333] text-[#A1A1AA] hover:border-[#555]'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
