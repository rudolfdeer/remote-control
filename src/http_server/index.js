import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import robot from 'robotjs';

export const httpServer = http.createServer(function (req, res) {
  const __dirname = path.resolve(path.dirname(''));
  const file_path =
    __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
  fs.readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

const wss = new WebSocketServer({
  port: 8080,
});

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const command = data.toString();
    console.log('command: ', command);

    if (command.match(/^mouse_right\s/)) {
      const offset = Number(command.split(' ')[1]);
      const { x, y } = robot.getMousePos();
      const newX = x + offset;
      robot.moveMouseSmooth(newX, y);

      ws.send(`mouse_position ${newX},${y}`);
    }

    if (command.match(/^mouse_left\s/)) {
      const offset = Number(command.split(' ')[1]);
      const { x, y } = robot.getMousePos();
      const newX = x - offset;
      robot.moveMouseSmooth(newX, y);

      ws.send(`mouse_position ${newX},${y}`);
    }

    if (command.match(/^mouse_up\s/)) {
      const offset = Number(command.split(' ')[1]);
      const { x, y } = robot.getMousePos();
      const newY = y - offset;
      robot.moveMouseSmooth(x, newY);

      ws.send(`mouse_position ${x},${newY}`);
    }

    if (command.match(/^mouse_down\s/)) {
      const offset = Number(command.split(' ')[1]);
      const { x, y } = robot.getMousePos();
      const newY = y + offset;
      robot.moveMouseSmooth(x, newY);

      ws.send(`mouse_position ${x},${newY}`);
    }

    if (command.match(/^draw_circle\s/)) {
      const radius = Number(command.split(' ')[1]);
      const { x, y } = robot.getMousePos();

      for (let i = 0; i <= Math.PI * 2; i += 0.01) {
        const toX = x + radius * Math.cos(i);
        const toY = y + radius * Math.sin(i);

        robot.dragMouse(toX, toY);
      }
      ws.send(`mouse_position ${x},${y}`);
    }

    if (command.match(/^draw_rectangle\s/)) {
      const facetX = Number(command.split(' ')[1]);
      const facetY = Number(command.split(' ')[2]);
      const { x, y } = robot.getMousePos();
    }

    if (command.match(/^draw_square\s/)) {
      const facet = Number(command.split(' ')[1]);
      const { x, y } = robot.getMousePos();
    }

    const { x, y } = robot.getMousePos();
    ws.send(`mouse_position ${x},${y}`);
  });
  ws.send('hello! message from werver!!');
});

wss.on('close', () => {
  console.log('server stopped');
});
