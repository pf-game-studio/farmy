/**
 * Objeto atualizável, que deve implementar on_update
 */
export abstract class Updatable {
    /**
     * Atualiza o objeto.
     *
     * @param delta tempo que passou desde a última atualização
     */
    abstract on_update(delta: number): void;
}

/**
 * Responsável por atualizar todos os objetos cadastrados na lista interna
 */
export default class Updater extends Updatable {
    private to_update: Array<Updatable>;

    constructor() {
        super();

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
    on_update(delta: number): void {
        this.to_update.forEach(updatable => updatable.on_update(delta));
    }
}
