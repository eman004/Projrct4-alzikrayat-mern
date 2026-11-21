import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import CommentForm from '../components/CommentForm.jsx';

function PhotoDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPhotoDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/photos/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Photo not found');
        }
        setPhoto(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotoDetail();
  }, [id]);

  const handleCommentAdded = (newComment) => {
    setPhoto((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
    }));
  };

  const handleDeletePhoto = async () => {
    if (!user || !photo) return;
    if (!window.confirm('Delete this photo permanently?')) return;

    try {
      const res = await fetch(`/api/photos/${photo._id}`, {
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

      navigate('/gallery');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="status-box">Loading photo details...</div>;
  if (error) {
    return (
      <div className="status-box">
        <p className="error-message">{error}</p>
        <Link to="/gallery" className="btn btn-primary">
          Back to Gallery
        </Link>
      </div>
    );
  }

  const owner = photo.userId || {};
  const isOwner = user && owner._id === user._id;

  return (
    <section className="photo-detail-page">
      <div className="detail-top-bar">
        <Link to="/gallery" className="btn btn-outline btn-sm">
          &larr; Back to Gallery
        </Link>
        {isOwner && (
          <button type="button" onClick={handleDeletePhoto} className="btn btn-danger btn-sm">
            Delete Photo
          </button>
        )}
      </div>

      <div className="detail-layout">
        <div className="detail-image-box">
          <img
            src={`/uploads/${photo.fileName}`}
            alt={photo.title}
            className="detail-full-image"
          />
        </div>

        <div className="detail-sidebar">
          <h1>{photo.title}</h1>
          <p className="detail-meta">
            Uploaded by{' '}
            <strong>
              {owner.firstName ? `${owner.firstName} ${owner.lastName}` : 'Member'}
            </strong>{' '}
            on {new Date(photo.dateTime).toLocaleString()}
          </p>

          {photo.description && <p className="detail-description">{photo.description}</p>}

          <hr />

          <div className="comments-section">
            <h3>Comments ({photo.comments ? photo.comments.length : 0})</h3>

            {photo.comments && photo.comments.length > 0 ? (
              <ul className="comments-list">
                {photo.comments.map((item) => (
                  <li key={item._id} className="comment-item">
                    <div className="comment-header">
                      <strong>
                        {item.userId
                          ? `${item.userId.firstName} ${item.userId.lastName}`
                          : 'User'}
                      </strong>
                      <span>{new Date(item.dateTime).toLocaleString()}</span>
                    </div>
                    <p>{item.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">No comments yet. Start the conversation!</p>
            )}

            {user ? (
              <CommentForm
                photoId={photo._id}
                userId={user._id}
                onCommentAdded={handleCommentAdded}
              />
            ) : (
              <div className="login-prompt">
                <Link to="/login">Login</Link> to post a comment on this photo.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PhotoDetail;
