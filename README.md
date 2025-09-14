# 🎬 Movie Booking System

A full-stack web application similar to BookMyShow, built with Flask (Python) backend and React frontend. Users can browse cinemas, select movies, choose seats, and manage their bookings.

## ✨ Features

### Backend API
- **Users Management**: Create and manage user accounts
- **Cinemas**: List all available cinemas with locations
- **Screens**: Manage screens within cinemas
- **Movies**: Display movie details, ratings, and descriptions
- **Shows**: Manage specific showtimes for movies on different screens
- **Bookings**: Handle seat selections and booking confirmations
- **Seat Layout**: Fixed 10x10 seat layout for all screens

### Frontend User Flow
- **Cinema & Show Listing**: Browse cinemas and view available movies with showtimes
- **Interactive Seat Selection**: Visual seat map with real-time availability
- **Booking Confirmation**: Complete booking process with payment simulation
- **Booking History**: View past bookings and transactions
- **User Authentication**: Simple user registration and login system

## 🛠️ Tech Stack

### Backend
- **Flask**: Python web framework
- **SQLAlchemy**: ORM for database operations
- **SQLite**: Lightweight database for development
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React**: JavaScript library for building user interfaces
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **CSS3**: Modern styling with gradients and animations

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- Node.js 14 or higher
- npm or yarn package manager

### Installation & Setup

1. **Clone or download the project**
   ```bash
   cd "movie booking system"
   ```

2. **Set up the Backend (Flask)**
   ```bash
   # Install Python dependencies
   pip install -r requirements.txt
   
   # Run the Flask server
   python app.py
   ```
   The backend will start on `http://localhost:5000`

3. **Set up the Frontend (React)**
   ```bash
   # Install Node.js dependencies
   npm install
   
   # Start the React development server
   npm start
   ```
   The frontend will start on `http://localhost:3000`

4. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

## 📱 How to Use

### 1. User Login/Registration
- Enter your name and email address
- Click "Sign In / Create Account" to login or create a new account
- If the email exists, you'll be logged in; if not, a new account will be created

### 2. Browse Cinemas
- View all available cinemas on the home screen
- Use the city filter to browse cinemas by specific cities
- Click "View Movies & Shows" to see available movies for a cinema

### 3. Select Movie & Showtime
- Browse movies with details like genre, duration, and rating
- Choose from available showtimes for each movie
- Click on a showtime to proceed to seat selection

### 4. Select Seats
- View the interactive seat map (10x10 layout)
- Green seats are available, red are occupied
- Click to select/deselect seats (maximum 6 seats)
- Review your selection and total amount

### 5. Complete Booking
- Click "Pay" to confirm your booking
- View booking confirmation with all details
- Booking is automatically saved to your history

### 6. View Booking History
- Navigate to "My Bookings" from the header
- View all past and upcoming bookings
- See booking details, amounts, and show status

## 🗄️ Database Schema

### Tables
- **users**: User account information
- **cinemas**: Cinema details and locations
- **screens**: Screen information within cinemas
- **movies**: Movie details, ratings, and descriptions
- **shows**: Showtime information linking movies to screens
- **bookings**: User bookings with seat selections

### Sample Data
The application automatically creates sample data including:
- **24 cinemas** across **6 major cities**:
  - **Mumbai**: 4 cinemas (PVR Juhu, INOX R City, Cinepolis Andheri, Miraj Cinemas)
  - **Delhi**: 4 cinemas (PVR Select City Walk, INOX Nehru Place, Cinepolis Vasant Kunj, Waves Cinema)
  - **Bangalore**: 4 cinemas (PVR Forum Mall, INOX Garuda Mall, Cinepolis Phoenix MarketCity, Fun Cinemas)
  - **Chennai**: 4 cinemas (PVR Express Avenue, INOX Chennai City Centre, AGS Cinemas, Rohini Silver Screens)
  - **Hyderabad**: 4 cinemas (PVR Inorbit Mall, INOX GVK One, Cinepolis AMB Mall, Sudha Multiplex)
  - **Pune**: 4 cinemas (PVR Pavilion Mall, INOX Bund Garden, Cinepolis Amanora Mall, E-Square Multiplex)
