import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import axios from 'axios';
import ErrorBoundary from "../Components/ErrorBoundary";
import Loading from "../Components/Loading";
import Header from "../Components/Header";

const NotFound = lazy(() => import("./NotFound"));
const Home = lazy(() => import("./Home"));

export default function Router() {

    const [data, setData] = useState([]);
    const [newData, setNewData] = useState([]);
    const [newDataLength, setNewDataLength] = useState(0);
    const [searchInput, setSearchInput] = useState('')

    const fetchData = async () => {
        try {
            const { data: dataFromDb } = await axios.get(`/api/v1/data?query=${searchInput}`);
            // if (data.length > state.length) {
            // setNewDataLength(data.length - state.length)
            // setNewData(data.slice(state.length, data.length - state.length))
            setData(dataFromDb);
            // }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        // const getData = setInterval(async () => {
        fetchData();
        // }, 5000);
        // return () => clearInterval(getData);
    }, [searchInput])

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
                            <Home data={data} />
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
