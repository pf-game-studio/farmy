import { Application, Container, utils } from 'pixi.js';
import GameObject, { iVector } from '../../src/game_objects/game_object';

class TestObject extends GameObject {
    async on_update(_delta: number): Promise<void> {}

    constructor(parent: Container) {
        super(`${__dirname}/cat.png`, parent);
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

describe('Test GameObjects', () => {
    it('Can detect collision with points', () => {
        const left_upper_edge: iVector = obj.position();
        const middle = {
            x: obj.position().x + obj.size().x / 2,
            y: obj.position().y + obj.size().y / 2
        };
        const right_upper_edge: iVector = {
            x: obj.position().x + obj.size().x,
            y: obj.position().y
        };
        const left_lower_edge: iVector = {
            x: obj.position().x,
            y: obj.position().y + obj.size().y
        };
        const right_lower_edge: iVector = {
            x: obj.position().x + obj.size().x,
            y: obj.position().y + obj.size().y
        };
        const outside_left: iVector = {
            x: obj.position().x + obj.size().x + 1,
            y: obj.position().y
        };
        const outside_right: iVector = {
            x: obj.position().x - 1,
            y: obj.position().y
        };
        const outside_down: iVector = {
            x: obj.position().x,
            y: obj.position().y + obj.size().y + 1
        };
        const outside_up: iVector = {
            x: obj.position().x,
            y: obj.position().y - 1
        };
        const outside: iVector = {
            x: obj.position().x + obj.size().x + 1,
            y: obj.position().y + obj.size().y + 1
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
