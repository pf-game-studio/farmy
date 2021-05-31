import { Container, Sprite, Texture } from 'pixi.js';
import { Updatable } from '../event/updater';

export interface iVector {
    x: number;
    y: number;
}

/**
 * Objeto de jogo. Responsável por lidar com os sprites e textura do pixi.js
 */
export default abstract class GameObject extends Updatable {
    protected texture: Texture;
    protected sprite: Sprite;

    constructor(texture_path: string, parent: Container) {
        super();
        this.texture = Texture.from(texture_path);
        this.sprite = new Sprite(this.texture);
        this.sprite.x += Math.random() * 100;
        this.sprite.y += Math.random() * 100;
        this.sprite.anchor.set(0.5);

        parent.addChild(this.sprite);
    }

    /**
     * @returns sprite do objeto
     */
    get_sprite(): Sprite {
        return this.sprite;
    }

    /**
     * Aplica uma velocidade constante por um determinado tempo ao sprite atual.
     *
     * @param vel velocidade atual
     * @param delta tempo para aplicar a velocidade
     */
    apply_velocity(vel: iVector, delta: number): void {
        this.sprite.x += vel.x * delta;
        this.sprite.y += vel.y * delta;
    }
}
