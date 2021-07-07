import { Container, Texture } from 'pixi.js';
import GameMap from '../game_map';
import { Tool } from '../items/item';
import Entity, { iVector } from './entity';

/**
 * Ações possíveis que uma ferramenta pode ter no chão
 */
export enum eTileAction {
    plow,
    water
}

/**
 * Objeto para representar um tile no chão
 */
export default class GroundTile extends Entity {
    private plowable: boolean;
    private plowed: boolean;
    private watered: boolean;
    private map: GameMap;

    constructor(
        texture: Texture,
        map: GameMap,
        parent: Container,
        position: iVector,
        plowable: boolean
    ) {
        super(texture, parent);

        this.set_position(position);
        this.map = map;
        this.plowed = false;
        this.watered = false;
        this.plowable = plowable;
    }

    /**
     * Atualiza a textura do tile
     *
     * @param texture textura para ser usada
     */
    set_texture(texture: Texture): void {
        this.sprite.texture = texture;
    }

    /**
     * Interage com uma ferramenta específica
     *
     * @param tool ferramenta que está interagindo
     */
    interact(tool: Tool): void {
        switch (tool.action) {
            case eTileAction.plow:
                this.on_plow();
                break;
            case eTileAction.water:
                this.on_water();
                break;
        }
    }

    /**
     * Ação de quando o jogador está arando a terra
     */
    on_plow(): void {
        if (this.plowable && !this.plowed) {
            this.set_texture(this.map.get_plowed_texture());
            this.plowed = true;
        }
    }

    /**
     * Ação de quando o jogador está molhando a terra
     */
    on_water(): void {
        if (this.plowed && !this.watered) {
            this.sprite.tint = 0xafafaf;
            this.watered = true;
        }
    }
}
