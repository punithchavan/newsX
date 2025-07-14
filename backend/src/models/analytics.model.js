import mongoose, {Schema} from "mongoose";

const analyticsSchema = new Schema({
    date:{
        type: Date,
        default: Date.now,
        unique: true,
    },
    totalUsers:{
        type: Number,
    },
    totalTweets:{
        type: Number,
    },
    totalComments:{
        type: Number,
    },
    totalLikes:{
        type: Number,
    },
    trendingHashtags: [
     String
    ]
})

export const Analytic = new mongoose.model("Analytic", analyticsSchema);