<script setup>
import { ref, computed, nextTick } from "vue";
import { useOcorrenciasStore } from "./stores/ocorrencias";

const store = useOcorrenciasStore();
const descricao = ref("");
const mostrarLista = ref(true);
const campo = ref(null);

/* metadados locais  o store continua guardando apenas strings */
const horas = ref([]);
const recente = ref(-1);
const carimbando = ref(false);

const dataHoje = new Date().toLocaleDateString("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const registros = computed(() =>
  store.lista
    .map((texto, i) => ({
      texto,
      indice: i,
      protocolo: String(i + 1).padStart(3, "0"),
      hora: horas.value[i] ?? "--:--",
    }))
    .reverse()
);

function agora() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function registrar() {
  const texto = descricao.value.trim();
  if (texto === "") return;

  store.adicionar(texto);
  const i = store.lista.length - 1;
  horas.value[i] = agora();
  recente.value = i;
  descricao.value = "";
  mostrarLista.value = true;

  carimbando.value = true;
  setTimeout(() => (carimbando.value = false), 450);

  await nextTick();
  campo.value?.focus();
}
</script>

<template>
  <main class="mesa">
    <div class="pilha">
      <div class="via via--palha" aria-hidden="true"><span>3ª via</span></div>
      <div class="via via--rosa" aria-hidden="true"><span>2ª via</span></div>

      <article class="folha">
        <span class="furo" aria-hidden="true"></span>
        <span class="furo" aria-hidden="true"></span>
        <span class="furo" aria-hidden="true"></span>

        <header class="cabecalho">
          <div>
            <p class="orgao">Livro de ocorrências</p>
            <h1>Registro de Ocorrências</h1>
          </div>
          <dl class="meta">
            <div><dt>Data</dt><dd>{{ dataHoje }}</dd></div>
            <div><dt>Via</dt><dd>1ª  arquivo</dd></div>
          </dl>
        </header>

        <div class="carimbo" :class="{ 'carimbo--batendo': carimbando }">
          <strong>{{ store.lista.length }}</strong>
          <span>{{ store.lista.length === 1 ? 'registro' : 'registros' }}</span>
        </div>

        <form class="lancamento" @submit.prevent="registrar">
          <label for="descricao">Descrição da ocorrência</label>
          <div class="linha-campo">
            <span class="marcador">{{ String(store.lista.length + 1).padStart(3, "0") }}</span>
            <input
              id="descricao"
              ref="campo"
              v-model="descricao"
              type="text"
              autocomplete="off"
              placeholder="O que aconteceu, onde e quando"
            />
          </div>
          <button type="submit" class="registrar">Registrar ocorrência</button>
        </form>

        <section class="livro">
          <div class="livro__topo">
            <h2>Lançamentos do dia</h2>
            <button type="button" class="alternar" @click="mostrarLista = !mostrarLista">
              {{ mostrarLista ? "ocultar" : "mostrar" }}
            </button>
          </div>

          <div v-if="mostrarLista">
            <template v-if="registros.length">
              <div class="colunas" aria-hidden="true">
                <span>Nº</span><span>Hora</span><span>Descrição</span>
              </div>
              <ol class="lancamentos">
                <li
                  v-for="r in registros"
                  :key="r.indice"
                  :class="{ 'lancamentos__novo': r.indice === recente }"
                >
                  <span class="num">{{ r.protocolo }}</span>
                  <span class="hora">{{ r.hora }}</span>
                  <span class="texto">{{ r.texto }}</span>
                </li>
              </ol>
            </template>
            <p v-else class="vazio">
              O livro ainda está em branco. Escreva a primeira ocorrência na linha acima.
            </p>
          </div>
        </section>
      </article>
    </div>
  </main>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@500;600;700&family=DM+Mono:wght@400;500&display=swap");

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
}
</style>

