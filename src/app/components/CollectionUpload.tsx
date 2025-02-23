"use client";
import { useState } from 'react';
import { api } from '@/lib/api';

export const CollectionUpload = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !title) return;

    try {
      setIsUploading(true);
      await api.createCollection(title, file);
      // Handle success
    } catch (error) {
      console.error('Error uploading collection:', error);
      // Handle error
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-[740px] mx-auto px-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Collection Title"
        className="w-full p-4 rounded-[32px] bg-input mb-4"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        accept=".pdf"
        className="w-full p-4 rounded-[32px] bg-input mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={isUploading || !file || !title}
        className="w-full py-4 bg-primary-orange text-white rounded-full font-medium disabled:opacity-50"
      >
        {isUploading ? 'Uploading...' : 'Upload Collection'}
      </button>
    </div>
  );
}; 