import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table, message } from "antd";

const Users = () => {
    const [users, setUsers] = useState([]);

    //getUsers
    const getUsers = async () => {
        try {
            const res = await axios.get("/api/v1/admin/getAllUsers", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.data.success) {
                const filteredUsers = res.data.data.filter(user => !user.isAdmin);
                setUsers(filteredUsers);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    // handle user status
    const handleAccountStatus = async (record, status) => {
        try {
            const res = await axios.post(
                "/api/v1/admin/change-user-status",
                {
                    targetUserId: record._id,
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
                getUsers();
            }
        } catch (error) {
            console.log(error);
            message.error("Something Went Wrong");
        }
    };

    // antD table col
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text, record) => (
                <span style={{ color: record.status === "blocked" ? "red" : "green" }}>
                    {record.status}
                </span>
            ),
        },
        {
            title: "Doctor",
            dataIndex: "isDoctor",
            render: (text, record) => <span>{record.isDoctor ? "Yes" : "No"}</span>,
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
                <div className="d-flex">
                    {record.status === "blocked" ? (
                        <button
                            className="btn btn-success"
                            onClick={() => handleAccountStatus(record, "active")}
                        >
                            Unblock
                        </button>
                    ) : (
                        <button
                            className="btn btn-danger"
                            onClick={() => handleAccountStatus(record, "blocked")}
                        >
                            Block
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <h1 className="text-center m-2">Users List</h1>
            <Table columns={columns} dataSource={users} rowKey="_id" />
        </Layout>
    );
};

export default Users;
