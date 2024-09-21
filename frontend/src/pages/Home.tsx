import { Link } from "react-router-dom";

export const Home = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to the BlogHub!</h1>
            <p className="text-lg mb-8">Explore our latest articles and insights.</p>
            <Link to="/blogs">
                <button className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
                    Go to Blogs
                </button>
            </Link>
            <p className="mt-4 text-sm text-gray-600">Hit the "/blogs" endpoint to see the latest blog posts.</p>
        </div>
    );
};
