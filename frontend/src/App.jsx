import { useEffect, useState } from "react";
import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportIssue from "./pages/ReportIssue";
import Issues from "./pages/Issues";
import Admin from "./pages/Admin";
import About from "./pages/About";
import MyReports from "./pages/MyReports";
import Notifications from "./pages/Notifications";
import { API_BASE_URL } from "./api";
import "./App.css";

function AppShell({ user, setUser }) {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    imageUrl: "",
    address: "",
  });

  const token = localStorage.getItem("token");

  const fetchIssues = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/issues`);
    setIssues(res.data);
  };

  const fetchNotifications = async () => {
    if (!user || !token) {
      setNotifications([]);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (error) {
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setNotifications([]);
    navigate("/login");
  };

  const suggestCategory = (text) => {
    const value = text.toLowerCase();

    if (value.includes("pothole") || value.includes("road")) return "Pothole";
    if (value.includes("garbage") || value.includes("trash") || value.includes("waste")) return "Garbage";
    if (value.includes("light") || value.includes("streetlight")) return "Streetlight";
    if (value.includes("water") || value.includes("leak")) return "Water Leakage";
    if (value.includes("drain") || value.includes("sewer")) return "Drainage";

    return "";
  };

  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    const suggestedCategory = suggestCategory(description);

    setForm({
      ...form,
      description,
      category: suggestedCategory || form.category,
    });
  };

  const hasDuplicateIssue = () => {
    const currentAddress = form.address.trim().toLowerCase();

    return issues.some((issue) => {
      const issueAddress = issue.location?.address?.trim().toLowerCase();

      return (
        issue.category === form.category &&
        issueAddress === currentAddress &&
        issue.status !== "Resolved"
      );
    });
  };

  const submitIssue = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login before reporting an issue");
      navigate("/login");
      return;
    }

    if (hasDuplicateIssue()) {
      alert("Similar active issue already exists. Please support the existing issue instead.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/issues`,
        {
          title: form.title,
          description: form.description,
          category: form.category,
          imageUrl: form.imageUrl,
          location: { address: form.address },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      alert(error.response?.data?.message || "Issue submission failed");
      return;
    }

    setForm({
      title: "",
      description: "",
      category: "",
      imageUrl: "",
      address: "",
    });

    fetchIssues();
    alert("Issue reported successfully");
    navigate("/issues");
  };

  const updateStatus = async (id, status, adminNote = "") => {
    await axios.patch(
      `${API_BASE_URL}/api/issues/${id}/status`,
      { status, adminNote },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchIssues();
  };

  const markNotificationRead = async (id) => {
    await axios.patch(
      `${API_BASE_URL}/api/notifications/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchNotifications();
  };

  const markAllNotificationsRead = async () => {
    await axios.patch(
      `${API_BASE_URL}/api/notifications/read-all`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchNotifications();
  };

  const upvoteIssue = async (id) => {
    if (!user) {
      alert("Please login before supporting an issue");
      navigate("/login");
      return;
    }

    try {
      await axios.patch(
        `${API_BASE_URL}/api/issues/${id}/upvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchIssues();
    } catch (error) {
      alert(error.response?.data?.message || "Support failed");
    }
  };

  const addComment = async (id, text) => {
    if (!user) {
      alert("Please login before commenting");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/issues/${id}/comments`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchIssues();
    } catch (error) {
      alert(error.response?.data?.message || "Comment failed");
    }
  };

  const addFeedback = async (id, rating, comment) => {
    if (!user) {
      alert("Please login before giving feedback");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/issues/${id}/feedback`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchIssues();
    } catch (error) {
      alert(error.response?.data?.message || "Feedback failed");
    }
  };

  const deleteIssue = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this issue?");
    if (!confirmDelete) return;

    await axios.delete(`${API_BASE_URL}/api/issues/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchIssues();
  };

  const isIssueSupported = (issue) => {
    if (!user) return false;

    return (issue.supportedBy || []).some((supporter) => {
      const supporterId = supporter?._id || supporter;
      return supporterId.toString() === user.id;
    });
  };

  const totalIssues = issues.length;
  const reportedCount = issues.filter((issue) => issue.status === "Reported").length;
  const inProgressCount = issues.filter((issue) => issue.status === "In Progress").length;
  const resolvedCount = issues.filter((issue) => issue.status === "Resolved").length;
  const highPriorityCount = issues.filter((issue) => issue.priorityScore >= 20).length;
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const filteredIssues = issues.filter((issue) => {
    const searchValue = searchText.toLowerCase();

    const matchesSearch =
      issue.title.toLowerCase().includes(searchValue) ||
      issue.description.toLowerCase().includes(searchValue) ||
      issue.location?.address?.toLowerCase().includes(searchValue);

    const matchesCategory = categoryFilter === "" || issue.category === categoryFilter;
    const matchesStatus = statusFilter === "" || issue.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <>
      <nav className="nav-bar">
        <Link className="brand-link" to="/">CivicFix</Link>

        <div className="nav-links">
          <NavLink end to="/">Dashboard</NavLink>
          <NavLink to="/report">Report</NavLink>
          <NavLink to="/my-reports">My Reports</NavLink>
          <NavLink to="/issues">Issues</NavLink>
          {user && (
            <NavLink className="notification-link" to="/notifications">
              Notifications
              {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
            </NavLink>
          )}
          {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
          <NavLink to="/about">About</NavLink>
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-chip">{user.name} ({user.role})</span>
              <button type="button" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              totalIssues={totalIssues}
              reportedCount={reportedCount}
              inProgressCount={inProgressCount}
              resolvedCount={resolvedCount}
              highPriorityCount={highPriorityCount}
              issues={issues}
            />
          }
        />

        <Route
          path="/report"
          element={
            <ReportIssue
              user={user}
              form={form}
              setForm={setForm}
              submitIssue={submitIssue}
              handleDescriptionChange={handleDescriptionChange}
            />
          }
        />

        <Route
          path="/my-reports"
          element={
            <MyReports
              user={user}
              issues={issues}
              addComment={addComment}
              addFeedback={addFeedback}
            />
          }
        />

        <Route
          path="/issues"
          element={
            <Issues
              user={user}
              filteredIssues={filteredIssues}
              searchText={searchText}
              setSearchText={setSearchText}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              upvoteIssue={upvoteIssue}
              isIssueSupported={isIssueSupported}
              addComment={addComment}
              addFeedback={addFeedback}
            />
          }
        />

        <Route
          path="/admin"
          element={
            <Admin
              user={user}
              filteredIssues={filteredIssues}
              searchText={searchText}
              setSearchText={setSearchText}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              updateStatus={updateStatus}
              deleteIssue={deleteIssue}
            />
          }
        />

        <Route
          path="/notifications"
          element={
            <Notifications
              user={user}
              notifications={notifications}
              markNotificationRead={markNotificationRead}
              markAllNotificationsRead={markAllNotificationsRead}
            />
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <BrowserRouter>
      <div className="app">
        <AppShell user={user} setUser={setUser} />
      </div>
    </BrowserRouter>
  );
}

export default App;
