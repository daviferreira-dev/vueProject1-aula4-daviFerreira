import { defineStore } from 'pinia';

export const useOcorrenciasStore = defineStore("ocorrencias", {
    state: () => ({
        lista: []
    }),
    actions: {
        adicionar(descricao) {
            this.lista.push(descricao);
        }
    }
})
