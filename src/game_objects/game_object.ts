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

        parent.addChild(this.sprite);
    }

    /**
     * @returns posição atual do sprite
     */
    position(): iVector {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    /**
     * @returns tamanho do sprite
     */
    size(): iVector {
        return { x: this.sprite.width, y: this.sprite.height };
    }

    /**
     * @returns posição atual do centro do sprite
     */
    center_position(): iVector {
        return {
            x: this.position().x + this.size().x / 2,
            y: this.position().y + this.size().y / 2
        };
    }

    /**
     * @returns sprite do objeto
     */
    get_sprite(): Sprite {
        return this.sprite;
    }

    /**
     * Verifica se um outro objeto do jogo está colidindo com este
     *
     * @param other outro objeto qualquer
     * @returns verdadeiro se a colisão foi detectada
     */
    collides(other: GameObject): boolean {
        return this.point_collides(other.position(), other.size());
    }

    /**
     * Verifica se um ponto e tamanho genéricos estão colidindo com este objeto
     *
     * @param position posição arbitrária no jogo
     * @param size tamanho arbitrário no jogo. Se não passado, a colisão é feita
     *             apenas com o ponto da posição
     * @returns verdadeiro se a colisão foi detectada
     */
    point_collides(position: iVector, size?: iVector): boolean {
        size = size || { x: 0, y: 0 };

        const this_pos = this.position();
        const this_size = this.size();

        return (
            this_pos.x <= position.x + size.x &&
            this_pos.x + this_size.x >= position.x &&
            this_pos.y <= position.y + size.y &&
            this_pos.y + this_size.y >= position.y
        );
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
