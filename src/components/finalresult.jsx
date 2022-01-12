import React, { useEffect, useState } from 'react'
const url = 'https://uselessfacts.jsph.pl/random.json'
const FinalResult = ({ reset,...props }) => {
    const [fact, setFact] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const loadFact = async () => {
        try {
            setError(false)
            setLoading(true)
            const response = await fetch(url, { method: 'GET' })
            const jsonresponse = await response.json();
            setFact(jsonresponse)
            console.log(jsonresponse)

        }
        catch (error) {
            setError(true);
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        loadFact()
    }, [])
    
    return(
        <div style={{ position: 'fixed', display: 'block', zIndex: '3000', backgroundColor: 'rgba(230,230,230,0.9)', top: '0', left: '0', width: '100%', height: '100%' }}>
            <div className='container'>
                <h1>Final result</h1>
                {error && <h1 style={{ color: 'red' }}>Error loading random facts </h1>}
                {!error && loading && <h1 style={{ color: 'blue' }}>loading...</h1>}
                {!error && !loading && fact &&
                    <div className="container bg-white border shadow" >

                        <div className="row p-2 text-success">
                            <div className="col-12" >{fact.text }</div>
                        </div>
                        <div className="row p-2 text-secondary">
                            <div className="col-4 " >source</div>
                            <div className="col-8 " >{fact.source}</div>
                        </div>
                        <div className="row p-2 text-secondary">
                            <div className="col-4 " >url</div>
                            <div className="col-8 "  ><a style={{ fontSize: '10px' }} href={fact.source_url}>{fact.source_url}</a></div>
                        </div>

                        
                    </div>
                }
                <button onClick={reset} type="button" className="btn btn-danger m-2 col-sm-6 col-xl-4 col-12" >Reset</button>
            </div>
        </div>
    )
}

export default FinalResult