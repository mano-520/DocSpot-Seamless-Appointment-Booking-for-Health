import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Row, Table } from "antd";
import DoctorList from "../components/DoctorList";
import { useSelector } from "react-redux";

import "../styles/DashboardStyles.css";

const HomePage = () => {
    const { user } = useSelector((state) => state.user);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // login user data
    const getUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "/api/v1/admin/getAllDoctors",
                { headers: { Authorization: "Bearer " + token } }
            );
            if (res.data.success) {
                setDoctors(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getDoctorAppointments = async () => {
        try {
            const res = await axios.get("/api/v1/appointment/doctor-appointments", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (res.data.success) {
                const approvedAppointments = res.data.data.filter(app => app.status === "approved");
                setAppointments(approvedAppointments);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user?.isDoctor) {
            getDoctorAppointments();
        } else {
            getUserData();
        }
    }, [user]);

    const columns = [
        {
            title: "Patient",
            dataIndex: "userInfo",
            render: (text, record) => (
                <div className="d-flex align-items-center gap-2">
                    <div className="status-badge" style={{ background: '#f1f5f9', color: '#0f172a', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                        {record.userInfo?.name[0].toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 700 }}>{record.userInfo?.name}</span>
                </div>
            )
        },
        {
            title: "Appointment Date",
            dataIndex: "date",
            render: (text) => <span style={{ color: '#64748b' }}>{text}</span>
        },
        {
            title: "Scheduled Time",
            dataIndex: "time",
            render: (text) => <span style={{ color: '#0ea5e9', fontWeight: 700 }}>{text}</span>
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text) => (
                <span className={`status-badge status-${text.toLowerCase()}`}>
                    {text}
                </span>
            )
        },
    ];

    return (
        <Layout>
            <div className="dashboard-wrapper">
                <div className="welcome-banner">
                    <h1>Hello, {user?.name.split(' ')[0]}! 👋</h1>
                    <p>
                        {user?.isDoctor
                            ? "Welcome to your digital command center. Manage your schedule and patient care with absolute precision."
                            : "Discover elite medical specialists and book world-class healthcare appointments in seconds. Your health, elevated."}
                    </p>
                </div>

                {user?.isDoctor ? (
                    <div className="mt-4">
                        <div className="section-header mb-4">
                            <h2 style={{ color: "#0f172a", fontWeight: 800, letterSpacing: '-1px' }}>Priority Appointments</h2>
                            <p style={{ color: "#64748b" }}>Overview of your confirmed patient schedule for today.</p>
                        </div>
                        <Table
                            columns={columns}
                            dataSource={appointments}
                            className="premium-table"
                            pagination={{ pageSize: 5 }}
                            rowKey="_id"
                        />
                    </div>
                ) : (
                    <div>
                        <div className="section-header mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                            <div>
                                <h2 style={{ color: "#0f172a", fontWeight: 800, letterSpacing: '-1px' }}>Global Registry of Specialists</h2>
                                <p style={{ color: "#64748b" }} className="mb-0">Connect with certified professionals in our verified network.</p>
                            </div>
                            <div className="search-container" style={{ minWidth: '400px' }}>
                                <div className="search-glass-container">
                                    <i className="fa-solid fa-magnifying-glass search-icon-float"></i>
                                    <input
                                        type="text"
                                        placeholder="Search specialists, clinics..."
                                        className="search-input-elite"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <div className="clear-search-btn" onClick={() => setSearchQuery("")}>
                                            <i className="fa-solid fa-xmark"></i>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Row>
                            {doctors && doctors
                                .filter(doc =>
                                    doc.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    doc.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((doctor) => <DoctorList doctor={doctor} key={doctor._id} />)}

                            {doctors && doctors.filter(doc =>
                                doc.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                doc.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
                            ).length === 0 && (
                                    <div className="text-center w-100 py-5">
                                        <div className="mb-4">
                                            <i className="fa-solid fa-user-slash" style={{ fontSize: '4rem', color: '#e2e8f0' }}></i>
                                        </div>
                                        <h3 style={{ color: '#0f172a', fontWeight: 800 }}>No Specialists Found</h3>
                                        <p className="text-muted" style={{ fontSize: '1.2rem' }}>We couldn't find any results matching "{searchQuery}".</p>
                                    </div>
                                )}
                        </Row>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default HomePage;
