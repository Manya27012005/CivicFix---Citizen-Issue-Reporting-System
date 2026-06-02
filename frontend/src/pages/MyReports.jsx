import { useState } from "react";

function MyReports({ user, issues, addComment, addFeedback }) {
  const [commentText, setCommentText] = useState({});
  const [feedbackText, setFeedbackText] = useState({});
  const [ratings, setRatings] = useState({});

  if (!user) {
    return (
      <section className="issues-section">
        <h2>My Reports</h2>
        <p className="notice-text">Please login to view your reports.</p>
      </section>
    );
  }

  const myIssues = issues.filter((issue) => {
    const reporterId = issue.reportedBy?._id || issue.reportedBy;
    return reporterId?.toString() === user.id;
  });

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
          <span className="eyebrow">Your activity</span>
          <h2>My Reports</h2>
        </div>
      </div>

      {myIssues.length === 0 ? (
        <p className="empty-text">You have not reported any issues yet.</p>
      ) : (
        <div className="issues-grid">
          {myIssues.map((issue) => (
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

              {issue.adminNote && (
                <p className="admin-note">Admin response: {issue.adminNote}</p>
              )}

              <div className="compact-stats">
                <span>Upvotes: {issue.upvotes}</span>
                <span>Priority: {issue.priorityScore}</span>
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
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyReports;
