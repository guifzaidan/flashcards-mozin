import type { Deck } from "./queries/decks";
import type { Card } from "./queries/cards";

// In-memory store — persiste enquanto o dev server estiver rodando
let deckIdCounter = 3;
let cardIdCounter = 8;

export const mockDecks: Omit<Deck, "card_count">[] = [
  { id: 1, name: "Anatomia – Cabeça e Pescoço", created_at: "2025-05-01T10:00:00" },
  { id: 2, name: "Farmacologia – Antibióticos", created_at: "2025-05-02T10:00:00" },
  { id: 3, name: "Fisiologia Cardiovascular", created_at: "2025-05-03T10:00:00" },
];

export const mockCards: Card[] = [
  {
    id: 1, deck_id: 1,
    front: "Quais são os ramos terminais do nervo facial (VII par craniano)?",
    back: "Temporal, zigomático, bucal, marginal da mandíbula e cervical. Mnemônico: Two Zebras Bit My Cat.",
    times_correct: 3, times_incorrect: 1, last_reviewed: "2025-05-10T09:00:00", created_at: "2025-05-01T10:00:00",
  },
  {
    id: 2, deck_id: 1,
    front: "Qual nervo é responsável pela sensibilidade da córnea e da mucosa nasal?",
    back: "Nervo oftálmico (V1) — ramo do trigêmeo. Responsável pela sensibilidade geral da córnea, fronte e nariz.",
    times_correct: 1, times_incorrect: 3, last_reviewed: "2025-05-10T09:05:00", created_at: "2025-05-01T10:05:00",
  },
  {
    id: 3, deck_id: 1,
    front: "Qual é a origem e inserção do músculo esternocleidomastoideo?",
    back: "Origem: manúbrio do esterno e terço medial da clavícula. Inserção: processo mastoideo do temporal e linha nucal superior.",
    times_correct: 0, times_incorrect: 0, last_reviewed: null, created_at: "2025-05-01T10:10:00",
  },
  {
    id: 4, deck_id: 2,
    front: "Qual o mecanismo de ação das penicilinas?",
    back: "Inibem a síntese da parede celular bacteriana ligando-se às PBPs (Penicillin Binding Proteins), impedindo a transpeptidação do peptidoglicano. São bactericidas.",
    times_correct: 2, times_incorrect: 2, last_reviewed: "2025-05-11T08:00:00", created_at: "2025-05-02T10:00:00",
  },
  {
    id: 5, deck_id: 2,
    front: "Qual antibiótico é de escolha para infecção por MRSA?",
    back: "Vancomicina (1ª escolha parenteral) ou Linezolida. Para MRSA comunitário sem gravidade: Sulfametoxazol-Trimetoprim ou Clindamicina.",
    times_correct: 0, times_incorrect: 4, last_reviewed: "2025-05-11T08:10:00", created_at: "2025-05-02T10:05:00",
  },
  {
    id: 6, deck_id: 3,
    front: "O que é a Lei de Starling do coração?",
    back: "Quanto maior o volume diastólico final (pré-carga), maior a força de contração e o volume sistólico — até um limite. O coração bombeia o que recebe.",
    times_correct: 4, times_incorrect: 0, last_reviewed: "2025-05-12T07:00:00", created_at: "2025-05-03T10:00:00",
  },
  {
    id: 7, deck_id: 3,
    front: "Quais são os determinantes do débito cardíaco?",
    back: "DC = FC × VS. Fatores que influenciam: pré-carga (retorno venoso), pós-carga (resistência periférica) e contratilidade miocárdica.",
    times_correct: 1, times_incorrect: 1, last_reviewed: "2025-05-12T07:05:00", created_at: "2025-05-03T10:05:00",
  },
  {
    id: 8, deck_id: 3,
    front: "O que diferencia uma onda P normal de uma P mitrale no ECG?",
    back: "P mitrale: onda P alargada (>120ms) e com entalhamento, melhor vista em D2. Indica sobrecarga atrial esquerda — clássica na estenose mitral.",
    times_correct: 0, times_incorrect: 2, last_reviewed: "2025-05-12T07:10:00", created_at: "2025-05-03T10:10:00",
  },
];

export function getNextDeckId() {
  return ++deckIdCounter;
}

export function getNextCardId() {
  return ++cardIdCounter;
}
