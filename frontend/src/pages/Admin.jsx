import { useState } from "react";

function Admin({
  user,
  filteredIssues,
  searchText,
  setSearchText,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  updateStatus,
  deleteIssue,
}) {
  const [adminNotes, setAdminNotes] = useState({});
  const [adminStatuses, setAdminStatuses] = useState({});

  const handleNoteChange = (id, value) => {
    setAdminNotes({
      ...adminNotes,
      [id]: value,
    });
  };

  const handleStatusChange = (id, value) => {
    setAdminStatuses({
      ...adminStatuses,
      [id]: value,
    });
  };

  const handleSaveUpdate = async (issue) => {
    try {
      await updateStatus(
        issue._id,
        adminStatuses[issue._id] || issue.status,
        adminNotes[issue._id] ?? issue.adminNote ?? ""
      );

      alert("Admin update saved successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Admin update failed");
    }
  };

  const getStatusClass = (status) => {
    return `status-badge ${status.toLowerCase().replaceAll(" ", "-")}`;
  };

  if (!user) {
    return (
      <section className="issues-section">
        <h2>Admin Panel</h2>
        <p className="notice-text">Please login as admin to access this page.</p>
      </section>
    );
  }

  if (user.role !== "admin") {
    return (
      <section className="issues-section">
        <h2>Admin Panel</h2>
        <p className="notice-text">Only admin users can access this page.</p>
      </section>
    );
  }

  return (
    <section className="issues-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Official workspace</span>
          <h2>Admin Panel</h2>
          <p className="section-subtitle">
            Review citizen reports, write official responses, and update progress status.
          </p>
        </div>
      </div>

      <div className="filters">
        <input
          placeholder="Search by title, description, or address"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All categories</option>
          <option value="Pothole">Pothole</option>
          <option value="Garbage">Garbage</option>
          <option value="Streetlight">Streetlight</option>
          <option value="Water Leakage">Water Leakage</option>
          <option value="Drainage">Drainage</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="Reported">Reported</option>
          <option value="Verified">Verified</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {filteredIssues.length === 0 ? (
        <p className="empty-text">No issues found.</p>
      ) : (
        <div className="admin-list">
          {filteredIssues.map((issue) => (
            <article className="issue-card admin-card" key={issue._id}>
              <div className="admin-issue-info">
                {issue.imageUrl && (
                  <img className="issue-image" src={issue.imageUrl} alt={issue.title} />
                )}

                <div className="issue-card-top">
                  <div>
                    <h3>{issue.title}</h3>
                    <p>{issue.description}</p>
                  </div>
                  <span className={getStatusClass(issue.status)}>{issue.status}</span>
                </div>

                <div className="meta">
                  <span>{issue.category}</span>
                  <span>{issue.location?.address}</span>
                </div>

                {issue.reportedBy?.name && (
                  <p className="reported-by">Reported by: {issue.reportedBy.name}</p>
                )}

                {issue.adminNote && (
                  <p className="admin-note">Current response: {issue.adminNote}</p>
                )}

                <div className="compact-stats">
                  <span>Upvotes: {issue.upvotes}</span>
                  <span>Priority: {issue.priorityScore}</span>
                </div>
              </div>

              <div className="admin-control-panel">
                <div>
                  <span className="eyebrow">Admin action</span>
                  <h4>Update citizen communication</h4>
                </div>

              <div className="admin-tools">
                <label>
                  Admin response to citizen
                  <textarea
                    placeholder="Example: Work will start within 2 days. Our team has verified this location."
                    value={adminNotes[issue._id] ?? issue.adminNote ?? ""}
                    onChange={(e) => handleNoteChange(issue._id, e.target.value)}
                  />
                </label>

                <label>
                  Status
                  <select
                    className="status-select"
                    value={adminStatuses[issue._id] || issue.status}
                    onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                  >
                    <option value="Reported">Reported</option>
                    <option value="Verified">Verified</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </label>
              </div>

              <div className="issue-actions two-buttons">
                <button type="button" onClick={() => handleSaveUpdate(issue)}>
                  Save Update
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteIssue(issue._id)}
                >
                  Delete Issue
                </button>
              </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Admin;
