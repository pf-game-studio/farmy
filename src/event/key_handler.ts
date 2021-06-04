export type tKeyCallback = (state: eKeyState) => void;
type tKeyHandler<T> = (self: T, state: eKeyState) => void;

/**
 * Interface de uma classe que pode se registrar em um gerenciador de teclas
 */
export interface iKeyRegistrable {
    /**
     * Adicione seus eventos esperados no key_handler
     *
     * @param key_handler gerenciador de teclas
     */
    register(key_handler: KeyHandler): void;
}

/**
 * Interface de listener do teclado. Todos esses objetos podem ser adicionados
 * ao KeyHandler.
 */
interface iKeyListener {
    /**
     * Deve retornar as teclas que espera receber
     *
     * @returns vetor de chaves esperadas
     */
    key: string;

    /**
     * O que fazer quando a tecla for apertada
     */
    on_key: tKeyCallback;
}

/**
 * Possíveis estados do evento de tecla
 */
export enum eKeyState {
    down,
    up
}

/**
 * Associa um objeto a um handler de tecla estático. O handler de tecla deve
 * executar a menor função possível, limitando as ações para o método de
 * atualização assíncrono que não interfere no gameloop.
 *
 * @param obj objeto a ser associado (this)
 * @param handler função ou método estático para associar, deve receber self: T
 * @returns callback de tecla
 */
function bind_handler<T>(obj: T, handler: tKeyHandler<T>): tKeyCallback {
    return state => handler(obj, state);
}

/**
 * Gerenciador de eventos do teclado. Sempre que esse objeto é atualizado, envia
 * eventos de teclado para os listeners cadastrados.
 */
export default class KeyHandler {
    private keys: Set<string>;
    private listeners: Array<iKeyListener>;

    /**
     * Propaga os eventos de tecla para os listeners cadastrados
     *
     * @param key tecla apertada ou solta
     * @param state estado atual da tecla
     */
    private dispatch(key: string, state: eKeyState): void {
        this.listeners.forEach(listener => {
            if (listener.key === key) {
                listener.on_key(state);
            }
        });
    }

    /**
     * Adiciona uma tecla na lista interna e propaga o evento de key 'down' se a
     * tecla não estava apertada
     *
     * @param key tecla a ser adicionada
     */
    private add_key(key: string): void {
        if (!this.keys.has(key)) {
            this.keys.add(key);
            this.dispatch(key, eKeyState.down);
        }
    }

    /**
     * Remove uma tecla da lista interna e propaga o evento de key 'up' se a
     * tecla estava apertada
     *
     * @param key tecla a ser removida
     */
    private pop_key(key: string): void {
        if (this.keys.delete(key)) {
            this.dispatch(key, eKeyState.up);
        }
    }

    constructor() {
        this.keys = new Set();
        this.listeners = [];

        const self = this;
        window.addEventListener('keydown', (evt: KeyboardEvent) =>
            self.add_key(evt.key)
        );
        window.addEventListener('keyup', (evt: KeyboardEvent) =>
            self.pop_key(evt.key)
        );
    }

    /**
     * Adiciona um listener na lista interna. Esse listener receberá eventos de
     * teclado sempre que o handler receber os eventos de tecla do javascript
     *
     * @param listener listener de teclado para ser adicionado
     */
    private _add_key_listener(listener: iKeyListener): void {
        this.listeners.push(listener);
    }

    /**
     * Adiciona um handler de tecla relacionado a uma tecla.
     *
     * @param key tecla para ser associada ao handler
     * @param obj referência ao objeto que escutará a tecla
     * @param on_key função que será executada quando a tecla for apertada ou
     *               solta
     */
    add_key_listener<T>(key: string, obj: T, on_key: tKeyHandler<T>): void {
        this._add_key_listener({
            key,
            on_key: bind_handler(obj, on_key)
        });
    }

    /**
     * Registra um objeto registrável
     *
     * @param registrable objeto a ser registrado
     */
    register(registrable: iKeyRegistrable): void {
        registrable.register(this);
    }
}
