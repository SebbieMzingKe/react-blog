import React from "react";
import BlogList from "./BlogList";
import useFetch from "./useFetch";

const Home = () => {
    // const url='http://localhost:8000/blogs'
    const { data, isPending, error } = useFetch('db.json');

    return (
        <div className="Home">
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {data && <BlogList blogs={data['blogs']} title="All Blogs." />}
        </div>
    );
}

export default Home;
