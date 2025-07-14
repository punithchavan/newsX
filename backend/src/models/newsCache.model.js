import mongoose, {Schema} from "mongoose";

const newsCacheSchema = new Schema({
  hashtag: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  articles: [{
    title: String,
    description: String,
    url: String,
    imageUrl: String,
    source: String,
    publishedAt: Date,
    extra: Schema.Types.Mixed,
  }],
  cachedAt: {
    type: Date,
    default: Date.now
  }
});

export const NewsCache = mongoose.model("NewsCache", newsCacheSchema);
