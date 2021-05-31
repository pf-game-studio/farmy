import { Container } from 'pixi.js';
import KeyHandler, {
    iKeyRegistrable,
    tKeyCallback,
    bind_handler,
    eKeyState
} from '../event/key_handler';
import GameObject, { iVector } from './game_object';
import { ARROWS } from '../event/keys';

const PLAYER_SPEED = 1;

/**
 * Objeto do jogador
 */
export default class Player extends GameObject implements iKeyRegistrable {
    private speed: iVector;

    constructor(texture_path: string, parent: Container) {
        super(texture_path, parent);

        this.speed = { x: 0, y: 0 };
    }

    /**
     * Registra seus callbacks no gerenciador de teclas
     *
     * @param key_handler gerenciador de teclas a registrar
     */
    register(key_handler: KeyHandler): void {
        key_handler.add_key_listener({
            key: ARROWS.W,
            on_key: bind_handler(this, Player.w_handler)
        });

        key_handler.add_key_listener({
            key: ARROWS.S,
            on_key: bind_handler(this, Player.s_handler)
        });

        key_handler.add_key_listener({
            key: ARROWS.A,
            on_key: bind_handler(this, Player.a_handler)
        });

        key_handler.add_key_listener({
            key: ARROWS.D,
            on_key: bind_handler(this, Player.d_handler)
        });
    }

    on_update(delta: number): void {
        this.apply_velocity(this.speed, delta);
    }

    /**
     * Handler da tecla w
     *
     * @param self this
     * @param state estado atual da tecla
     */
    private static w_handler(self: Player, state: eKeyState): void {
        switch (state) {
            case eKeyState.down:
                self.speed.y -= PLAYER_SPEED;
                break;
            case eKeyState.up:
                self.speed.y += PLAYER_SPEED;
                break;
        }
    }

    /**
     * Handler da tecla s
     *
     * @param self this
     * @param state estado atual da tecla
     */
    private static s_handler(self: Player, state: eKeyState): void {
        switch (state) {
            case eKeyState.down:
                self.speed.y += PLAYER_SPEED;
                break;
            case eKeyState.up:
                self.speed.y -= PLAYER_SPEED;
                break;
        }
    }

    /**
     * handler da tecla a
     *
     * @param self this
     * @param state estado atual da tecla
     */
    private static a_handler(self: Player, state: eKeyState): void {
        switch (state) {
            case eKeyState.down:
                self.speed.x -= PLAYER_SPEED;
                break;
            case eKeyState.up:
                self.speed.x += PLAYER_SPEED;
                break;
        }
    }

    /**
     * Retorna uma função de callback de tecla com 'this' associado
     *
     * @param self this
     * @param state estado atual da tecla
     */
    private static d_handler(self: Player, state: eKeyState): void {
        switch (state) {
            case eKeyState.down:
                self.speed.x += PLAYER_SPEED;
                break;
            case eKeyState.up:
                self.speed.x -= PLAYER_SPEED;
                break;
        }
    }
}
