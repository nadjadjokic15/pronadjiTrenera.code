
const Appointment = require('../models/AppointmentModel');


exports.createAppointment = (req, res) => {
  const { appointment_date, trainerId } = req.body;
  const userId = req.user.id; 

  if (!appointment_date) {
    return res.status(400).json({ message: 'Datum termina je obavezan.' });
  }

  Appointment.createAppointment(userId, trainerId, appointment_date, (err, appointmentId) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Došlo je do greške prilikom zakazivanja termina.' });
    }

    return res.status(201).json({
      message: 'Termin je uspešno zakazan.',
      appointmentId: appointmentId,
    });
  });
};





exports.getAppointmentsByUserId = (req, res) => {
  const {userId} = req.params;
 
  

  Appointment.getAppointmentsByUserId(userId, (err, appointments) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Došlo je do greške prilikom pretrage termina.' });
    }

    return res.status(200).json({
      appointments: appointments,
    });
  });
};
exports.getAppointmentsByTrainerId = (req, res) => {
    const{trainerId} = req.params;
   
    
  
    Appointment.getAppointmentsByTrainerId(trainerId, (err, appointments) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Došlo je do greške prilikom pretrage termina.' });
      }
  
      return res.status(200).json({
        appointments: appointments,
      });
    });
  };




exports.updateStatus = (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body; 
  // const userId = req.user.id; 

  
  Appointment.updateAppointmentStatus(appointmentId,  status, (err, result) => {
    if (err) {
      return res.status(400).send(err.message);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Termin nije pronađen ili nemate pristup ovom terminu.' });
    }
    return res.status(200).json({
      message: 'Status termina je uspešno ažuriran.',
    });
  });
};




exports.cancelAppointment = (req, res) => {
  const appointmentId = req.params.appointmentId;
  

  Appointment.cancelAppointment(appointmentId,  (err, result) => {
    if (err) {
      return res.status(403).json({ message: err.message });
    }
    return res.status(200).json({ message: "Termin uspešno otkazan." });
  });
};