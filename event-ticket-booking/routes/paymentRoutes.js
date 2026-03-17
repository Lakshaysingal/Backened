const router = require("express").Router();

const payment = require("../controllers/paymentController");

router.post("/checkout",payment.checkout);

router.get("/success/:bookingId",payment.paymentSuccess);

module.exports = router;