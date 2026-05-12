import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTours } from '../api';

interface Tour {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function Tours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const userData = userStr ? JSON.parse(userStr) : null;
    if (!userData) { navigate('/'); return; }
    setUser(userData);
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchTours = async () => {
      try {
        setIsLoading(true);
        const res = await getTours();
        setTours(res.data);
      } catch (err) {
        console.error('Failed to fetch tours', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTours();
  }, [user?.id]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const filteredTours = tours.filter(tour =>
    tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      fontFamily: "'Georgia', serif",
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 32px',
          height: '64px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '3px', height: '24px', background: '#0d9488' }} />
            <span style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1e293b',
              letterSpacing: '-0.3px',
            }}>TravelHub</span>
            <span style={{
              fontSize: '12px',
              color: '#94a3b8',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              paddingLeft: '16px',
            }}>Explore Tours</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              fontSize: '13px',
              color: '#475569',
            }}>
              Welcome, <strong style={{ color: '#1e293b' }}>{user.name}</strong>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 18px',
                background: 'transparent',
                border: '1px solid #e2e8f0',
                borderRadius: '2px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#475569',
                cursor: 'pointer',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = '#0d9488';
                (e.target as HTMLButtonElement).style.color = '#0d9488';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = '#e2e8f0';
                (e.target as HTMLButtonElement).style.color = '#475569';
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 32px' }}>
        {/* Search Section */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                placeholder="Search tours by name or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '2px',
                  fontSize: '14px',
                  color: '#1e293b',
                  background: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#0d9488'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; }}
              />
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            {filteredTours.length} tour{filteredTours.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Tours Grid */}
        {isLoading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px',
          }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                overflow: 'hidden',
              }}>
                <div style={{ height: '220px', background: '#f0fdfa' }} />
                <div style={{ padding: '24px' }}>
                  <div style={{ height: '18px', background: '#f0fdfa', borderRadius: '2px', marginBottom: '12px' }} />
                  <div style={{ height: '14px', background: '#f0fdfa', borderRadius: '2px', width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTours.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px',
          }}>
            {filteredTours.map((tour, index) => (
              <TourCard
                key={tour.id}
                tour={tour}
                index={index}
                onClick={() => navigate(`/tours/${tour.id}`)}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: '40px', height: '3px', background: '#0d9488', margin: '0 auto 20px' }} />
            <p style={{ color: '#475569', fontSize: '16px', margin: 0 }}>No tours found matching your search</p>
          </div>
        )}
      </main>
    </div>
  );
}

function TourCard({ tour, index, onClick }: { tour: any; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#ffffff',
        border: `1px solid ${hovered ? '#0d9488' : '#e2e8f0'}`,
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? '0 4px 24px rgba(13,148,136,0.10)' : 'none',
      }}
    >
      {/* Media */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: '#f0fdfa' }}>
        {tour.image.toLowerCase().endsWith('.mp4') || tour.image.includes('/video/') ? (
          <video
            src={tour.image}
            autoPlay muted loop playsInline
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.4s',
            }}
          />
        ) : (
          <img
            src={tour.image}
            alt={tour.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.4s',
            }}
          />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          background: '#0d9488',
          color: '#fff',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.8px',
          padding: '4px 10px',
          borderRadius: '2px',
        }}>
          #{String(index + 1).padStart(2, '0')}
        </div>
        <div style={{
          position: 'absolute',
          bottom: '14px',
          left: '14px',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.85)',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}>
          Vietnam
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        <h3 style={{
          fontSize: '17px',
          fontWeight: '700',
          color: hovered ? '#0d9488' : '#1e293b',
          margin: '0 0 10px 0',
          lineHeight: '1.4',
          transition: 'color 0.2s',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {tour.name}
        </h3>
        <p style={{
          fontSize: '13px',
          color: '#475569',
          margin: '0 0 20px 0',
          lineHeight: '1.6',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {tour.description}
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '1px solid #e2e8f0',
        }}>
          <div>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 2px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>From</p>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#0d9488' }}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price)}
            </span>
          </div>
          <div style={{
            padding: '8px 18px',
            background: hovered ? '#0d9488' : 'transparent',
            border: `1px solid ${hovered ? '#0d9488' : '#cbd5e1'}`,
            borderRadius: '2px',
            fontSize: '12px',
            fontWeight: '600',
            color: hovered ? '#ffffff' : '#475569',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
          }}>
            View Details
          </div>
        </div>
      </div>
    </div>
  );
}