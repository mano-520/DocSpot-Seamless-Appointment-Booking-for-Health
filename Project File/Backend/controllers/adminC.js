const doctorModel = require("../schemas/docModel");
const userModel = require("../schemas/userModel");

const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({ isAdmin: false });
        res.status(200).send({
            success: true,
            message: "Users data list",
            data: users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while fetching users",
            error,
        });
    }
};

const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        res.status(200).send({
            success: true,
            message: "Doctors data list",
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while fetching doctors",
            error,
        });
    }
};


const changeAccountStatusController = async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
        const user = await userModel.findOne({ _id: doctor.userId });
        const notification = user.notification;
        notification.push({
            type: "doctor-account-request-updated",
            message: `Your Doctor Account Request Has ${status} `,
            onClickPath: "/notification",
        });

        // Update user's isDoctor flag based on approval status
        user.isDoctor = status === "approved" ? true : false;

        await user.save();
        res.status(201).send({
            success: true,
            message: "Account Status Updated",
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Account Status",
            error,
        });
    }
};

const changeUserStatusController = async (req, res) => {
    try {
        const { targetUserId, status } = req.body;
        const user = await userModel.findByIdAndUpdate(targetUserId, { status }, { new: true });
        res.status(201).send({
            success: true,
            message: `User status has been updated to ${status}`,
            data: user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in updating user status",
            error,
        });
    }
};

module.exports = {
    getAllUsersController,
    getAllDoctorsController,
    changeAccountStatusController,
    changeUserStatusController,
};

