import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CinemaList() {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    try {
      const response = await axios.get('/api/cinemas');
      setCinemas(response.data);
    } catch (err) {
      setError('Failed to load cinemas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCinemaSelect = (cinemaId) => {
    navigate(`/cinema/${cinemaId}/movies`);
  };

  // Group cinemas by city
  const groupCinemasByCity = (cinemas) => {
    const grouped = {};
    cinemas.forEach(cinema => {
      const city = cinema.location.split(', ').pop(); // Extract city from location
      if (!grouped[city]) {
        grouped[city] = [];
      }
      grouped[city].push(cinema);
    });
    return grouped;
  };

  // Get unique cities for filter
  const getCities = (cinemas) => {
    const cities = new Set();
    cinemas.forEach(cinema => {
      const city = cinema.location.split(', ').pop();
      cities.add(city);
    });
    return Array.from(cities).sort();
  };

  const groupedCinemas = groupCinemasByCity(cinemas);
  const cities = getCities(cinemas);
  const filteredCinemas = selectedCity === 'All' 
    ? cinemas 
    : cinemas.filter(cinema => cinema.location.includes(selectedCity));

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading cinemas...</div>
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
    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        🎭 Select a Cinema
      </h2>
      
      {/* City Filter */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '25px',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: '1px solid rgba(102, 126, 234, 0.2)'
      }}>
        <h3 style={{ 
          marginBottom: '20px', 
          color: '#333',
          fontSize: '1.4rem',
          fontWeight: 'bold'
        }}>
          🌍 Choose Your City
        </h3>
        <p style={{ 
          marginBottom: '20px', 
          color: '#666',
          fontSize: '1rem'
        }}>
          Select a city to see available cinemas in that location
        </p>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '12px', 
          justifyContent: 'center',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <button
            className={`nav-button ${selectedCity === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCity('All')}
            style={{ 
              background: selectedCity === 'All' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
              color: selectedCity === 'All' ? 'white' : '#333',
              border: selectedCity === 'All' ? 'none' : '2px solid rgba(102, 126, 234, 0.3)',
              padding: '12px 20px',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '25px',
              transition: 'all 0.3s ease',
              boxShadow: selectedCity === 'All' ? '0 4px 15px rgba(102, 126, 234, 0.4)' : '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            🌐 All Cities ({cinemas.length} cinemas)
          </button>
          {cities.map(city => {
            const cityCinemaCount = cinemas.filter(cinema => cinema.location.includes(city)).length;
            return (
              <button
                key={city}
                className={`nav-button ${selectedCity === city ? 'active' : ''}`}
                onClick={() => setSelectedCity(city)}
                style={{ 
                  background: selectedCity === city ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                  color: selectedCity === city ? 'white' : '#333',
                  border: selectedCity === city ? 'none' : '2px solid rgba(102, 126, 234, 0.3)',
                  padding: '12px 20px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  borderRadius: '25px',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedCity === city ? '0 4px 15px rgba(102, 126, 234, 0.4)' : '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                🏙️ {city} ({cityCinemaCount})
              </button>
            );
          })}
        </div>
        
        {selectedCity !== 'All' && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '10px',
            fontSize: '0.9rem',
            color: '#555'
          }}>
            Showing cinemas in <strong>{selectedCity}</strong>
          </div>
        )}
      </div>

      {/* Cinemas Grid */}
      <div className="cinema-grid">
        {filteredCinemas.map(cinema => {
          const city = cinema.location.split(', ').pop();
          const area = cinema.location.split(', ')[0];
          return (
            <div key={cinema.id} className="cinema-card">
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '10px',
                padding: '8px',
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '8px'
              }}>
                <span style={{ 
                  fontSize: '1.5rem', 
                  marginRight: '8px' 
                }}>
                  🏢
                </span>
                <h3 style={{ margin: 0, color: '#333' }}>{cinema.name}</h3>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <p style={{ 
                  margin: '5px 0', 
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  📍 <strong>{area}</strong>
                </p>
                <p style={{ 
                  margin: '5px 0', 
                  color: '#888',
                  fontSize: '0.85rem'
                }}>
                  🏙️ {city}
                </p>
              </div>
              
              <button 
                onClick={() => handleCinemaSelect(cinema.id)}
                className="cinema-button"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                🎬 View Movies & Shows
              </button>
            </div>
          );
        })}
      </div>
      
      {filteredCinemas.length === 0 && selectedCity !== 'All' && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#666'
        }}>
          <h3>No cinemas found in {selectedCity}</h3>
          <p>Try selecting a different city or view all cinemas.</p>
        </div>
      )}
    </div>
  );
}

export default CinemaList;