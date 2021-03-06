import { Application, Container, utils } from 'pixi.js';
import Entity, { iVector } from '../../../src/game_objects/entities/entity';

class TestObject extends Entity {
    async on_update(_delta: number): Promise<void> {}

    constructor(parent: Container) {
        super(`${__dirname}/../cat.png`, parent);
    }
}

utils.skipHello();

const app = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1
});

const container = new Container();
app.stage.addChild(container);

const obj = new TestObject(container);

describe('Test Entities', () => {
    it('Can detect collision with points', () => {
        const left_upper_edge: iVector = obj.topleft_position();
        const middle = {
            x: obj.topleft_position().x + obj.size().x / 2,
            y: obj.topleft_position().y + obj.size().y / 2
        };
        const right_upper_edge: iVector = {
            x: obj.topleft_position().x + obj.size().x,
            y: obj.topleft_position().y
        };
        const left_lower_edge: iVector = {
            x: obj.topleft_position().x,
            y: obj.topleft_position().y + obj.size().y
        };
        const right_lower_edge: iVector = {
            x: obj.topleft_position().x + obj.size().x,
            y: obj.topleft_position().y + obj.size().y
        };
        const outside_left: iVector = {
            x: obj.topleft_position().x + obj.size().x + 1,
            y: obj.topleft_position().y
        };
        const outside_right: iVector = {
            x: obj.topleft_position().x - 1,
            y: obj.topleft_position().y
        };
        const outside_down: iVector = {
            x: obj.topleft_position().x,
            y: obj.topleft_position().y + obj.size().y + 1
        };
        const outside_up: iVector = {
            x: obj.topleft_position().x,
            y: obj.topleft_position().y - 1
        };
        const outside: iVector = {
            x: obj.topleft_position().x + obj.size().x + 1,
            y: obj.topleft_position().y + obj.size().y + 1
        };

        expect(obj.point_collides(left_upper_edge)).toBe(true);
        expect(obj.point_collides(middle)).toBe(true);
        expect(obj.point_collides(right_upper_edge)).toBe(true);
        expect(obj.point_collides(left_lower_edge)).toBe(true);
        expect(obj.point_collides(right_lower_edge)).toBe(true);

        expect(obj.point_collides(outside_left)).toBe(false);
        expect(obj.point_collides(outside_right)).toBe(false);
        expect(obj.point_collides(outside_down)).toBe(false);
        expect(obj.point_collides(outside_up)).toBe(false);
        expect(obj.point_collides(outside)).toBe(false);
    });
});
