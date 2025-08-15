//import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import { getUser } from "../api/userApi";
import { HiHome, HiSearch, HiBell } from "react-icons/hi";
import { FaEnvelope } from "react-icons/fa";


const Footer = () => {
    const navigate = useNavigate();
    return (
        <footer className="fixed bottom-0 w-full  flex items-center justify-between px-4 py-4 shadow-md bg-white">
            <HiHome size={24} className="text-gray-800 cursor-pointer" onClick={()=> {
                navigate("/home")
            }} />
            <HiSearch size={24} className="text-gray-800 cursor-pointer" onClick={()=>{
                navigate("/search-user")
            }} />
            <HiBell size={24} className="text-gray-800 cursor-pointer" />
            <FaEnvelope size={24} className="text-gray-800 cursor-pointer" />
        </footer>
    )
}

export {
    Footer
}