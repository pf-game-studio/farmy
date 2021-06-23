import { eTileAction } from '../entities/ground_tile';
import { eItemId } from './item_ids';

export type tItemData = {
    id: eItemId;
    ammount?: number;
};

export abstract class Item {
    abstract readonly stack_size: number;
    abstract readonly sprite_path: string;
}

export abstract class Tool extends Item {
    readonly stack_size: number = 1;
    abstract readonly action: eTileAction;
}
