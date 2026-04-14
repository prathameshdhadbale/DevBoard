import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import pool from "../config/db.js";
const router = express.Router();


router.get('/', authMiddleware, async (req, res) => {
    const user_id = req.user.id;

    const getUserQuery = `SELECT * FROM applications WHERE user_id = $1 order by created_at DESC`;
    try {
        const result = await pool.query(getUserQuery, [user_id]);
        res.status(200).json(result.rows);

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});


router.post('/', authMiddleware, async (req, res) => {
    const { company, position, job_link, notes, followup_date } = req.body;
    const user_id = req.user.id;

    const createApplicationQuery = `INSERT INTO applications (user_id , company, position , job_link , notes , followup_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
    try {
        const result = await pool.query(createApplicationQuery, [user_id, company, position, job_link, notes, followup_date]);
        return res.status(201).json(result.rows[0]);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.patch('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status, company, position, job_link, notes, followup_date } = req.body;

    const updateApplicationQuery = `UPDATE applications SET status = $1 , company = $2 , position = $3 , job_link = $4 , notes = $5, followup_date = $6 WHERE id = $7 and user_id = $8 RETURNING *`;
    try {
        const result = await pool.query(updateApplicationQuery, [status, company, position, job_link, notes, followup_date, id, req.user.id]);
        return res.status(200).json(result.rows[0]);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }

});


router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const deleteApplicationQuery = `DELETE FROM applications WHERE id = $1 and user_id = $2`;
    try {
        await pool.query(deleteApplicationQuery, [id, req.user.id]);
        return res.status(200).json({ message: "Application deleted" })
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.get('/stats', authMiddleware, async (req, res) => {
    const user_id = req.user.id;
    try {
        const totalApplicationsOfUser = await pool.query(`SELECT COUNT(*) FROM applications WHERE user_id = $1`, [user_id]);
        const interviewApplicationsOfUser = await pool.query(`SELECT COUNT(*) FROM applications WHERE user_id = $1 AND status = 'interview'`, [user_id]);
        const rejectedwApplicationsOfUser = await pool.query(`SELECT COUNT(*) FROM applications WHERE user_id = $1 AND status = 'rejected'`, [user_id]);
        const offerApplicationsOfUser = await pool.query(`SELECT COUNT(*) FROM applications WHERE user_id = $1 AND status = 'offer'`, [user_id]);
        const activewApplicationsOfUser = await pool.query(`SELECT COUNT(*) FROM applications WHERE user_id = $1 AND status NOT IN ('rejected','offer')`, [user_id]);

        const totals = parseInt(totalApplicationsOfUser.rows[0].count);
        const interview = parseInt(interviewApplicationsOfUser.rows[0].count);

        const stats = {
            total: totals,
            active: parseInt(activewApplicationsOfUser.rows[0].count),
            interviews: interview,
            offers: parseInt(offerApplicationsOfUser.rows[0].count),
            rejected: parseInt(rejectedwApplicationsOfUser.rows[0].count),
            responseRate: totals > 0
                ? Math.round((interview / totals) * 100)
                : 0
        };

        return res.status(200).json(stats);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.get('/followups', authMiddleware, async (req, res) => {
    const user_id = req.user.id;

    const followUpApplications = `SELECT * FROM applications WHERE user_id = $1 AND followup_date <= CURRENT_DATE AND status NOT IN ('rejected','offer') ORDER BY followup_date ASC`;
    try {
        const result = await pool.query(followUpApplications, [user_id]);
        return res.status(200).json(result.rows);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});



export default router;