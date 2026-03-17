const router = require("express").Router();

const ticket = require("../controllers/ticketController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.get("/my-tickets",auth,role("user"),ticket.getMyTickets);

module.exports = router;