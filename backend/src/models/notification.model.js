import mongoose, {Schema} from "mongoose";

const notificationSchema = new Schema({
  recipient: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  type: {
    type: String,
    enum: ["like", "comment", "follow", "mention", "news"],
    required: true,
  },
  actor: { 
    type: Schema.Types.ObjectId, 
    ref: "User" 
  },
  tweet: { 
    type: Schema.Types.ObjectId, 
    ref: "Tweet" 
  },
  comment: { 
    type: Schema.Types.ObjectId, 
    ref: "Comment" 
  },
  isRead: { type: Boolean, 
    default: false 
  },
}, { timestamps: true });

notificationSchema.statics.send = function({ recipient, type, actor, tweet, comment }) {
  return this.create({ recipient, type, actor, tweet, comment });
};


export const Notification = mongoose.model("Notification", notificationSchema);
