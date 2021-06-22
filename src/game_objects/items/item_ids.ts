import { Item } from './item';
import Can from './tools/can';
import Hoe from './tools/hoe';

/**
 * Enumerado de todos os ids de itens
 */
export enum eItemId {
    hoe = 1,
    can,

    null = 255
}

/**
 * Lookup table que traduz um id de item em um item
 */
const item_type_lut = {
    [eItemId.hoe]: Hoe,
    [eItemId.can]: Can
};

/**
 * Traduz o id de item, retornando uma instância do item traduzido
 *
 * @throws caso id seja null
 * @param id id do item que se deseja
 * @returns instância do item com `id`
 */
export function translate_id(id: eItemId): Item {
    if (id === eItemId.null) {
        throw `Cannot translate id ${id} to valid item`;
    }
    return new item_type_lut[id]();
}
