import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddCardModal from "../components/AddCardModal";
import "./DashboardPage.css";
import { getApplications, createApplication, updateApplication, deleteApplication, getStats, getFollowups } from "../api/applications.api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";


const COLUMNS = [
  { id: "applied", label: "Applied" },
  { id: "interview", label: "Interview" },
  { id: "assignment", label: "Assignment" },
  { id: "offer", label: "Offer" },
  { id: "rejected", label: "Rejected" },
];


const DashboardPage = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [followups, setFollowups] = useState([]);

  const fetchstats = async () => {
    const stats = await getStats(token);
    setStats(stats);
  }

  const fetchFollowups = async () => {
    const data = await getFollowups(token);
    setFollowups(data);
  };

  const [cards, setCards] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      const data = await getApplications(token);
      setCards(data);
    }
    fetchdata();
    fetchFollowups();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [editCard, setEditCard] = useState(null);

  // ── STATS ──
  const [stats, setStats] = useState({
    total: 0, active: 0, interviews: 0, offers: 0, rejected: 0, responseRate: 0
  });
  useEffect(() => {
    fetchstats();
  }, []);

  // ── DRAG END ──
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;


    setCards(prev =>
      prev.map(card =>
        String(card.id) === draggableId ? { ...card, status: newStatus } : card
      )
    );

    const card = cards.find(c => String(c.id) === draggableId);
    await updateApplication({ ...card, status: newStatus }, token);
    await fetchstats();
    await fetchFollowups();
    // TODO: call updateStatus API
  };

  // ── ADD CARD ──
  const handleAddCard = async (newCard) => {
    const created = await createApplication(newCard, token);
    setCards(prev => [...prev, created]);
    await fetchstats();
    await fetchFollowups();
    setShowModal(false);
  };

  // ── EDIT CARD ──
  const handleEditCard = async (updatedCard) => {
    const updated = await updateApplication(updatedCard, token);
    setCards(prev =>
      prev.map(c => c.id === updated.id ? updated : c)
    );
    await fetchstats();
    await fetchFollowups();
    setEditCard(null);
    setShowModal(false);

    // TODO: call updateApplication API
    // await updateApplication(updatedCard);
  };

  // ── DELETE CARD ──
  const handleDeleteCard = async (cardId) => {
    await deleteApplication(cardId, token);
    setCards(prev => prev.filter(c => c.id !== cardId));
    await fetchstats();
    await fetchFollowups();
    // TODO: call deleteApplication API
    // await deleteApplication(cardId);
  };

  const openEdit = (card) => {
    setEditCard(card);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditCard(null);
  };

  const handleLogout = () => {
    logout();
    // TODO: navigate to login
    navigate("/login");
  };

  return (
    <div className="dashboard">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-logo">
          <div className="logo-dot" />
          DevBoard
        </div>
        <div className="navbar-right">
          <span className="navbar-user">Hello 👋</span>
          <button className="btn-ghost" onClick={handleLogout}>Logout</button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Application</button>
        </div>
      </nav>

      {/* ── STATS BAR ── */}
      <div className="stats-bar">
        <div className="stat-card highlight">
          <span className="stat-label">Total Applied</span>
          <span className="stat-value">{stats.total}</span>
          <span className="stat-sub">all time</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active</span>
          <span className="stat-value">{stats.active}</span>
          <span className="stat-sub">in pipeline</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Interviews</span>
          <span className="stat-value">{stats.interviews}</span>
          <span className="stat-sub">response rate {stats.responseRate}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Offers</span>
          <span className="stat-value">{stats.offers}</span>
          <span className="stat-sub">
            {stats.offers > 0 ? "🎉 congrats!" : "keep going"}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Rejected</span>
          <span className="stat-value">{stats.rejected}</span>
          <span className="stat-sub">keep going 💪</span>
        </div>
      </div>

      {/* ── FOLLOW-UPS ── */}
      {followups.length > 0 && (
        <div className="followups-section">
          <div className="followups-header">
            🔔 Follow-ups Required
          </div>

          <div className="followups-list">
            {followups.map((item) => (
              <div key={item.id} className="followup-card">
                <div className="followup-company">{item.company}</div>
                <div className="followup-role">{item.position}</div>

                {item.followup_date && (
                  <div className="followup-date">
                    📅 {new Date(item.followup_date).toLocaleDateString("en-IN", {
                      month: "short", day: "numeric", year: "numeric"
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BOARD HEADER ── */}
      <div className="board-header">
        <div>
          <div className="board-title">My Applications</div>
          <div className="board-subtitle">Drag cards to update status</div>
        </div>
      </div>

      {/* ── KANBAN BOARD ── */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban">
          {COLUMNS.map(col => {
            const colCards = cards.filter(c => c.status === col.id);
            return (
              <div key={col.id} className={`column col-${col.id}`}>
                <div className="col-header">
                  <div className="col-title">
                    <div className="col-dot" />
                    {col.label}
                  </div>
                  <div className="col-count">{colCards.length}</div>
                </div>

                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      className={`col-body ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {colCards.map((card, index) => (
                        <Draggable key={String(card.id)} draggableId={String(card.id)} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className={`card ${snapshot.isDragging ? "dragging" : ""}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="card-company">{card.company}</div>
                              <div className="card-role">{card.position}</div>
                              {card.job_link && (
                                <a
                                  className="card-link"
                                  href={card.job_link}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  ↗ Job Link
                                </a>
                              )}
                              {card.notes && (
                                <div className="card-note">{card.notes}</div>
                              )}
                              <div className="card-meta">
                                <span className="card-date">
                                  {new Date(card.created_at).toLocaleDateString("en-IN", {
                                    month: "short", day: "numeric", year: "numeric"
                                  })}
                                </span>
                                <div className="card-actions">
                                  <button
                                    className="card-btn"
                                    onClick={() => openEdit(card)}
                                    title="Edit"
                                  >✏</button>
                                  <button
                                    className="card-btn delete"
                                    onClick={() => handleDeleteCard(card.id)}
                                    title="Delete"
                                  >✕</button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      <button
                        className="add-card-btn"
                        onClick={() => setShowModal(true)}
                      >
                        + Add card
                      </button>
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* ── MODAL ── */}
      {showModal && (
        <AddCardModal
          onClose={closeModal}
          onSave={editCard ? handleEditCard : handleAddCard}
          editCard={editCard}
        />
      )}
    </div>
  );
};

export default DashboardPage;
