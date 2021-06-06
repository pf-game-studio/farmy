import { Application, Container, settings, SCALE_MODES } from 'pixi.js';
import KeyHandler from './event/key_handler';
import Player from './game_objects/player';
import Updater from './event/updater';
import GameMap from './game_objects/game_map';
import default_map_data from './data/map';

settings.SCALE_MODE = SCALE_MODES.NEAREST;

const app = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1
});

document.body.appendChild(app.view);

const player_cont = new Container();
player_cont.x = app.screen.width / 2;
player_cont.y = app.screen.height / 2;
player_cont.pivot.x = player_cont.width / 2;
player_cont.pivot.y = player_cont.height / 2;

const map_cont = new Container();
map_cont.scale.x = 1.5;
map_cont.scale.y = 1.5;

app.stage.addChild(map_cont);
app.stage.addChild(player_cont);

const player = new Player('./assets/cat.png', player_cont);

// @ts-ignore variável não utilizada
const map = new GameMap('./assets/map.png', map_cont, default_map_data);

const key_handler = new KeyHandler();
const updater = new Updater();

key_handler.register(player);

updater.add_updatable(player);

app.ticker.add((delta: number): void => {
    updater.on_update(delta);
});
