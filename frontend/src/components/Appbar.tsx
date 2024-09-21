import { Avatar } from "./Blogcard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const Appbar = () => {
    const [signedUp, setSignedUp] = useState(false);
    const [username, setUsername] = useState("Anonymous");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setSignedUp(true);
            const storedUsername = localStorage.getItem("email");
            if (storedUsername) {
                setUsername(storedUsername);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        setSignedUp(false);
        setUsername("Anonymous");
    
    };

    return (
        <div className="border-b flex justify-between px-10 py-4">
            <Link to={'/blogs'} className="flex flex-col justify-center cursor-pointer text-2xl font-bold text-gray-800 hover:text-green-700">
                BlogHub
            </Link>
            <div>
                <Link to={`/publish`}>
                    <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">New +</button>
                </Link>

                {!signedUp && (
                    <Link to={`/signup`}>
                        <button
                            type="button"
                            className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                            Sign up
                        </button>
                    </Link>
                )}

                {signedUp && (
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mr-4 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                        Logout
                    </button>
                )}

                <Avatar size={"big"} name={username} />
            </div>
        </div>
    );
};
