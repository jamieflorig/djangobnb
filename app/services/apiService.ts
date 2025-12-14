import { getAccessToken, refreshAccessToken, resetAuthCookies } from "../lib/actions";
import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_HOST;

const apiService = {
    get: async function (url: string, isRetry = false): Promise<any> {
        console.log('get', url);

        const token = await getAccessToken();
        if (!token && !isRetry) {
            // If there's no token and this isn't a retry, redirect to login
            redirect('/login');
        }

        const fullUrl = `${process.env.NEXT_PUBLIC_API_HOST}${url}`;
        console.log('Fetching URL:', fullUrl);

        try {
            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                cache: 'no-store' // Prevent caching of authenticated requests
            });

            if (response.status === 404) {
                console.log('Resource not found (404)');
                return null;
            }

            // Handle 401 Unauthorized (token expired or invalid)
            if (response.status === 401 && !isRetry) {
                console.log('Access token expired, attempting to refresh...');
                const refreshResult = await refreshAccessToken();
                
                if (refreshResult.success && refreshResult.accessToken) {
                    // Retry the original request with the new token
                    console.log('Token refreshed, retrying request...');
                    return this.get(url, true); // Pass true to indicate this is a retry
                } else {
                    // If refresh failed, clear auth and redirect to login
                    console.log('Refresh token failed, logging out...');
                    await resetAuthCookies();
                    redirect('/login');
                }
            }

            if (!response.ok) {
                const errorData = await response.text();
                console.error('API Error Response:', errorData);
                throw new Error(`API request failed with status ${response.status}`);
            }

            if (response.status === 204) {
                return null; // Handle No Content
            }

            const data = await response.json();
            console.log('Response:', data);
            return data;
            
        } catch (error) {
            console.error('API Service Error:', error);
            if (!isRetry) {
                // Only redirect on first attempt to prevent infinite loops
                await resetAuthCookies();
                redirect('/login');
            }
            throw error;
        }
    },

    post: async function(url: string, data: any): Promise<any> {
        console.log('post', url, data);

        const token = await getAccessToken();
        const fullUrl = `${process.env.NEXT_PUBLIC_API_HOST}${url}`;

        const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

        const headers: HeadersInit = {
            'Authorization': `Bearer ${token}`,
        };

        const body = isFormData ? data : JSON.stringify(data);

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        return new Promise((resolve, reject) => {
            fetch(fullUrl, {
            method: 'POST',
            body,
            headers,
        })

        .then(response => {
                // Check if the response status is OK (200-299)
                if (response.ok) {
                    if (response.status === 204) {
                        return null; // Handle No Content
                    }
                    return response.json();
                } else {
                    // Handle server errors (4xx, 5xx)
                    throw new Error(`API request failed with status ${response.status}`);
                }
            })
            .then((json) => {
                console.log('Response:', json);
                resolve(json);
            })
            .catch((error => {
                console.error('API Service Error:', error);
                reject(error);
            }));
    });
},
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //             .then(response => response.json())
    //             .then((json) => {
    //                 console.log('Response:', json);

    //                 resolve(json);
    //             })
    //             .catch((error => {
    //                 reject(error);
    //             }))
    //     })
    // },

    postWithoutToken: async function(url: string, data: any): Promise<any> {
        console.log('post', url, data);

        const fullUrl = `${process.env.NEXT_PUBLIC_API_HOST}${url}`; 
        console.log('DEBUG: Full Signup API URL:', fullUrl);

        return new Promise((resolve, reject) => {
            // fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
            //     method: 'POST',
            //     body: data,
            fetch(fullUrl, { // <-- Ensure this uses the new fullUrl variable
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then((json) => {
                    console.log('Response:', json);

                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    }
}

export default apiService;