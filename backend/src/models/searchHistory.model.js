import mongoose, {Schema} from "mongoose";

const searchHistorySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    query: {
        type: String,
        required: true,
        trim: true,
    },
}, {timestamps: true})

export const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);