import React, { useEffect, useState, lazy } from 'react';
import Card from '../../Components/Card';

const NotFound = lazy(() => import("../NotFound"));

export default function Home({ data }) {

    return (
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
    );
};
