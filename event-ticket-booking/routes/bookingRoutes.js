const router = require("express").Router();

const booking = require("../controllers/bookingController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/",auth,role("user"),booking.bookSeats);

router.get("/history",auth,role("user"),booking.getMyBookings);

module.exports = router;
