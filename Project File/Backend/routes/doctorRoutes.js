const express = require("express");
const {
    getDoctorInfoController,
    updateProfileController,
    getDoctorByIdController,
} = require("../controllers/doctorC");
const authMiddleWare = require("../middlewares/authMiddleWare");
const router = express.Router();

//POST SINGLE DOC INFO
router.post("/getDoctorInfo", authMiddleWare, getDoctorInfoController);

//POST UPDATE PROFILE
router.post("/updateProfile", authMiddleWare, updateProfileController);

//POST GET SINGLE DOC INFO
router.post("/getDoctorById", authMiddleWare, getDoctorByIdController);

module.exports = router;
