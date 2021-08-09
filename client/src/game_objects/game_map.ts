import { Loader, Container, Rectangle, Texture, BaseTexture } from 'pixi.js';
import { iVector } from './entities/entity';
import GroundTile from './entities/ground_tile';
import { Tool } from './items/item';

/**
 * Dados gerais do mapa, será usado para salvar o estado atual do jogo
 */
export interface iMapData {
    tiles: Array<number>;
    width: number;
    height: number;
    tile_size: number;
    tile_num_x: number;
    tile_num_y: number;
}

/**
 * Abstração do mapa do jogo, contém diversos tiles do mapa
 */
export default class GameMap {
    private tile_textures: Array<Texture> = [];
    private parent: Container;
    private data: iMapData;
    private loader: Loader;

    private ground_tiles: Array<GroundTile> = [];

    constructor(tile_path: string, parent: Container, map_data: iMapData) {
        this.parent = parent;
        this.loader = new Loader();
        this.data = map_data;

        this.loader.add('map', tile_path).load((_, resources) => {
            const texture = resources['map'].texture;
            if (!texture) {
                throw `failed to load map textures`;
            }
            this.load_tiles(resources['map'].texture as BaseTexture);
            this.render();
        });
    }

    /**
     * @returns textura de uma terra arada
     */
    get_plowed_texture(): Texture {
        const texture: Texture | undefined = this.tile_textures[67];
        if (!texture) {
            throw 'Texture not found';
        }
        return texture;
    }

    /**
     * Interação de uma ferramenta com o mapa
     *
     * @param tool ferramenta que vai interagir
     * @param pos posição que está interagindo
     */
    interact(tool: Tool, pos: iVector): void {
        this.get_obj_at(pos).interact(tool);
    }

    /**
     * Retorna o objeto do chão em uma determinada posição, em coordenadas do mapa
     *
     * @todo arrumar os outros métodos
     * @throws caso não exista um objeto do chão em uma posição
     * @param pos posição que se deve retornar
     * @returns objeto na posição
     */
    get_obj_at(pos: iVector): GroundTile {
        let tile: GroundTile | undefined;
        this.ground_tiles.forEach(ground_tile => {
            if (ground_tile.point_collides(pos)) {
                tile = ground_tile;
            }
        });
        if (!tile) {
            throw `Tile not found at position x=${pos.x} y=${pos.y}`;
        }
        return tile;
    }

    /**
     * Renderiza o mapa, criando todos os tiles e associando-os ao container
     */
    private render(): void {
        this.data.tiles.forEach((val, idx) => {
            const x: number = idx % this.data.width;
            const y: number = Math.floor(idx / this.data.width);

            const plowable: boolean =
                x != this.data.width - 1 &&
                x != 0 &&
                y != this.data.height - 1 &&
                y != 0;

            this.ground_tiles.push(
                new GroundTile(
                    this.get_texture(val),
                    this,
                    this.parent,
                    {
                        x: x * this.data.tile_size,
                        y: y * this.data.tile_size
                    },
                    plowable
                )
            );
        });
    }

    /**
     * Carrega todos os tiles com base no tilesheet carregado
     *
     * @param texture recurso do pixi recebido ao finalizar o carregamento
     *                do tilesheet
     */
    private load_tiles(texture: BaseTexture): void {
        for (let i = 0; i < this.data.tile_num_y; i++) {
            for (let j = 0; j < this.data.tile_num_x; j++) {
                this.tile_textures.push(
                    new Texture(
                        texture,
                        new Rectangle(
                            j * this.data.tile_size,
                            i * this.data.tile_size,
                            this.data.tile_size,
                            this.data.tile_size
                        )
                    )
                );
            }
        }
    }

    // /**
    //  * Retorna o objeto do chão em uma posição normalizada em relação ao tamanho
    //  * dos sprites.
    //  *
    //  * @throws caso não exista um objeto do chão em uma posição
    //  * @param pos posição normalizada para se encontrar o objeto
    //  * @returns objeto na posição normalizada
    //  */
    // private get_obj_at_normalized(pos: iVector): GroundTile {
    //     if (pos.x < 0 || pos.x >= this.data.width) {
    //         throw `Object cannot be accessed at x=${pos.x}`;
    //     } else if (pos.y < 0 || pos.y >= this.data.height) {
    //         throw `Object cannot be accessed at y=${pos.y}`;
    //     }
    //     return this.get_obj_by_idx(pos.y * this.data.tile_size + pos.x);
    // }

    // /**
    //  * Retorna o objeto do chão em um índice no vetor, garantindo que não seja
    //  * undefined.
    //  *
    //  * @throws caso o índice não seja válido no array
    //  * @param idx índice do array
    //  * @returns objeto no índice, garantido que não é undefined
    //  */
    // private get_obj_by_idx(idx: number): GroundTile {
    //     const obj: GroundTile | undefined = this.ground_tiles[idx];

    //     if (!obj) {
    //         throw `GroundTile not found at idx=${idx}`;
    //     }

    //     return obj;
    // }

    /**
     * Retorna uma textura pelo índice do array
     *
     * @throws caso a textura não seja encontrada
     * @param idx índice do array
     * @returns textura no índice, garantindo que não é undefined
     */
    private get_texture(idx: number): Texture {
        const texture: Texture | undefined = this.tile_textures[idx];

        if (!texture) {
            throw 'Texture not found';
        }
        return texture;
    }
}
