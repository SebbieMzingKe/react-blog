import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import useFetch from "./useFetch";

const BlogDetails = () => {

    const {id } = useParams() 
    const { data, error, isPending} = useFetch(`https://chanzublog.onrender.com/blogs/${id}`)
    const i = Number(id)
    console.log("id",typeof(i))
    const history = useHistory()
    // console.log('data',data['blogs'][i])
    console.log('data',data?.blogs)
    const handleClick = () => {
        fetch(`https://chanzublog.onrender.com/blogs/${id}`, {
            method: 'DELETE'
        }).then(() => {
            history.push('/')
        })
        
    }
    return ( 
        <div className="blog-details">
        {isPending && <div>Loading...</div>}
        {error && <div>{ error }</div>}
        {data && (
            <article>
                <h2>{ data.title }</h2>
                <p>Written by { data['blogs'][i].author }</p>
                <div>{  data['blogs'][i].body }</div>
                <button onClick={handleClick}>delete</button>
            </article>
        )}
        </div>
     );
}
 
export default BlogDetails;
