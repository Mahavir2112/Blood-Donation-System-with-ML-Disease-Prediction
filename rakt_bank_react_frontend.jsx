// RaktBank - Single-file React App (App.jsx)
// Copy this into a create-react-app src/App.jsx and save the CSS below into src/App.css

import React, { useState, useEffect } from 'react';
import './App.css';

function Navbar() {
  return (
    <header className="rb-navbar">
      <h1>RaktBank</h1>
      <nav>
        <a href="#donor">Donor</a>
        <a href="#inventory">Inventory</a>
        <a href="#appointments">Appointments</a>
        <a href="#predictor">Disease Predictor</a>
      </nav>
    </header>
  );
}

function DonorRegistration({ onAdd }) {
  const [form, setForm] = useState({ name: '', email: '', bloodGroup: '', phone: '' });
  const submit = e => {
    e.preventDefault();
    if (!form.name || !form.bloodGroup) return alert('Please fill name and blood group');
    onAdd(form);
    setForm({ name: '', email: '', bloodGroup: '', phone: '' });
  };
  return (
    <section id="donor" className="card">
      <h2>Donor Registration</h2>
      <form onSubmit={submit} className="form">
        <label>
          Name
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          Email
          <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          Blood Group
          <select value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
            <option value="">Select</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>O+</option>
            <option>O-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        </label>
        <div className="actions">
          <button type="submit">Register Donor</button>
        </div>
      </form>
    </section>
  );
}

function Inventory({ items }) {
  return (
    <section id="inventory" className="card">
      <h2>Inventory</h2>
      <table className="inventory-table">
        <thead>
          <tr><th>Blood Group</th><th>Units</th></tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.group}><td>{it.group}</td><td>{it.units}</td></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function AppointmentScheduler({ onSchedule }) {
  const [appt, setAppt] = useState({ donorName: '', date: '', time: '' });
  const submit = e => {
    e.preventDefault();
    if (!appt.donorName || !appt.date) return alert('Fill donor name and date');
    onSchedule(appt);
    setAppt({ donorName: '', date: '', time: '' });
  };
  return (
    <section id="appointments" className="card">
      <h2>Schedule Appointment</h2>
      <form className="form" onSubmit={submit}>
        <label>
          Donor Name
          <input value={appt.donorName} onChange={e => setAppt({ ...appt, donorName: e.target.value })} />
        </label>
        <label>
          Date
          <input type="date" value={appt.date} onChange={e => setAppt({ ...appt, date: e.target.value })} />
        </label>
        <label>
          Time
          <input type="time" value={appt.time} onChange={e => setAppt({ ...appt, time: e.target.value })} />
        </label>
        <div className="actions">
          <button type="submit">Schedule</button>
        </div>
      </form>
    </section>
  );
}

function DiseasePredictor() {
  const [features, setFeatures] = useState({ age: '', fever: false, cough: false, fatigue: false });
  const [result, setResult] = useState(null);
  const submit = async e => {
    e.preventDefault();
    // Example: call backend ML API - replace URL with your server endpoint
    try {
      const resp = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(features)
      });
      const data = await resp.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Prediction failed (no server).' });
    }
  };
  return (
    <section id="predictor" className="card">
      <h2>Disease Predictor</h2>
      <form className="form" onSubmit={submit}>
        <label>
          Age
          <input type="number" value={features.age} onChange={e => setFeatures({ ...features, age: e.target.value })} />
        </label>
        <label className="checkbox">
          <input type="checkbox" checked={features.fever} onChange={e => setFeatures({ ...features, fever: e.target.checked })} /> Fever
        </label>
        <label className="checkbox">
          <input type="checkbox" checked={features.cough} onChange={e => setFeatures({ ...features, cough: e.target.checked })} /> Cough
        </label>
        <label className="checkbox">
          <input type="checkbox" checked={features.fatigue} onChange={e => setFeatures({ ...features, fatigue: e.target.checked })} /> Fatigue
        </label>
        <div className="actions">
          <button type="submit">Predict</button>
        </div>
      </form>
      {result && (
        <div className="result">
          {result.error ? <span className="error">{result.error}</span> : <>
            <p><strong>Prediction:</strong> {result.label}</p>
            <p><strong>Confidence:</strong> {Math.round((result.confidence||0)*100)}%</p>
          </>}
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [inventory, setInventory] = useState([
    { group: 'A+', units: 10 },
    { group: 'B+', units: 8 },
    { group: 'O+', units: 15 }
  ]);
  const [appointments, setAppointments] = useState([]);
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    // In real app: fetch initial data from backend
    // fetch('/api/inventory').then(r=>r.json()).then(setInventory)
  }, []);

  const addDonor = async donor => {
    // optimistic UI update
    setDonors(prev => [donor, ...prev]);
    try {
      await fetch('/api/donors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(donor) });
    } catch (err) {
      console.error('failed to save donor', err);
    }
  };

  const schedule = async appt => {
    setAppointments(prev => [appt, ...prev]);
    try {
      await fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(appt) });
    } catch (err) { console.error('failed to schedule', err); }
  };

  return (
    <div className="app-root">
      <Navbar />
      <main className="container">
        <div className="columns">
          <div className="column-left">
            <DonorRegistration onAdd={addDonor} />
            <AppointmentScheduler onSchedule={schedule} />
            <div className="card">
              <h2>Recent Donors</h2>
              <ul className="donor-list">
                {donors.length === 0 ? <li>No donors yet</li> : donors.map((d,i)=>(<li key={i}>{d.name} — {d.bloodGroup}</li>))}
              </ul>
            </div>
          </div>
          <div className="column-right">
            <Inventory items={inventory} />
            <DiseasePredictor />
            <div className="card">
              <h2>Appointments</h2>
              <ul className="appt-list">
                {appointments.length===0? <li>No appointments</li> : appointments.map((a,i)=>(<li key={i}>{a.donorName} — {a.date} {a.time}</li>))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <footer className="rb-footer">Built with ❤️ — RaktBank</footer>
    </div>
  );
}

