import { Updatable } from './updater';
import { GLOBALS } from '../data/globals';
import { Text } from 'pixi.js';

/**
 * Objeto sensível a mudanças de dia.
 */
export interface TimeSensitive {
    /**
     * método a ser chamado quando o dia é alterado
     *
     * @param day dia atual
     */
    on_new_day(day: number): void;
}

/**
 * Gerenciador de tempo do jogo, é atualizável pelo Updater, somando um contador
 * de tempo interno. Quando o tempo passa do limite, incrementa o dia e chama
 * todos os métodos dos sensíveis ao tempo.
 */
export default class TimingManager implements Updatable {
    private current_day: number;
    private time: number;
    private listeners: Array<TimeSensitive>;
    private text: Text;

    constructor(text: Text) {
        this.current_day = 0;
        this.time = 0;
        this.listeners = [];
        this.text = text;

        this.update_text();
    }

    async on_update(delta: number): Promise<void> {
        this.time += delta;
        this.update_text();
        if (this.is_limit()) {
            this.do_new_day();
        }
    }

    /**
     * Atualiza o texto na tela com o horário atual
     */
    private update_text(): void {
        this.text.text = this.time_str();
    }

    /**
     * Faz a atualização do dia, chamado quando o horário chega no limite
     */
    do_new_day(): void {
        this.current_day++;
        this.time = 0;
        this.listeners.forEach(listener =>
            listener.on_new_day(this.current_day)
        );
    }

    /**
     * Verifica se o horário atual está no limite
     *
     * @returns verdadeiro se a hora atual é maior ou igual à hora limite
     */
    is_limit(): boolean {
        return this.hour() >= GLOBALS.max_hour;
    }

    /**
     * @returns hora atual em inteiro
     */
    hour(): number {
        return (
            GLOBALS.initial_hour +
            Math.floor(
                this.time / (GLOBALS.delta_in_seconds * GLOBALS.minutes_in_hour)
            )
        );
    }

    /**
     * @returns hora atual em string
     */
    s_hour(): string {
        const hour = this.hour();
        return hour < 10 ? `0${hour}` : `${hour}`;
    }

    /**
     * @returns minuto atual em inteiro
     */
    minute(): number {
        return (
            Math.floor(this.time / GLOBALS.delta_in_seconds) %
            GLOBALS.minutes_in_hour
        );
    }

    /**
     * @returns minuto atual em string
     */
    s_minute(): string {
        const minute = this.minute();
        return minute < 10 ? `0${minute}` : `${minute}`;
    }

    /**
     * @returns hora e minuto atual em formato hh:mm
     */
    time_str(): string {
        return `${this.s_hour()}:${this.s_minute()}`;
    }

    /**
     * Adiciona um objeto sensível a mudanças diárias
     *
     * @param sensitive objeto sensível ao tempo para adicionar
     */
    add_sensitive(sensitive: TimeSensitive): void {
        this.listeners.push(sensitive);
    }
}
