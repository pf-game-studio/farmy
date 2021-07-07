/**
 * Objeto atualizável, que deve implementar on_update
 */
export interface Updatable {
    /**
     * Atualiza o objeto.
     *
     * @param delta tempo que passou desde a última atualização
     */
    on_update(delta: number): Promise<void>;
}

/**
 * Responsável por atualizar todos os objetos cadastrados na lista interna
 */
export default class Updater implements Updatable {
    private to_update: Array<Updatable>;

    constructor() {
        this.to_update = [];
    }

    /**
     * Adiciona um objeto atualizável na lista interna. Todos os objetos
     * da lista são atualizados quando o Updater é atualizado.
     *
     * @param updatable objeto atualizável para adicionar
     */
    add_updatable(updatable: Updatable): void {
        this.to_update.push(updatable);
    }

    /**
     * Propaga atualização para todos os objetos registrados.
     *
     * @param delta tempo desde a última atualização
     */
    async on_update(delta: number): Promise<void> {
        await Promise.all(
            this.to_update.map(updatable => updatable.on_update(delta))
        );
    }
}
