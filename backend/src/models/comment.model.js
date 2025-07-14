import mongoose, {Schema} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    tweet:{
        type: Schema.Types.ObjectId,
        ref: "Tweet",
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {timestamps: true});

commentSchema.statics.getAllForTweet = function(tweetId) {
    return this.find({ tweet: tweetId }).populate("owner");
}

commentSchema.statics.getPaginatedForTweet = function(tweetId, options) {
    const aggregate = this.aggregate([
        { $match: { tweet: new mongoose.Types.ObjectId(tweetId) } },
        { $sort: { createdAt: -1 } },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        { $unwind: "$owner" }
    ]);

    return this.aggregatePaginate(aggregate, options);
};

commentSchema.plugin(aggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema)