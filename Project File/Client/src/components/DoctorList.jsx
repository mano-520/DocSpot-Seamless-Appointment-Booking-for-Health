import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardStyles.css";

const DoctorList = ({ doctor }) => {
    const navigate = useNavigate();
    return (
        <div className="col-md-6 col-lg-4 col-xl-3 p-3">
            <div
                className="doctor-card"
                onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
                style={{ cursor: "pointer" }}
            >
                <div className="doctor-card-header">
                    <div className="doctor-avatar-circle p-0" style={{ overflow: 'hidden' }}>
                        {doctor.profileImage ? (
                            <img src={doctor.profileImage} alt="doctor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <i className="fa-solid fa-user-md"></i>
                        )}
                    </div>
                    <h3>Dr. {doctor.firstName} {doctor.lastName}</h3>
                    <div className="specialization">{doctor.specialization}</div>
                </div>
                <div className="doctor-card-body">
                    <div className="doc-info-row">
                        <span className="label"><i className="fa-solid fa-briefcase-medical"></i> Experience</span>
                        <span className="value">{doctor.experience} Years</span>
                    </div>
                    <div className="doc-info-row">
                        <span className="label"><i className="fa-solid fa-receipt"></i> Consult Fee</span>
                        <span className="value">₹{doctor.feesPerCunsaltation}</span>
                    </div>
                    <div className="doc-info-row">
                        <span className="label"><i className="fa-solid fa-clock-rotate-left"></i> Typical Hours</span>
                        <span className="value">{doctor.timings[0]} - {doctor.timings[1]}</span>
                    </div>
                    <button className="btn-book-now" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/doctor/book-appointment/${doctor._id}`);
                    }}>
                        Book Appointment <i className="fa-solid fa-calendar-check"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorList;
