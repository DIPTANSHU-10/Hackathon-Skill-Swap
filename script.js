// Seed Data Initialization
let gigs = JSON.parse(localStorage.getItem('ss_gigs_v4')) || [
  { id: 101, title: 'Full-Stack React & Node.js Application', category: 'Development', price: 300, delivery: 5, desc: 'Complete web development from design to deployment.', createdAt: Date.now() - 200000 },
  { id: 102, title: 'UI/UX Mobile App Design Kit', category: 'Design', price: 150, delivery: 3, desc: 'Figma prototypes and high-fidelity mobile application layouts.', createdAt: Date.now() - 100000 },
  { id: 103, title: 'Video Editing & Motion Graphics', category: 'Video & Audio', price: 120, delivery: 2, desc: 'Professional promo video cuts, color grading, and titles.', createdAt: Date.now() }
];

let bookings = JSON.parse(localStorage.getItem('ss_bookings_v4')) || [];

function saveState() {
  localStorage.setItem('ss_gigs_v4', JSON.stringify(gigs));
  localStorage.setItem('ss_bookings_v4', JSON.stringify(bookings));
}

// Navigation Tab Switcher
function switchTab(tabId, btnElement) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  btnElement.classList.add('active');
  renderApp();
}

// Feature 1: Create/Post Gig
function handleCreateGig(e) {
  e.preventDefault();
  const newGig = {
    id: Date.now(),
    title: document.getElementById('gigTitle').value,
    category: document.getElementById('gigCategory').value,
    price: Number(document.getElementById('gigPrice').value),
    delivery: Number(document.getElementById('gigDelivery').value),
    desc: document.getElementById('gigDesc').value,
    createdAt: Date.now()
  };

  gigs.unshift(newGig);
  saveState();
  alert('Service posted successfully!');
  e.target.reset();
  switchTab('browse', document.querySelectorAll('.tab-btn')[0]);
}

// Feature 3: Modal Handlers
function openModal(gigId) {
  const gig = gigs.find(g => g.id === gigId);
  if (!gig) return;
  document.getElementById('modalGigId').value = gig.id;
  document.getElementById('modalTitle').innerText = 'Book: ' + gig.title;
  document.getElementById('bookingModal').classList.add('active');
}

function closeModal() {
  document.getElementById('bookingModal').classList.remove('active');
}

function handleConfirmBooking(e) {
  e.preventDefault();
  const gigId = Number(document.getElementById('modalGigId').value);
  const gig = gigs.find(g => g.id === gigId);

  const newBooking = {
    id: Date.now(),
    gigId: gig.id,
    gigTitle: gig.title,
    clientName: document.getElementById('clientName').value,
    clientEmail: document.getElementById('clientEmail').value,
    date: document.getElementById('bookingDate').value,
    notes: document.getElementById('bookingNotes').value,
    status: 'Pending'
  };

  bookings.unshift(newBooking);
  saveState();
  closeModal();
  alert('Booking request submitted! Track progress in "My Bookings".');
  e.target.reset();
  renderApp();
}

// Feature 4, DP1 (Rejection) & DP2 (Auto Conflict Resolution)
function setBookingStatus(bookingId, status) {
  const target = bookings.find(b => b.id === bookingId);
  if (!target) return;

  if (status === 'Accepted') {
    target.status = 'Accepted';
    
    // DP2 Conflict Resolution: Auto-decline conflicting pending bookings for same slot
    bookings.forEach(b => {
      if (b.id !== bookingId && b.gigId === target.gigId && b.date === target.date && b.status === 'Pending') {
        b.status = 'Declined';
        b.notes += ' (Auto-Declined: Schedule Slot Conflict)';
      }
    });
    alert(`Booking accepted! Conflicting requests for ${target.date} were auto-declined (DP2 Strategy).`);
  } else if (status === 'Declined') {
    // DP1 Rejection
    target.status = 'Declined';
    alert('Booking request declined (DP1).');
  }

  saveState();
  renderApp();
}

// Feature 2 & DP3: Discovery, Search, Rank & Render
function renderApp() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const sort = document.getElementById('sortFilter').value;

  // Filter Logic
  let filtered = gigs.filter(g => {
    const matchCat = category === 'All' || g.category === category;
    const matchSearch = g.title.toLowerCase().includes(search) || g.desc.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  // DP3 Ranking/Sorting Logic
  if (sort === 'newest') filtered.sort((a, b) => b.createdAt - a.createdAt);
  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);

  // Render Marketplace Grid
  document.getElementById('gigGrid').innerHTML = filtered.map(g => `
    <div class="card">
      <div>
        <span class="card-tag">${g.category}</span>
        <h3>${g.title}</h3>
        <p>${g.desc}</p>
        <p style="font-size:12px; color: var(--text-muted);">Delivery: ${g.delivery} Days</p>
      </div>
      <div class="card-footer">
        <span class="price">$${g.price}</span>
        <button class="primary-btn" onclick="openModal(${g.id})">Book Gig</button>
      </div>
    </div>
  `).join('') || '<p style="color:var(--text-muted)">No services found matching criteria.</p>';

  // Render Creator Dashboard
  document.getElementById('creatorGrid').innerHTML = bookings.map(b => `
    <div class="card">
      <div>
        <h3>${b.gigTitle}</h3>
        <p><strong>Client:</strong> ${b.clientName} (${b.clientEmail})</p>
        <p><strong>Requested Date:</strong> ${b.date}</p>
        <p><strong>Notes:</strong> ${b.notes}</p>
        <p style="margin-top:10px;">Status: <span class="status-badge status-${b.status.toLowerCase()}">${b.status}</span></p>
      </div>
      ${b.status === 'Pending' ? `
        <div style="display:flex; gap:10px; margin-top:16px;">
          <button class="primary-btn success" style="flex:1" onclick="setBookingStatus(${b.id}, 'Accepted')">Accept</button>
          <button class="primary-btn danger" style="flex:1" onclick="setBookingStatus(${b.id}, 'Declined')">Decline</button>
        </div>
      ` : ''}
    </div>
  `).join('') || '<p style="color:var(--text-muted)">No incoming requests.</p>';

  // Render Client Bookings
  document.getElementById('clientGrid').innerHTML = bookings.map(b => `
    <div class="card">
      <div>
        <h3>${b.gigTitle}</h3>
        <p><strong>Date Slot:</strong> ${b.date}</p>
        <p style="margin-top:8px;">Status: <span class="status-badge status-${b.status.toLowerCase()}">${b.status}</span></p>
        <p style="font-size:12px; color:var(--text-muted); margin-top:8px;">${b.notes}</p>
      </div>
    </div>
  `).join('') || '<p style="color:var(--text-muted)">You have not booked any services yet.</p>';
}

// Initial Run
renderApp();