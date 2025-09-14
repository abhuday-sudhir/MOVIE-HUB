from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///movie_booking.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    bookings = db.relationship('Booking', backref='user', lazy=True)

class Cinema(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    screens = db.relationship('Screen', backref='cinema', lazy=True)

class Screen(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    cinema_id = db.Column(db.Integer, db.ForeignKey('cinema.id'), nullable=False)
    shows = db.relationship('Show', backref='screen', lazy=True)

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    duration = db.Column(db.Integer)  # in minutes
    genre = db.Column(db.String(100))
    rating = db.Column(db.Float)
    poster_url = db.Column(db.String(500))  # Movie poster image URL
    language = db.Column(db.String(50))
    shows = db.relationship('Show', backref='movie', lazy=True)

class Show(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    screen_id = db.Column(db.Integer, db.ForeignKey('screen.id'), nullable=False)
    show_time = db.Column(db.DateTime, nullable=False)
    price = db.Column(db.Float, nullable=False)
    bookings = db.relationship('Booking', backref='show', lazy=True)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    show_id = db.Column(db.Integer, db.ForeignKey('show.id'), nullable=False)
    seats = db.Column(db.String(500), nullable=False)  # JSON string of selected seats
    total_amount = db.Column(db.Float, nullable=False)
    booking_time = db.Column(db.DateTime, default=datetime.utcnow)

# API Routes
@app.route('/api/users', methods=['POST'])
def create_or_get_user():
    data = request.get_json()
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    
    if existing_user:
        # Update name if provided (in case user wants to change their name)
        if data.get('name') and existing_user.name != data['name']:
            existing_user.name = data['name']
            db.session.commit()
        # Return existing user
        return jsonify({'id': existing_user.id, 'name': existing_user.name, 'email': existing_user.email}), 200
    
    # Create new user if doesn't exist
    user = User(name=data['name'], email=data['email'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'id': user.id, 'name': user.name, 'email': user.email}), 201

@app.route('/api/cinemas', methods=['GET'])
def get_cinemas():
    cinemas = Cinema.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'location': c.location
    } for c in cinemas])

@app.route('/api/cities', methods=['GET'])
def get_cities():
    cinemas = Cinema.query.all()
    cities = {}
    for cinema in cinemas:
        city = cinema.location.split(', ').pop()
        if city not in cities:
            cities[city] = {
                'name': city,
                'cinema_count': 0,
                'cinemas': []
            }
        cities[city]['cinema_count'] += 1
        cities[city]['cinemas'].append({
            'id': cinema.id,
            'name': cinema.name,
            'location': cinema.location
        })
    
    return jsonify(list(cities.values()))

@app.route('/api/movies', methods=['GET'])
def get_all_movies():
    movies = Movie.query.all()
    return jsonify([{
        'id': movie.id,
        'title': movie.title,
        'description': movie.description,
        'duration': movie.duration,
        'genre': movie.genre,
        'rating': movie.rating,
        'poster_url': movie.poster_url,
        'language': movie.language
    } for movie in movies])

@app.route('/api/cities/<city_name>/cinemas', methods=['GET'])
def get_cinemas_by_city(city_name):
    cinemas = Cinema.query.filter(Cinema.location.like(f'%, {city_name}')).all()
    return jsonify([{
        'id': cinema.id,
        'name': cinema.name,
        'location': cinema.location
    } for cinema in cinemas])

@app.route('/api/movies/<int:movie_id>/cinemas', methods=['GET'])
def get_cinemas_for_movie(movie_id):
    # Get all cinemas that have shows for this movie
    shows = Show.query.filter_by(movie_id=movie_id).join(Screen).join(Cinema).all()
    
    cinemas_data = {}
    for show in shows:
        cinema = show.screen.cinema
        if cinema.id not in cinemas_data:
            cinemas_data[cinema.id] = {
                'id': cinema.id,
                'name': cinema.name,
                'location': cinema.location,
                'shows': []
            }
        
        cinemas_data[cinema.id]['shows'].append({
            'id': show.id,
            'show_time': show.show_time.isoformat(),
            'price': show.price,
            'screen_name': show.screen.name
        })
    
    return jsonify(list(cinemas_data.values()))

@app.route('/api/cinemas/<int:cinema_id>/movies', methods=['GET'])
def get_movies_by_cinema(cinema_id):
    shows = Show.query.join(Screen).filter(Screen.cinema_id == cinema_id).all()
    
    movies_data = {}
    for show in shows:
        movie = show.movie
        if movie.id not in movies_data:
            movies_data[movie.id] = {
                'id': movie.id,
                'title': movie.title,
                'description': movie.description,
                'duration': movie.duration,
                'genre': movie.genre,
                'rating': movie.rating,
                'poster_url': movie.poster_url,
                'language': movie.language,
                'shows': []
            }
        
        movies_data[movie.id]['shows'].append({
            'id': show.id,
            'show_time': show.show_time.isoformat(),
            'price': show.price,
            'screen_name': show.screen.name
        })
    
    return jsonify(list(movies_data.values()))