- 3 screens per cinema
- 3 popular movies with ratings and descriptions
- Multiple showtimes spanning 7 days
- Various pricing tiers

## 🔧 API Endpoints

### Users
- `POST /api/users` - Create a new user

### Cinemas
- `GET /api/cinemas` - Get all cinemas
- `GET /api/cinemas/<id>/movies` - Get movies for a specific cinema

### Shows & Bookings
- `GET /api/shows/<id>/seats` - Get seat availability for a show
- `POST /api/bookings` - Create a new booking
- `GET /api/users/<id>/bookings` - Get user's booking history

## 🎨 UI Features

- **Responsive Design**: Works on desktop and mobile devices
- **Modern Styling**: Gradient backgrounds and smooth animations
- **Interactive Elements**: Hover effects and visual feedback
- **User-Friendly**: Intuitive navigation and clear visual cues
- **Real-time Updates**: Live seat availability and booking status
- **City-based Filtering**: Filter cinemas by city for better organization
- **Multi-city Support**: Browse cinemas across 6 major Indian cities

## 🔒 Business Logic

### Seat Selection Rules
- Maximum 6 seats per booking
- Real-time seat availability checking
- Prevents double booking of seats
- Visual feedback for seat states

### Booking Process
- User authentication required
- Seat availability validation
- Automatic total calculation
- Booking confirmation with details
- Integration with booking history

## 🚀 Deployment

### Backend Deployment
1. Install production WSGI server (e.g., Gunicorn)
2. Set up environment variables for production
3. Configure database for production use
4. Set up reverse proxy (e.g., Nginx)

### Frontend Deployment
1. Build production version: `npm run build`
2. Serve static files from build directory
3. Configure API endpoints for production backend

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Cinema browsing and selection
- [ ] Movie and showtime selection
- [ ] Seat selection (single and multiple)
- [ ] Booking confirmation
- [ ] Booking history viewing
- [ ] Edge cases (max seats, occupied seats)

## 📝 Development Notes

### File Structure
```
movie booking system/
├── app.py                 # Flask backend application
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
├── public/               # Static files
├── src/                  # React source code
│   ├── components/       # React components
│   ├── App.js           # Main App component
│   ├── index.js         # React entry point
│   └── index.css        # Global styles
└── README.md            # This file
```

### Key Components
- **Header**: Navigation and user info
- **CinemaList**: Display available cinemas
- **MovieList**: Show movies and showtimes
- **SeatSelection**: Interactive seat map
- **BookingConfirmation**: Success page
- **BookingHistory**: User's booking records
- **UserForm**: Registration/login form

## 🐛 Troubleshooting

### Common Issues

1. **Backend not starting**
   - Check if Python dependencies are installed
   - Ensure port 5000 is not in use
   - Verify Python version compatibility

2. **Frontend not connecting to backend**
   - Check if backend is running on port 5000
   - Verify proxy configuration in package.json
   - Check browser console for CORS errors

3. **Database issues**
   - Delete movie_booking.db to reset database
   - Restart Flask application to recreate tables

4. **Seat selection not working**
   - Check browser console for JavaScript errors
   - Verify API endpoints are responding
   - Clear browser cache and reload

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all dependencies are correctly installed
3. Ensure both backend and frontend are running
4. Check browser developer console for errors

## 🎯 Future Enhancements

- User authentication with passwords
- Payment gateway integration
- Email booking confirmations
- Movie reviews and ratings
- Advanced seat layouts
- Admin panel for cinema management
- Mobile app development
- Real-time notifications

---

**Happy Movie Booking! 🍿🎬**