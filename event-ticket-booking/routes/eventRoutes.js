const router = require("express").Router();

const event = require("../controllers/eventController");
const seat = require("../controllers/seatController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/create",auth,role("organizer"),event.createEvent);

router.get("/",auth,role("user"),event.getEvents);

router.get("/:eventId/seats",auth,role("organizer"),seat.getSeats);

module.exports = router;