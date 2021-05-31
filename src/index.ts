import { Application, Container, Text } from 'pixi.js';
import KeyHandler from './event/key_handler';
import Player from './game_objects/player';
import Updater from './event/updater';

const app = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1
});

document.body.appendChild(app.view);

const container = new Container();

app.stage.addChild(container);

container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

const text = new Text('FPS: ', { fontSize: 10 });

app.stage.addChild(text);

const player = new Player('./assets/cat.png', container);

const key_handler = new KeyHandler();
const updater = new Updater();

key_handler.register(player);

updater.add_updatable(player);

app.ticker.add(delta => {
    updater.on_update(delta);
    text.text = `FPS: ${app.ticker.FPS}`;
});
