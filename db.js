const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg(`postgres:webuser:webuser@localhost:5432/social`);
}

module.exports.registerUser = function(
    first,
    last,
    email,
    hashedPassword,
    imageurl,
    bio
) {
    return db.query(
        `INSERT INTO users (first, last, email, password, imageurl, bio)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [first, last, email, hashedPassword, imageurl, bio]
    );
};

module.exports.getLoginInfo = function(email) {
    return db.query(
        `SELECT *
        FROM users
        WHERE email = $1`,
        [email]
    );
};

module.exports.getUserInfo = function(id) {
    return db.query(
        `SELECT *
        FROM users
        WHERE id = $1`,
        [id]
    );
};

module.exports.addImage = function(imageurl, id) {
    return db.query(
        `UPDATE users
        SET imageurl = $1
        WHERE id = $2
        RETURNING imageurl`,
        [imageurl, id]
    );
};

module.exports.updateBio = function(bio, id) {
    return db.query(
        `UPDATE users
        SET bio = $1
        WHERE id = $2
        RETURNING bio`,
        [bio, id]
    );
};

exports.getFriendship = (loggedInId, otherUserId) => {
    return db.query(
        `SELECT * FROM friendship
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)`,
        [loggedInId, otherUserId]
    );
};
/////friendship

module.exports.sendFriendship = (loggedInId, otherUserId) => {
    return db.query(
        `INSERT INTO friendship (sender_id, recipient_id)
        VALUES ($1, $2) returning *`,
        [loggedInId, otherUserId]
    );
};
module.exports.acceptFriendship = (loggedInId, otherUserId) => {
    return db.query(
        `UPDATE friendship
        SET accepted = true
         WHERE (recipient_id = $1 AND sender_id= $2)`,
        [loggedInId, otherUserId]
    );
};
module.exports.removeFriendship = (loggedInId, otherUserId) => {
    return db.query(
        `DELETE FROM friendship
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)`,
        [loggedInId, otherUserId]
    );
};

/////friendship

module.exports.getFriendshipLists = id => {
    return db.query(
        `SELECT users.id, first, last, imageurl, accepted
        FROM friendship
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
    `,
        [id]
    );
};

module.exports.getUsersByIds = function(arrayOfIds) {
    return db.query(
        `SELECT *
         FROM users
       WHERE users.id = ANY($1)`,
        [arrayOfIds]
    );
};

module.exports.getChatMessages = function() {
    return db.query(
        `SELECT users.id AS sender_id, users.first AS sender_first, users.last AS sender_last, users.imageurl AS sender_url, message, chatmsg.id AS message_id, chatmsg.created_at AS message_created_at
        FROM chatmsg
        LEFT JOIN users
        ON chatmsg.user_id = users.id
        ORDER BY chatmsg.created_at DESC
        LIMIT 10`
    );
};
////////////////////////////////////////////
module.exports.addChatMessage = function(message, user_id) {
    return db.query(
        `INSERT INTO chatmsg (message, user_id)
        VALUES ($1, $2)
        RETURNING *`,
        [message, user_id]
    );
};
