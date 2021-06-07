import { SCALE_MODES, settings, Container, Application } from 'pixi.js';
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
    private player_container: Container;

    private player: Player;
    private updater: Updater;
    private key_handler: KeyHandler;
    // @ts-ignore no unused variable
    private map: GameMap;

    constructor() {
        super({
            width: 800,
            height: 600,
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1
        });
        this.ticker.stop();

        this.map_container = this.create_map_container();
        this.player_container = this.create_player_container();

        this.player = new Player('./assets/cat.png', this.player_container);
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
     * Cria e configura o container dos jogadores
     *
     * @returns container que receberá os jogadores
     */
    private create_player_container(): Container {
        const player_cont = new Container();
        player_cont.x = this.screen.width / 2;
        player_cont.y = this.screen.height / 2;
        player_cont.pivot.x = player_cont.width / 2;
        player_cont.pivot.y = player_cont.height / 2;

        this.stage.addChild(player_cont);

        return player_cont;
    }

    /**
     * Cria e configura o container do mapa
     *
     * @returns container do mapa
     */
    private create_map_container(): Container {
        const map_cont = new Container();
        map_cont.scale.x = 1.5;
        map_cont.scale.y = 1.5;

        this.stage.addChild(map_cont);

        return map_cont;
    }

    /**
     * Inicia o loop do ticker
     */
    start_eventloop(): void {
        this.ticker.start();
    }
}
