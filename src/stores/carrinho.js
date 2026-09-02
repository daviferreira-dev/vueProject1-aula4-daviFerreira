import { defineStore } from 'pinia';

export const useCarrinhoStore = defineStore('carrinho', { 
    state: () => ({
        quantidade: 0
    }),
    actions: {
        adicionarProduto() {
            this.quantidade++;
        }
    }
})