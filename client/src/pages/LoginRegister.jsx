import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoginForm from '../components/LoginForm.jsx';

function LoginRegister() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  // Registration form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
    occupation: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuthSuccess = (userData) => {
    loginUser(userData);
    navigate('/gallery');
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      handleAuthSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            type="button"
            className={!isRegisterMode ? 'active' : ''}
            onClick={() => {
              setIsRegisterMode(false);
              setError('');
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={isRegisterMode ? 'active' : ''}
            onClick={() => {
              setIsRegisterMode(true);
              setError('');
            }}
          >
            Register
          </button>
        </div>

        {!isRegisterMode ? (
          <LoginForm onSuccess={handleAuthSuccess} />
        ) : (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <h2>Create an Account</h2>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address *</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password (min 6 chars) *</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Khartoum, Sudan"
                />
              </div>

              <div className="form-group">
                <label htmlFor="occupation">Occupation</label>
                <input
                  id="occupation"
                  name="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="CS Student"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Short Bio</label>
              <textarea
                id="description"
                name="description"
                rows="2"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us a bit about yourself..."
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default LoginRegister;
