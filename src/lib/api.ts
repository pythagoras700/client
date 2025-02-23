export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.2.126:8000';

export const api = {
  // Create Collection API
  createCollection: async (title: string, file: File) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/rag/create_collection`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  // Get All Collections
  getAllCollections: async () => {
    const response = await fetch(`${API_BASE_URL}/api/get/all_collections`);
    return response.json();
  },

  // Generate Video Content - POST request
  generateVideoContent: async (prompt: string) => {
    const response = await fetch(`${API_BASE_URL}/api/generate/video/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({ 
        prompt,
        rag_id: "1" 
      }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to generate video');
    }
    
    const data = await response.json();
    return data.id;
  },

  // Get Video Content - GET request
  getVideoContent: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/get/video/content?id=${id}&rag_id=1`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch video content');
    }

    const data = await response.json();
    return {
      videoUrl: data.videoUrl,
      audioBase64: data.audioBase64
    };
  },

  // Generate Audio Content - POST request
  generateAudioContent: async (prompt: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate/audio/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ 
          prompt,
          rag_id: "1"  // Using "1" for now
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }
      
      const data = await response.json();
      return data.unique_id; // Get the unique_id from response
    } catch (error) {
      console.error('Error in POST request:', error);
      throw error;
    }
  },

  // Get Audio Content - GET request
  getAudioContent: async (uniqueId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/get/audio/content?id=${uniqueId}`, {
        method: 'GET',
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audio content');
      }

      const data = await response.json();
      return data; // Return the full response
    } catch (error) {
      console.error('Error in GET request:', error);
      throw error;
    }
  },

  // For audio upload
  uploadAudio: async (audioBlob: Blob, story: string) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('story', story);

    const response = await fetch(`${API_BASE_URL}/api/process-audio`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to upload audio');
    }
    return await response.json();
  }
}; 