const app = require("./src/app");

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  server.close(() => console.log(`Exit server express`));
});
