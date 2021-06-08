import { Container, Texture } from 'pixi.js';
import Entity, { iVector } from './entity';

/**
 * Objeto para representar um tile no chão
 */
export default class GroundTile extends Entity {
    constructor(texture: Texture, parent: Container, position: iVector) {
        super(texture, parent);

        this.set_position(position);
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
