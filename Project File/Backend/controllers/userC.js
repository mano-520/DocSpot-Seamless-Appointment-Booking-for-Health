const userModel = require("../schemas/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../schemas/docModel");
const appointmentModel = require("../schemas/appointmentModel");

const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res
                .status(200)
                .send({ message: "User already exists", success: false });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send({ message: "Registered Successfully", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Register Controller error: ${error.message}`,
        });
    }
};

const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res
                .status(200)
                .send({ message: "User not found", success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res
                .status(200)
                .send({ message: "Invalid email or password", success: false });
        }

        // Check if user is blocked
        if (user.status === "blocked") {
            return res.status(200).send({
                message: "Your account has been blocked by admin. Please contact support.",
                success: false,
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res
            .status(200)
            .send({ message: "Login Success", success: true, token });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error in Login Controller ${error.message}` });
    }
};

const authController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId });
        user.password = undefined;
        if (!user) {
            return res.status(200).send({
                message: "User not found",
                success: false,
            });
        } else if (user.status === "blocked") {
            return res.status(200).send({
                message: "Your account is blocked",
                success: false,
            });
        } else {
            // Include profile image if user is a doctor
            const userData = {
                ...user.toObject(),
                profileImage: null
            };

            if (user.isDoctor) {
                // Try finding by string ID and by ObjectID to be safe
                let doctor = await doctorModel.findOne({ userId: req.body.userId });

                if (!doctor) {
                    doctor = await doctorModel.findOne({ userId: user._id });
                }

                if (doctor) {
                    userData.profileImage = doctor.profileImage;
                }
            }

            res.status(200).send({
                success: true,
                data: userData,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Auth error",
            success: false,
            error,
        });
    }
};


const applyDoctorController = async (req, res) => {
    try {
        console.log("Apply Doctor Request Body:", req.body);
        const newDoctor = new doctorModel({ ...req.body, status: "pending" });
        await newDoctor.save();
        const adminUser = await userModel.findOne({ isAdmin: true });
        if (adminUser) {
            const notification = adminUser.notification;
            notification.push({
                type: "apply-doctor-request",
                message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
                data: {
                    doctorId: newDoctor._id,
                    name: newDoctor.firstName + " " + newDoctor.lastName,
                    onClickPath: "/admin/doctors",
                },
            });
            await userModel.findByIdAndUpdate(adminUser._id, { notification });
        }
        res.status(201).send({
            success: true,
            message: "Doctor Account Applied Successfully",
        });
    } catch (error) {
        console.log("Apply Doctor Controller Error:", error);
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error While Applying For Doctor",
        });
    }
};

const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        const seennotification = user.seennotification;
        const notification = user.notification;
        seennotification.push(...notification);
        user.notification = [];
        user.seennotification = seennotification;
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "all notification marked as read",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in notification",
            success: false,
            error,
        });
    }
};

const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        user.notification = [];
        user.seennotification = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "Notifications Deleted Successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "unable to delete all notifications",
            error,
        });
    }
};

const updateUserProfileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId);
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "User not found",
            });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;

        const updatedUser = await user.save();
        updatedUser.password = undefined;

        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error updating profile",
            error,
        });
    }
};

module.exports = {
    loginController,
    registerController,
    authController,
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
    updateUserProfileController,
};

