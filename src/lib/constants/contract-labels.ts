import type { ContractSource, ContractType, PersonType } from "@/lib/types/contract";

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  rent: "Locação",
  sale: "Venda",
};

export const CONTRACT_SOURCE_LABELS: Record<ContractSource, string> = {
  linked: "Imóvel cadastrado",
  manual: "Preenchimento manual",
};

export const PERSON_TYPE_LABELS: Record<PersonType, string> = {
  individual: "Pessoa física",
  company: "Pessoa jurídica",
};

export const GUARANTEE_TYPE_OPTIONS = [
  { value: "deposit", label: "Caução" },
  { value: "guarantor", label: "Fiador" },
  { value: "insurance", label: "Seguro fiança" },
  { value: "none", label: "Sem garantia" },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: "pix", label: "PIX" },
  { value: "bank_transfer", label: "Transferência bancária" },
  { value: "boleto", label: "Boleto" },
  { value: "cash", label: "Dinheiro" },
];

export const ADJUSTMENT_INDEX_OPTIONS = [
  { value: "igpm", label: "IGP-M" },
  { value: "ipca", label: "IPCA" },
  { value: "none", label: "Sem reajuste" },
];
