import Updater, { Updatable } from '../../src/event/updater';

class AnUpdatable implements Updatable {
    private counter: number = 0;

    async on_update(delta: number): Promise<void> {
        this.counter += delta;
    }

    value(): number {
        return this.counter;
    }
}

class SlowUpdatable implements Updatable {
    private counter: number = 0;

    async on_update(delta: number): Promise<void> {
        await new Promise(r => setTimeout(r, 50));
        this.counter += delta;
    }

    value(): number {
        return this.counter;
    }
}

describe('Test Updater', () => {
    it('Can add updatables', () => {
        const updater = new Updater();
        const updatable = new AnUpdatable();

        updater.add_updatable(updatable);
    });

    it('Can update its updatables', () => {
        const updater = new Updater();
        const updatable = new AnUpdatable();

        updater.add_updatable(updatable);

        updater.on_update(1);
        expect(updatable.value()).toBe(1);

        updater.on_update(4);
        expect(updatable.value()).toBe(5);
    });

    it('Awaits updates correctly', async () => {
        const updater = new Updater();
        const slow = new SlowUpdatable();

        updater.add_updatable(slow);

        const before = Date.now();

        await updater.on_update(1);
        await updater.on_update(1);

        const after = Date.now();

        expect(after - before).toBeGreaterThanOrEqual(100);
    });

    it('Awaits all updates concurrently', async () => {
        const updater = new Updater();
        const slow = new SlowUpdatable();
        const slow2 = new SlowUpdatable();

        updater.add_updatable(slow);
        updater.add_updatable(slow2);

        const before = Date.now();

        await updater.on_update(1);

        const after = Date.now();

        expect(after - before).toBeGreaterThanOrEqual(50);
        expect(after - before).toBeLessThanOrEqual(100);
    });
});
