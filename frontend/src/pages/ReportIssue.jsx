import { Link } from "react-router-dom";

function ReportIssue({
  user,
  form,
  setForm,
  submitIssue,
  handleDescriptionChange,
}) {
  return (
    <section className="form-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Citizen report</span>
          <h2>Report an Issue</h2>
        </div>
      </div>

      {!user && (
        <p className="notice-text">
          Please <Link to="/login">login</Link> before reporting an issue.
        </p>
      )}

      <form onSubmit={submitIssue}>
        <label>
          Issue title
          <input
            placeholder="Example: Broken streetlight"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </label>

        <label>
          Description
          <textarea
            placeholder="Explain what happened and how it affects people nearby"
            value={form.description}
            onChange={handleDescriptionChange}
            required
          />
        </label>

        <label>
          Category
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Select category</option>
            <option value="Pothole">Pothole</option>
            <option value="Garbage">Garbage</option>
            <option value="Streetlight">Streetlight</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Drainage">Drainage</option>
            <option value="Other">Other</option>
          </select>
        </label>

        {form.category && (
          <p className="suggestion-text">Suggested category: {form.category}</p>
        )}

        <div className="form-row">
          <label>
            Image URL optional
            <input
              placeholder="Paste image link if available"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </label>

          <label>
            Address or location
            <input
              placeholder="Example: Main road, Bhopal"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </label>
        </div>

        <button type="submit">Submit Issue</button>
      </form>
    </section>
  );
}

export default ReportIssue;
