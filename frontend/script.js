const API_URL = 'http://localhost:3001/api/bookings';

let allBookings = [];
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function fetchBookingsAndRender() {
  fetch(API_URL)
    .then(res => res.json())
    .then(bookings => {
      allBookings = bookings;
      renderUserBookings();
      renderCalendar(currentYear, currentMonth);
    });
}

function renderUserBookings() {
  const list = document.getElementById('approved-list');
  if (!list) return;
  list.innerHTML = '';
  allBookings.filter(b => b.status === 'approved').forEach(booking => {
    const li = document.createElement('li');
    li.textContent = `${booking.name} - Room ${booking.room} - ${booking.date} from ${booking.fromTime} to ${booking.toTime}`;
    list.appendChild(li);
  });
}

function renderCalendar(year, month) {
  const container = document.getElementById('calendar-container');
  const currentMonthDisplay = document.getElementById('current-month');
  if (!container || !currentMonthDisplay) return;

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  currentMonthDisplay.textContent = `${monthNames[month]} ${year}`;

  container.innerHTML = '';
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day';
    container.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day';
    cell.textContent = day;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasBooking = allBookings.some(b => b.date === dateStr && b.status === 'approved');
    if (hasBooking) cell.classList.add('booked');
    cell.onclick = function() { showBookingDetails(dateStr); };
    container.appendChild(cell);
  }
}

function showBookingDetails(dateStr) {
  const detailsContainer = document.getElementById('booking-details');
  const detailsList = document.getElementById('details-list');
  const detailsDate = document.getElementById('details-date');
  detailsDate.textContent = `Bookings for ${dateStr}`;
  detailsList.innerHTML = '';
  detailsContainer.style.display = 'block';
  const matching = allBookings.filter(b => b.date === dateStr && b.status === 'approved');
  if (matching.length === 0) {
    detailsList.textContent = "No bookings for this date.";
  } else {
    matching.forEach(booking => {
      const div = document.createElement('div');
      div.textContent = `${booking.name} - Room ${booking.room} from ${booking.fromTime} to ${booking.toTime}`;
      detailsList.appendChild(div);
    });
  }
}

function initCalendarNav() {
  document.getElementById('prev-month').addEventListener('click', function() {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar(currentYear, currentMonth);
  });
  document.getElementById('next-month').addEventListener('click', function() {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar(currentYear, currentMonth);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('empDate').min = new Date().toISOString().split('T')[0];
  document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('empName').value.trim();
    const room = document.getElementById('empRoom').value;
    const date = document.getElementById('empDate').value;
    const fromTime = document.getElementById('empFromTime').value;
    const toTime = document.getElementById('empToTime').value;

    if (!name || !room || !date || !fromTime || !toTime) {
      document.getElementById('booking-message').textContent = "Please fill all fields.";
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      document.getElementById('booking-message').textContent = "Date must not be in the past.";
      return;
    }

    if (fromTime >= toTime) {
      document.getElementById('booking-message').textContent = "From Time must be before To Time.";
      return;
    }

    const overlap = allBookings.some(b =>
      b.room === room &&
      b.date === date &&
      b.status === 'approved' &&
      !(toTime <= b.fromTime || fromTime >= b.toTime)
    );
    if (overlap) {
      document.getElementById('booking-message').textContent = "This time slot is already booked for this room.";
      return;
    }

    const newBooking = { name, room, date, fromTime, toTime, status: 'pending' };
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById('booking-message').textContent = data.message;
      fetchBookingsAndRender();
      this.reset();
    })
    .catch(() => {
      document.getElementById('booking-message').textContent = "Error saving booking.";
    });
  });

  initCalendarNav();
  fetchBookingsAndRender();
});


// const API_URL = 'http://localhost:3001/api/bookings';

// let allBookings = [];
// let currentYear = new Date().getFullYear();
// let currentMonth = new Date().getMonth();

// function fetchBookingsAndRender() {
//   fetch(API_URL)
//     .then(res => res.json())
//     .then(bookings => {
//       allBookings = bookings;
//       renderUserBookings();
//       renderCalendar(currentYear, currentMonth);
//     });
// }

// // Render approved bookings
// function renderUserBookings() {
//   const list = document.getElementById('approved-list');
//   if (!list) return;
//   list.innerHTML = '';
//   allBookings.filter(b => b.status === 'approved').forEach(booking => {
//     const li = document.createElement('li');
//     li.textContent = `${booking.name} - Room ${booking.room} - ${booking.date} from ${booking.fromTime} to ${booking.toTime}`;
//     list.appendChild(li);
//   });
// }

