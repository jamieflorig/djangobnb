'use server';

import { error } from 'console';
import { max } from 'date-fns';
import { refresh } from 'next/cache';
import { cookies } from 'next/headers';
import path from 'path';
import { json } from 'stream/consumers';

export async function handleRefresh() {
    console.log('handleRefresh');

    const refreshToken = await getRefreshToken();

    const token = await fetch('http://localhost:8000/api/auth/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({
            refresh: refreshToken
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'    
        }
    })
        .then(response => response.json())
        .then(async (json) => {
            console.log('Response - Refresh:', json);

            if (json.access) {
                await (await cookies()).set('session_access_token', json.access, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60, //60 minutes
                    path: '/'
                });

                return json.access;
            } else {
                await resetAuthCookies();
            }
        })
        .catch((error) => {
            console.log('error', error);

            resetAuthCookies();
        })

    return token;
}

export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();
    await cookieStore.set('session_userid', userId, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/'
    });

    await cookieStore.set('session_access_token', accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60, // 60 minutes
        path: '/'
    });

    await cookieStore.set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/'
    });
}

export async function resetAuthCookies() {
    const cookieStore = await cookies();
    await cookieStore.set('session_userid', '');
    await cookieStore.set('session_access_token', '');
    await cookieStore.set('session_refresh_token', '');
}

//
// Get data

export async function getUserId() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_userid');
    return userId?.value || null;
}

export async function getAccessToken() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('session_access_token')?.value;
    return accessToken || null;
}

export async function refreshAccessToken() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('session_refresh_token')?.value;

    if (!refreshToken) {
        return { success: false, accessToken: null };
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh: refreshToken
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            const newAccessToken = data.access;

            await cookieStore.set('session_access_token', newAccessToken, {
                httpOnly: true,
                secure: false,
                maxAge: 60 * 60,
                path: '/'
            });

            return { success: true, accessToken: newAccessToken };
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
    }

    return { success: false, accessToken: null };
}

export async function getRefreshToken() {
    let refreshToken = (await cookies()).get('session_refresh_token')?.value;

    return refreshToken;
}