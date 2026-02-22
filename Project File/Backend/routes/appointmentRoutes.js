const express = require("express");
const authMiddleWare = require("../middlewares/authMiddleWare");
const {
    bookAppointmentController,
    checkAvailabilityController,
    userAppointmentsController,
    doctorAppointmentsController,
    updateStatusController,
} = require("../controllers/appointmentC");

const router = express.Router();

//BOOK APPOINTMENT
router.post("/book-appointment", authMiddleWare, bookAppointmentController);

//Booking Avliability
router.post(
    "/check-availability",
    authMiddleWare,
    checkAvailabilityController
);

//APPOINTMENT LIST
router.get("/user-appointments", authMiddleWare, userAppointmentsController);

//DOCTOR APPOINTMENT LIST
router.get(
    "/doctor-appointments",
    authMiddleWare,
    doctorAppointmentsController
);

//UPDATE STATUS
router.post("/update-status", authMiddleWare, updateStatusController);

module.exports = router;
