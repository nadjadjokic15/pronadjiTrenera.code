
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/AppointmentController');
const { authenticate } = require('../middlewares/AuthMiddleware');


router.post('/appointments', authenticate, appointmentController.createAppointment);


router.get('/users/:userId/appointments', authenticate, appointmentController.getAppointmentsByUserId);
router.get('/trainers/:trainerId/appointments', authenticate, appointmentController.getAppointmentsByTrainerId);

router.put('/:appointmentId/status', authenticate, appointmentController.updateStatus); 

router.put('/appointments/cancel/:appointmentId', authenticate, appointmentController.cancelAppointment);


module.exports = router;
