import React from "react";
import { Form, Input, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import "../styles/AuthStyles.css";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //form handler
    const onfinishHandler = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post("/api/v1/user/register", values);
            dispatch(hideLoading());
            if (res.data.success) {
                message.success("Register Successfully!");
                navigate("/login");
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            const errorMessage = error.response?.data?.message || "Something Went Wrong";
            message.error(errorMessage);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-banner">
                <div className="banner-content">
                    <h2>Join Our Community</h2>
                    <p>Start your journey to better health. Register today to find and book appointments with world-class specialists.</p>
                </div>
            </div>
            <div className="auth-form-section">
                <div className="glass-card">
                    <div className="auth-card">
                        <h3>Create Account</h3>
                        <p className="subtitle">Fill in the details below to get started</p>
                        <Form
                            layout="vertical"
                            onFinish={onfinishHandler}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Full Name"
                                name="name"
                                rules={[{ required: true, message: 'Please enter your name' }]}
                            >
                                <Input className="premium-input" placeholder="e.g. John Doe" />
                            </Form.Item>

                            <Form.Item
                                label="Email Address"
                                name="email"
                                rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                            >
                                <Input className="premium-input" placeholder="example@mail.com" />
                            </Form.Item>

                            <Form.Item
                                label="Phone Number"
                                name="phone"
                                rules={[{ required: true, message: 'Please enter your phone number' }]}
                            >
                                <Input className="premium-input" placeholder="+1 234 567 890" />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please create a password' }]}
                            >
                                <Input.Password className="premium-input" placeholder="Create a strong password" />
                            </Form.Item>

                            <button className="premium-btn" type="submit">
                                Register Now
                            </button>

                            <Link to="/login" className="auth-link">
                                Already have an account? Login here
                            </Link>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
