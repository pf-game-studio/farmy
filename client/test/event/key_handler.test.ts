import KeyHandler, {
    eKeyState,
    iKeyRegistrable
} from '../../src/event/key_handler';
import { KEYBOARD } from '../../src/event/keys';

const key = KEYBOARD.E;

class ARegistrable implements iKeyRegistrable {
    private down: boolean = false;
    private up: boolean = true;

    register(key_handler: KeyHandler): void {
        key_handler.add_key_listener(key, this, ARegistrable.handle_key);
    }

    is_down(): boolean {
        return this.down;
    }
    is_up(): boolean {
        return this.up;
    }

    static handle_key(self: ARegistrable, state: eKeyState) {
        switch (state) {
            case eKeyState.down:
                self.down = true;
                self.up = false;
                break;
            case eKeyState.up:
                self.down = false;
                self.up = true;
                break;
        }
    }
}

describe('Test KeyHandler', () => {
    it('Can register listeners', () => {
        const kh = new KeyHandler();
        const registrable = new ARegistrable();

        kh.register(registrable);
    });

    it('Can listen to events', () => {
        const kh = new KeyHandler();
        const registrable = new ARegistrable();

        kh.register(registrable);

        window.dispatchEvent(new KeyboardEvent('keydown', { key }));

        expect(registrable.is_down()).toBe(true);
        expect(registrable.is_up()).toBe(false);

        window.dispatchEvent(new KeyboardEvent('keyup', { key }));

        expect(registrable.is_down()).toBe(false);
        expect(registrable.is_up()).toBe(true);
    });
});
