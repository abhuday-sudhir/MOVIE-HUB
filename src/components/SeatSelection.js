import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircleArrowLeft } from 'lucide-react';

function SeatSelection({ selectedSeats, setSelectedSeats, selectedShow, setSelectedShow, currentUser }) {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [showData, setShowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Generate seat layout (10x10)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const cols = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
    if (selectedShow && selectedShow.id.toString() === showId) {
      fetchShowSeats();
    } else {
      setError('No show selected. Please go back and select a show.');
      setLoading(false);
    }
  }, [showId, selectedShow]);

  const fetchShowSeats = async () => {
    try {
      const response = await axios.get(`/api/shows/${showId}/seats`);
      setShowData(response.data);
    } catch (err) {
      setError('Failed to load seat information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSeatId = (row, col) => `${row}${col}`;

  const isSeatOccupied = (row, col) => {
    if (!showData) return false;
    return showData.booked_seats.includes(getSeatId(row, col));
  };

  const isSeatSelected = (row, col) => {
    return selectedSeats.includes(getSeatId(row, col));
  };

  const handleSeatClick = (row, col) => {
    const seatId = getSeatId(row, col);
    
    if (isSeatOccupied(row, col)) {
      return; // Can't select occupied seats
    }

    if (selectedSeats.includes(seatId)) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatId));
    } else {
      // Select seat (max 6 seats)
      if (selectedSeats.length >= 6) {
        alert('You can select a maximum of 6 seats.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handlePayment = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }

    setBookingLoading(true);
    try {
      await axios.post('/api/bookings', {
        user_id: currentUser.id,
        show_id: showId,
        seats: selectedSeats
      });

      navigate('/booking/confirmation');
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatShowTime = (showTime) => {
    const date = new Date(showTime);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading seat selection...</div>
      </div>
    );
  }

  if (error || !showData) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const totalAmount = selectedSeats.length * showData.price;

  return (
    <div className="main-content">
      <div className="container">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <CircleArrowLeft/>Back to Shows
        </button>

      <div className="seat-selection">
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
          Seat Selection
        </h2>

        {selectedShow && (
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h3>{selectedShow.movie_title}</h3>
            <p>{formatShowTime(selectedShow.show_time)}</p>
            <p>{selectedShow.screen_name}</p>
          </div>
        )}

        <div className="seat-map">
          <div className="seat-info">
            <div className="seat-legend">
              <div className="seat available"></div>
              <span>Available</span>
            </div>
            <div className="seat-legend">
              <div className="seat selected"></div>
              <span>Selected</span>
            </div>
            <div className="seat-legend">
              <div className="seat occupied"></div>
              <span>Occupied</span>
            </div>
          </div>

          {/* Column headers */}
          <div style={{ 
            display: 'flex', 
            marginBottom: '10px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '5px'
          }}>
            <div style={{ width: '30px' }}></div> {/* Empty space for row labels */}
            {cols.map(col => (
              <div key={col} style={{ 
                width: '30px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                color: '#333',
                fontSize: '0.9rem'
              }}>
                {col}
              </div>
            ))}
          </div>

          {/* Seat grid with row labels */}
          {rows.map(row => (
            <div key={row} className="seat-row">
              <span style={{ 
                width: '30px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                color: '#333',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {row}
              </span>
              {cols.map(col => {
                const seatId = getSeatId(row, col);
                const isOccupied = isSeatOccupied(row, col);
                const isSelected = isSeatSelected(row, col);
                
                return (
                  <div
                    key={seatId}
                    className={`seat ${
                      isOccupied ? 'occupied' : 
                      isSelected ? 'selected' : 'available'
                    }`}
                    onClick={() => handleSeatClick(row, col)}
                  >
                  </div>
                );
              })}
            </div>
          ))}

          {/* Screen at the bottom */}
          <div className="screen"></div>
        </div>

        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <div className="summary-item">
            <span>Selected Seats:</span>
            <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
          </div>
          <div className="summary-item">
            <span>Price per Seat:</span>
            <span>₹{showData.price}</span>
          </div>
          <div className="summary-item">
            <span>Number of Seats:</span>
            <span>{selectedSeats.length}</span>
          </div>
          <div className="total">
            <span>Total Amount:</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        <button 
          className="pay-button"
          onClick={handlePayment}
          disabled={selectedSeats.length === 0 || bookingLoading}
        >
          {bookingLoading ? 'Processing...' : `Pay ₹${totalAmount}`}
        </button>

        {selectedSeats.length > 0 && (
          <p style={{ 
            textAlign: 'center', 
            marginTop: '15px', 
            color: '#666',
            fontSize: '0.9rem'
          }}>
            Tip: You can select up to 6 seats maximum
          </p>
        )}
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;