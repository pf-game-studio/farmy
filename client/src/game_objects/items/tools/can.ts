import { eTileAction } from '../../entities/ground_tile';
import { Tool } from '../item';

export default class Can extends Tool {
    readonly sprite_path: string = './assets/items/can.png';
    readonly action: eTileAction = eTileAction.water;
}
