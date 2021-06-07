import { Viewport } from 'pixi-viewport';
import { SCALE_MODES, settings, Container, Application } from 'pixi.js';
import { GLOBALS } from './data/globals';
import default_map_data from './data/map';
import KeyHandler from './event/key_handler';
import Updater from './event/updater';
import GameMap from './game_objects/game_map';
import Player from './game_objects/player';

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
    // @ts-ignore no unused variable
    private map: GameMap;

    constructor() {
        super();
        this.ticker.stop();

        this.camera = this.create_camera();
        this.map_container = this.create_map_container(this.camera);

        this.player = new Player('./assets/cat.png', this.camera, true);
        this.map = new GameMap(
            './assets/map.png',
            this.map_container,
            default_map_data
        );
        this.key_handler = new KeyHandler();
        this.updater = new Updater();

        this.key_handler.register(this.player);
        this.updater.add_updatable(this.player);

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
            .clamp({ underflow: 'center', direction: 'all' });

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
        map_cont.scale.x = 1.5;
        map_cont.scale.y = 1.5;

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
