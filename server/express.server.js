const express = require('express');
const fetch = require("node-fetch");
const { makeExecutableSchema } = require('graphql-tools');
const socketIO = require('socket.io')();
const bodyParser = require('body-parser');
const http = require('http');

const server = express()
const port = 3000;


server.use(bodyParser.json())
server.use(bodyParser.urlencoded({
  extended: true
}))

const app = server.listen(port, function (err, result) {
  console.log(`running in port ${port}`)
})

const QUERY = `{
    people{
      functionname
      screen
    }
  }
  `;

var isrespond = false;
const io = socketIO.listen(app);
// รอการ connect จาก client
io.on('connection', client => {
  console.log('user connected')

  // เมื่อ Client ตัดการเชื่อมต่อ
  client.on('disconnect', () => {
    console.log('user disconnected')
  })

  // ส่งข้อมูลไปยัง Client ทุกตัวที่เขื่อมต่อแบบ Realtime 
    setInterval(() => {
      if (!isrespond) {
        isrespond = true;
        gettestgraph().then(rs => {
          var d = new Date()
          console.log(d.getTime())
          io.sockets.emit('new-message', {
            rs: rs,
            time: d.getTime()
          })
          isrespond = false;
        })
      }
    }, 1000); 
})


// server.get('/socket', (req, res) => {
//   socketIO.on('connection', (client) => {

//   }); 
//   res.json({ a: 's' })
// })

server.get('/testgraph', (req, res) => {
  var url = "http://localhost:9100/graphql";
  var opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY })
  };

  fetch(url, opts)
    .then(res => res.json())
    .then(resjson => res.json(resjson))
    .catch(console.error);
})

const gettestgraph = () => {
  var url = "http://localhost:9100/graphql";
  var opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY })
  };
  return new Promise((resolve, reject) => {
    fetch(url, opts)
      .then(res => res.json())
      .then(resjson => {
        // console.log('resjson', resjson);
        // console.log('data OK');
        resolve(resjson);
      })
      .catch(console.error);
  })
}
