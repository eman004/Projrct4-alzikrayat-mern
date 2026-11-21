import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PhotoCard from '../components/PhotoCard.jsx';

function Gallery() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Upload form states
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/photos');
      if (!res.ok) {
        throw new Error('Failed to load gallery photos');
      }
      const data = await res.json();
      setPhotos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !user) return;

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('userId', user._id);

      const res = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload photo');
      }

      setPhotos((prev) => [data, ...prev]);
      setTitle('');
      setDescription('');
      setFile(null);
      setShowUploadForm(false);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId) => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
      const res = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user._id,
        },
        body: JSON.stringify({ userId: user._id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete photo');
      }

      setPhotos((prev) => prev.filter((item) => item._id !== photoId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section className="gallery-page">
      <div className="gallery-toolbar">
        <div>
          <h1>Alzikrayat Gallery</h1>
          <p className="subtitle">Browse community memories and shared snapshots</p>
        </div>

        <div className="toolbar-controls">
          <div className="view-toggle" role="group" aria-label="Display style">
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>
          </div>

          {user ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowUploadForm((prev) => !prev)}
            >
              {showUploadForm ? 'Cancel Upload' : '+ Upload Photo'}
            </button>
          ) : (
            <Link to="/login" className="btn btn-secondary">
              Login to Upload
            </Link>
          )}
        </div>
      </div>

      {user && showUploadForm && (
        <form onSubmit={handleUpload} className="upload-panel">
          <h3>Share a New Memory</h3>
          {uploadError && <div className="alert alert-error">{uploadError}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="photo-title">Photo Title *</label>
              <input
                id="photo-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Sunset by the Nile"
              />
            </div>

            <div className="form-group">
              <label htmlFor="photo-file">Select Image *</label>
              <input
                id="photo-file"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="photo-desc">Description / Story</label>
            <textarea
              id="photo-desc"
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a brief caption..."
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Publish Photo'}
          </button>
        </form>
      )}

      {loading && <div className="status-box">Loading photos...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && photos.length === 0 && (
        <div className="status-box">
          No photos have been shared yet. Be the first to upload a memory!
        </div>
      )}

      {!loading && !error && photos.length > 0 && (
        <div className={viewMode === 'grid' ? 'photos-grid' : 'photos-list'}>
          {photos.map((photo) => (
            <PhotoCard
              key={photo._id}
              photo={photo}
              currentUser={user}
              onDelete={handleDelete}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Gallery;
