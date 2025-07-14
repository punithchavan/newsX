import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema({
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
        default: null,
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {timestamps: true})

// Custom validator to ensure either tweet or comment is liked
likeSchema.pre("save", function (next) {
  if (!this.tweet && !this.comment) {
    return next(new Error("A like must be associated with either a tweet or a comment."));
  }
  next();
});

export const Like = mongoose.model("Like", likeSchema)