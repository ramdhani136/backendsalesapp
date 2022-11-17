const cookieParser = require("cookie-parser");
const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const path = require("path");
const { WaBot } = require("./utils/waBot");
const { PermissionData } = require("./middleware/DocRule");
const { verifyToken } = require("./middleware/VerifiyToken");
// const { List } = require("whatsapp-web.js");
// const expressBusboy = require("express-busboy");
// const fileUpload = require("express-fileupload");
// expressBusboy.extend(app);

const io = new Server(server, {
  cors: {
    // origin: "*",
    origin: ["*", "http://localhost:3000"],
    methods: ["GET", "POST"],
    transports: ["websocket", "polling", "flashsocket"],
    allowedHeaders: ["react-client"],
    credentials: true,
  },
});

const corsOptions = {
  origin: ["*", "http://localhost:3000"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use("/public", express.static(path.join(__dirname, "public/images")));
app.use("/images/users", express.static(path.join(__dirname, "public/users")));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(fileUpload());

const setEmit = (name, msg) => {
  io.emit(name, msg);
};

io.on("connection", (socket) => {
  console.log("Connected Successfully", socket.id);
  socket.on("disconnect", () => {
    console.log("disocnnnect ", socket.id);
  });
});

module.exports.setEmit = setEmit;

const port = process.env.PORT || 5000;

// Import WaBot
WaBot();

// End

const deviceRouter = require("./routes/deviceRoute");
const branchRouter = require("./routes/branchRoute");
const userRouter = require("./routes/userRoute");
const cgRouter = require("./routes/customerGroupRoute");
const customerRoute = require("./routes/customerRoute");
const visitRoute = require("./routes/visitRoute");
const callSheetRoute = require("./routes/callSheetRoute");
const profileRoleRoute = require("./routes/roleProfileRoute");
const roleListRoute = require("./routes/roleListRoute");
const roleUserRoure = require("./routes/roleUserRoute");
const permissionRoute = require("./routes/permissionRoute");
const contactRoute = require("./routes/contactRoute");
const notifRoute = require("./routes/notifRoute");
const userGroupRoute = require("./routes/userGroupRoute");
const listUserGroupRoute = require("./routes/listUserGroupRoute");
const scheduleRoute = require("./routes/ScheduleRoute");
var myModul = require("./utils/waBot");

// app.get("/coba", async (req, res) => {
//   const message = `Halo perkenalkan saya Vika (bot system) dari Pt. Ekatunggal 🙏
// Mohon berikan rating dari Bapak/Ibu tentang komunikasi
// yang sudah dilakukan oleh tim sales kami.
// dari skala (tidak baik) 1-5 (sangat baik)
// `;
//   let sections = [
//     {
//       title: "Silahkan berikan penilaian :)",
//       rows: [
//         {
//           title: "#CST00120220900131_1",
//           description: "⭐",
//         },
//         {
//           title: "#CST00120220900131_2",
//           description: "⭐⭐",
//         },
//         {
//           title: "#CST00120220900131_3",
//           description: "⭐⭐⭐",
//         },
//         {
//           title: "#CST00120220900131_4",
//           description: "⭐⭐⭐⭐",
//         },
//         {
//           title: "#CST00120220900131_5",
//           description: "⭐⭐⭐⭐⭐",
//         },
//       ],
//     },
//   ];
//   let list = new List(message, "Rate", sections, "VST2022082222152", "footer");
//   await myModul.kirimpesan("089637428874@c.us", list);
//   res.send("hjahja");
// });
app.use("/qr", async (req, res) => {
  const client = myModul.allClient;
  await client[0].destroy();
  client[0].initialize();
  res.send("req status qr");
});
app.use("/device", verifyToken, PermissionData, deviceRouter);
app.use("/branch", verifyToken, PermissionData, branchRouter);
app.use("/users", userRouter);
app.use("/customergroup", verifyToken, PermissionData, cgRouter);
app.use("/customer", verifyToken, PermissionData, customerRoute);
// app.use("/visit", visitRoute);
app.use("/visit", verifyToken, PermissionData, visitRoute);
app.use("/contact", verifyToken, PermissionData, contactRoute);
app.use("/callsheet", verifyToken, PermissionData, callSheetRoute);
app.use("/roleprofile", verifyToken, PermissionData, profileRoleRoute);
app.use("/rolelist", verifyToken, PermissionData, roleListRoute);
app.use("/roleuser", verifyToken, PermissionData, roleUserRoure);
app.use("/permission", verifyToken, PermissionData, permissionRoute);
app.use("/notif", verifyToken, PermissionData, notifRoute);
app.use("/usergroup", verifyToken, PermissionData, userGroupRoute);
app.use("/listusergroup", verifyToken, PermissionData, listUserGroupRoute);
app.use("/schedule", verifyToken, PermissionData, scheduleRoute);
app.get("*", function (req, res) {
  res.status(404).send("404 NOT FOUND");
});

server.listen(port, () => {
  console.log(`Listening port : ${port}`);
});

module.exports = { io };
