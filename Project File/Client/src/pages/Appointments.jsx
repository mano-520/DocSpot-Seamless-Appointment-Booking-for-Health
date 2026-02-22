import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import moment from "moment";
import { Table } from "antd";

import "../styles/DashboardStyles.css";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);

    const getAppointments = async () => {
        try {
            const res = await axios.get("/api/v1/appointment/user-appointments", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.data.success) {
                setAppointments(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAppointments();
    }, []);

    const columns = [
        {
            title: "Specialist",
            dataIndex: "doctorInfo",
            render: (text, record) => (
                <div className="d-flex align-items-center">
                    <div className="user-avatar-placeholder me-3" style={{ width: '40px', height: '40px', fontSize: '0.9rem', borderRadius: '12px' }}>
                        {record.doctorInfo?.firstName[0]}
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, color: '#111827' }}>Dr. {record.doctorInfo?.firstName} {record.doctorInfo?.lastName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{record.doctorInfo?.specialization}</div>
                    </div>
                </div>
            ),
        },
        {
            title: "Date",
            dataIndex: "date",
            render: (text) => (
                <div style={{ fontWeight: 600, color: '#475569' }}>
                    <i className="fa-solid fa-calendar-day me-2" style={{ color: '#10b981' }}></i>
                    {text}
                </div>
            )
        },
        {
            title: "Time Slot",
            dataIndex: "time",
            render: (text) => (
                <div style={{ fontWeight: 600, color: '#475569' }}>
                    <i className="fa-solid fa-clock me-2" style={{ color: '#10b981' }}></i>
                    {text}
                </div>
            )
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text) => (
                <span className={`status-badge status-${text.toLowerCase()}`}>
                    <i className={`fa-solid ${text === 'approved' ? 'fa-check-circle' : text === 'pending' ? 'fa-clock' : 'fa-circle-xmark'} me-1`}></i>
                    {text}
                </span>
            ),
        },
    ];

    return (
        <Layout>
            <div className="dashboard-wrapper">
                <div className="page-hero">
                    <h1>My Appointments</h1>
                    <p>Manage your health journey. View and track your scheduled consultations with top specialists.</p>
                </div>

                <div className="premium-table-container">
                    <Table
                        columns={columns}
                        dataSource={appointments}
                        className="premium-table"
                        pagination={{ pageSize: 8 }}
                        rowKey="_id"
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Appointments;
