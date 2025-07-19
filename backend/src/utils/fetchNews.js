import axios from "axios";

const fetchNewsByHashtag = async (hashtag) => {
    try{
        const response = await axios.get("https://newsapi.org/v2/everything", {
            params: {
                q: hashtag,
                language: "en",
                sortBy: "publishedAt",
                apiKey: process.env.NEWS_API_KEY,
                pageSize: 10,
            },
        });

        return response.data.articles.map((article) => ({
            title: article.title,
            description: article.description,
            url: article.url,
            imageUrl: article.urlToImage,
            source: article.source.name,
            publishedAt: article.publishedAt,
        }))
    } catch(error){
        console.log("Error fetching news: ", error);
        return[];
    }
};

export {
    fetchNewsByHashtag
}