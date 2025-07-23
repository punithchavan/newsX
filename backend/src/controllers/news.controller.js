import { fetchNewsByHashtag } from "../utils/fetchNews.js";
import { NewsCache } from "../models/newsCache.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

//core functionality
const getNewsByHashtag = async (req,res) => {
    const { hashtag } = req.params;
    if(!hashtag){
        throw new ApiError(400, "Hashtag is required");
    }
    //check cache
    const cached = await NewsCache.findOne({ hashtag: hashtag.toLowerCase() });
    if(cached && Date.now() - new Date(cached.cachedAt).getTime() < 6*60*60*1000){
        return res.status(200).json(new ApiResponse(200, cached.articles, "News from cache"));
    }
    // fetch fresh news
    const articles = await fetchNewsByHashtag(hashtag);
    //save news in DB as tweets
    for(const article of articles){
        let mediaUrls = [];
        if(article.imageUrl){
            try{
                const uploadResult = await uploadOnCloudinary(article.imageUrl);
            if (uploadResult?.url) {
                mediaUrls.push(uploadResult.url);
            }
            } catch(error){
                console.log("Cloudinary upload failed:", error.message);
            }
        }
        const content = `${article.title} - ${article.source}`;
        const existing = await Tweet.findOne({content});
        if(!existing){
            await Tweet.create({
                content,
                media: mediaUrls,
                hashTags: [hashtag.toLowerCase()],
                owner: process.env.SYSTEM_USER_ID,
                likesCount: 0,
                commentsCount: 0
            });
        }
    }
    //save to DB cache
    await NewsCache.findOneAndUpdate(
    { hashtag: hashtag.toLowerCase() },
    { articles, cachedAt: Date.now() },
    { upsert: true }
  );
  return res.status(200).json(new ApiResponse(200, articles, "News from API"));
}

export {
    getNewsByHashtag
}