@app.route('/api/shows/<int:show_id>/seats', methods=['GET'])
def get_show_seats(show_id):
    show = Show.query.get_or_404(show_id)
    bookings = Booking.query.filter_by(show_id=show_id).all()
    
    booked_seats = set()
    for booking in bookings:
        seats = eval(booking.seats)  # Convert string back to list
        booked_seats.update(seats)
    
    return jsonify({
        'show_id': show_id,
        'booked_seats': list(booked_seats),
        'price': show.price
    })

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()
    
    # Validate seats (max 6 seats)
    seats = data['seats']
    if len(seats) > 6:
        return jsonify({'error': 'Maximum 6 seats allowed'}), 400
    
    # Check if seats are available
    show = Show.query.get_or_404(data['show_id'])
    existing_bookings = Booking.query.filter_by(show_id=data['show_id']).all()
    
    booked_seats = set()
    for booking in existing_bookings:
        booked_seats.update(eval(booking.seats))
    
    if any(seat in booked_seats for seat in seats):
        return jsonify({'error': 'Some seats are already booked'}), 400
    
    # Create booking
    total_amount = len(seats) * show.price
    booking = Booking(
        user_id=data['user_id'],
        show_id=data['show_id'],
        seats=str(seats),
        total_amount=total_amount
    )
    
    db.session.add(booking)
    db.session.commit()
    
    return jsonify({
        'booking_id': booking.id,
        'total_amount': total_amount,
        'seats': seats
    }), 201

@app.route('/api/users/<int:user_id>/bookings', methods=['GET'])
def get_user_bookings(user_id):
    bookings = Booking.query.filter_by(user_id=user_id).order_by(Booking.booking_time.desc()).all()
    
    result = []
    for booking in bookings:
        show = booking.show
        movie = show.movie
        cinema = show.screen.cinema
        
        result.append({
            'booking_id': booking.id,
            'movie_title': movie.title,
            'cinema_name': cinema.name,
            'screen_name': show.screen.name,
            'show_time': show.show_time.isoformat(),
            'seats': eval(booking.seats),
            'total_amount': booking.total_amount,
            'booking_time': booking.booking_time.isoformat()
        })
    
    return jsonify(result)

