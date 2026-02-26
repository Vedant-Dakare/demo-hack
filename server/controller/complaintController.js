const Complaint = require("../models/Complaint");
const User = require("../models/users");
const axios = require("axios");
const FormData = require("form-data");
const cloudinary = require("../config/cloudinary");

const FEEDBACK_RATINGS = Complaint.FEEDBACK_RATINGS || [
  "Good",
  "Average",
  "Poor",
  "Worst",
];
const FEEDBACK_ALLOWED_STATUSES = new Set(["Completed", "Approved"]);

function normalizeFeedbackRating(rawRating) {
  if (!rawRating || typeof rawRating !== "string") {
    return undefined;
  }
  const normalized = rawRating.trim().toLowerCase();
  return FEEDBACK_RATINGS.find(
    (rating) => rating.toLowerCase() === normalized
  );
}

const FLASK_URL = process.env.FLASK_URL || "http://127.0.0.1:5000";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

async function geocodeAddress(address) {
  if (!address) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      q: address,
      format: "json",
      limit: "1",
    });

    const response = await axios.get(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: {
        "User-Agent": "Trinetra-smart-governance/1.0",
      },
      timeout: 8000,
    });

    const [firstResult] = response.data;
    if (!firstResult) {
      return null;
    }

    const lat = Number(firstResult.lat);
    const lng = Number(firstResult.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    return { lat, lng };
  } catch (error) {
    console.error("Location geocoding failed:", error.message);
    return null;
  }
}

async function buildLocationPayload(rawLocation) {
  if (!rawLocation) {
    return undefined;
  }

  let parsedLocation = rawLocation;

  if (typeof rawLocation === "string") {
    const locationString = rawLocation.trim();
    if (!locationString) {
      return undefined;
    }

    try {
      parsedLocation = JSON.parse(locationString);
    } catch {
      const geocoded = await geocodeAddress(locationString);
      return {
        address: locationString,
        lat: geocoded?.lat,
        lng: geocoded?.lng,
      };
    }
  }

  if (typeof parsedLocation === "object" && parsedLocation !== null) {
    const address =
      typeof parsedLocation.address === "string"
        ? parsedLocation.address.trim()
        : "";
    const lat = Number(parsedLocation.lat);
    const lng = Number(parsedLocation.lng);

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return {
        address: address || undefined,
        lat,
        lng,
      };
    }

    if (address) {
      const geocoded = await geocodeAddress(address);
      return {
        address,
        lat: geocoded?.lat,
        lng: geocoded?.lng,
      };
    }
  }

  return undefined;
}

// Create Complaint
const createComplaint = async (req, res, next) => {
  try {
    // Admins cannot submit complaints, only view them
    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins are not allowed to submit complaints. They can only view and manage complaints."
      });
    }

    const description =
      typeof req.body.description === "string"
        ? req.body.description.trim()
        : "";

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required.",
      });
    }

    let textResult = null;
    let imageResult = null;

    // // ---------------------
    // // TEXT CLASSIFICATION
    // // ---------------------
    // //if (description) {
    // //  try {
    // //    const textResponse = await axios.post(
    // //      `${FLASK_URL}/classify-text`,
    // //      { text: description }
    // //    );
    //     textResult = textResponse.data; // { classification, confidence }
    //   } catch (e) {
    //     console.error("Text classification failed:", e.response?.data || e.message);
    //   }
    // }

    // ---------------------
    // IMAGE CLASSIFICATION
    // ---------------------
    if (req.file && req.file.buffer) {
      try {
        const formData = new FormData();
        formData.append("file", req.file.buffer, {
          filename: req.file.originalname || `upload-${Date.now()}`,
          contentType: req.file.mimetype || "image/jpeg",
        });

        const imageResponse = await axios.post(
          `${FLASK_URL}/classify-image`,
          formData,
          { headers: formData.getHeaders() }
        );
        imageResult = imageResponse.data;
      } catch (e) {
        console.error("Image classification failed:", e.response?.data || e.message);
      }
    }

    // ---------------------
    // FINAL CATEGORY LOGIC
    // ---------------------
    let finalCategory = imageResult?.classification || req.body.category;

    // normalize using the model helper — this will also work if we
    // accidentally receive an already-canonical value, since the
    // setter on the schema will keep it unchanged.
    // first try to translate to a canonical value; if that fails we
    // treat it as unsupported
    const normalizedCategory = Complaint.canonicalCategory(finalCategory);
    if (finalCategory && !normalizedCategory) {
      return res.status(400).json({
        success: false,
        message: `Unsupported category: ${finalCategory}`,
      });
    }

    // ---------------------
    // SAVE TO DATABASE
    // ---------------------
    const locationPayload = await buildLocationPayload(req.body.location);

    const complaintPayload = {
      description,
      user: req.user._id,
      category: normalizedCategory,
      priority: req.body.priority,
      location: locationPayload,
    };

    if (req.file && req.file.buffer) {
      // Persist image in DB as a Data URL and upload to Cloudinary
      const mime = req.file.mimetype || "image/jpeg";
      const base64 = req.file.buffer.toString("base64");
      const dataUri = `data:${mime};base64,${base64}`;
      complaintPayload.image = {
        data: dataUri,
        contentType: mime,
      };
      try {
        const uploadRes = await cloudinary.uploader.upload(dataUri, {
          folder: "complaints",
          resource_type: "image",
        });
        complaintPayload.imageUrl = uploadRes.secure_url;
      } catch (e) {
        console.error("Cloudinary upload failed:", e.response?.data || e.message);
      }
    }

    const complaint = await Complaint.create(complaintPayload);
    
    // Populate the user data in the response
    const populatedComplaint = await Complaint.findById(complaint._id).populate("user", "name email");

    res.status(201).json(populatedComplaint);

  } catch (error) {
    console.error("Create complaint error:", error.message);
    next(error);
  }
};

