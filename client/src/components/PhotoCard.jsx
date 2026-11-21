import { Link } from 'react-router-dom';

function PhotoCard({ photo, currentUser, onDelete, viewMode }) {
  const owner = photo.userId || {};
  const ownerId = typeof owner === 'object' ? owner._id : owner;
  const isOwner = currentUser && ownerId === currentUser._id;

  const formattedDate = new Date(photo.dateTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className={`photo-card ${viewMode === 'list' ? 'photo-card-list' : ''}`}>
      <Link to={`/photos/${photo._id}`} className="photo-image-link">
        <img
          src={`/uploads/${photo.fileName}`}
          alt={photo.title}
          className="photo-image"
          loading="lazy"
        />
      </Link>

      <div className="photo-card-body">
        <div className="photo-card-header">
          <h3 className="photo-title">
            <Link to={`/photos/${photo._id}`}>{photo.title}</Link>
          </h3>
          <span className="photo-date">{formattedDate}</span>
        </div>

        {photo.description && <p className="photo-description">{photo.description}</p>}

        <div className="photo-card-footer">
          <span className="photo-author">
            By {owner.firstName ? `${owner.firstName} ${owner.lastName}` : 'Member'}
          </span>

          <div className="photo-actions">
            <Link to={`/photos/${photo._id}`} className="btn btn-secondary btn-sm">
              View Details
            </Link>
            {isOwner && (
              <button
                type="button"
                onClick={() => onDelete(photo._id)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default PhotoCard;
