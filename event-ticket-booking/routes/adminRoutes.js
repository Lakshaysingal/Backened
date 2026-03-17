const router = require("express").Router();

const admin = require("../controllers/adminController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.get("/dashboard",auth,role("admin"),admin.dashboard);

module.exports = router;