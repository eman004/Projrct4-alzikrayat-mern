import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Home() {
  const { user } = useAuth();

  return (
    <section className="home-hero">
      <div className="hero-content">
        <span className="hero-badge">MERN Full-Stack Edition</span>
        <h1>Preserve and Share Your Meaningful Memories on Alzikrayat</h1>
        <p>
          Alzikrayat is a community photo-sharing platform where you can upload snapshots,
          organize your visual stories, and engage with friends through comments.
        </p>

        <div className="hero-actions">
          <Link to="/gallery" className="btn btn-primary">
            Explore Gallery
          </Link>
          {!user && (
            <Link to="/login" className="btn btn-outline">
              Join or Sign In
            </Link>
          )}
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3>Share Moments</h3>
          <p>Upload photos with titles and stories stored securely in MongoDB.</p>
        </div>
        <div className="feature-card">
          <h3>Flexible Views</h3>
          <p>Switch seamlessly between responsive grid cards and detailed list layouts.</p>
        </div>
        <div className="feature-card">
          <h3>Community Discussion</h3>
          <p>Inspect full-resolution photos and post instant comments without page reloads.</p>
        </div>
      </div>
    </section>
  );
}

export default Home;
