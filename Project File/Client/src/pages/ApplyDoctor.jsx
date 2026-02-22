import React, { useState } from "react";
import Layout from "../components/Layout";
import { Col, Form, Input, Row, TimePicker, message, Steps, Button, Upload } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import moment from "moment";
import RegistrationSVG from "../components/RegistrationSVG";
import "../styles/DashboardStyles.css";

const ApplyDoctor = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState("");

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
            form.setFieldsValue({ profileImage: base64 });
        }
    };

    const next = async () => {
        try {
            // Validate only fields in the current step
            const fields = currentStep === 0
                ? ["firstName", "lastName", "phone", "email", "address", "profileImage"]
                : ["specialization", "experience", "feesPerCunsaltation", "timings"];

            await form.validateFields(fields);
            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.log("Validation failed:", error);
            // Don't proceed to next step if validation fails
        }
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    //handle form submission
    const handleFinish = async () => {
        try {
            // Consolidation: Validate ALL fields and get their values
            const values = await form.validateFields();

            console.log("Submitting Specialist Application:", {
                ...values,
                timings: values.timings ? [
                    moment(values.timings[0].toDate()).format("HH:mm"),
                    moment(values.timings[1].toDate()).format("HH:mm"),
                ] : "MISSING"
            });

            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/user/apply-doctor",
                {
                    ...values,
                    userId: user._id,
                    timings: values.timings ? [
                        moment(values.timings[0].toDate()).format("HH:mm"),
                        moment(values.timings[1].toDate()).format("HH:mm"),
                    ] : undefined,
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
                navigate("/");
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

    const steps = [
        {
            title: 'Personal Info',
            content: (
                <div className="fade-in">
                    <div className="section-title">
                        <i className="fa-solid fa-user-doctor"></i> Personal Information
                    </div>

                    <div className="d-flex justify-content-center mb-4">
                        <Form.Item name="profileImage" required rules={[{ required: true, message: 'Profile photo is required' }]}>
                            <Upload
                                name="avatar"
                                listType="picture-circle"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // Mock endpoint
                                onChange={handleUpload}
                                beforeUpload={(file) => {
                                    const isLt2M = file.size / 1024 / 1024 < 2;
                                    if (!isLt2M) {
                                        message.error('Image must be smaller than 2MB!');
                                    }
                                    return isLt2M;
                                }}
                            >
                                {imageUrl ? (
                                    <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <div className="d-flex flex-column align-items-center">
                                        <i className="fa-solid fa-camera mb-2" style={{ fontSize: '1.5rem', color: '#003366' }}></i>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#003366' }}>UPLOAD PHOTO</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </div>

                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item label="First Name" name="firstName" required rules={[{ required: true, message: 'First name is required' }]}>
                                <Input className="premium-input" placeholder="e.g. John" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Last Name" name="lastName" required rules={[{ required: true, message: 'Last name is required' }]}>
                                <Input className="premium-input" placeholder="e.g. Doe" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Contact Phone" name="phone" required rules={[{ required: true, message: 'Phone number is required' }]}>
                                <Input className="premium-input" placeholder="+1 (555) 000-0000" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Professional Email" name="email" required rules={[{ required: true, type: 'email', message: 'Valid email is required' }]}>
                                <Input className="premium-input" type="email" placeholder="john.doe@medical.com" />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item label="Clinic Address" name="address" required rules={[{ required: true, message: 'Address is required' }]}>
                                <Input.TextArea rows={3} className="premium-input" placeholder="123 Health St, Medical Center" />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item label="Website (Optional)" name="website">
                                <Input className="premium-input" placeholder="https://www.yourclinic.com" />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            ),
        },
        {
            title: 'Professional',
            content: (
                <div className="fade-in">
                    <div className="section-title">
                        <i className="fa-solid fa-graduation-cap"></i> Professional Credentials
                    </div>
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item label="Specialization" name="specialization" required rules={[{ required: true, message: 'Specialization is required' }]}>
                                <Input className="premium-input" placeholder="e.g. Cardiology" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Experience (Years)" name="experience" required rules={[{ required: true, message: 'Experience is required' }]}>
                                <Input className="premium-input" placeholder="e.g. 10" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Consultation Fee (₹)" name="feesPerCunsaltation" required rules={[{ required: true, message: 'Fee is required' }]}>
                                <Input className="premium-input" type="number" placeholder="500" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Daily Timings" name="timings" required rules={[{ required: true, message: 'Timings are required' }]}>
                                <TimePicker.RangePicker
                                    format="HH:mm"
                                    className="premium-input w-100"
                                    placeholder={["Start", "End"]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div className="info-card mt-4" style={{ background: '#eff6ff' }}>
                        <h5 style={{ color: '#1e40af' }}>Verification Notice</h5>
                        <p style={{ fontSize: '0.9rem', color: '#1e3a8a', fontWeight: 500 }}>
                            By submitting this application, you agree to our verification process. Our admin team will review your credentials within 24-48 business hours.
                        </p>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <div className="dashboard-wrapper">
                <div className="page-hero">
                    <h1>Join Our Medical Network</h1>
                    <p>Register as a specialist to provide world-class healthcare to thousands of patients.</p>
                </div>

                <div className="form-card p-0" style={{ overflow: 'hidden' }}>
                    <div className="wizard-container">
                        <div className="wizard-illustration">
                            <div style={{ width: '100%', maxWidth: '350px' }}>
                                <RegistrationSVG />
                            </div>
                            <div className="text-center mt-4">
                                <h4 style={{ color: '#003366', fontWeight: 700 }}>Expert Onboarding</h4>
                                <p className="text-muted">Start your journey into modern digital healthcare today.</p>
                            </div>
                        </div>

                        <div className="wizard-form-section">
                            <div className="wizard-steps-wrapper">
                                <Steps current={currentStep} items={steps.map(item => ({ title: item.title }))} size="small" />
                            </div>

                            <Form
                                layout="vertical"
                                onFinish={handleFinish}
                                form={form}
                                preserve={true}
                                className="step-content"
                            >
                                <div className={currentStep === 0 ? "fade-in" : "d-none"}>
                                    <div className="section-title">
                                        <i className="fa-solid fa-user-doctor"></i> Personal Information
                                    </div>

                                    <div className="d-flex justify-content-center mb-4">
                                        <Form.Item name="profileImage" required rules={[{ required: true, message: 'Profile photo is required' }]}>
                                            <Upload
                                                name="avatar"
                                                listType="picture-circle"
                                                className="avatar-uploader"
                                                showUploadList={false}
                                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                onChange={handleUpload}
                                                beforeUpload={(file) => {
                                                    const isLt2M = file.size / 1024 / 1024 < 2;
                                                    if (!isLt2M) {
                                                        message.error('Image must be smaller than 2MB!');
                                                    }
                                                    return isLt2M;
                                                }}
                                            >
                                                {imageUrl ? (
                                                    <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div className="d-flex flex-column align-items-center">
                                                        <i className="fa-solid fa-camera mb-2" style={{ fontSize: '1.5rem', color: '#003366' }}></i>
                                                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#003366' }}>UPLOAD PHOTO</div>
                                                    </div>
                                                )}
                                            </Upload>
                                        </Form.Item>
                                    </div>

                                    <Row gutter={24}>
                                        <Col xs={24} md={12}>
                                            <Form.Item label="First Name" name="firstName" required rules={[{ required: true, message: 'First name is required' }]}>
                                                <Input className="premium-input" placeholder="e.g. John" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item label="Last Name" name="lastName" required rules={[{ required: true, message: 'Last name is required' }]}>
                                                <Input className="premium-input" placeholder="e.g. Doe" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item label="Contact Phone" name="phone" required rules={[{ required: true, message: 'Phone number is required' }]}>
                                                <Input className="premium-input" placeholder="+1 (555) 000-0000" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item label="Professional Email" name="email" required rules={[{ required: true, type: 'email', message: 'Valid email is required' }]}>
                                                <Input className="premium-input" type="email" placeholder="john.doe@medical.com" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24}>
                                            <Form.Item label="Clinic Address" name="address" required rules={[{ required: true, message: 'Address is required' }]}>
                                                <Input.TextArea rows={3} className="premium-input" placeholder="123 Health St, Medical Center" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24}>
                                            <Form.Item label="Website (Optional)" name="website">
                                                <Input className="premium-input" placeholder="https://www.yourclinic.com" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                <div className={currentStep === 1 ? "fade-in" : "d-none"}>
                                    <div className="section-title">
                                        <i className="fa-solid fa-graduation-cap"></i> Professional Credentials
                                    </div>
                                    <Row gutter={24}>
                                        <Col xs={24} md={12}>
                                            <Form.Item label="Specialization" name="specialization" required rules={[{ required: true, message: 'Specialization is required' }]}>
                                                <Input className="premium-input" placeholder="e.g. Cardiology" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item label="Experience (Years)" name="experience" required rules={[{ required: true, message: 'Experience is required' }]}>
                                                <Input className="premium-input" placeholder="e.g. 10" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item label="Consultation Fee (₹)" name="feesPerCunsaltation" required rules={[{ required: true, message: 'Fee is required' }]}>
                                                <Input className="premium-input" type="number" placeholder="500" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item label="Daily Timings" name="timings" required rules={[{ required: true, message: 'Timings are required' }]}>
                                                <TimePicker.RangePicker
                                                    format="HH:mm"
                                                    className="premium-input w-100"
                                                    placeholder={["Start", "End"]}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <div className="info-card mt-4" style={{ background: '#eff6ff' }}>
                                        <h5 style={{ color: '#1e40af' }}>Verification Notice</h5>
                                        <p style={{ fontSize: '0.9rem', color: '#1e3a8a', fontWeight: 500 }}>
                                            By submitting this application, you agree to our verification process. Our admin team will review your credentials within 24-48 business hours.
                                        </p>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between mt-5 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
                                    {currentStep > 0 && (
                                        <Button className="premium-input px-4 d-flex align-items-center" style={{ height: '45px' }} onClick={prev}>
                                            <i className="fa-solid fa-arrow-left me-2"></i> Previous
                                        </Button>
                                    )}

                                    {currentStep < steps.length - 1 ? (
                                        <Button
                                            type="primary"
                                            className="form-submit-btn m-0 w-auto px-5"
                                            style={{ height: '45px' }}
                                            onClick={next}
                                        >
                                            Next Step <i className="fa-solid fa-arrow-right ms-2"></i>
                                        </Button>
                                    ) : (
                                        <Button
                                            type="primary"
                                            className="form-submit-btn m-0 w-auto px-5"
                                            style={{ height: '45px' }}
                                            htmlType="submit"
                                        >
                                            Submit Application <i className="fa-solid fa-paper-plane ms-2"></i>
                                        </Button>
                                    )}
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ApplyDoctor;
