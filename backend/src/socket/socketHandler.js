const User = require("../models/User");
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const jwt = require("jsonwebtoken");
const socketAuthMiddleware = async (socket, next)=>{
    try{
            const token = socket.handshake.headers.token;
    if(!token) return next(new Error("invalid token"))
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.user = await User.findById(decoded.id).select("name avatar");
    if(!socket.user) return next(new Error("not found"))
        next();
    }catch(err){
        next(err)
    }

}
exports.socketHandler = (io) => {

    io.use(socketAuthMiddleware);

    io.on("connection", (socket) => {

        socket.join(
            socket.user._id.toString()
        );

        socket.on(
            "join-conversation",
            async (conversationId) => {

                const con =
                    await Conversation.findOne({
                        _id: conversationId,
                        participants:
                            socket.user._id
                    });

                if (con) {
                    socket.join(conversationId);
                }
            }
        );

        socket.on(
            "send-message",
            async ({
                conversationId,
                content,
                attachments = []
            }) => {

                try {

                    const con =
                        await Conversation.findOne({
                            _id: conversationId,
                            participants:
                                socket.user._id
                        });

                    if (!con) return;

                    let message =
                        await Message.create({
                            conversation:
                                conversationId,
                            sender:
                                socket.user._id,
                            content,
                            attachments,
                            readBy: [
                                socket.user._id
                            ]
                        });

                    message =
                        await message.populate(
                            "sender",
                            "name avatar"
                        );

                    await Conversation.findByIdAndUpdate(
                        conversationId,
                        {
                            lastMessage:
                                message._id,
                            lastMessageAt:
                                new Date()
                        }
                    );

                    io.to(conversationId)
                      .emit(
                          "receive-message",
                          message
                      );

                } catch (err) {

                    socket.emit(
                        "error",
                        {
                            message:
                                "Failed to send message"
                        }
                    );
                }
            }
        );

        socket.on(
            "typing",
            ({ conversationId }) => {

                socket
                    .to(conversationId)
                    .emit(
                        "user-typing",
                        {
                            userId:
                                socket.user._id
                        }
                    );
            }
        );

        socket.on(
            "stop-typing",
            ({ conversationId }) => {

                socket
                    .to(conversationId)
                    .emit(
                        "user-stop-typing",
                        {
                            userId: socket.user._id
                        }
                    );
            }
        );

    });
};