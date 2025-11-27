import React, { useState, useEffect, useContext } from "react";
import "./Dashboard.css";
import Users from "./Users";
import Orders from "./Orders";
import ChangePass from "./ChangePass";
import Category from "./Category";
import Products from "./Products";
import Support from "./Support";
import Profile from "./Profile";
import Store from "./Store";
import Payment from "./Payment";
import DeliveryBoy from "./DeliveryBoy";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import Swal from "sweetalert2";


import {
    MdDashboard,
    MdPeople,
    MdShoppingCart,
    MdCategory,
    MdInventory,
    MdSettings,
    MdSupport,
    MdKey,
    MdMenu,
    MdPersonAdd,
    MdCheckCircle,
    MdCancel,
    MdSupervisorAccount,
    MdSearch,
    MdEdit,
    MdDelete,
    MdBlock,
    MdClose,
    MdLightMode,
    MdDarkMode,
    MdLogout,
    MdPerson,
    MdStore,
    MdPayment,
    MdDeliveryDining,
    MdAttachMoney
} from "react-icons/md";

// import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);





const Dashboard = () => {
    const { user, logout, token } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activepage, setActivePage] = useState("dashboard");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [stats, setStats] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [recentActivities, setRecentActivities] = useState([]);
    const [allActivities, setAllActivities] = useState([]);
    const [showAllActivities, setShowAllActivities] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [stores, setStores] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchDashboardStats();
        fetchRecentActivities();
        fetchChartData();
    }, [token, navigate]);

    useEffect(() => {
        // Listen for store updates
        const handleStorageChange = () => {
            fetchDashboardStats();
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const fetchStores = () => {
        // Get stores from localStorage or use default data
        const storedStores = JSON.parse(localStorage.getItem('stores') || '[]');
        const defaultStores = [
            { id: 1, name: "Main Store", location: "Downtown", manager: "John Smith", phone: "9876543210", status: "active", revenue: 15000, orders: 45 },
            { id: 2, name: "Branch Store", location: "Mall Road", manager: "Jane Doe", phone: "9876543211", status: "active", revenue: 12500, orders: 38 },
            { id: 3, name: "Express Store", location: "Airport", manager: "Bob Wilson", phone: "9876543212", status: "inactive", revenue: 8200, orders: 22 }
        ];
        
        const storesData = storedStores.length > 0 ? storedStores : defaultStores;
        setStores(storesData);
        
        // Save to localStorage if using default data
        if (storedStores.length === 0) {
            localStorage.setItem('stores', JSON.stringify(defaultStores));
        }
        
        return storesData;
    };

    const fetchDashboardStats = async () => {
        try {
            const res = await API.get("/admin/dashboard/stats");
            
            // Calculate total payments from localStorage
            const payments = JSON.parse(localStorage.getItem('payments') || '[]');
            const totalPayments = payments.reduce((sum, payment) => sum + payment.total, 0);
            
            // Get stores data
            const storesData = fetchStores();
            const totalStorePayments = storesData.reduce((sum, store) => sum + (store.revenue || 0), 0);
            
            // Calculate user stats from dummy data
            const dummyUsers = [
                { _id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'user', status: 'active', createdAt: '2024-01-15T10:30:00Z' },
                { _id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'admin', status: 'active', createdAt: '2024-01-10T14:20:00Z' },
                { _id: '3', name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'user', status: 'inactive', createdAt: '2024-01-08T09:15:00Z' },
                { _id: '4', name: 'Sarah Wilson', email: 'sarah.wilson@example.com', role: 'user', status: 'active', createdAt: '2024-01-05T16:45:00Z' },
                { _id: '5', name: 'David Brown', email: 'david.brown@example.com', role: 'moderator', status: 'active', createdAt: '2024-01-03T11:30:00Z' },
                { _id: '6', name: 'Lisa Davis', email: 'lisa.davis@example.com', role: 'user', status: 'inactive', createdAt: '2023-12-28T13:20:00Z' },
                { _id: '7', name: 'Robert Miller', email: 'robert.miller@example.com', role: 'user', status: 'active', createdAt: '2023-12-25T08:10:00Z' },
                { _id: '8', name: 'Emily Garcia', email: 'emily.garcia@example.com', role: 'admin', status: 'active', createdAt: '2023-12-20T15:35:00Z' }
            ];
            
            const totalUsers = dummyUsers.length;
            const activeUsers = dummyUsers.filter(user => user.status === 'active').length;
            const inactiveUsers = dummyUsers.filter(user => user.status === 'inactive').length;
            
            // Calculate other stats
            const categories = ['milk', 'dahi', 'ghee', 'buttermilk', 'cheese', 'cream'];
            const totalCategories = categories.length;
            
            setStats({
                ...res.data, 
                totalUsers,
                activeUsers,
                inactiveUsers,
                totalPayments,
                totalCategories,
                totalProducts: 15,
                totalOrders: 25,
                totalDeliveryBoys: 8,
                totalStoreItems: 12,
                totalStores: storesData.length,
                totalStorePayments
            });
        } catch (error) {
            // console.error("Failed to fetch stats:", error);
            
            const payments = JSON.parse(localStorage.getItem('payments') || '[]');
            const totalPayments = payments.reduce((sum, payment) => sum + payment.total, 0);
            
            // Get stores data for fallback
            const storesData = fetchStores();
            const totalStorePayments = storesData.reduce((sum, store) => sum + (store.revenue || 0), 0);
            
            // Calculate user stats from dummy data for fallback
            const dummyUsers = [
                { _id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'user', status: 'active', createdAt: '2024-01-15T10:30:00Z' },
                { _id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'admin', status: 'active', createdAt: '2024-01-10T14:20:00Z' },
                { _id: '3', name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'user', status: 'inactive', createdAt: '2024-01-08T09:15:00Z' },
                { _id: '4', name: 'Sarah Wilson', email: 'sarah.wilson@example.com', role: 'user', status: 'active', createdAt: '2024-01-05T16:45:00Z' },
                { _id: '5', name: 'David Brown', email: 'david.brown@example.com', role: 'moderator', status: 'active', createdAt: '2024-01-03T11:30:00Z' },
                { _id: '6', name: 'Lisa Davis', email: 'lisa.davis@example.com', role: 'user', status: 'inactive', createdAt: '2023-12-28T13:20:00Z' },
                { _id: '7', name: 'Robert Miller', email: 'robert.miller@example.com', role: 'user', status: 'active', createdAt: '2023-12-25T08:10:00Z' },
                { _id: '8', name: 'Emily Garcia', email: 'emily.garcia@example.com', role: 'admin', status: 'active', createdAt: '2023-12-20T15:35:00Z' }
            ];
            
            const totalUsers = dummyUsers.length;
            const activeUsers = dummyUsers.filter(user => user.status === 'active').length;
            const inactiveUsers = dummyUsers.filter(user => user.status === 'inactive').length;
            
            setStats({
                totalUsers,
                activeUsers,
                inactiveUsers,
                totalAdmins: 0,
                totalPayments,
                totalCategories: 6,
                totalProducts: 15,
                totalOrders: 25,
                totalDeliveryBoys: 8,
                totalStoreItems: 12,
                totalStores: storesData.length,
                totalStorePayments
            });
        }
    };

    const fetchRecentActivities = async () => {
        try {
            const res = await API.get("/admin/recent-activities");
            setAllActivities(res.data);
            setRecentActivities(res.data.slice(0, 5));
        } catch (error) {
            // console.error("Failed to fetch activities:", error);
        }
    };

    const fetchChartData = async () => {
        try {
            const res = await API.get("/admin/chart-data");
            setChartData(res.data);
        } catch (error) {
            // console.error("Failed to fetch chart data:", error);
        }
    };

    const refreshDashboard = () => {
        fetchDashboardStats();
        fetchRecentActivities();
        fetchChartData();
    };

    const handleSearch = async (term) => {
        if (term.length < 2) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        try {
            const res = await API.get(`/admin/search?q=${term}`);
            setSearchResults(res.data);
            setShowSearchResults(true);
        } catch (error) {
            // console.error("Search failed:", error);
            setSearchResults([]);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        handleSearch(value);
    };

    const handleResultClick = (result) => {
        if (result.type === 'user') {
            setActivePage('users');
        } else if (result.type === 'order') {
            setActivePage('orders');
        } else if (result.type === 'product') {
            setActivePage('products');
        }
        setSearchTerm('');
        setShowSearchResults(false);
    };

    // theme 
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    // logout handle function
    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out from your account!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Logout",
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate("/login");
                Swal.fire("Logged Out!", "You have been logged out successfully.", "success");
            }
        });
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const renderContent = () => {
        switch (activepage) {
            case "dashboard":
                return (
                    <>
                        {/* stats card */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <MdPeople />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.totalUsers || 0}</h3>
                                    <p>Total Customers</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon active">
                                    <MdCheckCircle />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.activeUsers || 0}</h3>
                                    <p>Active Customers</p>
                                </div>
                            </div>

                            {/* <div className="stat-card">
                                <div className="stat-icon admin">
                                    <MdSupervisorAccount />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.totalAdmins || 0}</h3>
                                    <p>Total Admins</p>
                                </div>
                            </div> */}
                            <div className="stat-card">
                                <div className="stat-icon payment">
                                    <MdAttachMoney />
                                </div>
                                <div className="stat-info">
                                    <h3>₹{stats.totalPayments || 0}</h3>
                                    <p>Total Payments</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon orders">
                                    <MdShoppingCart />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.totalOrders || 0}</h3>
                                    <p>Total Orders</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon products">
                                    <MdInventory />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.totalProducts || 0}</h3>
                                    <p>Total Products</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon store">
                                    <MdStore />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.totalStores || 5}</h3>
                                    <p>Total Stores</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon store-payment">
                                    <MdPayment />
                                </div>
                                <div className="stat-info">
                                    <h3>₹{stats.totalStorePayments || 45000}</h3>
                                    <p>Store Payments</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon delivery">
                                    <MdDeliveryDining />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.totalDeliveryBoys || 8}</h3>
                                    <p>Delivery Boys</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon categories">
                                    <MdCategory />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.totalCategories || 6}</h3>
                                    <p>Categories</p>
                                </div>
                            </div>
                        </div>

                        {/* Store Details Section */}
                        <div className="store-details-section">
                            <h3>Store Overview</h3>
                            <div className="store-cards-grid">
                                {stores.map((store) => (
                                    <div key={store.id} className="store-detail-card">
                                        <div className="store-card-header">
                                            <MdStore className="store-icon" />
                                            <h4>{store.name} - {store.location}</h4>
                                        </div>
                                        <div className="store-stats">
                                            <div className="store-stat">
                                                <span className="label">Revenue:</span>
                                                <span className="value">₹{store.revenue?.toLocaleString() || '0'}</span>
                                            </div>
                                            <div className="store-stat">
                                                <span className="label">Orders:</span>
                                                <span className="value">{store.orders || 0}</span>
                                            </div>
                                            <div className="store-stat">
                                                <span className="label">Status:</span>
                                                <span className={`status ${store.status}`}>{store.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* charts and activity */}
                        {/* <div className="content-grid">
                            <div className="chart-container">
                                <div className="chart-header">
                                    <h3>Revenue Overview</h3>
                                </div>
                                <div className="chart-placeholder">
                                    {chartData.length > 0 ? (
                                        <Line
                                            data={{
                                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                                datasets: [
                                                    {
                                                        label: 'Active Users',
                                                        data: [stats.activeUsers || 0, (stats.activeUsers || 0) * 0.8, (stats.activeUsers || 0) * 1.2, (stats.activeUsers || 0) * 0.9, (stats.activeUsers || 0) * 1.1, stats.activeUsers || 0],
                                                        borderColor: '#27ae60',
                                                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                                                        tension: 0.4,
                                                        fill: true
                                                    },
                                                    {
                                                        label: 'Inactive Users',
                                                        data: [stats.inactiveUsers || 0, (stats.inactiveUsers || 0) * 1.3, (stats.inactiveUsers || 0) * 0.7, (stats.inactiveUsers || 0) * 1.1, (stats.inactiveUsers || 0) * 0.9, stats.inactiveUsers || 0],
                                                        borderColor: '#e74c3c',
                                                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                                                        tension: 0.4,
                                                        fill: true
                                                    }
                                                ]
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        display: true,
                                                        position: 'top',
                                                        labels: {
                                                            usePointStyle: true,
                                                            padding: 20
                                                        }
                                                    }
                                                },
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        grid: {
                                                            color: 'rgba(0,0,0,0.1)'
                                                        }
                                                    },
                                                    x: {
                                                        grid: {
                                                            display: false
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="no-data">
                                            <p>No data available</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="activity-container">
                                <div className="activity-header">
                                    <h3>Recent Activity</h3>
                                    <button
                                        className="view-all-btn"
                                        onClick={() => setShowAllActivities(!showAllActivities)}
                                    >
                                        {showAllActivities ? 'Show Less' : 'View All'}
                                    </button>
                                </div>
                                <div className="activity-list">
                                    {(showAllActivities ? allActivities : recentActivities).length > 0 ? (
                                        (showAllActivities ? allActivities : recentActivities).map((activity, index) => (
                                            <div key={index} className="activity-item">
                                                <div className="activity-avatar">
                                                    {activity.user.charAt(0)}
                                                </div>
                                                <div className="activity-details">
                                                    <p>
                                                        <span className="activity-user">{activity.user}</span>
                                                        &nbsp;{activity.action}
                                                    </p>
                                                    <span className="activity-time">{activity.time}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-activity">
                                            <p>No recent activities</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div> */}


                    </>
                );

            // switch case----

            case "users":
                return <Users onDataChange={refreshDashboard} />;
            case "orders":
                return <Orders />;
            case "changepassword":
                return <ChangePass />
            case "category":
                return <Category />
            case "products":
                return <Products />

            case "support":
                return <Support />
            case "profile":
                return <Profile />
            case "store":
                return <Store onStoreUpdate={refreshDashboard} />
            case "payment":
                return <Payment onPaymentUpdate={refreshDashboard} />
            case "deliveryboy":
                return <DeliveryBoy />
            default:
                return (
                    <div>
                        <h1>Page Not Found</h1>
                    </div>
                );
        }
    };

    return (
        <div
            className={`dashboard-container ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"} ${theme}-theme`}
        >
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="mobile-overlay" 
                    onClick={toggleSidebar}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999,
                        display: window.innerWidth <= 768 ? 'block' : 'none'
                    }}
                />
            )}
            <div className='sidebar' style={{ zIndex: 1000 }}>
               
                <nav className="sidebar-nav">
                    <ul>
                        <li className={activepage === "dashboard" ? "active" : ""}>
                            <a href="#dashboard" onClick={() => setActivePage("dashboard")}>
                                <MdDashboard />
                                {sidebarOpen && <span>Dashboard</span>}
                            </a>
                        </li>
                        <li className={activepage === "users" ? "active" : ""}>
                            <a href="#users" onClick={() => setActivePage("users")}>
                                <MdPeople />
                                {sidebarOpen && <span>Customers</span>}
                            </a>
                        </li>
                         <li className={activepage === "products" ? "active" : ""}>
                            <a href="#products" onClick={() => setActivePage("products")}>
                                <MdInventory />
                                {sidebarOpen && <span>Products</span>}
                            </a>
                        </li>
                        <li className={activepage === "category" ? "active" : ""}>
                            <a href="#category" onClick={() => setActivePage("category")}>
                                <MdCategory />
                                {sidebarOpen && <span>Category</span>}
                            </a>
                        </li>
                        <li className={activepage === "orders" ? "active" : ""}>
                            <a href="#orders" onClick={() => setActivePage("orders")}>
                                <MdShoppingCart />
                                {sidebarOpen && <span>Orders</span>}
                            </a>
                        </li>
                        
                       
                        <li className={activepage === "store" ? "active" : ""}>
                            <a href="#store" onClick={() => setActivePage("store")}>
                                <MdStore />
                                {sidebarOpen && <span>Store</span>}
                            </a>
                        </li>
                        <li className={activepage === "payment" ? "active" : ""}>
                            <a href="#payment" onClick={() => setActivePage("payment")}>
                                <MdPayment />
                                {sidebarOpen && <span>Payment</span>}
                            </a>
                        </li>
                        <li className={activepage === "deliveryboy" ? "active" : ""}>
                            <a href="#deliveryboy" onClick={() => setActivePage("deliveryboy")}>
                                <MdDeliveryDining />
                                {sidebarOpen && <span>Delivery Boys</span>}
                            </a>
                        </li>

                        <li className={activepage === "profile" ? "active" : ""}>
                            <a href="#profile" onClick={() => setActivePage("profile")}>
                                <MdPerson />
                                {sidebarOpen && <span>Profile</span>}
                            </a>
                        </li>
                        <li className={activepage === "changepassword" ? "active" : ""}>
                            <a href="#changepassword" onClick={() => setActivePage("changepassword")}>
                                <MdKey />
                                {sidebarOpen && <span>Change Password</span>}
                            </a>
                        </li>
                        <li className="logout-item">
                            <a href="#logout" onClick={handleLogout}>
                                <MdLogout />
                                {sidebarOpen && <span>Logout</span>}
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="main-content">
                <header className="dashboard-header">
                    <div className="header-left">
                        <button className="menu-toggle" onClick={toggleSidebar}>
                            <MdMenu />
                        </button>
                        <div>
                            <h3>Welcome back, <span style={{ color: "#ff8600" }}>{user?.name || 'Admin'}</span></h3>
                            <p>Here's what's happening with your store today</p>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="theme-toggle">
                            <button 
                                className="theme-btn" 
                                onClick={toggleTheme}
                                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                            >
                                {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
                            </button>
                        </div>
                        <div className="user-menu">
                         <div
                                className="user-avatar"
                                onClick={() => setActivePage("profile")}
                            >
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                           
                            {isFormOpen && (
                                <div className="popup-form">
                                    <button
                                        className="close-btn"
                                        onClick={() => setIsFormOpen(false)}
                                    >
                                        ✕
                                    </button>
                                    <h3>Hello, <span style={{ color: "blue" }}>{user?.name || 'Admin'}</span></h3>
                                    <p>{user?.email || ''}</p>
                                    <button className="logout-btn" onClick={handleLogout} style={{
                                        background: "#d33",
                                        color: "white",
                                        border: "none",
                                        padding: "8px 16px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontWeight: "bold"
                                    }}>Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                {renderContent()}
            </div>
        </div>
    );
};

export default Dashboard;
