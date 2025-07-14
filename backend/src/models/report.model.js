import mongoose, {Schema} from "mongoose";

const reportSchema = new Schema({
  reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
  targetTweet: { type: Schema.Types.ObjectId, ref: "Tweet" },
  targetComment: { type: Schema.Types.ObjectId, ref: "Comment" },
  reason: {
    type: String,
    enum: ["spam", "abuse", "false information", "other"],
    required: true,
  },
  details: { type: String },
  status: {
    type: String,
    enum: ["pending", "reviewed", "resolved"],
    default: "pending"
  }
}, { timestamps: true });

reportSchema.pre("save", function (next) {
  if (!this.targetTweet && !this.targetComment) {
    return next(new Error("Report must reference a tweet or a comment."));
  }
  next();
});

export const Report = mongoose.model("Report", reportSchema);