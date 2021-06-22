import KeyHandler, {
    iKeyRegistrable,
    eKeyState
} from '../../event/key_handler';
import Entity, { iVector } from './entity';
import { ARROWS, KEYBOARD } from '../../event/keys';
import { Updatable } from '../../event/updater';
import { Viewport } from 'pixi-viewport';
import Inventory from '../inventory';
import default_inventory_data from '../../data/default_inventory';
import { Item } from '../items/item';

const PLAYER_SPEED = 1;

/**
 * Direções que o jogador está olhando
 */
enum ePlayerDirection {
    left,
    right,
    up,
    down
}

/**
 * Objeto do jogador
 */
export default class Player
    extends Entity
    implements iKeyRegistrable, Updatable
{
    private speed: iVector;
    private do_action: boolean;
    private direction: ePlayerDirection;
    private inventory: Inventory;

    constructor(texture_path: string, parent: Viewport, main: boolean) {
        super(texture_path, parent);
        if (main) {
            parent.follow(this.sprite);
        }

        this.direction = ePlayerDirection.right;
        this.speed = { x: 0, y: 0 };
        this.do_action = false;
        this.inventory = new Inventory(default_inventory_data, parent.parent);
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
        key_handler.add_key_listener(KEYBOARD.E, this, Player.e_handler);
        key_handler.add_key_listener(KEYBOARD.Q, this, Player.q_handler);
        key_handler.add_key_listener(KEYBOARD.F, this, Player.action_handler);
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
    async on_action(): Promise<void> {
        try {
            const item: Item = this.inventory.selected_item();
            console.log(
                `performing action on item ${item}, on direction ${this.direction}`
            );
        } catch (error) {}
    }

    /**
     * Handler da tecla w - move para cima
     *
     * @param self this
     * @param state estado atual da tecla
     */
    private static w_handler(self: Player, state: eKeyState): void {
        switch (state) {
            case eKeyState.down:
                self.speed.y -= PLAYER_SPEED;
                self.direction = ePlayerDirection.up;
                break;
            case eKeyState.up:
                self.speed.y += PLAYER_SPEED;
                break;
        }
    }

    /**
     * Handler da tecla s - move para baixo
     *
     * @param self this
     * @param state estado atual da tecla
     */
    private static s_handler(self: Player, state: eKeyState): void {
        switch (state) {
            case eKeyState.down:
                self.speed.y += PLAYER_SPEED;
                self.direction = ePlayerDirection.down;
                break;
            case eKeyState.up:
                self.speed.y -= PLAYER_SPEED;
                break;
        }
    }

    /**
     * handler da tecla a - move para a esquerda
     *
     * @param self this
     * @param state estado atual da tecla
     */
    private static a_handler(self: Player, state: eKeyState): void {
        switch (state) {
            case eKeyState.down:
                self.speed.x -= PLAYER_SPEED;
                self.direction = ePlayerDirection.left;
                break;
            case eKeyState.up:
                self.speed.x += PLAYER_SPEED;
                break;
        }
    }

    /**
     * Handler da tecla d - move para a direita
     *
     * @param self this
     * @param state estado atual da tecla
     */
    private static d_handler(self: Player, state: eKeyState): void {
        switch (state) {
            case eKeyState.down:
                self.speed.x += PLAYER_SPEED;
                self.direction = ePlayerDirection.right;
                break;
            case eKeyState.up:
                self.speed.x -= PLAYER_SPEED;
                break;
        }
    }

    /**
     * Handler da tecla e - incrementa o cursor do inventário
     *
     * @param self this
     * @param state estado atual da tecla
     */
    private static e_handler(self: Player, state: eKeyState): void {
        if (state == eKeyState.up) {
            self.inventory.increment_cursor();
        }
    }

    /**
     * Handler da tecla q - decrementa o cursor do inventário
     *
     * @param self this
     * @param state estado atual da tecla
     */
    private static q_handler(self: Player, state: eKeyState): void {
        if (state == eKeyState.down) {
            self.inventory.decrement_cursor();
        }
    }

    /**
     * Handler da tecla de ação
     *
     * @param self this
     * @param state estado atual da tecla
     */
    private static action_handler(self: Player, state: eKeyState): void {
        if (state == eKeyState.down) {
            self.do_action = true;
        }
    }
}
