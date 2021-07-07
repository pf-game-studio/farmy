import { eTileAction } from '../../entities/ground_tile';
import { Tool } from '../item';

export default class Hoe extends Tool {
    readonly sprite_path: string = './assets/items/hoe.png';
    readonly action: eTileAction = eTileAction.plow;
}
