import { useState, useEffect } from "react";
import "./AddCardModal.css";

const EMPTY_FORM = {
  company: "",
  position: "",
  job_link: "",
  notes: "",
  followup_date: "",
};

const AddCardModal = ({ onClose, onSave, editCard }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  // If editing, pre-fill form
  useEffect(() => {
    if (editCard) {
      setFormData({
        company: editCard.company || "",
        position: editCard.position || "",
        job_link: editCard.job_link || "",
        notes: editCard.notes || "",
        followup_date: editCard.followup_date || "",
      });
    }
  }, [editCard]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSave = () => {
    if (!formData.company.trim()) {
      setError("Company name is required.");
      return;
    }
    if (!formData.position.trim()) {
      setError("Position is required.");
      return;
    }

    if (editCard) {
      onSave({ ...editCard, ...formData });
    } else {
      onSave(formData);
    }
  };

  // Close on backdrop click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {editCard ? "Edit Application" : "Add Application"}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label htmlFor="company">Company Name <span className="required">*</span></label>
            <input
              id="company"
              name="company"
              type="text"
              placeholder="e.g. Razorpay"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="position">Position <span className="required">*</span></label>
            <input
              id="position"
              name="position"
              type="text"
              placeholder="e.g. Frontend Engineer Intern"
              value={formData.position}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="job_link">Job Link <span className="optional">(optional)</span></label>
            <input
              id="job_link"
              name="job_link"
              type="url"
              placeholder="https://..."
              value={formData.job_link}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="followup_date">Follow Up Date <span className="optional">(optional)</span></label>
            <input
              id="followup_date"
              name="followup_date"
              type="date"
              value={formData.followup_date}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="notes">Notes <span className="optional">(optional)</span></label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Any notes about this application..."
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {error && <div className="modal-error">{error}</div>}
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>
            {editCard ? "Save Changes" : "Save Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCardModal;
