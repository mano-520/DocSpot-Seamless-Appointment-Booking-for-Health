import React, { useState } from "react";
import Layout from "../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Form, Input, message } from "antd";
import axios from "axios";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
import "../styles/DashboardStyles.css";

const UserProfile = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleUpdate = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post("/api/v1/user/update-profile", {
                ...values,
                userId: user._id,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                dispatch(setUser(res.data.data));
                setIsModalOpen(false);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error("Something went wrong");
        }
    };

    return (
        <Layout>
            <div className="dashboard-wrapper">
                <div className="page-hero">
                    <h1>Medical Hub <span className="pulse-emerald"></span></h1>
                    <p>Advanced biometric interface for your clinical identity and health registry.</p>
                </div>

                <div className="profile-bento-grid">
                    {/* Biometric ID Module */}
                    <div className="hub-card bento-4">
                        <div className="hub-label">Biometric ID</div>
                        <div className="status-ring">
                            {user?.profileImage ? (
                                <img src={user?.profileImage} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <div className="user-avatar-placeholder" style={{ width: '100%', height: '100%', borderRadius: '50%', fontSize: '2rem' }}>
                                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <h3 className="hub-title mb-1">{user?.name}</h3>
                            <div style={{ color: '#10b981', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px' }}>
                                SYSTEM STATUS: {user?.isAdmin ? 'ADMINISTRATOR' : user?.isDoctor ? 'HCP SPECIALIST' : 'VERIFIED PATIENT'}
                            </div>
                        </div>
                        <div className="mt-auto pt-4">
                            <button className="glow-btn w-100" onClick={() => {
                                form.setFieldsValue({
                                    name: user?.name,
                                    email: user?.email,
                                    phone: user?.phone
                                });
                                setIsModalOpen(true);
                            }}>Update Pulse</button>
                        </div>
                    </div>

                    {/* Clinical Overview Module */}
                    <div className="hub-card bento-8">
                        <div className="hub-label">Registry Overview</div>
                        <h3 className="hub-title">Core Identity Data</h3>

                        <div className="hub-data-row">
                            <span className="hub-data-label">Unique Protocol ID</span>
                            <span className="hub-data-value" style={{ fontFamily: 'monospace' }}>DOC-SP-2026-{user?._id?.slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="hub-data-row">
                            <span className="hub-data-label">Primary Communication</span>
                            <span className="hub-data-value">{user?.email}</span>
                        </div>
                        <div className="hub-data-row">
                            <span className="hub-data-label">Secure Phonenumber</span>
                            <span className="hub-data-value">{user?.phone || "Pending Registration"}</span>
                        </div>
                        <div className="hub-data-row">
                            <span className="hub-data-label">Auth Level</span>
                            <span className="hub-data-value" style={{ color: '#10b981' }}>{user?.isAdmin ? 'L3 - System Admin' : user?.isDoctor ? 'L2 - Healthcare' : 'L1 - Standard'}</span>
                        </div>
                        <div className="hub-data-row">
                            <span className="hub-data-label">Registry Since</span>
                            <span className="hub-data-value">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "March 2024"}</span>
                        </div>
                    </div>

                    {/* System Activity Hub */}
                    <div className="hub-card bento-6">
                        <div className="hub-label">System Feed</div>
                        <h3 className="hub-title">Recent Pulse</h3>

                        <div className="stat-widget border-0 p-0 mb-4" style={{ boxShadow: 'none', background: 'transparent' }}>
                            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                <i className="fa-solid fa-bell"></i>
                            </div>
                            <div className="stat-value">{user?.notification?.length || 0}</div>
                            <div className="stat-label">Unresolved Alerts</div>
                        </div>

                        <div className="stat-widget border-0 p-0" style={{ boxShadow: 'none', background: 'transparent' }}>
                            <div className="stat-icon" style={{ background: 'rgba(226, 232, 240, 0.3)', color: '#64748b' }}>
                                <i className="fa-solid fa-shield-check"></i>
                            </div>
                            <div className="stat-value">{user?.seennotification?.length || 0}</div>
                            <div className="stat-label">Encrypted History Logs</div>
                        </div>
                    </div>

                    {/* Security & Access Module */}
                    <div className="hub-card bento-6">
                        <div className="hub-label">System Access</div>
                        <h3 className="hub-title">Terminal Permissions</h3>

                        <div className="d-flex flex-column gap-3">
                            <div className="p-3 rounded-4" style={{ background: 'rgba(241, 245, 249, 0.5)', border: '1px solid rgba(226, 232, 240, 0.5)' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>ENCRYPTION STATUS</div>
                                <div style={{ fontWeight: 700, color: '#111827' }}>256-bit AES Active</div>
                            </div>
                            <div className="p-3 rounded-4" style={{ background: 'rgba(241, 245, 249, 0.5)', border: '1px solid rgba(226, 232, 240, 0.5)' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>ACCESS TOKEN</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', wordBreak: 'break-all' }}>
                                    Bearer {localStorage.getItem("token")?.slice(0, 30)}...
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto pt-4 d-flex justify-content-end">
                            <i className="fa-solid fa-fingerprint" style={{ fontSize: '2.5rem', color: '#10b981', opacity: 0.2 }}></i>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title={<div style={{ color: '#10b981', fontWeight: 800, letterSpacing: '1px' }}><i className="fa-solid fa-fingerprint me-2"></i> IDENTITY SYNC</div>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                className="hub-modal"
            >
                <div style={{ padding: '20px 10px 10px' }}>
                    <Form layout="vertical" form={form} onFinish={handleUpdate}>
                        <Form.Item label={<span style={{ fontWeight: 600, color: '#111827' }}>Full Legal Name</span>} name="name" required>
                            <Input className="premium-input" placeholder="Enter your full name" style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                        </Form.Item>
                        <Form.Item label={<span style={{ fontWeight: 600, color: '#111827' }}>Secure Email</span>} name="email" required>
                            <Input className="premium-input" type="email" placeholder="Enter your email" style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                        </Form.Item>
                        <Form.Item label={<span style={{ fontWeight: 600, color: '#111827' }}>Contact Registry (Phone)</span>} name="phone">
                            <Input className="premium-input" placeholder="Enter your phone number" style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                        </Form.Item>
                        <div className="d-flex justify-content-end mt-4 pt-4" style={{ borderTop: '1px solid #f1f5f9' }}>
                            <button type="submit" className="glow-btn border-0">
                                Sync Registry
                            </button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </Layout>
    );
};

export default UserProfile;
