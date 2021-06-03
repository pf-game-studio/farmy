import { Container } from 'pixi.js';
import KeyHandler, { iKeyRegistrable, eKeyState } from '../event/key_handler';
import GameObject, { iVector } from './game_object';
import { ARROWS, KEYBOARD } from '../event/keys';

const PLAYER_SPEED = 1;

/**
 * Objeto do jogador
 */
export default class Player extends GameObject implements iKeyRegistrable {
    private speed: iVector;
    private do_action: boolean;

    constructor(texture_path: string, parent: Container) {
        super(texture_path, parent);

        this.speed = { x: 0, y: 0 };
        this.do_action = false;
    }

    /**
     * Registra seus callbacks no gerenciador de teclas
     *
     * @param key_handler gerenciador de teclas a registrar
     */
    register(key_handler: KeyHandler): void {
        key_handler.add_key_listener(ARROWS.W, this, Player.w_handler);
        key_handler.add_key_listener(ARROWS.A, this, Player.a_handler);
        key_handler.add_key_listener(ARROWS.S, this, Player.s_handler);
        key_handler.add_key_listener(ARROWS.D, this, Player.d_handler);
        key_handler.add_key_listener(KEYBOARD.E, this, Player.action_handler);
    }

    async on_update(delta: number): Promise<void> {
        this.apply_velocity(this.speed, delta);

        if (this.do_action) {
            this.on_action();
            this.do_action = false;
        }
    }

    /**
     * Executa a ação do jogador, quando a tecla de ação é pressionada.
     */
    on_action(): void {
        console.log('performing action');
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
     * Handler da tecla d
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

    /**
     * Handler da tecla de ação
     *
     * @param self this
     * @param state estado atual da tecla
     */
    private static action_handler(self: Player, state: eKeyState): void {
        switch (state) {
            case eKeyState.down:
                break;
            case eKeyState.up:
                self.do_action = true;
                break;
        }
    }
}
