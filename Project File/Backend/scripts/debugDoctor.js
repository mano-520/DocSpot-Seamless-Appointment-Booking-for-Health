const mongoose = require("mongoose");
const dotenv = require("dotenv");
const doctorModel = require("../schemas/docModel");
const connectToDB = require("../config/connectToDB");

dotenv.config();

const debugDoctor = async () => {
    try {
        await connectToDB();
        // Get the most recently created doctor
        const doctor = await doctorModel.findOne().sort({ createdAt: -1 });

        if (doctor) {
            console.log("Latest Doctor Found:");
            console.log(`Name: ${doctor.firstName} ${doctor.lastName}`);
            console.log(`Timings (Raw):`, doctor.timings);
            console.log(`Timings Type:`, Array.isArray(doctor.timings) ? "Array" : typeof doctor.timings);
            if (Array.isArray(doctor.timings)) {
                console.log(`Element 0 Type:`, typeof doctor.timings[0]);
            }
        } else {
            console.log("No doctors found.");
        }

        process.exit();
    } catch (error) {
        console.log("Error:", error);
        process.exit(1);
    }
};

debugDoctor();
