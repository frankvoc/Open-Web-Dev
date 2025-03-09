require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const OpenAI = require("openai");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static("public"));
const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});
const users = new Set();

io.on("connection", (socket) => {
    console.log("A new user connected to the server.");

    socket.on("chat message", async (msg) => {
        io.emit("chat message", { text: `${socket.username || "User"}: ${msg}`, fromBot: false });
        if (msg.startsWith("@bot ")) {
            const userMessage = msg.replace("@bot ", "");
            try {
                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: userMessage }],
                });
                const botResponse = completion.choices[0].message.content;
                io.emit("chat message", { text: "ChatGPT: " + botResponse, fromBot: true });
            } catch (error) {
                console.error("Error with OpenAI API:", error);
                io.emit("chat message", {text:"ChatGPT: OpenAI is having issues, please wait", fromBot: true});
            }
        }
    });
    socket.on("set username", (username) => {
        socket.username = username;
        users.add(username);
        io.emit("user list", Array.from(users));
    });
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.username);
        users.delete(socket.username);
        io.emit("user list", Array.from(users));
    });
});
server.listen(3000);