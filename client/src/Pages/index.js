import React, { lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ErrorBoundary from "../Components/ErrorBoundary";
import Loading from "../Components/Loading";

const NotFound = lazy(() => import("./NotFound"));
const Home = lazy(() => import("./Home"));
const Alert = lazy(() => import("./Alerts"));

export default function Router() {

    return (
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                <ErrorBoundary>
                    <Switch >
                        <Route exact path="/Alerts">
                            <Alert />
                        </Route>
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
