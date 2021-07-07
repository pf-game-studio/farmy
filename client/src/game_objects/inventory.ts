import { Container } from '@pixi/display';
import { GLOBALS } from '../data/globals';
import { Item, tItemData } from './items/item';
import ItemStack from './items/item_stack';

/**
 * Inventário do jogador
 */
export default class Inventory {
    private stacks: Array<ItemStack>;
    private cursor: number;

    constructor(data: Array<tItemData>, parent: Container) {
        if (data.length != GLOBALS.inventory_size) {
            throw `Invalid inventory data length, expected ${GLOBALS.inventory_size}, received ${data.length}`;
        }
        this.stacks = [];
        data.forEach((item_data, idx) => {
            this.stacks.push(
                new ItemStack(parent, idx, item_data.id, item_data.ammount)
            );
        });
        this.cursor = 0;
        this.set_cursor(0);
    }

    /**
     * @returns valor atual do cursor
     */
    get_cursor(): number {
        return this.cursor;
    }

    /**
     * Incrementa o valor atual do cursor
     */
    increment_cursor(): void {
        this.set_cursor(this.cursor + 1);
    }

    /**
     * Decrementa o valor atual do cursor
     */
    decrement_cursor(): void {
        this.set_cursor(this.cursor - 1);
    }

    /**
     * Seta o valor do cursor, limitando entre 0 e o tamanho do array de pilhas
     *
     * @param val valor do cursor
     * @returns
     */
    set_cursor(val: number): void {
        if (val >= this.stacks.length) {
            val = 0;
        } else if (val < 0) {
            val = this.stacks.length - 1;
        }
        this.cursor = val;
        this.stacks.forEach((stack, idx) => {
            if (idx === this.cursor) {
                stack.select();
            } else {
                stack.deselect();
            }
        });
    }

    /**
     * Retorna o item atualmente selecionado no cursor
     *
     * @throws caso o id do item na posição seja nulo ou caso o cursor esteja
     *         fora do Array
     * @returns item na posição do cursor
     */
    selected_item(): Item {
        const item: Item | undefined = this.stacks[this.cursor]?.get_instance();
        if (!item) {
            throw `Invalid cursor position ${this.cursor}`;
        }
        return item;
    }
}
