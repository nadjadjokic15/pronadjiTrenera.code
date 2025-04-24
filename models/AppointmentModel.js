
const db = require('../utils/db'); 


exports.createAppointment = (userId, trainerId, appointment_date, callback) => {
  const now = new Date();
  const appointmentDate = new Date(appointment_date);

  
  if (appointmentDate <= now) {
    return callback(new Error('Datum termina mora biti u budućnosti.'), null);
  }

  
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const updatedAt = createdAt;

  
  const query = 'INSERT INTO appointments (user_id, created_at, updated_at, appointment_date, trainer_id, status) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(query, [userId, createdAt, updatedAt, appointment_date, trainerId, 'scheduled'], (err, result) => {
    if (err) {
      return callback(err, null); 
    }

    
    const getAppointmentQuery = 'SELECT * FROM appointments WHERE id = ?';
    db.query(getAppointmentQuery, [result.insertId], (err, appointmentResult) => {
      if (err) {
        return callback(err, null); 
      }

      
      return callback(null, appointmentResult[0]);
    });
  });
};








exports.getAppointmentsByUserId = (userId, callback) => {
  const query = `
    SELECT 
      a.id AS appointment_id,
      a.appointment_date,
      a.status,
      a.updated_at,
      t.id AS trainer_id,
      t.username AS trainer_name
    FROM railway.appointments a
    INNER JOIN railway.trainers t ON a.trainer_id = t.id
    WHERE a.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return callback(err, null);
    }

    const appointments = results.map(row => ({
      id: row.appointment_id,
      appointment_date: row.appointment_date,
      status: row.status,
      updated_at: row.updated_at,
      role: "trainer",
      username: row.trainer_name,
      trainer: {
        id: row.trainer_id,
        name: row.trainer_name
      }
    }));

    return callback(null, appointments);
  });
};

exports.getAppointmentsByTrainerId = (trainerId, callback) => {
  const query = `
    SELECT 
      a.id AS appointment_id,
      a.appointment_date,
      a.status,
      a.updated_at,
      u.id AS user_id,
      u.username AS user_name
    FROM railway.appointments a
    INNER JOIN railway.users u ON a.user_id = u.id
    WHERE a.trainer_id = ?
  `;

  db.query(query, [trainerId], (err, results) => {
    if (err) {
      return callback(err, null);
    }

    const appointments = results.map(row => ({
      id: row.appointment_id,
      appointment_date: row.appointment_date,
      status: row.status,
      updated_at: row.updated_at,
      role: "client",
      username: row.user_name,
      user: {
        id: row.user_id,
        username: row.user_name
      }
    }));

    return callback(null, appointments);
  });
};



exports.updateAppointmentStatus = (appointmentId, status, callback) => {
  
  if (!status || !['scheduled', 'completed', 'cancelled'].includes(status)) {
    return callback(new Error('Neispravan status.'), null);
  }

  const checkQuery = 'SELECT * FROM appointments WHERE id = ? ';
  db.query(checkQuery, [appointmentId], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    if (result.length === 0) {
      return callback(new Error('Termin nije pronađen ili nemate pristup ovom terminu.'), null);
    }

    const updateQuery = `
      UPDATE appointments
      SET status = ?, updated_at = NOW()
      WHERE id = ?
    `;
    db.query(updateQuery, [status, appointmentId], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result); 
    });
  });
};



exports.cancelAppointment = (appointmentId, callback) => {
  const updateQuery = 'UPDATE appointments SET status = "cancelled", updated_at = NOW() WHERE id = ? '
  ;
  
  db.query(updateQuery, [appointmentId], (err, result) => {
    if (err) {
      console.error("Greška pri ažuriranju statusa termina:", err);
      return callback(err, null);
    }

    if (result.affectedRows === 0) {
      return callback(new Error('Termin nije pronađen ili je već otkazan.'), null);
    }

    console.log(`Termin sa ID ${appointmentId} uspešno otkazan.`);
    return callback(null, result);
  });
};
