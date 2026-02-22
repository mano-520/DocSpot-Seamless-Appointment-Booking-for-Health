import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table, message } from "antd";

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);

    //getUsers
    const getDoctors = async () => {
        try {
            const res = await axios.get("/api/v1/admin/getAllDoctors", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.data.success) {
                const doctorsData = res.data.data.map((doc) => ({ ...doc, key: doc._id }));
                setDoctors(doctorsData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // handle account
    const handleAccountStatus = async (record, status) => {
        try {
            const res = await axios.post(
                "/api/v1/admin/changeAccountStatus",
                {
                    doctorId: record._id,
                    userId: record.userId,
                    status: status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                message.success(res.data.message);
                window.location.reload();
            }
        } catch (error) {
            message.error("Something Went Wrong");
        }
    };

    useEffect(() => {
        getDoctors();
    }, []);

    const columns = [
        {
            title: "Photo",
            dataIndex: "profileImage",
            render: (text, record) => (
                <div className="doctor-avatar-circle p-0" style={{ width: '40px', height: '40px', fontSize: '1rem', overflow: 'hidden' }}>
                    {record.profileImage ? (
                        <img src={record.profileImage} alt="doctor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        record.firstName[0]
                    )}
                </div>
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            render: (text, record) => (
                <span>
                    {record.firstName} {record.lastName}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
        },
        {
            title: "phone",
            dataIndex: "phone",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
                <div className="d-flex">
                    {record.status === "pending" && (
                        <>
                            <button
                                className="btn btn-success"
                                onClick={() => handleAccountStatus(record, "approved")}
                            >
                                Approve
                            </button>
                            <button
                                className="btn btn-danger ms-2"
                                onClick={() => handleAccountStatus(record, "rejected")}
                            >
                                Reject
                            </button>
                        </>
                    )}
                    {record.status === "rejected" && (
                        <button
                            className="btn btn-success"
                            onClick={() => handleAccountStatus(record, "approved")}
                        >
                            Approve
                        </button>
                    )}
                    {record.status === "approved" && (
                        <span className="text-success">Authorized</span>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <h1 className="text-center m-2">All Doctors</h1>
            <Table columns={columns} dataSource={doctors} rowKey="_id" />
        </Layout>
    );
};

export default Doctors;
