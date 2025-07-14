import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    media: [{
        type: String, // Cloudinary URLs
    }],
    hashTags: [{
        type: String,
        required: true,
        lowercase: true,
        trim: true
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    parentTweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
        default: null
    }
}, { timestamps: true });

tweetSchema.methods.formatTweet = function() {
    return {
        _id: this._id,
        content: this.content,
        media: this.media,
        hashTags: this.hashTags,
        createdAt: this.createdAt,
        owner: this.owner,
    }
}

tweetSchema.statics.findByHashtag = function(tag){
    return this.find({
        hashTags: tag.toLowerCase()
    })
}

export const Tweet = mongoose.model("Tweet", tweetSchema);
