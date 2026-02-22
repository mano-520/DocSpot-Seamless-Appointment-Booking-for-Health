const express = require("express");
const {
    loginController,
    registerController,
    authController,
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
    updateUserProfileController,
} = require("../controllers/userC");
const authMiddleWare = require("../middlewares/authMiddleWare");

const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

//Auth || POST
router.post("/getUserData", authMiddleWare, authController);

//Apply Doctor || POST
router.post("/apply-doctor", authMiddleWare, applyDoctorController);

//Notifiaction  || POST
router.post(
    "/get-all-notification",
    authMiddleWare,
    getAllNotificationController
);
router.post(
    "/delete-all-notification",
    authMiddleWare,
    deleteAllNotificationController
);

//Update Profile || POST
router.post("/update-profile", authMiddleWare, updateUserProfileController);

module.exports = router;
