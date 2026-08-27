import React, { useState, useEffect, useRef } from 'react';
import { profileApi } from '../../services/profileApi';
import apiClient from '../../services/axios'; // <-- your configured client

// Extract the backend origin (e.g., http://localhost:8080) from your apiClient
// apiClient.defaults.baseURL = "http://localhost:8080/api"
// Remove "/api" to get the origin
const BACKEND_ORIGIN = apiClient.defaults.baseURL?.replace('/api', '') || 'http://localhost:8080';

interface User {
  id: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  bio?: string;
}

export default function ProfileView() {
  const [user, setUser] = useState<User | null>(null);
  const [profilePic, setProfilePic] = useState<string>('');
  const [friendsCount, setFriendsCount] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/profile/me');
      const userData: User = response.data;
      setUser(userData);

      // 🔥 Build FULL URL with cache busting
      const picUrl = userData.profilePictureUrl
        ? `${BACKEND_ORIGIN}${userData.profilePictureUrl}?v=${Date.now()}`
        : getRandomAvatar(userData.username);
      setProfilePic(picUrl);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Could not load profile. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const getRandomAvatar = (username: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&size=150&rounded=true`;
  };

  useEffect(() => {
    if (user?.id) {
      fetchFriendsCount();
    }
  }, [user?.id]);

  const fetchFriendsCount = async () => {
    try {
      setFriendsCount(42);
    } catch (err) {
      console.error('Failed to fetch friends count:', err);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, GIF, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setSuccess(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await profileApi.uploadProfilePicture(formData);
      const newUrl = response.newProfilePicUrl; // e.g., "/api/images/123.jpg"

      // 🔥 Build FULL URL with cache busting
      const fullUrl = `${BACKEND_ORIGIN}${newUrl}?v=${Date.now()}`;
      console.log('✅ Full image URL:', fullUrl);
      setProfilePic(fullUrl);

      setUser((prev) => prev ? { ...prev, profilePictureUrl: newUrl } : null);
      setSuccess('Profile picture updated successfully!');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err?.response?.data?.message || 'Failed to upload profile picture.');
    } finally {
      setUploading(false);
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100%' }}>
        <div className="alert alert-danger" role="alert">
          {error || 'User not found. Please log in again.'}
        </div>
        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ height: '100%', padding: '2rem' }}
    >
      <div className="position-relative mb-3">
        <img
          key={profilePic}
          src={profilePic}
          alt="Profile"
          className="rounded-circle border"
          style={{
            width: '150px',
            height: '150px',
            objectFit: 'cover',
            border: '3px solid #007bff',
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            console.warn('⚠️ Image failed to load, using fallback avatar');
            target.src = getRandomAvatar(user.username);
          }}
        />

        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle border-0"
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {uploading ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            <i className="bi bi-camera-fill" style={{ fontSize: '1.2rem' }} />
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </div>

      <h4 className="mb-1">{user.username}</h4>
      <small className="text-muted mb-3">{user.email}</small>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show w-100 text-center" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} />
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible fade show w-100 text-center" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)} />
        </div>
      )}

      <div className="text-center mt-2">
        <small className="text-muted">Friends</small>
        <div className="fw-bold fs-4">{friendsCount}</div>
      </div>

      <div className="mt-3 text-center w-100">
        <p className="text-muted" style={{ maxWidth: '300px' }}>
          {user.bio || 'No bio yet.'}
        </p>
      </div>
    </div>
  );
}