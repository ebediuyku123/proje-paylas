'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağım.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">İletişime Geç</h1>
          <p className="text-xl text-[#A1A1AA] max-w-2xl mx-auto">
            Proje fikirleri, iş teklifleri veya sadece merhaba demek için bana yazabilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">E-posta</h3>
              <p className="text-[#A1A1AA] mb-4">Bana doğrudan e-posta gönderebilirsiniz.</p>
              <a href="mailto:hello@example.com" className="text-[#3B82F6] hover:text-[#2563EB] font-medium transition-colors">
                hello@example.com
              </a>
            </div>

            <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-[#10B981]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Sosyal Medya</h3>
              <p className="text-[#A1A1AA] mb-4">Beni sosyal ağlardan da takip edebilirsiniz.</p>
              <div className="space-y-2">
                <a href="#" className="block text-[#10B981] hover:text-[#059669] font-medium transition-colors">Twitter (X)</a>
                <a href="#" className="block text-[#10B981] hover:text-[#059669] font-medium transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Mesaj Gönder</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-[#A1A1AA]">
                      Adınız Soyadınız
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#52525B] focus:outline-none focus:border-[#3B82F6] transition-colors"
                      placeholder="Ahmet Yılmaz"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-[#A1A1AA]">
                      E-posta Adresiniz
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#52525B] focus:outline-none focus:border-[#3B82F6] transition-colors"
                      placeholder="ahmet@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-[#A1A1AA]">
                    Konu
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#52525B] focus:outline-none focus:border-[#3B82F6] transition-colors"
                    placeholder="Proje İşbirliği"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-[#A1A1AA]">
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-[#161616] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#52525B] focus:outline-none focus:border-[#3B82F6] transition-colors resize-none"
                    placeholder="Merhaba, sizinle şu konu hakkında görüşmek istiyorum..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Mesajı Gönder
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
