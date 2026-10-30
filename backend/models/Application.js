
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    institutionName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
  type: String,
  trim: true,
  default: "",
},
state: {
  type: String,
  trim: true,
  default: "",
},
affiliation: {
  type: String,
  trim: true,
  default: "",
},
    institutionId: {
      type: String,
      trim: true,
      default: "",
    },
    applicationType: {
      type: String,
      required: true,
      trim: true,
    },
    academicYear: {
      type: String,
      required: true,
      default: "2027-28",
    },
    courses: { type: String, trim: true, default: "" },
intake: { type: Number, min: 1, default: null },
    document: {
      originalName: {
        type: String,
        default: "",
      },
      filename: {
        type: String,
        default: "",
      },
      path: {
        type: String,
        default: "",
      },
      size: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: [
        "Draft",
        "Submitted",
        "Under Review",
        "Approved",
        "Rejected",
"Returned for Corrections",
      ],
      default: "Draft",
    },
    reviewerComments: {
  type: String,
  default: "",
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