/*
  App.css
  Save this content in src/App.css when using the component above.
*/

/* ---- App.css START ---- */
/* Basic, responsive CSS (plain CSS as requested) */

:root{
  --bg:#f7f9fb; --card:#ffffff; --accent:#d32f2f; --muted:#666;
}
*{box-sizing:border-box}
body,html,#root{height:100%;margin:0;font-family:Inter, Arial, sans-serif;background:var(--bg);color:#111}

.app-root{min-height:100%;display:flex;flex-direction:column}
.rb-navbar{background:var(--card);display:flex;justify-content:space-between;align-items:center;padding:12px 20px;box-shadow:0 1px 4px rgba(0,0,0,0.06)}
.rb-navbar h1{margin:0;color:var(--accent)}
.rb-navbar nav a{margin-left:12px;text-decoration:none;color:var(--muted)}

.container{max-width:1100px;margin:20px auto;padding:0 16px;flex:1}
.columns{display:flex;gap:20px}
.column-left{flex:1}
.column-right{width:360px}
.card{background:var(--card);padding:16px;border-radius:8px;box-shadow:0 1px 6px rgba(20,20,20,0.03);margin-bottom:16px}

.form label{display:block;margin-bottom:8px;font-size:14px;color:#333}
.form input,.form select{width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;margin-top:6px}
.form .checkbox{display:flex;align-items:center;gap:8px}
.actions{margin-top:12px}
.actions button{background:var(--accent);color:#fff;padding:8px 12px;border:none;border-radius:6px;cursor:pointer}

.inventory-table{width:100%;border-collapse:collapse}
.inventory-table th, .inventory-table td{padding:8px;text-align:left;border-bottom:1px solid #f0f0f0}
.donor-list, .appt-list{list-style:none;padding:0;margin:0}
.donor-list li, .appt-list li{padding:6px 0;border-bottom:1px dashed #f2f2f2}

.result{margin-top:12px;padding:10px;border-radius:6px;background:#fff9f9;border:1px solid #ffdddd}
.error{color:#b00020}

.rb-footer{text-align:center;padding:12px;color:var(--muted);font-size:14px}

/* Responsive */
@media(max-width:900px){
  .columns{flex-direction:column}
  .column-right{width:auto}
}

/* ---- App.css END ---- */
