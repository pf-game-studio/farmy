import { Container, Sprite, Texture } from 'pixi.js';
import { GLOBALS } from '../data/globals';

export interface iVector {
    x: number;
    y: number;
}

/**
 * Objeto de jogo. Responsável por lidar com os sprites e textura do pixi.js
 */
export default abstract class GameObject {
    protected texture: Texture;
    protected sprite: Sprite;

    constructor(texture: string | Texture, parent: Container) {
        if (typeof texture == 'string') {
            this.texture = Texture.from(texture);
        } else {
            this.texture = texture;
        }
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
        let next_x = this.sprite.x + vel.x * delta;
        let next_y = this.sprite.y + vel.y * delta;

        if (next_x <= 0) {
            next_x = 0;
        } else if (next_x >= GLOBALS.world_width - this.size().x) {
            next_x = GLOBALS.world_width - this.size().x;
        }

        if (next_y <= 0) {
            next_y = 0;
        } else if (next_y >= GLOBALS.world_height - this.size().y) {
            next_y = GLOBALS.world_height - this.size().y;
        }

        this.sprite.x = next_x;
        this.sprite.y = next_y;
    }
}
