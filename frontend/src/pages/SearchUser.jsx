import { useState } from "react";
import { searchUsers } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

const SearchUserPage = () =>{
    const [username, setUsername] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if(!username.trim()) return;
        try {
            setLoading(true);
            const response = await searchUsers(username);
            console.log("Users in handleSearch:", response);
            setResults(response || []);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black flex flex-col items-center">
            <Header />
            <div className="w-full max-w-md p-4 border-b border-gray-300 flex">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                <button
                  onClick={handleSearch}
                  className=" mx-2 bg-blue-300 text-white p-2 rounded-lg hover:bg-blue-400"
                >
                    Search
                </button>
            </div>

            <div className="w-full max-w-md p-4">
                {loading && <p className="text-gray-500">Searching...</p>}
                {/* {!loading && results.length === 0 && (
                    <p className="text-gray-500">Search user</p>
                )} */}
                {/* {!loading && results.length>0 && (
                    <ul className="divide-y divide-gray-200">
                        {results.map((user) => (
                            <li
                              key={user._id}
                              className="p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-100"
                              onClick={() => navigate(`/profile/${user.username}`)}
                            >
                                <img
                                  src={user.profilePicture || "/default-avatar.png"}
                                  alt={user.username}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold">{user.username}</p>
                                    <p className="text-gray-500 text-sm">{user.name || "No name"}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )} */}
                <ul className="divide-y divide-gray-200">
                    {results.map((user) => (
                        <li 
                          key = {user._id}
                          className="p-3 flex items-center gap-3 bg-gray-50"
                        >
                            <img
                              src={user.profilePicture?.url || "/default-avatar.png"}
                              alt={user.fullName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold">{user.username}</p>
                                <p className="text-gray-500 text-sm">{user.fullName || "No name"}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <Footer />
        </div>
    )
}

export {
    SearchUserPage
}
