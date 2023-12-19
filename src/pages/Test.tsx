import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

const Test = () => {
    const auth = useAuth();
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {

            let access_token = auth?.user?.access_token;

            try {
                // Constructing the full URL
                const apiUrl = "http://localhost:8080/v3/test";

                // Making the GET request
                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });

                // Check if the request was successful (status code 2xx)
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                } else {
                    // Handle error cases, e.g., unauthorized access
                    console.error("Failed to fetch data:", response.status, response.statusText);
                }
            } catch (error) {
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <h1>Welcome, you are here!</h1>
            {data && <p>Data from the server: {JSON.stringify(data)}</p>}
        </>
    );
};

export default Test;
