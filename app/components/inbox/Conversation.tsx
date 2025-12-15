'use client';

import { useRouter } from "next/navigation";
import { ConversationType } from "@/app/inbox/page";

interface ConversationProps {
    conversation: ConversationType,
    userId: string;
}

const Conversation: React.FC<ConversationProps> = ({
    conversation,
    userId
}) => {
    const router = useRouter();
    const otherUser = conversation.users.find((user) => user.id != userId)
    return (
        <div className="px-6 py-3 cursor-pointer border border-gray-300 rounded-xl">
            <p className="mb-6 text-xl">{otherUser?.name}</p>

            <p
                onClick={() => router.push(`/inbox/${conversation.id}`)} 
                className="text-airbnb-dark"
            >
                Go to conversation
            </p>
        </div>
    )
}
export default Conversation;




// import Link from 'next/link';
// import { formatDistanceToNow } from 'date-fns';

// type User = {
//     id: string;
//     name: string;
//     avatar_url: string | null;
// };

// type ConversationProps = {
//     id: string;
//     users: User[];
//     updatedAt: string;
// };

// const Conversation = ({ id, users, updatedAt }: ConversationProps) => {
//     // In a real app, you'd want to filter out the current user
//     const otherUser = users.length > 0 ? users[0] : null;

//     if (!otherUser) {
//         return null;
//     }

//     return (
//         <Link href={`/inbox/${id}`} className="block">
//             <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
//                 <div className="flex items-center space-x-4">
//                     <div className="flex-shrink-0">
//                         <img 
//                             src={otherUser.avatar_url || '/default-avatar.png'} 
//                             alt={otherUser.name}
//                             className="w-12 h-12 rounded-full object-cover"
//                         />
//                     </div>
//                     <div className="min-w-0 flex-1">
//                         <div className="flex justify-between items-center">
//                             <h3 className="text-lg font-medium text-gray-900 truncate">
//                                 {otherUser.name}
//                             </h3>
//                             <span className="text-sm text-gray-500 whitespace-nowrap">
//                                 {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
//                             </span>
//                         </div>
//                         <p className="text-sm text-gray-500 truncate">
//                             Click to view conversation
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </Link>
//     );
// };

// export default Conversation;