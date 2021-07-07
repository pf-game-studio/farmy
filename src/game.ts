import { Viewport } from 'pixi-viewport';
import { SCALE_MODES, settings, Container, Application, Text } from 'pixi.js';
import { GLOBALS } from './data/globals';
import default_map_data from './data/default_map';
import KeyHandler from './event/key_handler';
import Updater from './event/updater';
import GameMap from './game_objects/game_map';
import Player from './game_objects/entities/player';
import TimingManager from './event/timing_manager';

settings.SCALE_MODE = SCALE_MODES.NEAREST;

/**
 * Classe geral do jogo, encapsula a criação dos objetos
 */
export default class Game extends Application {
    private map_container: Container;
    private camera: Viewport;

    private player: Player;
    private updater: Updater;
    private key_handler: KeyHandler;
    private time_manager: TimingManager;
    // @ts-ignore no unused variable
    private map: GameMap;

    constructor() {
        super({ backgroundColor: 0x87cefa });
        this.ticker.stop();

        this.camera = this.create_camera();
        this.map_container = this.create_map_container(this.camera);

        const text = new Text(`0${GLOBALS.initial_hour}:00`, { fontSize: 24 });
        this.camera.parent.addChild(text);

        this.map = new GameMap(
            './assets/map.png',
            this.map_container,
            default_map_data
        );
        this.player = new Player(
            this.map,
            this.camera,
            true
        );
        this.key_handler = new KeyHandler();
        this.updater = new Updater();
        this.time_manager = new TimingManager(text);

        this.key_handler.register(this.player);
        this.updater.add_updatable(this.player);
        this.updater.add_updatable(this.time_manager);
        this.time_manager.add_sensitive(this.player);

        this.ticker.add((delta: number): void => {
            this.updater.on_update(delta);
        });

        document.body.appendChild(this.view);
    }

    /**
     * Cria e configura a câmera que ficara presa ao jogador principal, todos os
     * outros conteineres precisam ser filhos dela
     *
     * @returns camera
     */
    private create_camera(): Viewport {
        const vp = new Viewport({
            screenWidth: GLOBALS.screen_width,
            screenHeight: GLOBALS.screen_height,
            worldWidth: GLOBALS.world_width,
            worldHeight: GLOBALS.world_height,
            ticker: this.ticker
        });

        vp.drag()
            .pinch()
            .wheel()
            .decelerate()
            .clamp({ underflow: 'center', direction: 'all' })
            .clampZoom({
                maxHeight: GLOBALS.screen_height * 2,
                maxWidth: GLOBALS.screen_width * 2,
                minHeight: GLOBALS.screen_height / 2,
                minWidth: GLOBALS.screen_width / 2
            });

        this.stage.addChild(vp);

        return vp;
    }

    /**
     * Cria e configura o container do mapa
     *
     * @param parent onde o container do mapa estará
     * @returns container do mapa
     */
    private create_map_container(parent: Container): Container {
        const map_cont = new Container();

        parent.addChild(map_cont);

        return map_cont;
    }

    /**
     * Inicia o loop do ticker
     */
    start_eventloop(): void {
        this.ticker.start();
    }
}
