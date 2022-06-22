import Jimp from 'jimp';
import { httpServer } from './src/http_server/index.js';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

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

      const rightX = x + facetX;
      const bottomY = y + facetY;
      robot.mouseToggle("down");

      robot.moveMouseSmooth(rightX, y);
      robot.moveMouseSmooth(rightX, bottomY);
      robot.moveMouseSmooth(x, bottomY);
      robot.moveMouseSmooth(x, y);

      robot.mouseToggle("up");
    }

    if (command.match(/^draw_square\s/)) {
      const facet = Number(command.split(' ')[1]);
      const { x, y } = robot.getMousePos();

      const rightX = x + facet;
      const bottomY = y + facet;

      robot.mouseToggle("down");

      robot.moveMouseSmooth(rightX, y);
      robot.moveMouseSmooth(rightX, bottomY);
      robot.moveMouseSmooth(x, bottomY);
      robot.moveMouseSmooth(x, y);

      robot.mouseToggle("up");
    }

    if (command.match(/^prnt_scrn/)) {
      const { x, y } = robot.getMousePos();

      let size = 200;

      // const img = robot.screen.capture(0, 0, size, size).image;
      // new Jimp({data: img, width, height}, (err, image) => {
      //       image.write(fileName);
      // });

      let rimg = robot.screen.capture(0, 0, size, size);
      let path = 'myfile.png';

      // Create a new blank image, same size as Robotjs' one
      // let jimg = new Jimp(size, size);
      // for (var x = 0; x < size; x++) {
      //   for (var y = 0; y < size; y++) {
      //     // hex is a string, rrggbb format
      //     var hex = rimg.colorAt(x, y);
      //     // Jimp expects an Int, with RGBA data,
      //     // so add FF as 'full opaque' to RGB color
      //     var num = parseInt(hex + 'ff', 16);
      //     // Set pixel manually
      //     jimg.setPixelColor(num, x, y);
      //   }
      // }
      // jimg.write(path);
    }
  });
  ws.send('hello! message from werver!!');
});

wss.on('close', () => {
  console.log('server stopped');
});
