import React, { lazy } from 'react';
import Button from "@material-ui/core/Button";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ReplyIcon from "@material-ui/icons/Reply";
import Card from '../../Components/Card';

const NotFound = lazy(() => import("../NotFound"));

export default function Home({ data, sentimentHandler, sentiment }) {

    return (
        data ? (
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
                {data.map(post =>
                    <Card
                        key={post.content + post.title}
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
    );
};
