const express = require("express");
const router = express.Router();

const {
  getAssignedTasks,
  startWork,
  completeTask,
} = require("../controller/workerController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// ✅ Get all tasks assigned to logged-in worker
router.get(
  "/tasks",
  protect,
  authorizeRoles("worker"),
  getAssignedTasks
);

// ✅ Start work
router.post(
  "/start",
  protect,
  authorizeRoles("worker"),
  startWork
);

// ✅ Complete task
router.post(
  "/complete",
  protect,
  authorizeRoles("worker"),
  completeTask
);

module.exports = router;











