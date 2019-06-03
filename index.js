const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:3000" }); //change origins if you want to deploy
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./db");
const bcrypt = require("./bcrypt");
const csurf = require("csurf");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const config = require("./config");

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(require("body-parser").json());
app.use(compression());
app.use(express.static("./public"));

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//////////////////////////////////////////////////////////////////////////////// image upload boilerplate

//takes the uploaded file, gives it a unique name of 24 characters (uidSafe)+ the original file extension (path), stores it in our /uploads folder
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

//actually doing the uploading
var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

///////////////////////////////////

app.post(
    "/profilePic/upload",
    uploader.single("uploadedFile"),
    s3.upload,
    (req, res) => {
        console.log("POST /upload");

        // console.log("req body: ", req.body);
        // console.log("req file: ", req.file);
        db.addImage(config.s3Url + req.file.filename, req.session.userId)
            .then(({ rows }) => {
                res.json({
                    imageurl: rows[0].imageurl
                });
            })
            .catch(err => console.log("error in profilePic uploader", err));
    }
);
////////////////////////////////////////////////
app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/welcome/register", (req, res) => {
    bcrypt
        .hash(req.body.password)
        .then(hashedPassword => {
            console.log("register- post-returned");
            return db.registerUser(
                req.body.first,
                req.body.last,
                req.body.email,
                hashedPassword,
                req.body.imageurl,
                req.body.bio
            );
        })
        .then(({ rows }) => {
            req.session.userId = rows[0].id;
            res.json({ success: true });
        })
        .catch(function(err) {
            console.log("register- Error is:", err);
            res.json({ success: false });
        });
});

app.post("/welcome/login", (req, res) => {
    db.getLoginInfo(req.body.email)
        .then(results => {
            req.session.userId = results.rows[0].id;

            if (results.rows[0].password) {
                return bcrypt.compare(
                    req.body.password,
                    results.rows[0].password
                );
            } else {
                res.json({ notRegistered: true });
            }
        })
        .then(() => {
            res.json({ success: true });
        })
        .catch(function(err) {
            console.log("login- Error is:", err);
            res.json({ success: false });
        });
});
///////////////////////

app.get("/user", (req, res) => {
    db.getUserInfo(req.session.userId)
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            console.log("error in /user: ", err);
        });
});

/////////////////////
app.post("/updatebioo", (req, res) => {
    const bio = req.body.bioDraft;
    console.log("/updatebio userid hello:", req.session.userId);
    db.updateBio(bio, req.session.userId)
        .then(results => {
            res.json(results.rows[0].bio);
        })
        .catch(err => {
            console.log("error while updating bio: ", err);
            res.json({ error: true });
        });
});
//////////

app.get("/user/:id.json", (req, res) => {
    // console.log("index req.session.userid ", req.session.userId);
    // console.log("index req.params.id ", req.params.id);
    if (req.session.userId == req.params.id) {
        // console.log("index- same user");

        return res.json({ redirectTo: "/" });
    }
    db.getUserInfo(req.params.id)
        .then(results => {
            // console.log('data hjjhjkh:',data);
            res.json(results);
        })
        .catch(error => {
            console.log("error in getting /user/:id.json:", error);
        });
});

////////////////////friendship

app.get("/friendshipStatus/:id", (req, res) => {
    db.getFriendship(req.session.userId, req.params.id)
        .then(results => {
            // console.log("RESULTS sendFriendship", dbInfo);
            res.json(results);
        })
        .catch(err => {
            console.log("error in /user: ", err);
        });
});

app.post("/sendFriendship/:id", (req, res) => {
    // console.log(
    //     "index. js friendship:: req.session.userId:",
    //     req.session.userId
    // );
    // console.log("req.params.id:", req.params.id);
    db.sendFriendship(req.session.userId, req.params.id)
        .then(results => {
            // console.log("RESULTS sendFriendship", results);
            res.json(results);
        })
        .catch(err => {
            console.log("error while sendFriendship: ", err);
            res.json({ error: true });
        });
});
app.post("/acceptFriendship/:id", (req, res) => {
    db.acceptFriendship(req.session.userId, req.params.id)
        .then(results => {
            // console.log("RESULTS sendFriendship", results);
            res.json(results);
        })
        .catch(err => {
            console.log("error while acceptFriendship: ", err);
            res.json({ error: true });
        });
});

app.post("/removeFriendship/:id", (req, res) => {
    db.removeFriendship(req.session.userId, req.params.id)
        .then(results => {
            // console.log("RESULTS sendFriendship", results);
            res.json(results);
        })
        .catch(err => {
            console.log("error while removeFriendship: ", err);
            res.json({ error: true });
        });
});

////////////////// friendship

app.get("/friends/list", (req, res) => {
    db.getFriendshipLists(req.session.userId)
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            console.log("error while getting friendshiplists: ", err);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

////////--Always keep at the end
app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
///////////////////

server.listen(3000, function() {
    console.log("I'm listening.");
});
////////////////////

let onlineUsers = {};

io.on("connection", function(socket) {
    if (!socket.request.session || !socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;
    // socket.emit("userId", userId);
    onlineUsers[socket.id] = userId;

    let userIds = Object.values(onlineUsers);

    //onlineUsers data flow
    db.getUsersByIds(userIds).then(results => {
        // console.log("update", results);
        socket.emit(
            "onlineUsers",
            results.rows.filter(i => {
                if (i.id == userId) {
                    return false;
                } else {
                    return true;
                }
            })
        );
    });

    //userJoined data flow
    var filteredOwnUserIds = userIds.filter(id => id == userId);
    if (filteredOwnUserIds.length == 1) {
        db.getUserInfo(userId).then(results => {
            socket.broadcast.emit("userJoined", results.rows);
        });
    }

    //userLeft data flow
    socket.on("disconnect", function() {
        delete onlineUsers[socket.id];
        if (Object.values(onlineUsers).indexOf(userId) == -1) {
            io.sockets.emit("userLeft", userId);
        }
    });
    socket.on("disconnect", function() {
        delete onlineUsers[socket.id];
        if (Object.values(onlineUsers).indexOf(userId) == -1) {
            io.sockets.emit("userLeft", userId);
        }
    });
    //load chatMessages data flow
    db.getChatMessages()
        .then(results => {
            socket.emit("chatMessages", results.rows);
        })
        .catch(err => {
            console.log("error while loading chatMessages: ", err);
        });

    //add chatMessage data flow
    socket.on("chatMessageFromUserInput", async text => {
        const userInfo = await db.getUserInfo(userId);
        // console.log("userinfo:", userInfo);
        let newMessage = {
            message: text,
            sender_first: userInfo.rows[0].first,
            sender_last: userInfo.rows[0].last,
            sender_id: userInfo.rows[0].id,
            sender_url: userInfo.rows[0].imageurl
        };
        // console.log(
        //     "message:",
        //     newMessage.message,
        //     " sender: ",
        //     newMessage.sender_id
        // );
        db.addChatMessage(newMessage.message, newMessage.sender_id)
            .then(dbInfo => {
                newMessage.message_id = dbInfo.rows[0].id;
                newMessage.message_created_at = dbInfo.rows[0].created_at;
                io.sockets.emit("chatMessageFromServer", newMessage);
            })
            .catch(err => {
                console.log("error while adding new chatmessage: ", err);
            });
    });
});
