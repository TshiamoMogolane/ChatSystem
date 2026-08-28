import React, { useState, useEffect, useRef } from 'react';
import {
  FaCamera,
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaUserTag,
  FaVenusMars,
  FaTimes,
  FaPencilAlt,
  FaCheck,
  FaUserFriends,
  FaCircle,
} from 'react-icons/fa';
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
  role?: string;
  gender?: string;
  createdAt?: string;
  lastActive?: string;
}

export default function ProfileView() {
  const [user, setUser] = useState<User | null>(null);
  const [profilePic, setProfilePic] = useState<string>('');
  const [friendsCount, setFriendsCount] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetchedRef = useRef(false);

  // --- inline edit state (name + bio) ---
  const [editingField, setEditingField] = useState<'username' | 'bio' | null>(null);
  const [draftUsername, setDraftUsername] = useState('');
  const [draftBio, setDraftBio] = useState('');
  const [savingField, setSavingField] = useState<'username' | 'bio' | null>(null);

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
      const newUrl = response.newProfilePicUrl;

      const fullUrl = `${BACKEND_ORIGIN}${newUrl}?v=${Date.now()}`;
      setProfilePic(fullUrl);

      setUser((prev) => (prev ? { ...prev, profilePictureUrl: newUrl } : null));
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

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleAvatarClick = () => {
    setShowImageModal(true);
  };

  // --- inline edit handlers ---
  const startEdit = (field: 'username' | 'bio') => {
    if (!user) return;
    setError(null);
    setSuccess(null);
    if (field === 'username') setDraftUsername(user.username);
    if (field === 'bio') setDraftBio(user.bio || '');
    setEditingField(field);
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  const saveField = async (field: 'username' | 'bio') => {
    if (!user) return;
    const value = field === 'username' ? draftUsername.trim() : draftBio.trim();

    if (field === 'username' && value.length === 0) {
      setError('Username cannot be empty.');
      return;
    }

    setSavingField(field);
    setError(null);
    setSuccess(null);

    try {
      // NOTE: expects a backend endpoint that accepts a partial profile update,
      // e.g. PUT /api/profile/me { username?, bio? }. Adjust the path/payload
      // to match your ProfileController once that endpoint exists.
      const response = await apiClient.put('/profile/me', { [field]: value });
      const updated: Partial<User> = response.data ?? { [field]: value };

      setUser((prev) => (prev ? { ...prev, ...updated } : prev));
      setSuccess(field === 'username' ? 'Username updated!' : 'Bio updated!');
      setEditingField(null);
    } catch (err: any) {
      console.error(`Failed to update ${field}:`, err);
      setError(err?.response?.data?.message || `Failed to update ${field}.`);
    } finally {
      setSavingField(null);
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatLastActive = (dateStr?: string) => {
    if (!dateStr) return 'Unknown';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const isOnline = (dateStr?: string) => {
    if (!dateStr) return false;
    return Date.now() - new Date(dateStr).getTime() < 2 * 60 * 1000;
  };

  if (loading) {
    return (
      <div className="pv-panel h-100 d-flex flex-column">
        <PvStyles />
        <div className="p-3 border-bottom d-flex align-items-center flex-shrink-0">
          <div className="pv-panel-title">Profile</div>
        </div>
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pv-panel h-100 d-flex flex-column">
        <PvStyles />
        <div className="p-3 border-bottom d-flex align-items-center flex-shrink-0">
          <div className="pv-panel-title">Profile</div>
        </div>
        <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4">
          <div className="alert alert-danger" role="alert">
            {error || 'User not found. Please log in again.'}
          </div>
          <button className="btn btn-primary" onClick={() => (window.location.href = '/')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const online = isOnline(user.lastActive);

  return (
    <div className="pv-panel h-100 d-flex flex-column">
      <PvStyles />

      <div className="p-3 border-bottom d-flex align-items-center flex-shrink-0">
        <div className="pv-panel-title">Profile</div>
      </div>

      <div className="flex-grow-1 overflow-auto p-4">
        <div className="pv-grid">
          {/* Left column: avatar + editable name/bio form */}
          <div className="pv-identity">
            <div className="pv-avatar-wrap">
              <div className={`pv-signal-ring ${online ? 'pv-signal-ring--live' : ''}`}>
                <img
                  key={profilePic}
                  src={profilePic}
                  alt="Profile"
                  role="button"
                  onClick={handleAvatarClick}
                  className="pv-avatar"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getRandomAvatar(user.username);
                  }}
                />
              </div>

              <span
                className={`pv-status-dot ${online ? 'pv-status-dot--online' : ''}`}
                title={online ? 'Online' : 'Offline'}
              />

              <button
                onClick={handleUploadClick}
                disabled={uploading}
                className="pv-camera-btn"
                aria-label="Upload profile picture"
              >
                {uploading ? (
                  <span className="spinner-border spinner-border-sm text-white" style={{ width: 14, height: 14 }} />
                ) : (
                  <FaCamera size={13} />
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

            {/* Editable name + bio form — label, value and edit icon share one row */}
            <form className="pv-edit-form w-100 mt-3" onSubmit={(e) => e.preventDefault()}>
              {/* Username field */}
              <div className="pv-field-row">
                <span className="pv-field-row-label">Name</span>

                {editingField === 'username' ? (
                  <>
                    <input
                      id="pv-username-input"
                      type="text"
                      className="pv-field-input"
                      value={draftUsername}
                      onChange={(e) => setDraftUsername(e.target.value)}
                      autoFocus
                      maxLength={40}
                      disabled={savingField === 'username'}
                    />
                    <button
                      type="button"
                      className="pv-field-icon-btn pv-field-icon-btn--save"
                      onClick={() => saveField('username')}
                      disabled={savingField === 'username'}
                      aria-label="Save name"
                    >
                      {savingField === 'username' ? (
                        <span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} />
                      ) : (
                        <FaCheck size={12} />
                      )}
                    </button>
                    <button
                      type="button"
                      className="pv-field-icon-btn pv-field-icon-btn--cancel"
                      onClick={cancelEdit}
                      disabled={savingField === 'username'}
                      aria-label="Cancel"
                    >
                      <FaTimes size={12} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="pv-field-row-value">{user.username}</span>
                    <button
                      type="button"
                      className="pv-field-icon-btn"
                      onClick={() => startEdit('username')}
                      aria-label="Edit name"
                    >
                      <FaPencilAlt size={12} />
                    </button>
                  </>
                )}
              </div>

              {/* Bio field */}
              <div className="pv-field-row pv-field-row--bio mt-2">
                <span className="pv-field-row-label">Bio</span>

                {editingField === 'bio' ? (
                  <>
                    <textarea
                      id="pv-bio-input"
                      className="pv-field-input pv-field-textarea"
                      value={draftBio}
                      onChange={(e) => setDraftBio(e.target.value)}
                      autoFocus
                      maxLength={200}
                      rows={2}
                      disabled={savingField === 'bio'}
                      placeholder="Tell others a bit about yourself"
                    />
                    <div className="pv-field-row-actions">
                      <button
                        type="button"
                        className="pv-field-icon-btn pv-field-icon-btn--save"
                        onClick={() => saveField('bio')}
                        disabled={savingField === 'bio'}
                        aria-label="Save bio"
                      >
                        {savingField === 'bio' ? (
                          <span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} />
                        ) : (
                          <FaCheck size={12} />
                        )}
                      </button>
                      <button
                        type="button"
                        className="pv-field-icon-btn pv-field-icon-btn--cancel"
                        onClick={cancelEdit}
                        disabled={savingField === 'bio'}
                        aria-label="Cancel"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="pv-field-row-value pv-field-row-value--bio">
                      {user.bio || 'No bio yet.'}
                    </span>
                    <button
                      type="button"
                      className="pv-field-icon-btn"
                      onClick={() => startEdit('bio')}
                      aria-label="Edit bio"
                    >
                      <FaPencilAlt size={12} />
                    </button>
                  </>
                )}
              </div>
            </form>

            {error && (
              <div className="alert alert-danger alert-dismissible fade show w-100 text-center mt-3" role="alert">
                {error}
                <button type="button" className="btn-close" onClick={() => setError(null)} />
              </div>
            )}
            {success && (
              <div className="alert alert-success alert-dismissible fade show w-100 text-center mt-3" role="alert">
                {success}
                <button type="button" className="btn-close" onClick={() => setSuccess(null)} />
              </div>
            )}
          </div>

          {/* Right column: everything else, as a 3-column card grid */}
          <div className="pv-details-grid">
            <div className="pv-detail-card">
              <div className="pv-detail-icon">
                <FaCircle size={12} className={online ? 'text-success' : 'text-secondary'} />
              </div>
              <div>
                <div className="pv-detail-label">Status</div>
                <div className="pv-detail-value">
                  {online ? 'Online now' : `Last seen ${formatLastActive(user.lastActive)}`}
                </div>
              </div>
            </div>

            {user.role && (
              <div className="pv-detail-card">
                <div className="pv-detail-icon">
                  <FaUserTag size={15} />
                </div>
                <div>
                  <div className="pv-detail-label">Role</div>
                  <div className="pv-detail-value">{user.role}</div>
                </div>
              </div>
            )}

            <div className="pv-detail-card">
              <div className="pv-detail-icon">
                <FaUserFriends size={15} />
              </div>
              <div>
                <div className="pv-detail-label">Friends</div>
                <div className="pv-detail-value">{friendsCount}</div>
              </div>
            </div>

            <div className="pv-detail-card">
              <div className="pv-detail-icon">
                <FaEnvelope size={15} />
              </div>
              <div>
                <div className="pv-detail-label">Email</div>
                <div className="pv-detail-value">{user.email}</div>
              </div>
            </div>

            {user.gender && (
              <div className="pv-detail-card">
                <div className="pv-detail-icon">
                  <FaVenusMars size={15} />
                </div>
                <div>
                  <div className="pv-detail-label">Gender</div>
                  <div className="pv-detail-value">{user.gender}</div>
                </div>
              </div>
            )}

            <div className="pv-detail-card">
              <div className="pv-detail-icon">
                <FaCalendarAlt size={15} />
              </div>
              <div>
                <div className="pv-detail-label">Joined</div>
                <div className="pv-detail-value">{formatDate(user.createdAt)}</div>
              </div>
            </div>

            <div className="pv-detail-card">
              <div className="pv-detail-icon">
                <FaClock size={15} />
              </div>
              <div>
                <div className="pv-detail-label">Last active</div>
                <div className="pv-detail-value">{formatLastActive(user.lastActive)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-size image modal */}
      {showImageModal && (
        <div className="pv-modal-overlay" onClick={() => setShowImageModal(false)}>
          <button className="pv-modal-close" onClick={() => setShowImageModal(false)} aria-label="Close">
            <FaTimes />
          </button>
          <img
            src={profilePic}
            alt={`${user.username}'s profile`}
            className="pv-modal-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Scoped styles for the profile panel.
 * Colors match the rest of your system (Bootstrap primary blue, default grays).
 */
function PvStyles() {
  return (
    <style>{`
      .pv-panel {
        --pv-primary: #007bff;
        --pv-primary-dark: #0056b3;
        --pv-online: #28a745;
        --pv-border: #dee2e6;
        --pv-muted-surface: #f8f9fa;
        --pv-text-muted: #6c757d;
        --pv-ink: #212529;
        background: #fff;
        border: 1px solid var(--pv-border);
        border-radius: 0.75rem;
        overflow: hidden;
      }

      .pv-panel-title {
        font-weight: 600;
        color: var(--pv-ink);
      }

      /* Grid layout: identity column + details grid, filling the available width */
      .pv-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 3rem;
        align-items: start;
        position: relative;
        width: 100%;
      }

      /* vertical divider centered in the gap between the two columns */
      .pv-grid::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 1px;
        background: var(--pv-border);
      }

      @media (max-width: 900px) {
        .pv-grid {
          grid-template-columns: 1fr;
        }
        .pv-grid::before {
          display: none;
        }
      }

      .pv-identity {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      /* Avatar + signal ring */
      .pv-avatar-wrap {
        position: relative;
        width: 170px;
        height: 170px;
      }
      .pv-signal-ring {
        width: 170px;
        height: 170px;
        border-radius: 50%;
        padding: 4px;
        background: conic-gradient(from 0deg, var(--pv-primary), #66b2ff, var(--pv-primary));
      }
      .pv-signal-ring--live {
        animation: pv-rotate 6s linear infinite;
      }
      @keyframes pv-rotate { to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) {
        .pv-signal-ring--live { animation: none; }
      }

      .pv-avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        border: 3px solid #fff;
        cursor: pointer;
        display: block;
      }

      .pv-status-dot {
        position: absolute;
        bottom: 8px;
        left: 8px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #adb5bd;
        border: 3px solid #fff;
      }
      .pv-status-dot--online {
        background: var(--pv-online);
        animation: pv-pulse 2s ease-out infinite;
      }
      @keyframes pv-pulse {
        0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.45); }
        70% { box-shadow: 0 0 0 6px rgba(40, 167, 69, 0); }
        100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
      }

      .pv-camera-btn {
        position: absolute;
        bottom: 4px;
        right: 4px;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 2px solid #fff;
        background: var(--pv-primary);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.15s ease, background 0.15s ease;
      }
      .pv-camera-btn:hover { transform: scale(1.1); background: var(--pv-primary-dark); }
      .pv-camera-btn:disabled { cursor: not-allowed; opacity: 0.7; }

      /* Editable name/bio form — label, value/input and icon(s) all on one row */
      .pv-edit-form {
        width: 100%;
        max-width: 380px;
        text-align: left;
      }
      .pv-field-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 12px;
        border: 1px solid var(--pv-border);
        border-radius: 0.5rem;
        background: var(--pv-muted-surface);
      }
      .pv-field-row--bio {
        align-items: flex-start;
      }
      .pv-field-row-label {
        flex: 0 0 auto;
        width: 44px;
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: var(--pv-text-muted);
        padding-top: 2px;
      }
      .pv-field-row-value {
        flex: 1;
        min-width: 0;
        font-size: 0.9rem;
        color: var(--pv-ink);
        font-weight: 500;
        word-break: break-word;
      }
      .pv-field-row-value--bio {
        font-weight: 400;
        color: var(--pv-text-muted);
        line-height: 1.4;
      }
      .pv-field-row-actions {
        display: flex;
        gap: 6px;
        flex-shrink: 0;
        padding-top: 2px;
      }

      .pv-field-input {
        flex: 1;
        min-width: 0;
        font-size: 0.9rem;
        padding: 6px 9px;
        border: 1px solid var(--pv-primary);
        border-radius: 0.5rem;
        outline: none;
        color: var(--pv-ink);
      }
      .pv-field-input:focus {
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
      }
      .pv-field-textarea {
        resize: vertical;
        font-family: inherit;
      }

      .pv-field-icon-btn {
        flex-shrink: 0;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 1px solid var(--pv-border);
        background: #fff;
        color: var(--pv-text-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
      }
      .pv-field-icon-btn:hover {
        border-color: var(--pv-primary);
        color: var(--pv-primary);
      }
      .pv-field-icon-btn:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }
      .pv-field-icon-btn--save {
        background: var(--pv-online);
        border-color: var(--pv-online);
        color: #fff;
      }
      .pv-field-icon-btn--save:hover {
        background: #218838;
        border-color: #1e7e34;
        color: #fff;
      }
      .pv-field-icon-btn--cancel:hover {
        border-color: #dc3545;
        color: #dc3545;
      }

      /* Details grid — 3 columns of cards, filling the right side */
      .pv-details-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        align-content: start;
      }
      @media (max-width: 900px) {
        .pv-details-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (max-width: 480px) {
        .pv-details-grid {
          grid-template-columns: 1fr;
        }
      }

      .pv-detail-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px;
        border: 1px solid var(--pv-border);
        border-radius: 0.6rem;
        background: #fff;
        transition: border-color 0.15s ease;
        min-width: 0;
      }
      .pv-detail-card:hover {
        border-color: var(--pv-primary);
      }
      .pv-detail-icon {
        width: 34px;
        height: 34px;
        border-radius: 8px;
        background: rgba(0, 123, 255, 0.08);
        color: var(--pv-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .pv-detail-label {
        font-size: 0.7rem;
        color: var(--pv-text-muted);
      }
      .pv-detail-value {
        font-size: 0.9rem;
        color: var(--pv-ink);
        font-weight: 500;
        word-break: break-word;
      }

      /* Modal */
      .pv-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1050;
      }
      .pv-modal-close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: #fff;
        color: var(--pv-ink);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .pv-modal-img {
        max-width: 90%;
        max-height: 85%;
        border-radius: 12px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
      }
    `}</style>
  );
}