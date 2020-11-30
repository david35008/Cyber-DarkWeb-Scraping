import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import axios from 'axios';
import ErrorBoundary from "../Components/ErrorBoundary";
import Loading from "../Components/Loading";
import Header from "../Components/Header";
import useDebounce from '../Components/Debounce';

const NotFound = lazy(() => import("./NotFound"));
const Home = lazy(() => import("./Home"));

export default function Router() {

    const [data, setData] = useState([]);
    const [newData, setNewData] = useState([]);
    const [newDataLength, setNewDataLength] = useState(0);
    const [searchInput, setSearchInput] = useState('')
    const [isSearching, setIsSearching] = useState(false);
    const [sentiment, setSentiment] = useState("default");
    const [url, setUrl] = useState("/api/v1/data");
    
    const debouncedSearchTerm = useDebounce(searchInput, 500);

    const fetchData = async () => {
        try {
            const query = searchInput ? `?query=${searchInput}` : "";
            const { data: dataFromDb } = await axios.get(`${url}${query}`);
            // if (data.length > state.length) {
            // setNewDataLength(data.length - state.length)
            // setNewData(data.slice(state.length, data.length - state.length))
            setData(dataFromDb);
            setIsSearching(false);
            // }
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
        // const getData = setInterval(async () => {
        if (debouncedSearchTerm) {
            setIsSearching(true);
            fetchData();
        } else {
            fetchData();
        }
        // }, 5000);
        // return () => clearInterval(getData);
    }, [debouncedSearchTerm, url])

    return (
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                <ErrorBoundary>
                    <Header
                        news={newDataLength}
                        newData={newData}
                        setNewData={setNewData}
                        setNewDataLength={setNewDataLength}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                    />
                    <Switch >
                        <Route exact path="/">
                            <Home data={data} sentimentHandler={sentimentHandler} sentiment={sentiment} />
                        </Route>
                        <Route path="*">
                            <NotFound />
                        </Route>
                    </Switch>
                </ErrorBoundary>
            </Suspense>
        </BrowserRouter>
    )

}
