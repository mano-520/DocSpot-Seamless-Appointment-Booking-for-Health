const userModel = require("../schemas/userModel");
const doctorModel = require("../schemas/docModel");
const appointmentModel = require("../schemas/appointmentModel");

// Helper to normalize date format (replace spaces with hyphens)
const normalizeDate = (date) => {
    if (!date) return date;
    return date.replace(/\s+/g, '-');
};

const bookAppointmentController = async (req, res) => {
    try {
        console.log("Booking Appointment Request:", req.body);
        req.body.status = "pending";
        // Normalize date to ensure consistent collision checks (e.g., "DD MM YYYY" -> "DD-MM-YYYY")
        req.body.date = normalizeDate(req.body.date);
        req.body.time = req.body.time;

        // Check if user is blocked
        const userCheck = await userModel.findById(req.body.userId);
        if (userCheck && userCheck.status === "blocked") {
            return res.status(200).send({
                success: false,
                message: "You cannot book appointments as your account is blocked",
            });
        }

        // Double-check timings on booking
        const doctor = await doctorModel.findById(req.body.doctorId);
        if (doctor.timings && doctor.timings.length === 2) {
            // Convert to strings to ensure proper comparison
            const startTime = String(doctor.timings[0]);
            const endTime = String(doctor.timings[1]);
            const requestedTime = String(req.body.time);

            console.log(`Booking Debug:`);
            console.log(`  Requested Time: "${requestedTime}" (type: ${typeof req.body.time})`);
            console.log(`  Start Time: "${startTime}" (type: ${typeof doctor.timings[0]})`);
            console.log(`  End Time: "${endTime}" (type: ${typeof doctor.timings[1]})`);
            console.log(`  Comparison: ${requestedTime} < ${startTime} = ${requestedTime < startTime}`);
            console.log(`  Comparison: ${requestedTime} > ${endTime} = ${requestedTime > endTime}`);

            if (requestedTime < startTime || requestedTime > endTime) {
                return res.status(200).send({
                    success: false,
                    message: "Selected time is outside doctor's working hours",
                });
            }
        }

        // Check if the user already has a pending appointment with this doctor
        const userPendingAppointment = await appointmentModel.findOne({
            doctorId: req.body.doctorId,
            userId: req.body.userId,
            status: "pending",
        });

        if (userPendingAppointment) {
            return res.status(200).send({
                success: false,
                message: "You already have a pending appointment request with this doctor. Please wait for it to be approved or rejected.",
            });
        }

        // Check for existing approved or pending appointment at the same date and time
        const existingAppointment = await appointmentModel.findOne({
            doctorId: req.body.doctorId,
            date: req.body.date,
            time: req.body.time,
            status: { $in: ["approved", "pending"] },
        });

        if (existingAppointment) {
            console.log("Booking Collision Detected:", {
                requested: { doctorId: req.body.doctorId, date: req.body.date, time: req.body.time },
                found: existingAppointment
            });
            return res.status(200).send({
                success: false,
                message: "This slot is not available. It might be already booked or under review. Please select another time.",
            });
        }

        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();
        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
        user.notification.push({
            type: "New-appointment-request",
            message: `A New Appointment Request from ${req.body.userInfo.name}`,
            onClickPath: "/doctor-appointments", // Fixed path for doctor to view requests
        });
        await user.save();
        res.status(200).send({
            success: true,
            message: "Appointment Book Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While Booking Appointment",
        });
    }
};

const checkAvailabilityController = async (req, res) => {
    try {
        const date = normalizeDate(req.body.date);
        const fromTime = req.body.time;
        const toTime = req.body.time;
        const doctorId = req.body.doctorId;

        // Fetch doctor timings
        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: "Doctor not found",
            });
        }

        if (doctor.timings && doctor.timings.length === 2) {
            // Convert to strings to ensure proper comparison
            const startTime = String(doctor.timings[0]);
            const endTime = String(doctor.timings[1]);
            const requestedTime = String(fromTime);

            console.log(`Availability Debug:`);
            console.log(`  Requested Time: "${requestedTime}" (type: ${typeof fromTime})`);
            console.log(`  Start Time: "${startTime}" (type: ${typeof doctor.timings[0]})`);
            console.log(`  End Time: "${endTime}" (type: ${typeof doctor.timings[1]})`);

            // Simple string comparison for HH:mm (Works for same-day shifts)
            if (requestedTime < startTime || requestedTime > endTime) {
                return res.status(200).send({
                    success: false,
                    message: "Selected time is outside doctor's working hours",
                });
            }
        }

        const appointments = await appointmentModel.find({
            doctorId,
            date,
            time: fromTime,
            status: { $in: ["approved", "pending"] },
        });
        if (appointments.length > 0) {
            return res.status(200).send({
                message: "Appointments not Available at this time",
                success: false,
            });
        } else {
            return res.status(200).send({
                success: true,
                message: "Appointments available",
            });
        }
    } catch (error) {
        console.log("Check Availability Error:", error);
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error In checking availability",
        });
    }
};

const userAppointmentsController = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({
            userId: req.body.userId,
        });
        res.status(200).send({
            success: true,
            message: "Users Appointments Fetch SUccessfully",
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error In User Appointments",
        });
    }
};

const doctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        if (!doctor) {
            return res.status(200).send({
                success: false,
                message: "Doctor profile not found",
            });
        }
        const appointments = await appointmentModel.find({
            doctorId: doctor._id,
        });
        res.status(200).send({
            success: true,
            message: "Doctor Appointments Fetch SUccessfully",
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error In Doc Appointments",
        });
    }
};

const updateStatusController = async (req, res) => {
    try {
        const { appointmentsId, status } = req.body;
        const appointments = await appointmentModel.findByIdAndUpdate(
            appointmentsId,
            { status }
        );
        const user = await userModel.findOne({ _id: appointments.userId });
        const notification = user.notification;
        notification.push({
            type: "status-updated",
            message: `your appointment has been updated ${status}`,
            onClickPath: "/doctor-appointments",
        });
        await user.save();
        res.status(200).send({
            success: true,
            message: "Appointment Status Updated",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error In Update Status",
        });
    }
};

module.exports = {
    bookAppointmentController,
    checkAvailabilityController,
    userAppointmentsController,
    doctorAppointmentsController,
    updateStatusController,
};
