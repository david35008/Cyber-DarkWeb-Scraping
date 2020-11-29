import React, { lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ErrorBoundary from "../Components/ErrorBoundary";
import Loading from "../Components/Loading";
import Header from "../Components/Header";

const NotFound = lazy(() => import("./NotFound"));
const Home = lazy(() => import("./Home"));

export default function Router() {

    return (
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                <ErrorBoundary>
                    <Header />
                    <Switch >
                        <Route exact path="/">
                            <Home />
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
