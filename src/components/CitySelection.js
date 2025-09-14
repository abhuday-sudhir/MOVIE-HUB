import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Building2, ArrowRight } from 'lucide-react';

function CitySelection() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get('/api/cities');
      setCities(response.data);
    } catch (err) {
      setError('Failed to load cities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (cityName) => {
    navigate(`/city/${cityName}/movies`);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading cities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '8px', 
          color: '#333',
          fontSize: '2rem',
          fontWeight: '600'
        }}>
          Select Your City
        </h2>
        
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          color: '#666',
          fontSize: '1rem'
        }}>
          Choose your city to see available movies and cinemas
        </div>

      <div className="cinema-grid">
        {cities.map(city => (
          <div key={city.name} className="cinema-card">
            <div style={{ 
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                background: '#8b5cf6',
                color: 'white',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapPin size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#333', fontSize: '1.3rem' }}>
                  {city.name}
                </h3>
                <p style={{ 
                  margin: '5px 0 0 0', 
                  color: '#666',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Building2 size={14} />
                  {city.cinema_count} cinemas available
                </p>
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <p style={{ 
                color: '#888',
                fontSize: '0.9rem',
                margin: '5px 0'
              }}>
                Popular cinemas:
              </p>
              {city.cinemas.slice(0, 2).map(cinema => (
                <p key={cinema.id} style={{ 
                  color: '#666',
                  fontSize: '0.85rem',
                  margin: '2px 0'
                }}>
                  • {cinema.name}
                </p>
              ))}
              {city.cinemas.length > 2 && (
                <p style={{ 
                  color: '#999',
                  fontSize: '0.8rem',
                  margin: '2px 0'
                }}>
                  +{city.cinemas.length - 2} more...
                </p>
              )}
            </div>
            
            <button 
              onClick={() => handleCitySelect(city.name)}
              className="cinema-button"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Browse Movies
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default CitySelection;