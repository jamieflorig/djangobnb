import { getUserId } from "../../lib/actions";
import React, {useState, useEffect } from 'react';
import apiService from "@/app/services/apiService";
import ConversationDetail from "@/app/components/inbox/ConversationDetail";
import { UserType } from "../page";
import { getAccessToken } from "../../lib/actions";

export type MessageType = {
    id: string;
    name: string;
    body: string;
    conversationId: string;
    sent_to: UserType;
    created_by: UserType
}

interface PageProps {
    params: {
        id: string
    }
}

const ConversationPage = async (props: { params: { id: string } }) => {
    const { id: conversationId } = await Promise.resolve(props.params);
    const userId = await getUserId();
    const token = await getAccessToken();

    if (!userId || !token) {
        return (
            <main className="max-w-[1500px] max-auto px-6 py-12">
                <p>You need to be authenticated...</p>
            </main>
        )
    }

    if (!conversationId) {
        return (
            <main className="max-w-[1500px] max-auto px-6 py-12">
                <p>Invalid conversation ID</p>
            </main>
        )
    }

    let conversation = null;
    try {
        conversation = await apiService.get(`/api/chat/${conversationId}/`);
    } catch (error) {
        console.error('Error fetching conversation:', error);
        return (
            <main className="max-w-[1500px] max-auto px-6 py-12">
                <p>Error loading conversation. Please try again later.</p>
            </main>
        )
    }

    return (
        <main className="pt-6 max-w-[1500px] mx-auto px-6 pb-6">
            <ConversationDetail 
                token={token}
                userId={userId}
                messages={conversation.messages}
                conversation={conversation.conversation}
            />
        </main>
    )
}

export default ConversationPage;