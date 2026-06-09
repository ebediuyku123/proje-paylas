'use client';

import { useState } from 'react';
import { Mail, Trash2, Eye } from 'lucide-react';
import { getContactMessages, markMessageRead, deleteContactMessage } from '@/lib/firebase/firestore';
import { useWhenAuthed } from '@/hooks/useWhenAuthed';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { ContactMessage } from '@/types';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  useWhenAuthed(async () => {
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch {
      toast.error('Mesajlar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  });

  const handleSelect = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.read) {
      await markMessageRead(msg.id).catch(() => {});
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
    try {
      await deleteContactMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success('Mesaj silindi.');
    } catch {
      toast.error('Mesaj silinemedi.');
    }
  };

  if (loading) return <div className="p-12 text-center text-[#A1A1AA]">Yükleniyor...</div>;

  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Mesajlar</h1>
        <p className="text-[#A1A1AA] text-sm">
          İletişim formundan gelen mesajlar.
          {unread > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-[#3B82F6]/10 text-[#3B82F6] text-xs rounded-full">
              {unread} okunmamış
            </span>
          )}
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-16 text-center">
          <Mail className="w-12 h-12 text-[#52525B] mx-auto mb-4" />
          <p className="text-[#A1A1AA]">Henüz mesaj yok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 space-y-2">
            {messages.map(msg => (
              <button
                key={msg.id}
                onClick={() => handleSelect(msg)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?.id === msg.id
                    ? 'bg-[#3B82F6]/10 border-[#3B82F6]/40'
                    : 'bg-[#111111] border-[#222222] hover:border-[#333333]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {!msg.read && (
                      <span className="w-2 h-2 bg-[#3B82F6] rounded-full flex-shrink-0 mt-1" />
                    )}
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${msg.read ? 'text-[#A1A1AA]' : 'text-white'}`}>
                        {msg.name}
                      </p>
                      <p className="text-xs text-[#52525B] truncate">{msg.subject}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#52525B] flex-shrink-0">{formatDate(msg.createdAt)}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selected.subject}</h2>
                    <p className="text-sm text-[#A1A1AA] mt-1">
                      <span className="font-medium text-white">{selected.name}</span>
                      {' — '}
                      <a href={`mailto:${selected.email}`} className="text-[#3B82F6] hover:underline">
                        {selected.email}
                      </a>
                    </p>
                    <p className="text-xs text-[#52525B] mt-1">{formatDate(selected.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <hr className="border-[#222222]" />
                <p className="text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Mail className="w-4 h-4" /> Yanıtla
                </a>
              </div>
            ) : (
              <div className="bg-[#111111] border border-[#222222] rounded-xl p-16 text-center h-full flex items-center justify-center">
                <div>
                  <Eye className="w-10 h-10 text-[#52525B] mx-auto mb-3" />
                  <p className="text-[#A1A1AA]">Okumak için bir mesaj seçin.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
