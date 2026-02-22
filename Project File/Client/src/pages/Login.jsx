import React from "react";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AuthStyles.css";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //form handler
    const onfinishHandler = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post("/api/v1/user/login", values);
            dispatch(hideLoading());
            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                message.success("Login Successfully");
                navigate("/");
                window.location.reload();
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
        <div className="auth-container">
            <div className="auth-banner">
                <div className="banner-content">
                    <h2>Welcome Back</h2>
                    <p>Your health is our priority. Log in to manage your appointments and connect with top doctors seamlessly.</p>
                </div>
            </div>
            <div className="auth-form-section">
                <div className="glass-card">
                    <div className="auth-card">
                        <h3>Login</h3>
                        <p className="subtitle">Enter your credentials to access your account</p>
                        <Form
                            layout="vertical"
                            onFinish={onfinishHandler}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, type: 'email', message: 'Please enter your email' }]}
                            >
                                <Input className="premium-input" placeholder="example@mail.com" />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please enter your password' }]}
                            >
                                <Input.Password className="premium-input" placeholder="Enter your password" />
                            </Form.Item>

                            <button className="premium-btn" type="submit">
                                Sign In
                            </button>

                            <Link to="/register" className="auth-link">
                                New here? Create an account
                            </Link>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
