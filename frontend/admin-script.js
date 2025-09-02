const API_URL = 'http://localhost:3001/api/bookings';

let allBookings = [];

function fetchBookingsAndRenderAdmin() {
  fetch(API_URL)
    .then(res => res.json())
    .then(bookings => {
      allBookings = bookings;
      renderAdminBookings();
    });
}

function renderAdminBookings() {
  const list = document.getElementById('pending-list');
  if (!list) return;
  list.innerHTML = '';
  allBookings.forEach((booking, idx) => {
    if (booking.status === 'pending') {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>
          <strong>${booking.name}</strong> - Room ${booking.room} - ${booking.date} from ${booking.fromTime} to ${booking.toTime}
        </span>
        <button onclick="approveBooking(${idx})">Approve</button>
      `;
      list.appendChild(li);
    }
  });
}

window.approveBooking = function(idx) {
  fetch(`${API_URL}/${idx}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(() => {
    fetchBookingsAndRenderAdmin();
  });
};

document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if (username === 'admin' && password === 'admin123') {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    fetchBookingsAndRenderAdmin();
  } else {
    document.getElementById('login-message').textContent = "Invalid username or password.";
  }
});


// const API_URL = 'http://localhost:3001/api/bookings';

// let allBookings = [];

// function fetchBookingsAndRenderAdmin() {
//   fetch(API_URL)
//     .then(res => res.json())
//     .then(bookings => {
//       allBookings = bookings;
//       renderAdminBookings();
//     });
// }

// function renderAdminBookings() {
//   const list = document.getElementById('pending-list');
//   if (!list) return;
//   list.innerHTML = '';
//   allBookings.forEach((booking, idx) => {
//     if (booking.status === 'pending') {
//       const li = document.createElement('li');
//       li.innerHTML = `
//         <span>
//           <strong>${booking.name}</strong> - Room ${booking.room} - ${booking.date} from ${booking.fromTime} to ${booking.toTime}
//         </span>
//         <button onclick="approveBooking(${idx})">Approve</button>
//       `;
//       list.appendChild(li);
//     }
//   });
// }

// window.approveBooking = function(idx) {
//   fetch(`${API_URL}/${idx}`, {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' }
//   })
//   .then(res => res.json())
//   .then(data => {
//     fetchBookingsAndRenderAdmin();
//   });
// };

// document.getElementById('login-form').addEventListener('submit', function(e) {
//   e.preventDefault();
//   const username = document.getElementById('username').value.trim();
//   const password = document.getElementById('password').value.trim();
//   // Simple hardcoded admin check
//   if (username === 'admin' && password === 'admin123') {
//     document.getElementById('login-container').style.display = 'none';
//     document.getElementById('admin-dashboard').style.display = 'block';
//     fetchBookingsAndRenderAdmin();
//   } else {
//     document.getElementById('login-message').textContent = "Invalid username or password.";
//   }
// });
