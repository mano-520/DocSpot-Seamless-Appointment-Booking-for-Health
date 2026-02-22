const express = require("express");
const {
    getAllUsersController,
    getAllDoctorsController,
    changeAccountStatusController,
    changeUserStatusController,
} = require("../controllers/adminC");
const authMiddleWare = require("../middlewares/authMiddleWare");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleWare, getAllUsersController);

//GET METHOD || DOCTORS
router.get("/getAllDoctors", authMiddleWare, getAllDoctorsController);

//POST ACCOUNT STATUS
router.post(
    "/changeAccountStatus",
    authMiddleWare,
    changeAccountStatusController
);

//POST USER STATUS
router.post(
    "/change-user-status",
    authMiddleWare,
    changeUserStatusController
);

module.exports = router;

