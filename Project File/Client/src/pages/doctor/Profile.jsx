import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Col, Form, Input, Row, TimePicker, message, Button, Upload } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import { setUser } from "../../redux/features/userSlice";
import moment from "moment";
import "../../styles/DashboardStyles.css";

const Profile = () => {
    const { user } = useSelector((state) => state.user);
    const [doctor, setDoctor] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleUpload = async (info) => {
        const { file } = info;
        if (file.status === 'done' || file.originFileObj) {
            const base64 = await getBase64(file.originFileObj || file);
            setImageUrl(base64);
        }
    };

    const handleFinish = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/doctor/updateProfile",
                {
                    ...values,
                    userId: user._id,
                    profileImage: imageUrl || doctor.profileImage,
                    timings: [
                        moment(values.timings[0]).format("HH:mm"),
                        moment(values.timings[1]).format("HH:mm"),
                    ],
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
                dispatch(setUser({ ...user, profileImage: imageUrl || res.data.data.profileImage }));
                navigate("/");
            } else {
                message.error(res.data.success);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error("Something Went Wrong ");
        }
    };

    const getDoctorInfo = async () => {
        try {
            const res = await axios.post(
                "/api/v1/doctor/getDoctorInfo",
                { userId: params.id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                setDoctor(res.data.data);
                if (res.data.data.profileImage) {
                    setImageUrl(res.data.data.profileImage);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDoctorInfo();
        // eslint-disable-next-line
    }, []);

    return (
        <Layout>
            <div className="dashboard-wrapper">
                <div className="page-hero">
                    <h1>Specialist Hub <span className="pulse-emerald"></span></h1>
                    <p>Advanced administrative interface for specialized healthcare practitioners.</p>
                </div>

                {doctor && (
                    <Form
                        layout="vertical"
                        onFinish={handleFinish}
                        initialValues={{
                            ...doctor,
                            timings: doctor?.timings ? [
                                moment(doctor.timings[0], "HH:mm"),
                                moment(doctor.timings[1], "HH:mm"),
                            ] : [],
                        }}
                    >
                        <div className="profile-bento-grid">
                            {/* Biometric Credentials Hub */}
                            <div className="hub-card bento-4">
                                <div className="hub-label">Biometric Verification</div>
                                <div className="status-ring">
                                    <Upload
                                        name="avatar"
                                        listType="picture-circle"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        onChange={handleUpload}
                                        style={{ border: 'none', background: 'transparent' }}
                                    >
                                        {imageUrl ? (
                                            <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            <div className="d-flex flex-column align-items-center">
                                                <i className="fa-solid fa-user-doctor" style={{ fontSize: '2.5rem', color: '#10b981' }}></i>
                                            </div>
                                        )}
                                    </Upload>
                                </div>
                                <div className="text-center">
                                    <h3 className="hub-title mb-1">Dr. {doctor.firstName}</h3>
                                    <div style={{ color: '#10b981', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1px' }}>
                                        AUTH LEVEL: HCP SPECIALIST
                                    </div>
                                </div>
                                <div className="mt-auto pt-4">
                                    <button className="glow-btn w-100" type="submit">Sync Registry</button>
                                </div>
                            </div>

                            {/* Professional Identity Module */}
                            <div className="hub-card bento-8">
                                <div className="hub-label">Professional Registry</div>
                                <h3 className="hub-title">Identity Credentials</h3>
                                <Row gutter={24}>
                                    <Col xs={24} md={12}>
                                        <Form.Item label="First Identification" name="firstName" required>
                                            <Input className="premium-input" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item label="Last Identification" name="lastName" required>
                                            <Input className="premium-input" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item label="Clinical Contact" name="phone" required>
                                            <Input className="premium-input" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item label="Secure Email" name="email" required>
                                            <Input className="premium-input" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>

                            {/* Specialist Credentials Hub */}
                            <div className="hub-card bento-6">
                                <div className="hub-label">Clinical Data</div>
                                <h3 className="hub-title">Specialization & Status</h3>
                                <Row gutter={24}>
                                    <Col xs={24} md={12}>
                                        <Form.Item label="HCP Specialization" name="specialization" required>
                                            <Input className="premium-input" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item label="Years Established" name="experience" required>
                                            <Input className="premium-input" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24}>
                                        <Form.Item label="Clinical Facility Address" name="address" required>
                                            <Input className="premium-input" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>

                            {/* Operational Access Hub */}
                            <div className="hub-card bento-6">
                                <div className="hub-label">Operational Hub</div>
                                <h3 className="hub-title">Access & Schedule</h3>
                                <Row gutter={24}>
                                    <Col xs={24} md={12}>
                                        <Form.Item label="Consultation Fee (₹)" name="feesPerCunsaltation" required>
                                            <Input className="premium-input" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item label="Active Registry Timings" name="timings" required>
                                            <TimePicker.RangePicker format="HH:mm" className="premium-input w-100" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24}>
                                        <Form.Item label="Medical Portfolio Web-URL" name="website">
                                            <Input className="premium-input" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <div className="mt-auto pt-4 d-flex justify-content-between align-items-center">
                                    <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
                                        <i className="fa-solid fa-fingerprint me-2" style={{ color: '#10b981' }}></i>
                                        L2 Authorization Active
                                    </div>
                                    <Link to="/" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', textDecoration: 'none' }}>SYSTEM DASHBOARD</Link>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </div>
        </Layout>
    );
};

export default Profile;
