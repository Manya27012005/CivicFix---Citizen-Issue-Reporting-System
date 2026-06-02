import { Link } from "react-router-dom";

function Notifications({
  user,
  notifications,
  markNotificationRead,
  markAllNotificationsRead,
}) {
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  if (!user) {
    return (
      <section className="issues-section">
        <h2>Notifications</h2>
        <p className="notice-text">
          Please <Link to="/login">login</Link> to view notifications.
        </p>
      </section>
    );
  }

  return (
    <section className="issues-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Citizen updates</span>
          <h2>Notifications</h2>
          <p className="section-subtitle">
            Track official admin responses and status changes for your reported issues.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            className="small-action-button"
            onClick={markAllNotificationsRead}
          >
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="empty-text">No notifications yet.</p>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => (
            <article
              className={`notification-card ${notification.read ? "" : "unread"}`}
              key={notification._id}
            >
              <div>
                <div className="notification-title-row">
                  <h3>{notification.title}</h3>
                  {!notification.read && <span className="unread-dot">New</span>}
                </div>

                <p>{notification.message}</p>

                {notification.issue && (
                  <p className="reported-by">
                    Related issue: {notification.issue.title} ({notification.issue.status})
                  </p>
                )}

                <p className="reported-by">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="notification-actions">
                <Link className="text-link" to="/my-reports">View My Reports</Link>

                {!notification.read && (
                  <button
                    type="button"
                    className="small-action-button"
                    onClick={() => markNotificationRead(notification._id)}
                  >
                    Mark read
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Notifications;
