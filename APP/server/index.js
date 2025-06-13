const express = require('express');
const {createServer} = require('node:http');
const setUpSocketIO = require('./Server_Config/socketIOConfig');

require('dotenv').config();


const app = express();

// Middle Wares

    // for json parsing
    app.use(express.json());

    //for cookie parsing
    const cookie_parser = require('cookie-parser');
    app.use(cookie_parser());

    //for file upload parsing
    const fileUpload = require('express-fileupload');
    app.use(
        fileUpload(
            {
                useTempFiles:true,
                tempFileDir:'/tmp',
            }
        )
    )


// cors config to allow cross origin requests
const cors = require('cors');
app.use(
    cors(
        {
            origin:process.env.FRONT_END_URL,
            credentials:true,
        }
    )
)

//Routes for the Express APP
const baseUrl = process.env.API_MOUNTING;
const authRouter = require('./Routes/authRoutes');
const profileRouter = require('./Routes/profileRoutes');
const roomRouter = require('./Routes/roomRoutes');

app.use(`${baseUrl}/auth`,authRouter);
app.use(`${baseUrl}/profile`,profileRouter);
app.use(`${baseUrl}/room`,roomRouter);


// create a instance of server to use
const server = createServer(app);

//make the server listen for http requests
const PORT = process.env.PORT || 4000;
server.listen(PORT,() => {
    console.log('The express server is RUNNING CORRECTLY');
});

//default route
app.get('/',(req,res) => {
    return res.send(`<h1>The Server Is Running Correctly</h1>`);
})

//set up the web socket for socket io
setUpSocketIO(server);

//connect to the cloudinary for file media storage
const cloudinaryConnect = require('./Server_Config/CloudinaryConfig');
cloudinaryConnect();

//connect to the database
const {dbConnect} = require('./Server_Config/DatabaseConfig');
const { base } = require('./Models/User');
dbConnect();