# Initialize database and create sample data
def create_sample_data():
    with app.app_context():
        db.create_all()
        
        # Check if data already exists
        if Cinema.query.first():
            return
        
        # Create sample cinemas across multiple cities
        cinemas_data = [
            # Mumbai
            {'name': 'PVR Juhu', 'location': 'Juhu Beach Road, Mumbai'},
            {'name': 'INOX R City', 'location': 'Ghatkopar West, Mumbai'},
            {'name': 'Cinepolis Andheri', 'location': 'Andheri West, Mumbai'},
            {'name': 'Miraj Cinemas', 'location': 'Bandra Kurla Complex, Mumbai'},
            
            # Delhi
            {'name': 'PVR Select City Walk', 'location': 'Saket, New Delhi'},
            {'name': 'INOX Nehru Place', 'location': 'Nehru Place, New Delhi'},
            {'name': 'Cinepolis Vasant Kunj', 'location': 'Vasant Kunj, New Delhi'},
            {'name': 'Waves Cinema', 'location': 'Rohini, New Delhi'},
            
            # Bangalore
            {'name': 'PVR Forum Mall', 'location': 'Koramangala, Bangalore'},
            {'name': 'INOX Garuda Mall', 'location': 'Magrath Road, Bangalore'},
            {'name': 'Cinepolis Phoenix MarketCity', 'location': 'Whitefield, Bangalore'},
            {'name': 'Fun Cinemas', 'location': 'JP Nagar, Bangalore'},
            
            # Chennai
            {'name': 'PVR Express Avenue', 'location': 'Royapettah, Chennai'},
            {'name': 'INOX Chennai City Centre', 'location': 'Anna Salai, Chennai'},
            {'name': 'AGS Cinemas', 'location': 'T. Nagar, Chennai'},
            {'name': 'Rohini Silver Screens', 'location': 'Velachery, Chennai'},
            
            # Hyderabad
            {'name': 'PVR Inorbit Mall', 'location': 'Cyberabad, Hyderabad'},
            {'name': 'INOX GVK One', 'location': 'Banjara Hills, Hyderabad'},
            {'name': 'Cinepolis AMB Mall', 'location': 'Gachibowli, Hyderabad'},
            {'name': 'Sudha Multiplex', 'location': 'Secunderabad, Hyderabad'},
            
            # Pune
            {'name': 'PVR Pavilion Mall', 'location': 'Shivajinagar, Pune'},
            {'name': 'INOX Bund Garden', 'location': 'Bund Garden Road, Pune'},
            {'name': 'Cinepolis Amanora Mall', 'location': 'Hadapsar, Pune'},
            {'name': 'E-Square Multiplex', 'location': 'University Road, Pune'}
        ]
        
        for cinema_data in cinemas_data:
            cinema = Cinema(**cinema_data)
            db.session.add(cinema)
        
        db.session.commit()
        
        # Create sample screens
        cinemas = Cinema.query.all()
        for cinema in cinemas:
            for i in range(1, 4):  # 3 screens per cinema
                screen = Screen(name=f'Screen {i}', cinema_id=cinema.id)
                db.session.add(screen)
        
        db.session.commit()
        
        # Create sample movies with posters
        movies_data = [
            {
                'title': 'Avengers: Endgame',
                'description': 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos actions and restore balance to the universe.',
                'duration': 181,
                'genre': 'Action/Sci-Fi',
                'rating': 8.4,
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg',
                'language': 'English'
            },
            {
                'title': 'The Lion King',
                'description': 'A young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery.',
                'duration': 118,
                'genre': 'Animation/Adventure',
                'rating': 7.1,
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BMjIwMjE1Nzc4NV5BMl5BanBnXkFtZTgwNDg4OTA1NzM@._V1_.jpg',
                'language': 'English'
            },
            {
                'title': 'Spider-Man: No Way Home',
                'description': 'Peter Parker asks Doctor Strange for help to make people forget his identity as Spider-Man.',
                'duration': 148,
                'genre': 'Action/Adventure',
                'rating': 8.2,
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg',
                'language': 'English'
            },
            {
                'title': 'Black Widow',
                'description': 'Natasha Romanoff confronts the darker parts of her ledger when a dangerous conspiracy with ties to her past arises.',
                'duration': 134,
                'genre': 'Action/Adventure',
                'rating': 6.7,
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BNjRmNDI5MjMtMmFhZi00YzcwLWI4ZGItMGI2MjI0N2Q3YmIwXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
                'language': 'English'
            },
            {
                'title': 'Dune',
                'description': 'Paul Atreides leads a rebellion to restore his family reign on the planet Arrakis.',
                'duration': 155,
                'genre': 'Sci-Fi/Adventure',
                'rating': 8.0,
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
                'language': 'English'
            }
        ]
        
        for movie_data in movies_data:
            movie = Movie(**movie_data)
            db.session.add(movie)
        
        db.session.commit()
        
        # Create sample shows with varied time slots per cinema
        screens = Screen.query.all()
        movies = Movie.query.all()
        
        # Different time slot patterns for different cinemas
        time_patterns = [
            [10, 14, 18, 22],      # 4 shows: Morning, Afternoon, Evening, Night
            [11, 15, 19],          # 3 shows: Late morning, Afternoon, Evening  
            [12, 16, 20],          # 3 shows: Noon, Afternoon, Night
            [9, 13, 17, 21],       # 4 shows: Early, Afternoon, Evening, Late
            [10, 14, 18],          # 3 shows: Morning, Afternoon, Evening
            [11, 15, 19, 23]       # 4 shows: Late morning, Afternoon, Evening, Late night
        ]
        
        # Create shows for next 7 days
        base_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        for day in range(7):
            current_date = base_date + timedelta(days=day)
            
            for screen_idx, screen in enumerate(screens):
                # Each cinema gets different time slots
                cinema_pattern = time_patterns[screen_idx % len(time_patterns)]
                
                for movie in movies:
                    # Create shows based on cinema's time pattern
                    for hour in cinema_pattern:
                        show_time = current_date + timedelta(hours=hour)
                        # Different prices based on movie popularity and time
                        base_price = 200.0
                        if movie.rating > 8.0:
                            base_price += 100
                        if hour >= 18:  # Evening shows cost more
                            base_price += 50
                        if hour >= 22:  # Night shows cost more
                            base_price += 25
                        
                        show = Show(
                            movie_id=movie.id,
                            screen_id=screen.id,
                            show_time=show_time,
                            price=base_price
                        )
                        db.session.add(show)
        
        db.session.commit()
        print("Sample data created successfully!")

if __name__ == '__main__':
    create_sample_data()
    app.run(debug=True, port=5000)