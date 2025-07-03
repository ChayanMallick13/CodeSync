const ChatMessage = require("../Models/ChatMessage");
const User = require("../Models/User");



exports.sendMessageHandler = async(data,io) => {
    try {
        const {Sender,Message,Room} = data;

        // console.log(data);

        // create a new message
        const newMessage = await ChatMessage.create(
            {
                Message,
                Room,
                Sender,
            }
        );

        const user = await User.findById(Sender);
        newMessage.Sender = user;

        // console.log(newMessage);

        // tell everyone about the new message except the sender
        io.to(Room).emit('newMessageAdd',newMessage);

    } catch (error) {
        console.error(error);
        console.log('Some Problem in Sending the message');
    }
}