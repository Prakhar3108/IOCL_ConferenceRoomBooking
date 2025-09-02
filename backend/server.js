const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const BOOKINGS_FILE = path.join(__dirname, 'bookings.json');

app.use(cors());
app.use(express.json());

// Load bookings from file
function loadBookings() {
  if (!fs.existsSync(BOOKINGS_FILE)) return [];
  const data = fs.readFileSync(BOOKINGS_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}

// Save bookings to file
function saveBookings(bookings) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

// POST: New booking
app.post('/api/bookings', (req, res) => {
  const newBooking = req.body;
  const bookings = loadBookings();
  bookings.push(newBooking);
  saveBookings(bookings);
  res.json({ success: true, message: 'Booking saved.' });
});

// GET: All bookings
app.get('/api/bookings', (req, res) => {
  const bookings = loadBookings();
  res.json(bookings);
});

// PATCH: Approve a booking by index
app.patch('/api/bookings/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const bookings = loadBookings();
  if (bookings[index]) {
    bookings[index].status = 'approved';
    saveBookings(bookings);
    res.json({ success: true, message: 'Booking approved.' });
  } else {
    res.status(404).json({ success: false, message: 'Booking not found.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
