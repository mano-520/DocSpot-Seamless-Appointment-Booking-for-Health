const mongoose = require("mongoose");
const dotenv = require("dotenv");
const doctorModel = require("../schemas/docModel");
const userModel = require("../schemas/userModel");
const appointmentModel = require("../schemas/appointmentModel");
const connectToDB = require("../config/connectToDB");

dotenv.config();

const resetData = async () => {
    try {
        await connectToDB();

        // 1. Delete all doctors
        await doctorModel.deleteMany({});
        console.log("Deleted all doctors.");

        // 2. Delete all appointments
        await appointmentModel.deleteMany({});
        console.log("Deleted all appointments.");

        // 3. Reset users (isDoctor: false, clear notifications)
        // Keep 'isAdmin' as is.
        await userModel.updateMany(
            {},
            {
                isDoctor: false,
                notification: [],
                seennotification: []
            }
        );
        console.log("Reset all users (removed doctor status, cleared notifications).");

        process.exit();
    } catch (error) {
        console.log("Error resetting data:", error);
        process.exit(1);
    }
};

resetData();
