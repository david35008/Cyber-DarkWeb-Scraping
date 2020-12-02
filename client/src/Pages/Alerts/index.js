import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from '../../Components/Header';
import AlertDataCard from "../../Components/Cards/Alert";

function AlertsPage() {

    const [data, setData] = useState([]);
    const [url] = useState("/api/v1/alerts");

    const fetchData = async () => {
        const { data: dataFromServer } = await axios.get(url);
        setData(dataFromServer);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Header url={url} setData={setData} />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "6%",
                }}
            >
                <h1>Welcome to The Alerts Page</h1>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 10,
                        justifyContent: "center",
                    }}
                >
                    {data.length > 0 ? (
                        data.map((element) => {
                            return (
                                <AlertDataCard
                                    key={element.id}
                                    data={element}
                                    fetchData={fetchData}
                                />
                            );
                        })
                    ) : (
                            <div>
                                <h1>Cards Not Found</h1>
                            </div>
                        )}
                </div>
            </div>
        </>
    );
}

export default AlertsPage;
