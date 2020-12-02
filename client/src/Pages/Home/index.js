import React, { lazy, useState, useEffect } from 'react';
import axios from 'axios';
import Button from "@material-ui/core/Button";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ReplyIcon from "@material-ui/icons/Reply";
import Card from '../../Components/Cards/Data';
import Header from '../../Components/Header';

const NotFound = lazy(() => import("../NotFound"));

export default function Home() {

    const [data, setData] = useState([]);
    const [sentiment, setSentiment] = useState("default");
    const [url, setUrl] = useState("/api/v1/data");

    const fetchData = async () => {
        try {
            const { data: dataFromDb } = await axios.get(`${url}`);
            setData(dataFromDb);
        } catch (error) {
            console.error(error);
        }
    }

    const sentimentHandler = (sentimentValue) => {
        setSentiment(sentimentValue);
        if (sentimentValue !== "default") {
            setUrl(`/api/v1/data/${sentimentValue}`);
        } else {
            setUrl(`/api/v1/data`);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])


    return (
        <>
            <Header url={url} setData={setData} />
            {data ? (
                <div className="App">
                    <>
                        {sentiment !== "positive" ? (
                            <Button
                                color="primary"
                                onClick={() => sentimentHandler("positive")}
                            >
                                Positive Results <ThumbUpIcon style={{ paddingLeft: 5 }} />
                            </Button>
                        ) : (
                                <Button color="primary" onClick={() => sentimentHandler("default")}>
                                    All Results <ReplyIcon style={{ paddingLeft: 5 }} />
                                </Button>
                            )}
                    </>
                    <>
                        {sentiment !== "negative" ? (
                            <Button
                                color="secondary"
                                onClick={() => sentimentHandler("negative")}
                            >
                                Negative Results
                                <ThumbDownIcon style={{ paddingLeft: 5 }} />
                            </Button>
                        ) : (
                                <Button
                                    color="secondary"
                                    onClick={() => sentimentHandler("default")}
                                >
                                    All Results <ReplyIcon style={{ paddingLeft: 5 }} />
                                </Button>
                            )}
                    </>
                    {data.map((post, index) =>
                        <Card
                            key={post.content + post.title + index}
                            title={post.title}
                            content={post.content}
                            date={`${new Date(post.date).toDateString()}`}
                            author={post.author}
                            score={post.score}
                            nerAnalysis={post.nerAnalysis}
                        />
                    )
                    }
                </div >
            ) :
                <NotFound />
            }
        </>
    );
};
