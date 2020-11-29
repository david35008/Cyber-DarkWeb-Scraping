import React, { useEffect, useState, lazy } from 'react';
import axios from 'axios';
import Loading from "../../Components/Loading";
import Card from '../../Components/Card';

const NotFound = lazy(() => import("../NotFound"));

export default function Home() {

    const [data, setData] = useState()
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const { data } = await axios.get(`/api/v1/data`);
            setData(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    return (
        !loading ?
            data ? (
                <div className="App">
                    {data.map(post =>
                        <Card
                            title={post.title}
                            content={post.content}
                            date={`${new Date(post.date).toDateString()}`}
                            author={post.author}
                        />
                    )
                    }
                </div >
            ) :
                <NotFound />
            : (<Loading />)

    );
};
