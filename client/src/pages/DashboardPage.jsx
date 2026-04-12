import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddCardModal from "../components/AddCardModal";
import "./DashboardPage.css";

const COLUMNS = [
  { id: "applied", label: "Applied" },
  { id: "interview", label: "Interview" },
  { id: "assignment", label: "Assignment" },
  { id: "offer", label: "Offer" },
  { id: "rejected", label: "Rejected" },
];

// Dummy data — replace with real API data later
const INITIAL_CARDS = [
  { id: "1", company: "Razorpay", position: "Frontend Engineer Intern", status: "applied", date: "Apr 8, 2025", notes: "", jobLink: "https://razorpay.com" },
  { id: "2", company: "CRED", position: "Full Stack Intern", status: "applied", date: "Apr 10, 2025", notes: "Applied via LinkedIn. Referral from senior.", jobLink: "" },
  { id: "3", company: "Groww", position: "React Developer Intern", status: "interview", date: "Mar 28, 2025", notes: "Round 1 scheduled Apr 15.", jobLink: "" },
  { id: "4", company: "Postman", position: "Backend Intern", status: "interview", date: "Apr 2, 2025", notes: "", jobLink: "" },
  { id: "5", company: "Khatabook", position: "SWE Intern", status: "assignment", date: "Apr 1, 2025", notes: "Build a REST API in 48hrs. Due Apr 13.", jobLink: "" },
  { id: "6", company: "Wingman", position: "Frontend Intern", status: "offer", date: "Mar 20, 2025", notes: "₹25k/mo. Accepting by Apr 20.", jobLink: "" },
  { id: "7", company: "Flipkart", position: "SDE Intern", status: "rejected", date: "Mar 10, 2025", notes: "", jobLink: "" },
  { id: "8", company: "Meesho", position: "Full Stack Intern", status: "rejected", date: "Mar 14, 2025", notes: "", jobLink: "" },
];

const DashboardPage = () => {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [showModal, setShowModal] = useState(false);
  const [editCard, setEditCard] = useState(null);

  // ── STATS ──
  const stats = {
    total: cards.length,
    active: cards.filter(c => !["rejected", "offer"].includes(c.status)).length,
    interviews: cards.filter(c => c.status === "interview").length,
    offers: cards.filter(c => c.status === "offer").length,
    rejected: cards.filter(c => c.status === "rejected").length,
  };

  const responseRate = stats.total > 0
    ? Math.round((stats.interviews / stats.total) * 100)
    : 0;

  // ── DRAG END ──
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;

    setCards(prev =>
      prev.map(card =>
        card.id === draggableId ? { ...card, status: newStatus } : card
      )
    );

    // TODO: call updateStatus API
    // await updateApplicationStatus(draggableId, newStatus);
  };

  // ── ADD CARD ──
  const handleAddCard = (newCard) => {
    const card = {
      ...newCard,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      status: "applied",
    };
    setCards(prev => [...prev, card]);
    setShowModal(false);

    // TODO: call createApplication API
    // await createApplication(card);
  };

  // ── EDIT CARD ──
  const handleEditCard = (updatedCard) => {
    setCards(prev =>
      prev.map(c => c.id === updatedCard.id ? updatedCard : c)
    );
    setEditCard(null);
    setShowModal(false);

    // TODO: call updateApplication API
    // await updateApplication(updatedCard);
  };

  // ── DELETE CARD ──
  const handleDeleteCard = (cardId) => {
    setCards(prev => prev.filter(c => c.id !== cardId));

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
    localStorage.removeItem("token");
    // TODO: navigate to login
    // navigate("/login");
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
          <span className="navbar-user">Hi, Aadik 👋</span>
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
          <span className="stat-sub">response rate {responseRate}%</span>
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
                        <Draggable key={card.id} draggableId={card.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className={`card ${snapshot.isDragging ? "dragging" : ""}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="card-company">{card.company}</div>
                              <div className="card-role">{card.position}</div>
                              {card.jobLink && (
                                <a
                                  className="card-link"
                                  href={card.jobLink}
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
                                <span className="card-date">{card.date}</span>
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
