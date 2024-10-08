const exprees = require("express");
const bookPath = require("./routes/book");
const authorsPath = require("./routes/authors");
const authPath = require("./routes/auth");
const usersPath = require("./routes/user");

const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const { notFound, errorHandler } = require("./middleware/errors");
const connectToDb = require("./config/db");
dotenv.config();

//Connection To DataBase
connectToDb();

//init app
const app = exprees();
// Apply middlware
// Apply middlware to transfer Json to js
app.use(exprees.json());
app.use(logger);

// Routes
app.use("/api/books", bookPath);
app.use("/api/authors", authorsPath);
app.use("/api/users", usersPath);
app.use("/api/auth", authPath);

//Error handler middlware
app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server isrunning on port ${PORT}`));
