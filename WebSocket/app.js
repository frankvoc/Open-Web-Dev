require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const OpenAI = require("openai");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});
app.use(express.static("public"));
const users = new Set();
io.on("connection", (socket) => {
    socket.on("chat message", async (msg) => {
        io.emit("chat message", { text: `${socket.username || "User"}: ${msg}`, fromBot: false });
        if (msg.startsWith("@bot ")) {
            const userMessage = msg.replace("@bot ", "");
            io.emit("bot typing", { username: "ChatGPT" });//typing event
            try {
                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: userMessage }],
                });
                const botResponse = completion.choices[0].message.content;
                io.emit("bot stop typing", { username: "ChatGPT" }); //stop typing event
                io.emit("chat message", { text: "ChatGPT: " + botResponse, fromBot: true });
            } catch (error) {
                io.emit("bot stop typing", { username: "ChatGPT" }); //stop typing event
                io.emit("chat message", { text: "OpenAI Error.", fromBot: true });
            }
        }
    });
    socket.on("set username", (username) => {
        socket.username = username;
        users.add(username);
        io.emit("user list", Array.from(users));
    });
    socket.on("disconnect", () => {
        users.delete(socket.username);
        io.emit("user list", Array.from(users));
    });
});
server.listen(3000, () => {
    console.log("Server running on port 3000");
});
