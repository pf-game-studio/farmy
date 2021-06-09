import { Container, Sprite, Texture } from 'pixi.js';
import { GLOBALS } from '../../data/globals';
import Entity from '../entities/entity';
import { Item } from './item';
import { eItemId, translate_id } from './item_ids';

/**
 * Pilha de itens. O inventário é composto de várias pilhas
 */
export default class ItemStack extends Entity {
    private idx: number;
    private ammount: number;
    private max_ammount: number;
    private id: eItemId;
    private item_sprite?: Sprite;
    private parent: Container;

    /**
     * Constrói uma pilha de itens
     *
     * @param parent container no qual deve se renderizar
     * @param idx índice da pilha, usado para calcular a posição na tela
     * @param id opcional, id do item que irá guardar
     * @param ammount opcional, quantidade inicial do item que está guardando
     */
    constructor(
        parent: Container,
        idx: number,
        id?: eItemId,
        ammount?: number
    ) {
        super('./assets/square.png', parent);
        ammount = ammount || 0;
        id = id || eItemId.null;

        this.parent = parent;
        this.idx = idx;
        this.ammount = ammount;
        this.id = id;
        this.max_ammount =
            id === eItemId.null ? 0 : this.get_instance().stack_size;

        this.render();
    }

    /**
     * Calcula e seta a posição com base no índice
     */
    private render(): void {
        const inventory_width =
            GLOBALS.inventory_tile_width * GLOBALS.inventory_size;
        const left = Math.floor(GLOBALS.screen_width / 2 - inventory_width / 2);

        this.sprite.width = GLOBALS.inventory_tile_width;
        this.sprite.height = GLOBALS.inventory_tile_width;
        this.set_position({
            x: left + this.idx * GLOBALS.inventory_tile_width,
            y: GLOBALS.screen_height
        });

        this.render_item();
    }

    /**
     * Renderiza o item dentro do quadrado do inventário
     */
    private render_item(): void {
        if (this.id === eItemId.null) {
            return;
        }
        if (this.item_sprite) {
            this.parent.removeChild(this.item_sprite);
            this.item_sprite = undefined;
        }

        const path = this.get_instance().sprite_path;
        const item_texture = Texture.from(path);
        this.item_sprite = new Sprite(item_texture);
        this.parent.addChild(this.item_sprite);

        this.item_sprite.x = this.topleft_position().x + 6;
        this.item_sprite.y = this.topleft_position().y + 6;
        this.item_sprite.width = GLOBALS.inventory_tile_width - 16;
        this.item_sprite.height = GLOBALS.inventory_tile_width - 16;
    }

    /**
     * Altera o visual da pilha para mostrar que está selecionada
     */
    select(): void {
        this.sprite.tint = 0xffffff;
    }

    /**
     * Altera o visual da pilha para mostrar que não está selecionada
     */
    deselect(): void {
        this.sprite.tint = 0x000000;
    }

    /**
     * Reseta a pilha de itens, para guardar um item diferente em uma quantidade
     * diferente.
     *
     * @param id novo id de item para guardar
     * @param ammount nova quantidade dos itens
     */
    reset(id: eItemId, ammount: number): void {
        this.ammount = ammount;
        this.id = id;
        this.max_ammount =
            id === eItemId.null ? 0 : this.get_instance().stack_size;
    }

    /**
     * Retorna uma instância do item
     *
     * @throws caso `this.id` seja null
     * @returns instância do item a partir do id deste objeto
     */
    get_instance(): Item {
        return translate_id(this.id);
    }

    /**
     * @returns id do item
     */
    get_id(): eItemId {
        return this.id;
    }

    /**
     * @returns quantidade de itens atualmente na pilha
     */
    get_ammount(): number {
        return this.ammount;
    }

    /**
     * Verifica se pode adicionar `ammount` itens no stack
     *
     * @param ammount quantidade de itens para adicionar
     * @returns verdadeiro se pode adicionar
     */
    can_add(ammount: number): boolean {
        return this.ammount + ammount <= this.max_ammount;
    }

    /**
     * Verifica se pode remover `ammount` itens do stack
     *
     * @param ammount quantidade de itens para remover
     * @returns verdadeiro se pode remover
     */
    can_remove(ammount: number): boolean {
        return this.ammount - ammount >= 0;
    }

    /**
     * Adiciona `ammount` itens no stack
     *
     * @throws caso não possa adicionar
     * @param ammount quantidade de itens para adicionar
     */
    add(ammount: number): void {
        if (!this.can_add(ammount)) {
            throw `Cannot add ${ammount} items to stack, surpassing ${this.max_ammount}`;
        }

        this.ammount += ammount;
    }

    /**
     * Remove `Ammount` itens do stack
     *
     * @throws caso não possa remover
     * @param ammount quantidade de itens para remover
     */
    remove(ammount: number): void {
        if (!this.can_remove(ammount)) {
            throw `Cannot remove ${ammount} items from stack`;
        }

        this.ammount -= ammount;
    }
}