<style scoped>
.mesa {
  --tinta: #1a2c4e;
  --tinta-media: rgba(26, 44, 78, 0.62);
  --tinta-fraca: rgba(26, 44, 78, 0.34);
  --regua: rgba(26, 44, 78, 0.16);
  --papel: #e8ebdd;
  --rosa: #e2cec8;
  --palha: #e2d5ad;
  --mesa: #17293f;
  --carmim: #b23a2c;

  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: clamp(1rem, 4vw, 3.5rem) 1rem;
  background:
    radial-gradient(120% 90% at 50% 0%, #22405e 0%, var(--mesa) 55%, #0f1c2d 100%);
  font-family: "DM Mono", ui-monospace, "Courier New", monospace;
  color: var(--tinta);
}

/* granulado de feltro da mesa */
.mesa::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.14;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ---------- pilha de vias ---------- */
.pilha {
  position: relative;
  width: min(680px, 100%);
  animation: pousar 0.7s cubic-bezier(0.2, 0.9, 0.25, 1) both;
}

.via {
  position: absolute;
  inset: 0;
  border-radius: 2px;
  box-shadow: 0 18px 40px rgba(6, 14, 26, 0.45);
}
.via span {
  position: absolute;
  right: 1.1rem;
  bottom: 0.5rem;
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  color: rgba(26, 44, 78, 0.4);
}
.via--rosa {
  background: var(--rosa);
  transform: rotate(0.9deg) translate(7px, 8px);
}
.via--palha {
  background: var(--palha);
  transform: rotate(-1.4deg) translate(-6px, 15px);
}

/* ---------- folha principal ---------- */
.folha {
  position: relative;
  background: var(--papel);
  border-radius: 2px;
  padding: clamp(1.6rem, 3vw, 2.4rem) clamp(1.4rem, 3vw, 2.6rem)
    clamp(1.8rem, 3vw, 2.4rem) clamp(2.6rem, 6vw, 4.2rem);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.5) inset,
    0 26px 60px rgba(5, 12, 24, 0.5);
}

/* margem esquerda picotada */
.folha::before {
  content: "";
  position: absolute;
  left: clamp(1.5rem, 4vw, 2.6rem);
  top: 1.1rem;
  bottom: 1.1rem;
  width: 1px;
  background: repeating-linear-gradient(
    to bottom,
    var(--regua) 0 5px,
    transparent 5px 11px
  );
}

.furo {
  position: absolute;
  left: clamp(0.6rem, 2vw, 1.15rem);
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #0f1c2d;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.6);
}
.furo:nth-of-type(1) { top: 18%; }
.furo:nth-of-type(2) { top: 50%; }
.furo:nth-of-type(3) { top: 82%; }

/* ---------- cabeçalho ---------- */
.cabecalho {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2rem;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 0.9rem;
  border-bottom: 2px solid var(--tinta);
}

.orgao {
  margin: 0 0 0.35rem;
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--tinta-media);
}

h1 {
  margin: 0;
  font-family: "Archivo Narrow", "Arial Narrow", sans-serif;
  font-weight: 700;
  font-size: clamp(1.7rem, 5.2vw, 2.5rem);
  line-height: 0.98;
  letter-spacing: -0.015em;
}

.meta {
  display: flex;
  gap: 1.6rem;
  margin: 0;
}
.meta dt {
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--tinta-fraca);
}
.meta dd {
  margin: 0.15rem 0 0;
  font-size: 0.82rem;
  border-bottom: 1px solid var(--regua);
  padding-bottom: 0.15rem;
}

