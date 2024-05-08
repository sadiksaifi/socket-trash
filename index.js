const port = 3000;

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const { Server } = require("socket.io");
const io = new Server(server);

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use((req, res, next) => {
	console.log(req.ip);
	next();
})

io.on("connection", (socket) => {
	console.log("new conn", socket.id);
	socket.on("our-wallet", () => {
		socket.emit("0x04c33467d10c9121011462cd6ba343cb841df634");
	})

});

app.get("/cryptoapisverifydomain", (_, res) => {
	res.send("cryptoapis-cb-ac3d15c932b87b750d70bd60ae8ffe3ab36340e565b5b05fef3a3872c5544fb2");
})

app.post("/api/cryptoapi/callback", (req, res) => {
	console.log(req.body);

	io.sockets.emit("wallet::deposit", req.body);

	res.end();
})

app.get("/", (_req,res) => {
	res.send("welcome to api cryptoapi callback");
});

server.listen(port, () => {
	console.log(`started on ${port}`);
})

/*
 * {
 * 	apiVersion: '2021-03-20',
 * 	referenceId: 'bc464497-e876-464c-9ba2-106c69c4f9ab',
 * 	idempotencyKey: '582a909c95ed37befcb6eda06ea9d7dc98f0dd7e08a81fad20e0e46ae44d5ad6',
 * 	data: {
 * 	  product: 'BLOCKCHAIN_EVENTS',
 * 	  event: 'ADDRESS_COINS_TRANSACTION_CONFIRMED',
 * 	  item: {
 * 	    blockchain: 'ethereum',
 * 	    network: 'sepolia',
 * 	    address: '0x04c33467d10c9121011462cd6ba343cb841df634',
 * 	    minedInBlock: [Object],
 * 	    transactionId: '0xed6633cf1e81a50c220a450b6a035c82def2985be7beb306c0914f1cfb5850d0',
 * 	    amount: '0.1',
 * 	    unit: 'ETH',
 * 	    direction: 'incoming'
 * 	  }
 * 	}
 *}
 */
