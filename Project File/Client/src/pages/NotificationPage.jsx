import React from "react";
import Layout from "../components/Layout";
import { message, Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUser } from "../redux/features/userSlice";

import "../styles/DashboardStyles.css";

const NotificationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);

    const handleMarkAllRead = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/user/get-all-notification",
                { userId: user._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                dispatch(setUser(res.data.data));
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error("somthing went wrong");
        }
    };

    const handleDeleteAllRead = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/user/delete-all-notification",
                { userId: user._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                dispatch(setUser(res.data.data));
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error("Somthing went wrong in notifications");
        }
    };

    return (
        <Layout>
            <div className="dashboard-wrapper">
                <div className="page-hero">
                    <h1>Notification Center</h1>
                    <p>Stay updated with your latest appointment status and system alerts.</p>
                </div>

                <div className="premium-card p-4">
                    <Tabs
                        defaultActiveKey="0"
                        items={[
                            {
                                key: '0',
                                label: (<span><i className="fa-solid fa-envelope-open me-2"></i>Unread</span>),
                                children: (
                                    <>
                                        <div className="d-flex justify-content-end mb-4">
                                            <button className="status-badge status-approved border-0" onClick={handleMarkAllRead} style={{ cursor: 'pointer' }}>
                                                <i className="fa-solid fa-check-double me-2"></i> Mark All as Read
                                            </button>
                                        </div>

                                        {user?.notification.length > 0 ? (
                                            user.notification.map((notificationMgs, index) => (
                                                <div className="notification-card" key={index} onClick={() => navigate(notificationMgs.onClickPath)}>
                                                    <div className="notification-icon">
                                                        <i className="fa-solid fa-bell"></i>
                                                    </div>
                                                    <div className="notification-content">
                                                        <p>{notificationMgs.message}</p>
                                                    </div>
                                                    <div className="text-muted small">Just now</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-5">
                                                <i className="fa-solid fa-circle-check mb-3" style={{ fontSize: '3rem', color: '#e2e8f0' }}></i>
                                                <p className="text-muted">No new notifications. You're all caught up!</p>
                                            </div>
                                        )}
                                    </>
                                )
                            },
                            {
                                key: '1',
                                label: (<span><i className="fa-solid fa-envelope me-2"></i>Read History</span>),
                                children: (
                                    <>
                                        <div className="d-flex justify-content-end mb-4">
                                            <button className="status-badge status-rejected border-0" onClick={handleDeleteAllRead} style={{ cursor: 'pointer' }}>
                                                <i className="fa-solid fa-trash-can me-2"></i> Clear History
                                            </button>
                                        </div>

                                        {user?.seennotification.length > 0 ? (
                                            user.seennotification.map((notificationMgs, index) => (
                                                <div className="notification-card" key={index} onClick={() => navigate(notificationMgs.onClickPath)} style={{ opacity: 0.7 }}>
                                                    <div className="notification-icon" style={{ background: '#f8fafc', color: '#64748b' }}>
                                                        <i className="fa-solid fa-envelope-open"></i>
                                                    </div>
                                                    <div className="notification-content">
                                                        <p className="text-muted">{notificationMgs.message}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-5">
                                                <p className="text-muted">Your notification history is empty.</p>
                                            </div>
                                        )}
                                    </>
                                )
                            }
                        ]}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default NotificationPage;