/* ---------- carimbo ---------- */
.carimbo {
  position: absolute;
  top: clamp(-0.6rem, -1vw, -0.2rem);
  right: clamp(0.8rem, 3vw, 2rem);
  display: grid;
  place-items: center;
  gap: 0.1rem;
  padding: 0.55rem 1rem 0.5rem;
  color: var(--carmim);
  border: 2px solid currentColor;
  border-radius: 3px;
  background: rgba(232, 235, 221, 0.35);
  transform: rotate(-8deg);
  mix-blend-mode: multiply;
  opacity: 0.9;
  animation: bater 0.5s cubic-bezier(0.2, 1.4, 0.4, 1) 0.45s both;
}
.carimbo::after {
  content: "";
  position: absolute;
  inset: 3px;
  border: 1px solid currentColor;
  border-radius: 2px;
  opacity: 0.7;
}
.carimbo strong {
  font-family: "Archivo Narrow", "Arial Narrow", sans-serif;
  font-size: 1.6rem;
  line-height: 1;
}
.carimbo span {
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.carimbo--batendo {
  animation: bater 0.45s cubic-bezier(0.2, 1.4, 0.4, 1) both;
}

/* ---------- lançamento ---------- */
.lancamento {
  margin-top: 1.6rem;
}
.lancamento label {
  display: block;
  font-family: "Archivo Narrow", "Arial Narrow", sans-serif;
  font-weight: 600;
  font-size: 0.88rem;
  letter-spacing: 0.02em;
  color: var(--tinta-media);
}

.linha-campo {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-top: 0.45rem;
  border-bottom: 1.5px solid var(--tinta);
}
.marcador {
  font-size: 0.78rem;
  color: var(--carmim);
  letter-spacing: 0.05em;
}
.linha-campo input {
  flex: 1;
  min-width: 0;
  padding: 0.45rem 0 0.55rem;
  border: 0;
  background: transparent;
  font: inherit;
  font-size: 1rem;
  color: var(--tinta);
}
.linha-campo input::placeholder {
  color: var(--tinta-fraca);
}
.linha-campo input:focus {
  outline: none;
}
.linha-campo:focus-within {
  border-bottom-color: var(--carmim);
  box-shadow: 0 1.5px 0 var(--carmim);
}

.registrar {
  margin-top: 1.1rem;
  padding: 0.72rem 1.6rem;
  font-family: "Archivo Narrow", "Arial Narrow", sans-serif;
  font-weight: 700;
  font-size: 0.92rem;
  letter-spacing: 0.06em;
  color: var(--papel);
  background: var(--carmim);
  border: 0;
  border-radius: 2px;
  cursor: pointer;
  box-shadow: 0 3px 0 #7f2419;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.2s ease;
}
.registrar:hover {
  background: #c14133;
}
.registrar:active {
  transform: translateY(3px);
  box-shadow: 0 0 0 #7f2419;
}
.registrar:focus-visible,
.alternar:focus-visible {
  outline: 2px solid var(--tinta);
  outline-offset: 3px;
}

/* ---------- livro ---------- */
.livro {
  margin-top: 2.2rem;
}
.livro__topo {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--tinta);
  padding-bottom: 0.4rem;
}
h2 {
  margin: 0;
  font-family: "Archivo Narrow", "Arial Narrow", sans-serif;
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: 0.01em;
}
.alternar {
  border: 0;
  background: none;
  padding: 0;
  font: inherit;
  font-size: 0.78rem;
  color: var(--tinta-media);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.alternar:hover {
  color: var(--carmim);
}

.colunas,
.lancamentos li {
  display: grid;
  grid-template-columns: 3rem 3.6rem 1fr;
  gap: 0.9rem;
  align-items: baseline;
}
.colunas {
  padding: 0.55rem 0 0.35rem;
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--tinta-fraca);
}

.lancamentos {
  list-style: none;
  margin: 0;
  padding: 0;
}
.lancamentos li {
  position: relative;
  padding: 0.7rem 0;
  border-bottom: 1px dashed var(--regua);
  font-size: 0.9rem;
  animation: escrever 0.45s ease both;
}
.num {
  color: var(--carmim);
  font-size: 0.82rem;
}
.hora {
  color: var(--tinta-media);
  font-size: 0.82rem;
}
.texto {
  overflow-wrap: anywhere;
  line-height: 1.5;
}
.lancamentos__novo::before {
  content: "";
  position: absolute;
  left: -0.9rem;
  top: 0.95rem;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--carmim);
}

.vazio {
  margin: 1.4rem 0 0.4rem;
  max-width: 46ch;
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--tinta-media);
}

/* ---------- movimento ---------- */
@keyframes pousar {
  from { opacity: 0; transform: translateY(22px) scale(0.985); }
  to { opacity: 1; transform: none; }
}
@keyframes bater {
  0% { opacity: 0; transform: rotate(-8deg) scale(1.5); }
  60% { opacity: 1; transform: rotate(-8deg) scale(0.94); }
  100% { opacity: 0.9; transform: rotate(-8deg) scale(1); }
}
@keyframes escrever {
  from { opacity: 0; transform: translateX(-6px); }
  to { opacity: 1; transform: none; }
}

@media (max-width: 520px) {
  .colunas { display: none; }
  .lancamentos li {
    grid-template-columns: 3rem 1fr;
    grid-template-areas: "num hora" "texto texto";
    row-gap: 0.35rem;
  }
  .num { grid-area: num; }
  .hora { grid-area: hora; }
  .texto { grid-area: texto; }
  .carimbo { transform: rotate(-8deg) scale(0.85); }
  .registrar { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .pilha, .carimbo, .lancamentos li { animation: none; }
  .registrar { transition: none; }
}
</style>