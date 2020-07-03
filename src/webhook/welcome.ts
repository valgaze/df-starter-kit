export default function (conv, parameters) {
  const data = Math.random();

  conv.ask(`Hey there, your random number is ${data}`);
  console.log("\n##\n", conv.request);
  if (conv.request) {
    conv.ask(
      `Btw, you sent this request data up w/ the Welcome event ${JSON.stringify(
        conv.request
      )}`
    );
  }
}
