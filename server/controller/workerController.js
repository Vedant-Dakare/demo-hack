const Complaint = require("../models/Complaint");

// Get assigned tasks
exports.getAssignedTasks = async (req, res) => {
  try {
    console.log("Worker ID:", req.user._id);

    const tasks = await Complaint.find({
      assignedWorker: req.user._id,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    console.log("Tasks found:", tasks.length);

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// Start Work
exports.startWork = async (req, res) => {
  try {
    const { complaintId } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (String(complaint.assignedWorker) !== String(req.user._id)) {
      return res.status(403).json({ message: "This task is not assigned to you" });
    }

    if (complaint.status !== "Assigned") {
      return res.status(400).json({ message: "Only assigned tasks can be started" });
    }

    complaint.status = "In Progress";

    complaint.timeline.push({
      status: "In Progress",
      updatedBy: req.user._id,
      note: "Work started by worker",
    });

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate("user", "name email")
      .populate("assignedWorker", "name email");

    res.json({
      message: "Status updated to In Progress. Work started successfully.",
      complaint: updatedComplaint,
      notification: {
        type: "status_update",
        audience: ["worker", "admin"],
        complaintId: complaint._id,
        status: "In Progress",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error starting work" });
  }
};

// Complete Work
exports.completeTask = async (req, res) => {
  try {
    const { complaintId, proofImageUrl } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (String(complaint.assignedWorker) !== String(req.user._id)) {
      return res.status(403).json({ message: "This task is not assigned to you" });
    }

    if (complaint.status !== "In Progress") {
      return res.status(400).json({ message: "Only in-progress tasks can be completed" });
    }

    if (!proofImageUrl) {
      return res.status(400).json({ message: "Completion photo is required" });
    }

    complaint.status = "Completed";
    complaint.proofImageUrl = proofImageUrl;
    complaint.completionImage = proofImageUrl;
    complaint.completedAt = new Date();

    complaint.timeline.push({
      status: "Completed",
      updatedBy: req.user._id,
      note: "Work completed by worker",
    });

    await complaint.save();

    res.json({ message: "Task completed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error completing task" });
  }
};
