import { useEffect, useState } from "react";
const useFetch = (url) => {
    console.log("url",url)

    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const abortCont = new AbortController()
        
        setTimeout(() => {
            fetch(url)
            .then(res => {
                console.log(res)

                if(!res.ok){
                    throw Error('Could not fetch the data for that resource')
                }
                return res.json();
                
            })
            .then(data => {
                setData(data)
                console.log(data)
                setIsPending(false)
                setError(null)
                })
                .catch(err => {
                    if(err.name === 'AbortError')
                    console.log('fetch aborted')
                    setIsPending(false)
                    setError(err.message)
                
            }, 1000)
            });
            return() => abortCont.abort()
        }, [url]);

        return {data, isPending, error}
}

export default useFetch;