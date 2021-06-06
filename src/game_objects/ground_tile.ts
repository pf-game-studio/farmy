import { Container, Texture } from 'pixi.js';
import GameObject, { iVector } from './game_object';

/**
 * Objeto para representar um tile no chão
 */
export default class GroundTile extends GameObject {
    constructor(texture: Texture, parent: Container, position: iVector) {
        super(texture, parent);

        this.apply_velocity(position, 1);
    }

    /**
     * Atualiza a textura do tile
     *
     * @param texture textura para ser usada
     */
    set_texture(texture: Texture): void {
        this.sprite.texture = texture;
    }
}
