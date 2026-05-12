import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await login(username, password);
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/tours');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-block',
            width: '48px',
            height: '4px',
            background: '#0d9488',
            marginBottom: '20px',
          }} />
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e293b',
            letterSpacing: '-0.5px',
            margin: '0 0 8px 0',
          }}>TravelHub</h1>
          <p style={{
            fontSize: '14px',
            color: '#475569',
            margin: 0,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>Discover Amazing Destinations</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          padding: '40px',
        }}>
          {/* Error */}
          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '2px',
              marginBottom: '24px',
              fontSize: '14px',
              color: '#b91c1c',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Username */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#475569',
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '2px',
                  fontSize: '15px',
                  color: '#1e293b',
                  background: '#f5f7fa',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#0d9488'; e.target.style.background = '#fff'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f5f7fa'; }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#475569',
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '2px',
                  fontSize: '15px',
                  color: '#1e293b',
                  background: '#f5f7fa',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#0d9488'; e.target.style.background = '#fff'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f5f7fa'; }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '13px',
                background: isLoading ? '#0f766e' : '#0d9488',
                color: '#ffffff',
                border: 'none',
                borderRadius: '2px',
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                marginTop: '4px',
              }}
              onMouseEnter={(e) => { if (!isLoading) (e.target as HTMLButtonElement).style.background = '#0f766e'; }}
              onMouseLeave={(e) => { if (!isLoading) (e.target as HTMLButtonElement).style.background = '#0d9488'; }}
              onMouseDown={(e) => { if (!isLoading) (e.target as HTMLButtonElement).style.background = '#115e59'; }}
              onMouseUp={(e) => { if (!isLoading) (e.target as HTMLButtonElement).style.background = '#0f766e'; }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '28px 0',
            gap: '12px',
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Demo Credentials</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>
        </div>
      </div>
    </div>
  );
}