// Get All Complaints
const getAllComplaints = async (req, res, next) => {
  try {
    let complaints;

    if (req.user.role === "admin") {
      console.log(`Admin ${req.user.name} & ${req.user.role} is fetching all complaints`);
      complaints = await Complaint.find()
        .populate("user", "name email")
        .populate("assignedWorker", "name email");
    } else {
      complaints = await Complaint.find({ user: req.user._id })
        .populate("user", "name email")
        .populate("assignedWorker", "name email");
    }

    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

// Update Status
const updateComplaintStatus = async (req, res , next) => {
  try {
    const { status, workerId } = req.body;

    if (status === "Assigned") {
      if (!workerId) {
        return res.status(400).json({
          success: false,
          message: "workerId is required when status is Assigned.",
        });
      }

      const worker = await User.findById(workerId);
      if (!worker || worker.role !== "worker") {
        return res.status(400).json({
          success: false,
          message: "Invalid workerId.",
        });
      }
    }

    const update = { status };
    if (status === "Assigned") {
      update.assignedWorker = workerId;
      update.$push = {
        timeline: {
          status: "Assigned",
          updatedBy: req.user._id,
          note: "Complaint assigned to worker",
        },
      };
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, update, {
      returnDocument: "after",
    })
      .populate("user", "name email")
      .populate("assignedWorker", "name email");

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(updatedComplaint);
  } catch (error) {
    next(error);
  }
};

const submitComplaintFeedback = async (req, res, next) => {
  try {
    const normalizedRating = normalizeFeedbackRating(req.body.rating);
    if (!normalizedRating) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback rating. Use Good, Average, Poor, or Worst.",
      });
    }

    const complaint = await Complaint.findById(req.params.id)
      .populate("user", "name email")
      .populate("assignedWorker", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const complaintOwnerId = String(
      complaint.user?._id || complaint.user
    );
    if (complaintOwnerId !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only the complaint owner can submit feedback.",
      });
    }

    if (!FEEDBACK_ALLOWED_STATUSES.has(complaint.status)) {
      return res.status(400).json({
        success: false,
        message: "Feedback can be submitted only after completion.",
      });
    }

    const trimmedComment =
      typeof req.body.comment === "string"
        ? req.body.comment.trim()
        : undefined;

    complaint.feedback = {
      rating: normalizedRating,
      comment: trimmedComment || undefined,
      submittedAt: new Date(),
    };

    complaint.timeline.push({
      status: complaint.status,
      updatedBy: req.user._id,
      note: `Citizen feedback recorded (${normalizedRating})`,
    });

    await complaint.save();

    return res.json({
      success: true,
      message: "Feedback submitted successfully.",
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
  submitComplaintFeedback,
};
