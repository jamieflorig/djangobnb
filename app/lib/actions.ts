'use server';

import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();
    
    await cookieStore.set('session_userid', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/'
    });

    await cookieStore.set('session_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 60 minutes
        path: '/'
    });

    await cookieStore.set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/'
    });
}

export async function resetAuthCookies() {
    const cookieStore = await cookies();
    await cookieStore.delete('session_userid');
    await cookieStore.delete('session_access_token');
    await cookieStore.delete('session_refresh_token');
}

export async function getUserId() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('session_access_token')?.value;
    const userId = cookieStore.get('session_userid')?.value;
    
    if (!accessToken || !userId) {
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            cache: 'no-store'
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Clear invalid tokens
                cookieStore.delete('session_access_token');
                cookieStore.delete('session_refresh_token');
                cookieStore.delete('session_userid');
            }
            return null;
        }

        const user = await response.json();
        return user.id;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

export async function getAccessToken() {
    let accessToken = (await cookies()).get('session_access_token')?.value;

    return accessToken;
}

export async function getRefreshToken() {
    const refreshToken = (await cookies()).get('session_refresh_token')?.value;
    return refreshToken;
}

export async function refreshAccessToken() {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
        return { success: false, status: 401 };
    }

    const fullUrl = `${process.env.NEXT_PUBLIC_API_HOST}/api/auth/token/refresh/`;

    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
        return { success: false, status: response.status };
    }

    const data = await response.json();
    const access = data.access as string | undefined;
    const refresh = data.refresh as string | undefined;

    if (access) {
        (await cookies()).set('session_access_token', access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60,
            path: '/',
        });
    }

    if (refresh) {
        (await cookies()).set('session_refresh_token', refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });
    }

    return { success: !!access, status: 200, accessToken: access };
}

export async function bookProperty(propertyId: string, formData: FormData) {
    const fullUrl = `${process.env.NEXT_PUBLIC_API_HOST}/api/properties/${propertyId}/book/`;

    const cloneFormData = (source: FormData) => {
        const cloned = new FormData();
        for (const [key, value] of source.entries()) {
            cloned.append(key, value);
        }
        return cloned;
    };

    const doRequest = async (token: string | undefined, body: FormData) => {
        const headers: HeadersInit = {};

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return fetch(fullUrl, {
            method: 'POST',
            body,
            headers,
        });
    };

    let token = await getAccessToken();
    let response = await doRequest(token, cloneFormData(formData));

    if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed.success) {
            token = refreshed.accessToken;
            response = await doRequest(token, cloneFormData(formData));
        }
    }

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!response.ok) {
        const errorBody = isJson ? await response.json() : await response.text();
        return {
            success: false,
            status: response.status,
            error: errorBody,
        };
    }

    if (response.status === 204) {
        return { success: true };
    }

    return isJson ? await response.json() : { success: true };
}