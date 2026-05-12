import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTourById, bookTour } from '../api';

interface Tour {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resultMessage, setResultMessage] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const userData = userStr ? JSON.parse(userStr) : null;
    if (!userData) { navigate('/'); return; }
    setUser(userData);
  }, [navigate]);

  useEffect(() => {
    if (!user || !id) return;
    const fetchTour = async () => {
      try {
        const res = await getTourById(id);
        setTour(res.data);
      } catch (err) {
        console.error('Failed to fetch tour', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id, user?.id]);

  const handleBookTour = async () => {
    if (!user || !tour) return;
    setBookingStatus('loading');
    try {
      const res = await bookTour(user.id, tour.id);
      setBookingStatus('success');
      setResultMessage(res.data.message || `Booking successful! TXN ID: ${res.data.transactionId}`);
    } catch (err: any) {
      setBookingStatus('error');
      setResultMessage(err.response?.data?.message || 'Booking or payment failed.');
    }
  };

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
          maxWidth: '960px',
          margin: '0 auto',
          padding: '0 32px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}>
          <button
            onClick={() => navigate('/tours')}
            style={{
              padding: '7px 16px',
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
            Back
          </button>
          <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '3px', height: '20px', background: '#0d9488' }} />
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Tour Details</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 32px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '2px solid #ccfbf1',
              borderTop: '2px solid #0d9488',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }} />
            <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>Loading tour details...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : !tour ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: '40px', height: '3px', background: '#0d9488', margin: '0 auto 20px' }} />
            <p style={{ color: '#475569', fontSize: '16px', margin: 0 }}>Tour not found</p>
          </div>
        ) : (
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            {/* Hero */}
            <div style={{ position: 'relative', height: '400px', overflow: 'hidden', background: '#1e293b' }}>
              {tour.image.toLowerCase().endsWith('.mp4') || tour.image.includes('/video/') ? (
                <video
                  src={tour.image}
                  autoPlay muted loop playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={tour.image}
                  alt={tour.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)',
              }} />
              <div style={{
                position: 'absolute',
                bottom: '28px',
                left: '32px',
              }}>
                <span style={{
                  display: 'inline-block',
                  background: '#0d9488',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  padding: '4px 12px',
                  borderRadius: '2px',
                  textTransform: 'uppercase',
                }}>
                  Premium Tour Destination
                </span>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '48px' }}>
              {/* Title */}
              <div style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #e2e8f0' }}>
                <h2 style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: '0 0 12px 0',
                  letterSpacing: '-0.5px',
                  lineHeight: '1.2',
                }}>
                  {tour.name}
                </h2>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {'★★★★☆'.split('').map((s, i) => (
                    <span key={i} style={{ color: i < 4 ? '#f59e0b' : '#cbd5e1', fontSize: '16px' }}>{s}</span>
                  ))}
                  <span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: '8px' }}>4.8 / 5 · 342 reviews</span>
                </div>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '16px',
                color: '#475569',
                lineHeight: '1.8',
                margin: '0 0 40px 0',
                paddingLeft: '20px',
                borderLeft: '3px solid #0d9488',
              }}>
                {tour.description}
              </p>

              {/* Features */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '40px',
              }}>
                {[
                  { label: 'Duration', value: '7–10 Days' },
                  { label: 'Group Size', value: '2–10 People' },
                  { label: 'Location', value: 'Southeast Asia' },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    padding: '20px',
                    background: '#f0fdfa',
                    border: '1px solid #ccfbf1',
                    borderRadius: '4px',
                  }}>
                    <p style={{ fontSize: '11px', color: '#475569', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '600' }}>
                      {label}
                    </p>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Booking Section */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '24px',
                padding: '28px 32px',
                background: '#f5f7fa',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                marginBottom: '24px',
              }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 6px 0' }}>Total Price</p>
                  <p style={{ fontSize: '32px', fontWeight: '700', color: '#0d9488', margin: '0 0 4px 0' }}>
                    {tour.price !== undefined
                      ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price)
                      : 'Price not available'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>per person, all-inclusive</p>
                </div>

                {(bookingStatus === 'idle' || bookingStatus === 'error') && (
                  <BookButton onClick={handleBookTour} />
                )}
              </div>

              {/* Status Messages */}
              {bookingStatus === 'loading' && (
                <div style={{
                  padding: '28px 32px',
                  background: '#f0fdfa',
                  border: '1px solid #ccfbf1',
                  borderLeft: '3px solid #0d9488',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    border: '2px solid #ccfbf1',
                    borderTop: '2px solid #0d9488',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    flexShrink: 0,
                  }} />
                  <div>
                    <p style={{ fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0', fontSize: '15px' }}>Processing Your Booking</p>
                    <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>Orchestrating booking and processing payment...</p>
                  </div>
                </div>
              )}

              {bookingStatus === 'success' && (
                <div style={{
                  padding: '28px 32px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '4px',
                }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 10px 0' }}>
                    Booking Confirmed
                  </p>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>Booking Successful!</h3>
                  <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 20px 0' }}>{resultMessage}</p>
                  <button
                    onClick={() => navigate('/tours')}
                    style={{
                      padding: '9px 22px',
                      background: '#10b981',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '2px',
                      fontSize: '12px',
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    Back to Tours
                  </button>
                </div>
              )}

              {bookingStatus === 'error' && (
                <div style={{
                  padding: '28px 32px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderLeft: '3px solid #ef4444',
                  borderRadius: '4px',
                }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 10px 0' }}>
                    Booking Failed
                  </p>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>Something went wrong</h3>
                  <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 20px 0' }}>{resultMessage}</p>
                  <button
                    onClick={() => setBookingStatus('idle')}
                    style={{
                      padding: '9px 22px',
                      background: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '2px',
                      fontSize: '12px',
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function BookButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '14px 36px',
        background: hovered ? '#0f766e' : '#0d9488',
        color: '#ffffff',
        border: 'none',
        borderRadius: '2px',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '0.8px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
    >
      Book Now
    </button>
  );
}