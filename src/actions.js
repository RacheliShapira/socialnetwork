import axios from "./axios";

export function receiveFriendsList() {
    return axios.get("/friends/list").then(results => {
        return {
            type: "RECEIVE_FRIENDS_WANNABEES",
            list: results.data.rows
        };
    });
}

export function acceptFriendRequest(wannabe_id) {
    return axios.post("/acceptFriendship/" + wannabe_id).then(() => {
        return {
            type: "ACCEPT_FRIEND_REQUEST",
            id: wannabe_id
        };
    });
}

export function unFriend(friend_id) {
    return axios
        .post("/removeFriendship/" + friend_id, { action: "UNFRIEND" })
        .then(() => {
            return {
                type: "UNFRIEND",
                id: friend_id
            };
        });
}
////////////////////////////////////

export function addUserId(id) {
    return {
        type: "ADD_USER_ID",
        userId: id
    };
}

export function createOnlineUsersList(users) {
    // console.log("users!!!", users);
    return {
        type: "CREATE_ONLINE_USERS_LIST",
        users: users
        //users is an array of user objects
    };
}

export function addToOnlineusersList(user) {
    return {
        type: "ADD_ONLINE_USERS_LIST",
        user: user
    };
}

export function removeFromOnlineUsersList(id) {
    return {
        type: "REMOVE_ONLINE_USERS_LIST",
        id: id
    };
}

///////////////////////////////////////
export function receiveChatMessages(messages) {
    return {
        type: "LOAD_CHAT_MESSAGES",
        messages: messages
    };
}

export function addChatMessage(newMessage) {
    return {
        type: "ADD_CHAT_MESSAGE",
        newMessage: newMessage
    };
}
