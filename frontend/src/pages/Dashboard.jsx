import { Link } from "react-router-dom";

function Dashboard({
  totalIssues,
  reportedCount,
  inProgressCount,
  resolvedCount,
  highPriorityCount,
  issues,
}) {
  const recentIssues = issues.slice(0, 3);
  const priorityIssues = [...issues]
    .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))
    .slice(0, 3);
  const activeCount = totalIssues - resolvedCount;
  const resolvedPercent =
    totalIssues === 0 ? 0 : Math.round((resolvedCount / totalIssues) * 100);

  const getStatusClass = (status) => {
    return `status-badge ${status.toLowerCase().replaceAll(" ", "-")}`;
  };

  return (
    <>
      <header className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Citizen issue tracker</span>
          <h1>CivicFix</h1>
          <p>
            A public civic dashboard where citizens report local issues, communities support what matters, and admins share transparent progress updates.
          </p>

          <div className="hero-actions">
            <Link className="primary-link" to="/report">Report Issue</Link>
            <Link className="secondary-link" to="/issues">View Issues</Link>
          </div>
        </div>

        <div className="hero-panel civic-board">
          <div className="board-header">
            <span>Live civic board</span>
            <strong>{totalIssues}</strong>
          </div>

          <div className="board-meter">
            <span style={{ width: `${resolvedPercent}%` }} />
          </div>

          <div className="board-stats">
            <div>
              <strong>{activeCount}</strong>
              <span>Active</span>
            </div>
            <div>
              <strong>{resolvedCount}</strong>
              <span>Resolved</span>
            </div>
            <div>
              <strong>{resolvedPercent}%</strong>
              <span>Closure</span>
            </div>
          </div>

          <div className="workflow-strip">
            <span>Report</span>
            <span>Verify</span>
            <span>Resolve</span>
          </div>
        </div>
      </header>

      <section className="dashboard-section" aria-label="Issue summary">
        <div className="summary-card summary-total">
          <span>Total Issues</span>
          <strong>{totalIssues}</strong>
        </div>

        <div className="summary-card summary-reported">
          <span>Reported</span>
          <strong>{reportedCount}</strong>
        </div>

        <div className="summary-card summary-progress">
          <span>In Progress</span>
          <strong>{inProgressCount}</strong>
        </div>

        <div className="summary-card summary-resolved">
          <span>Resolved</span>
          <strong>{resolvedCount}</strong>
        </div>

        <div className="summary-card summary-priority">
          <span>High Priority</span>
          <strong>{highPriorityCount}</strong>
        </div>
      </section>

      <section className="issues-section priority-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Priority queue</span>
            <h2>High Priority Issues</h2>
          </div>
          <Link className="text-link" to="/issues">Open board</Link>
        </div>

        {priorityIssues.length === 0 ? (
          <p className="empty-text">No priority issues yet.</p>
        ) : (
          <div className="priority-grid">
            {priorityIssues.map((issue, index) => (
              <article className="priority-card" key={issue._id}>
                <div className="priority-rank">#{index + 1}</div>

                <div className="priority-content">
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

                  <div className="compact-stats">
                    <span>Upvotes: {issue.upvotes}</span>
                    <span>Priority: {issue.priorityScore}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="issues-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Latest activity</span>
            <h2>Recent Issues</h2>
          </div>
          <Link className="text-link" to="/issues">See all</Link>
        </div>

        {recentIssues.length === 0 ? (
          <p className="empty-text">No issues reported yet.</p>
        ) : (
          <div className="issues-grid">
            {recentIssues.map((issue) => (
              <div className="issue-card" key={issue._id}>
                <h3>{issue.title}</h3>
                <p>{issue.description}</p>

                <div className="meta">
                  <span>{issue.category}</span>
                  <span>{issue.status}</span>
                </div>

                <p className="address">{issue.location?.address}</p>
                <div className="compact-stats">
                  <span>Upvotes: {issue.upvotes}</span>
                  <span>Priority: {issue.priorityScore}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Dashboard;
