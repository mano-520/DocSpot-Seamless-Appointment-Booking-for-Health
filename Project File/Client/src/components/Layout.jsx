import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu, doctorMenu } from "../Data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";

const Layout = ({ children }) => {
    const { user } = useSelector((state) => state.user);
    const location = useLocation();
    const navigate = useNavigate();

    // logout funtion
    const handleLogout = () => {
        localStorage.clear();
        message.success("Logout Successfully");
        navigate("/login");
    };

    // rendering menu list
    const SidebarMenu = user?.isAdmin
        ? adminMenu
        : user?.isDoctor
            ? doctorMenu
            : userMenu;

    // Doctor menu profile path fix
    if (user?.isDoctor) {
        const profileItem = doctorMenu.find(item => item.name === 'Profile');
        if (profileItem) profileItem.path = `/doctor/profile/${user?._id}`;
    }

    return (
        <div className="main">
            <div className="layout">
                {/* Elite Top Navbar */}
                <header className="navbar">
                    <div className="nav-brand">
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <h6 className="logo-text">DocSpot</h6>
                        </Link>
                    </div>

                    <nav className="nav-links">
                        {SidebarMenu.map((menu) => {
                            const isActive = location.pathname === menu.path || (menu.name === 'Profile' && location.pathname.includes('/doctor/profile'));
                            return (
                                <Link
                                    className={`nav-item ${isActive ? "active" : ""}`}
                                    key={menu.name}
                                    to={menu.path}
                                >
                                    <i className={menu.icon}></i>
                                    <span>{menu.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="nav-actions">
                        <Badge
                            count={user && user.notification.length}
                            onClick={() => navigate("/notification")}
                            className="notification-badge"
                        >
                            <i className="fa-solid fa-bell"></i>
                        </Badge>

                        <Link
                            to={user?.isDoctor ? `/doctor/profile/${user?._id}` : "/profile"}
                            className="user-profile-trigger"
                        >
                            <div className="text-end d-none d-md-block" style={{ lineHeight: '1.2' }}>
                                <div style={{ fontSize: '0.9rem', color: '#111827', fontWeight: 700 }}>{user?.name}</div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                                    {user?.isAdmin ? 'ADMIN' : user?.isDoctor ? 'SPECIALIST' : 'PATIENT'}
                                </div>
                            </div>
                            {user?.profileImage ? (
                                <img src={user?.profileImage} alt="profile" className="user-avatar" />
                            ) : (
                                <div className="user-avatar-placeholder">
                                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                            )}
                        </Link>

                        <div className="logout-btn" onClick={handleLogout}>
                            <i className="fa-solid fa-power-off"></i>
                            <span className="d-none d-lg-inline">Logout</span>
                        </div>
                    </div>
                </header>

                <main className="content">
                    <div className="body">{children}</div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
