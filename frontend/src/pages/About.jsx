function About() {
  return (
    <section className="issues-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Project overview</span>
          <h2>About CivicFix</h2>
        </div>
      </div>

      <p>
        CivicFix is a local civic issue reporting and tracking system for
        citizens and administrators.
      </p>

      <div className="about-list">
        <div>
          <h3>For Citizens</h3>
          <p>Citizens can report public issues, track progress, support existing complaints, comment, and receive notifications.</p>
        </div>

        <div>
          <h3>For Admins</h3>
          <p>Admins can verify complaints, update status, write official responses, and remove invalid issues.</p>
        </div>

        <div>
          <h3>Innovation</h3>
          <p>The system includes auto category suggestion, duplicate prevention, priority scoring, feedback, notifications, and role-based access.</p>
        </div>
      </div>
    </section>
  );
}

export default About;
