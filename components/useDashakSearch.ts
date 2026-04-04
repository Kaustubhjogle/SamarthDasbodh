"use client";

import { useMemo } from "react";
import type { Dashak } from "@/app/types/dasbodh";

const DEVANAGARI_VOWELS: Record<string, string> = {
  अ: "a",
  आ: "a",
  इ: "i",
  ई: "i",
  उ: "u",
  ऊ: "u",
  ए: "e",
  ऐ: "ai",
  ओ: "o",
  औ: "au",
  ऋ: "ri",
};

const DEVANAGARI_MATRAS: Record<string, string> = {
  "ा": "a",
  "ि": "i",
  "ी": "i",
  "ु": "u",
  "ू": "u",
  "े": "e",
  "ै": "ai",
  "ो": "o",
  "ौ": "au",
  "ृ": "ri",
};

const DEVANAGARI_CONSONANTS: Record<string, string> = {
  क: "k",
  ख: "kh",
  ग: "g",
  घ: "gh",
  ङ: "n",
  च: "ch",
  छ: "chh",
  ज: "j",
  झ: "jh",
  ञ: "n",
  ट: "t",
  ठ: "th",
  ड: "d",
  ढ: "dh",
  ण: "n",
  त: "t",
  थ: "th",
  द: "d",
  ध: "dh",
  न: "n",
  प: "p",
  फ: "ph",
  ब: "b",
  भ: "bh",
  म: "m",
  य: "y",
  र: "r",
  ल: "l",
  व: "v",
  श: "sh",
  ष: "sh",
  स: "s",
  ह: "h",
  ळ: "l",
};

const DEVANAGARI_MARKS: Record<string, string> = {
  "ं": "n",
  "ः": "h",
  "ँ": "n",
};

const transliterationCache = new Map<string, { latin: string; latinNoSchwa: string }>();

const normalizeLatinSearch = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]/g, "");

const devanagariToLatin = (value: string) => {
  let output = "";
  const chars = Array.from(value);

  for (let index = 0; index < chars.length; index += 1) {
    const current = chars[index];

    if (DEVANAGARI_CONSONANTS[current]) {
      const consonant = DEVANAGARI_CONSONANTS[current];
      let next = chars[index + 1];

      if (next === "़") {
        index += 1;
        next = chars[index + 1];
      }

      if (next === "्") {
        output += consonant;
        index += 1;
        continue;
      }

      if (next && DEVANAGARI_MATRAS[next]) {
        output += consonant + DEVANAGARI_MATRAS[next];
        index += 1;
        continue;
      }

      output += consonant + "a";
      continue;
    }

    if (DEVANAGARI_VOWELS[current]) {
      output += DEVANAGARI_VOWELS[current];
      continue;
    }

    if (DEVANAGARI_MARKS[current]) {
      output += DEVANAGARI_MARKS[current];
      continue;
    }

    if (/[a-z0-9]/i.test(current)) {
      output += current.toLowerCase();
      continue;
    }

    output += " ";
  }

  return output;
};

const getLatinSearchKeys = (value: string) => {
  const cached = transliterationCache.get(value);

  if (cached) {
    return cached;
  }

  const latin = normalizeLatinSearch(devanagariToLatin(value));
  const nextValue = {
    latin,
    latinNoSchwa: latin.replace(/a/g, ""),
  };

  transliterationCache.set(value, nextValue);
  return nextValue;
};

const matchesToken = (
  text: string,
  tokenRaw: string,
  tokenLatin: string,
  tokenLatinNoSchwa: string
) => {
  if (text.toLowerCase().includes(tokenRaw)) {
    return true;
  }

  if (!tokenLatin) {
    return false;
  }

  const keys = getLatinSearchKeys(text);
  return (
    keys.latin.includes(tokenLatin) || keys.latinNoSchwa.includes(tokenLatinNoSchwa)
  );
};

const matchesQuery = (text: string, query: string) => {
  const rawTokens = query.split(/\s+/).filter(Boolean);

  if (rawTokens.length === 0) {
    return true;
  }

  return rawTokens.every((tokenRaw) => {
    const tokenLatin = normalizeLatinSearch(tokenRaw);
    const tokenLatinNoSchwa = tokenLatin.replace(/a/g, "");

    return matchesToken(text, tokenRaw, tokenLatin, tokenLatinNoSchwa);
  });
};

export default function useDashakSearch(dashaks: Dashak[], searchValue: string) {
  return useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return dashaks;
    }

    return dashaks
      .map((dashak) => {
        const matchingSamasas = dashak.samasas.filter((samasa) =>
          matchesQuery(samasa.title, query)
        );

        const dashakMatches = matchesQuery(`${dashak.title} ${dashak.subtitle}`, query);

        if (!dashakMatches && matchingSamasas.length === 0) {
          return null;
        }

        return {
          ...dashak,
          samasas: matchingSamasas,
        };
      })
      .filter((dashak): dashak is Dashak => dashak !== null);
  }, [dashaks, searchValue]);
}
