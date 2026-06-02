import { useState } from "react";

function Issues({
  user,
  filteredIssues,
  searchText,
  setSearchText,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  upvoteIssue,
  isIssueSupported,
  addComment,
  addFeedback,
}) {
  const [commentText, setCommentText] = useState({});
  const [feedbackText, setFeedbackText] = useState({});
  const [ratings, setRatings] = useState({});

  const submitComment = (issueId) => {
    addComment(issueId, commentText[issueId] || "");
    setCommentText({ ...commentText, [issueId]: "" });
  };

  const submitFeedback = (issueId) => {
    addFeedback(issueId, Number(ratings[issueId] || 5), feedbackText[issueId] || "");
    setFeedbackText({ ...feedbackText, [issueId]: "" });
    setRatings({ ...ratings, [issueId]: 5 });
  };

  const getStatusClass = (status) => {
    return `status-badge ${status.toLowerCase().replaceAll(" ", "-")}`;
  };

  return (
    <section className="issues-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Public board</span>
          <h2>All Issues</h2>
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
        <div className="issues-grid">
          {filteredIssues.map((issue) => {
            const isSupported = isIssueSupported(issue);

            return (
              <article className="issue-card" key={issue._id}>
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
                  <p className="admin-note">Admin response: {issue.adminNote}</p>
                )}

                <div className="issue-actions">
                  <button
                    type="button"
                    onClick={() => upvoteIssue(issue._id)}
                    disabled={isSupported}
                    className={isSupported ? "supported-button" : ""}
                  >
                    {isSupported ? "Supported" : "Support Issue"}
                  </button>

                  <div className="compact-stats">
                    <span>Upvotes: {issue.upvotes}</span>
                    <span>Priority: {issue.priorityScore}</span>
                  </div>
                </div>

                <div className="discussion-box">
                  <h4>Community Comments</h4>

                  {issue.comments?.length === 0 ? (
                    <p className="empty-text">No comments yet.</p>
                  ) : (
                    issue.comments?.map((comment) => (
                      <p className="comment-item" key={comment._id}>
                        <strong>{comment.commentedBy?.name || "Citizen"}:</strong>{" "}
                        {comment.text}
                      </p>
                    ))
                  )}

                  {user ? (
                    <div className="inline-form comment-form">
                      <input
                        placeholder="Add comment"
                        value={commentText[issue._id] || ""}
                        onChange={(e) =>
                          setCommentText({
                            ...commentText,
                            [issue._id]: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        className="comment-send-button"
                        aria-label="Add comment"
                        title="Add comment"
                        onClick={() => submitComment(issue._id)}
                      >
                        →
                      </button>
                    </div>
                  ) : (
                    <p className="notice-text">Login required to comment.</p>
                  )}
                </div>

                {issue.status === "Resolved" && (
                  <div className="feedback-box">
                    <h4>Citizen Feedback</h4>

                    {issue.feedbacks?.length === 0 ? (
                      <p className="empty-text">No feedback yet.</p>
                    ) : (
                      issue.feedbacks?.map((feedback) => (
                        <p className="comment-item" key={feedback._id}>
                          <strong>{feedback.givenBy?.name || "Citizen"}:</strong>{" "}
                          Rating {feedback.rating}/5 - {feedback.comment}
                        </p>
                      ))
                    )}

                    {user && (
                      <div className="inline-form">
                        <select
                          value={ratings[issue._id] || 5}
                          onChange={(e) =>
                            setRatings({
                              ...ratings,
                              [issue._id]: e.target.value,
                            })
                          }
                        >
                          <option value="5">5 stars</option>
                          <option value="4">4 stars</option>
                          <option value="3">3 stars</option>
                          <option value="2">2 stars</option>
                          <option value="1">1 star</option>
                        </select>

                        <input
                          placeholder="Feedback comment"
                          value={feedbackText[issue._id] || ""}
                          onChange={(e) =>
                            setFeedbackText({
                              ...feedbackText,
                              [issue._id]: e.target.value,
                            })
                          }
                        />

                        <button type="button" onClick={() => submitFeedback(issue._id)}>
                          Submit Feedback
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Issues;
