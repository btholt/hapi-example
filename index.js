const Hapi = require("hapi");

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOSTNAME || "localhost"
});

const options = {
  ops: {
    interval: 1000
  },
  reporters: {
    myConsoleReporter: [
      {
        module: "good-squeeze",
        name: "Squeeze",
        args: [{ log: "*", response: "*" }]
      },
      {
        module: "good-console"
      },
      "stdout"
    ]
  }
};

server.route({
  method: "GET",
  path: "/",
  handler: (request, h) => {
    return "Hello, world!";
  }
});

server.route({
  method: "GET",
  path: "/error",
  handler: (request, h) => {
    setTimeout(() => {
      throw new Error("someone wanted to see an error");
    }, 0);
    return "caused an error";
  }
});

server.route({
  method: "GET",
  path: "/{name}",
  handler: (request, h) => {
    return "Hello, " + encodeURIComponent(request.params.name) + "!";
  }
});

const init = async () => {
  await server.register({
    plugin: require("good"),
    options
  });
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