// // Calendar rendering
// function renderCalendar(year, month) {
//   const container = document.getElementById('calendar-container');
//   const currentMonthDisplay = document.getElementById('current-month');
//   if (!container || !currentMonthDisplay) return;

//   const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//   currentMonthDisplay.textContent = `${monthNames[month]} ${year}`;

//   container.innerHTML = '';
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const firstDay = new Date(year, month, 1).getDay();

//   for (let i = 0; i < firstDay; i++) {
//     const emptyCell = document.createElement('div');
//     emptyCell.className = 'calendar-day';
//     container.appendChild(emptyCell);
//   }

//   for (let day = 1; day <= daysInMonth; day++) {
//     const cell = document.createElement('div');
//     cell.className = 'calendar-day';
//     cell.textContent = day;
//     const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//     const hasBooking = allBookings.some(b => b.date === dateStr && b.status === 'approved');
//     if (hasBooking) cell.classList.add('booked');
//     cell.onclick = function() { showBookingDetails(dateStr); };
//     container.appendChild(cell);
//   }
// }

// function showBookingDetails(dateStr) {
//   const detailsContainer = document.getElementById('booking-details');
//   const detailsList = document.getElementById('details-list');
//   const detailsDate = document.getElementById('details-date');
//   detailsDate.textContent = `Bookings for ${dateStr}`;
//   detailsList.innerHTML = '';
//   detailsContainer.style.display = 'block';
//   const matching = allBookings.filter(b => b.date === dateStr && b.status === 'approved');
//   if (matching.length === 0) {
//     detailsList.textContent = "No bookings for this date.";
//   } else {
//     matching.forEach(booking => {
//       const div = document.createElement('div');
//       div.textContent = `${booking.name} - Room ${booking.room} from ${booking.fromTime} to ${booking.toTime}`;
//       detailsList.appendChild(div);
//     });
//   }
// }

// // Calendar navigation
// function initCalendarNav() {
//   document.getElementById('prev-month').addEventListener('click', function() {
//     currentMonth--;
//     if (currentMonth < 0) { currentMonth = 11; currentYear--; }
//     renderCalendar(currentYear, currentMonth);
//   });
//   document.getElementById('next-month').addEventListener('click', function() {
//     currentMonth++;
//     if (currentMonth > 11) { currentMonth = 0; currentYear++; }
//     renderCalendar(currentYear, currentMonth);
//   });
// }

// // Booking form submission
// document.addEventListener('DOMContentLoaded', function() {
//   document.getElementById('empDate').min = new Date().toISOString().split('T')[0];
//   document.getElementById('booking-form').addEventListener('submit', function(e) {
//     e.preventDefault();
//     const name = document.getElementById('empName').value.trim();
//     const room = document.getElementById('empRoom').value;
//     const date = document.getElementById('empDate').value;
//     const fromTime = document.getElementById('empFromTime').value;
//     const toTime = document.getElementById('empToTime').value;

//     if (!name || !room || !date || !fromTime || !toTime) {
//       document.getElementById('booking-message').textContent = "Please fill all fields.";
//       return;
//     }

//     const today = new Date().toISOString().split('T')[0];
//     if (date < today) {
//       document.getElementById('booking-message').textContent = "Date must not be in the past.";
//       return;
//     }

//     if (fromTime >= toTime) {
//       document.getElementById('booking-message').textContent = "From Time must be before To Time.";
//       return;
//     }

//     // Overlap check (only for approved bookings)
//     const overlap = allBookings.some(b =>
//       b.room === room &&
//       b.date === date &&
//       b.status === 'approved' &&
//       !(toTime <= b.fromTime || fromTime >= b.toTime)
//     );
//     if (overlap) {
//       document.getElementById('booking-message').textContent = "This time slot is already booked for this room.";
//       return;
//     }

//     const newBooking = { name, room, date, fromTime, toTime, status: 'pending' };
//     fetch(API_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(newBooking)
//     })
//     .then(res => res.json())
//     .then(data => {
//       document.getElementById('booking-message').textContent = data.message;
//       fetchBookingsAndRender();
//       this.reset();
//     })
//     .catch(() => {
//       document.getElementById('booking-message').textContent = "Error saving booking.";
//     });
//   });

//   initCalendarNav();
//   fetchBookingsAndRender();
// });
