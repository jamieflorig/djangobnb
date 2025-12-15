import { getUserId } from "../lib/actions";
import apiService from "../services/apiService";
import React, { useState, useEffect } from 'react';
import Conversation from "../components/inbox/Conversation";

export type UserType = {
    id: string;
    name: string;
    avatar_url: string;
}

export type ConversationType = {
    id: string;
    users: UserType[];
}

export default async function InboxPage() {
    const userId = await getUserId();
    
    if (!userId) {
        return (
            <main className="max-w-[1500px] mx-auto px-6 py-12">
                <p className="text-center">You need to be authenticated...</p>
            </main>
        );
    }

        const conversations = await apiService.get('/api/chat/')

        return (
            <main className="max-w-[1500px] mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold mb-6">Inbox</h1>
                
                    {conversations.map((conversation: ConversationType) => {
                        return (
                            <Conversation 
                                userId={userId}
                                key={conversation.id}
                                conversation={conversation}
                            />
                        )
                    })}
            </main>
        )
    }