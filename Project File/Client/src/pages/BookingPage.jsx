import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

import "../styles/DashboardStyles.css";

const BookingPage = () => {
    const { user } = useSelector((state) => state.user);
    const params = useParams();
    const [doctors, setDoctors] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [isAvailable, setIsAvailable] = useState(false);
    const dispatch = useDispatch();

    // login user data
    const getUserData = async () => {
        try {
            const res = await axios.post(
                "/api/v1/doctor/getDoctorById",
                { doctorId: params.doctorId },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            if (res.data.success) {
                setDoctors(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // booking func
    const handleBooking = async () => {
        try {
            if (!date || !time) {
                return message.error("Date & Time Required");
            }
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/appointment/book-appointment",
                {
                    doctorId: params.doctorId,
                    userId: user._id,
                    doctorInfo: doctors,
                    userInfo: user,
                    date: date,
                    time: time,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
        }
    };

    const handleAvailability = async () => {
        try {
            if (!date || !time) {
                return message.error("Please select both date and time");
            }
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/appointment/check-availability",
                { doctorId: params.doctorId, date, time },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                setIsAvailable(true);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
                setIsAvailable(false);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
        }
    };

    useEffect(() => {
        getUserData();
        //eslint-disable-next-line
    }, []);

    return (
        <Layout>
            <div className="dashboard-wrapper booking-container">
                <div className="page-hero">
                    <h1>Book Appointment</h1>
                    <p>Secure your consultation with world-class specialists in just a few steps.</p>
                </div>

                {doctors && (
                    <div className="booking-hero">
                        <div className="doc-profile-section">
                            <div className="doctor-avatar-circle p-0" style={{ width: '120px', height: '120px', fontSize: '3rem', overflow: 'hidden' }}>
                                {doctors.profileImage ? (
                                    <img src={doctors.profileImage} alt="doctor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    doctors.firstName && doctors.firstName[0]
                                )}
                            </div>
                            <h2 className="text-center" style={{ color: '#003366', fontWeight: 700 }}>Dr. {doctors.firstName} {doctors.lastName}</h2>
                            <p className="text-center text-primary fw-bold" style={{ letterSpacing: '1px' }}>{doctors.specialization?.toUpperCase()}</p>

                            <hr className="my-4" />

                            <div className="info-card">
                                <h5>Experience</h5>
                                <p>{doctors.experience} Years</p>
                            </div>
                            <div className="info-card">
                                <h5>Consultation Fee</h5>
                                <p>₹{doctors.feesPerCunsaltation}</p>
                            </div>
                            <div className="info-card">
                                <h5>Available Timings</h5>
                                <p>{doctors.timings && doctors.timings[0]} - {doctors.timings && doctors.timings[1]}</p>
                            </div>
                        </div>

                        <div className="booking-action-section">
                            <h4 className="mb-4" style={{ fontWeight: 700, color: '#003366' }}>Schedule Your Visit</h4>

                            <div className="picker-group">
                                <label className="picker-label">Select Date</label>
                                <DatePicker
                                    className="full-width-picker"
                                    format="DD-MM-YYYY"
                                    onChange={(value) => {
                                        setDate(value ? value.format("DD-MM-YYYY") : "");
                                        setIsAvailable(false);
                                    }}
                                />
                            </div>

                            <div className="picker-group">
                                <label className="picker-label">Select Time Slot</label>
                                <TimePicker
                                    className="full-width-picker"
                                    format="HH:mm"
                                    onChange={(value) => {
                                        setTime(value ? value.format("HH:mm") : "");
                                        setIsAvailable(false);
                                    }}
                                />
                            </div>

                            {(date && time) && (
                                <div className="booking-summary">
                                    <h6>Confirmation Summary</h6>
                                    <p className="mb-1 text-muted">Date: <strong>{date}</strong></p>
                                    <p className="mb-0 text-muted">Time: <strong>{time}</strong></p>
                                </div>
                            )}

                            <div className="d-flex flex-column gap-3">
                                <button
                                    className="btn-book-now"
                                    style={{ background: '#f8fafc', color: '#003366', border: '2px solid #e2e8f0' }}
                                    onClick={handleAvailability}
                                >
                                    Check Availability
                                </button>
                                <button
                                    className="btn-book-now"
                                    onClick={handleBooking}
                                    disabled={!isAvailable}
                                    style={{ opacity: isAvailable ? 1 : 0.6 }}
                                >
                                    {isAvailable ? "Proceed to Book" : "Check Availability First"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BookingPage;
