import { writeFile } from "node:fs/promises";

const BASE_URL = "https://mr.wikisource.org";
const SOURCE_PAGE = "दासबोध";

const normalizeSpace = (value) => value.replace(/\s+/g, " ").trim();

const ORDINAL_TO_NUMBER = {
  "पहिला": 1,
  "दुसरा": 2,
  "तीसरा": 3,
  "तिसरा": 3,
  "चवथा": 4,
  "चौथा": 4,
  "पांचवा": 5,
  "पाचवा": 5,
  "सहावा": 6,
  "सातवा": 7,
  "आठवा": 8,
  "नववा": 9,
  "नवावा": 9,
  "नवना": 9,
  "दहावा": 10,
};

const DEVANAGARI_DIGITS = "०१२३४५६७८९";

const devanagariToAsciiDigits = (value) =>
  value
    .split("")
    .map((char) => {
      const index = DEVANAGARI_DIGITS.indexOf(char);
      return index === -1 ? char : String(index);
    })
    .join("");

const wikiPageToUrl = (page) =>
  `${BASE_URL}/wiki/${page
    .split("/")
    .map((part) => encodeURIComponent(part.trim()))
    .join("/")}`;

const wikiPageToRawUrl = (page) =>
  `${BASE_URL}/w/index.php?title=${encodeURIComponent(page.trim())}&action=raw`;

const fetchText = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`failed to fetch ${url} (${response.status})`);
  }

  return response.text();
};

const extractDashaks = (rawText) => {
  const dashaks = [];

  for (const line of rawText.split("\n")) {
    const match = line.match(/^#\s+\[\[([^\]]+)\]\]\s*-\s*(.+)$/u);

    if (!match) {
      continue;
    }

    const page = normalizeSpace(match[1]);

    dashaks.push({
      page,
      title: page.replace(/^दासबोध\//u, ""),
      subtitle: normalizeSpace(match[2]),
      url: wikiPageToUrl(page),
    });
  }

  return dashaks;
};

const cleanTitle = (value) =>
  normalizeSpace(value)
    .replace(/<[^>]*>/gu, "")
    .replace(/[।॥]+.*$/u, "")
    .replace(/[:\-–—]+$/u, "")
    .trim();

const cleanLine = (line) =>
  normalizeSpace(
    line
      .replace(/\{\{[^}]*\}\}/gu, "")
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/gu, "$2")
      .replace(/\[\[([^\]]+)\]\]/gu, "$1")
      .replace(/<\/?poem>/giu, "")
      .replace(/'''/g, "")
      .replace(/''/g, "")
  );

const parseOvis = (contentLines) => {
  const ovis = [];
  let buffer = [];

  for (const rawLine of contentLines) {
    const line = normalizeSpace(rawLine);

    if (!line || /^॥\s*श्रीराम\s*॥$/u.test(line)) {
      continue;
    }

    if (/^इति\s+श्रीदासबोधे/u.test(line)) {
      break;
    }

    buffer.push(line);

    const numberMatch = line.match(/॥\s*([०१२३४५६७८९\d]+)\s*॥\s*$/u);

    if (!numberMatch) {
      continue;
    }

    const verseNumber = Number(devanagariToAsciiDigits(numberMatch[1]));
    const marathi = buffer.join(" ");

    ovis.push({
      id: `ovi-${Number.isNaN(verseNumber) ? ovis.length + 1 : verseNumber}`,
      marathi,
      english: "",
    });

    buffer = [];
  }

  return ovis;
};

const extractSamasas = (rawText) => {
  const lines = rawText.split("\n").map((line) => line.trimEnd());

  const contentStart = (() => {
    const endOfTemplateIndex = lines.findIndex((line) => line.trim() === "}}");
    return endOfTemplateIndex === -1 ? 0 : endOfTemplateIndex + 1;
  })();

  const bodyLines = lines.slice(contentStart);
  const samasaByNumber = new Map();
  const headingMatches = [];

  bodyLines.forEach((line, index) => {
    const match = normalizeSpace(line).match(/^समास\s+([^\s:]+)\s*:\s*(.+)$/u);

    if (!match) {
      return;
    }

    const number = ORDINAL_TO_NUMBER[match[1]];

    if (!number) {
      return;
    }

    headingMatches.push({
      index,
      number,
      title: cleanTitle(match[2]),
    });
  });

  if (headingMatches.length === 0) {
    throw new Error("could not find samasa headings in dashak page");
  }

  const firstHeading = headingMatches[0];
  if (firstHeading.number > 1 && firstHeading.index > 0) {
    const firstSectionLines = bodyLines.slice(0, firstHeading.index).map(cleanLine);
    const firstTitleMatch = firstSectionLines
      .join(" ")
      .match(/([^\s]+)नाम\s+समास\s+पहिला/u);

    samasaByNumber.set(1, {
      number: 1,
      title: cleanTitle(firstTitleMatch?.[1] ?? "समास 1"),
      content: firstSectionLines.filter(Boolean).join("\n"),
      ovis: parseOvis(firstSectionLines),
    });
  }

  headingMatches.forEach((heading, index) => {
    const next = headingMatches[index + 1];
    const start = heading.index + 1;
    const end = next ? next.index : bodyLines.length;
    const sectionLines = bodyLines.slice(start, end).map(cleanLine);
    const content = sectionLines.filter(Boolean).join("\n");

    samasaByNumber.set(heading.number, {
      number: heading.number,
      title: heading.title || `समास ${heading.number}`,
      content,
      ovis: parseOvis(sectionLines),
    });
  });

  const closeMarkers = [];
  bodyLines.forEach((line, index) => {
    const match = normalizeSpace(line).match(/([^\s]+)नाम\s+समास\s+([^\s।॥:]+)/u);

    if (!match) {
      return;
    }

    const number = ORDINAL_TO_NUMBER[match[2]];
    if (!number) {
      return;
    }

    closeMarkers.push({
      index,
      number,
      title: cleanTitle(match[1]),
    });
  });

  closeMarkers.forEach((marker, markerIndex) => {
    if (samasaByNumber.has(marker.number)) {
      return;
    }

    const previousEnd = markerIndex === 0 ? 0 : closeMarkers[markerIndex - 1].index + 1;
    const sectionLines = bodyLines.slice(previousEnd, marker.index + 1).map(cleanLine);

    samasaByNumber.set(marker.number, {
      number: marker.number,
      title: marker.title || `समास ${marker.number}`,
      content: sectionLines.filter(Boolean).join("\n"),
      ovis: parseOvis(sectionLines),
    });
  });

  return Array.from({ length: 10 }, (_, index) => {
    const number = index + 1;
    const samasa = samasaByNumber.get(number);

    if (samasa) {
      return samasa;
    }

    return {
      number,
      title: `समास ${number}`,
      content: "",
      ovis: [],
    };
  });
};

const main = async () => {
  const mainRaw = await fetchText(wikiPageToRawUrl(SOURCE_PAGE));
  const dashakLinks = extractDashaks(mainRaw);

  if (dashakLinks.length === 0) {
    throw new Error("could not find dashak links on source page");
  }

  const dashaks = [];

  for (let i = 0; i < dashakLinks.length; i += 1) {
    const dashak = dashakLinks[i];
    const dashakRaw = await fetchText(wikiPageToRawUrl(dashak.page));
    const samasas = extractSamasas(dashakRaw);

    dashaks.push({
      id: `dashak-${i + 1}`,
      number: i + 1,
      title: dashak.title,
      subtitle: dashak.subtitle,
      sourceUrl: dashak.url,
      samasas: samasas.map((samasa, samasaIndex) => ({
        id: `samasa-${i + 1}-${samasaIndex + 1}`,
        number: samasa.number,
        title: samasa.title,
        content: samasa.content,
        ovis: samasa.ovis,
      })),
    });
  }

  await writeFile(
    new URL("../app/data/dashaks.json", import.meta.url),
    `${JSON.stringify(dashaks, null, 2)}\n`,
    "utf8"
  );

  const totalSamasas = dashaks.reduce((count, dashak) => count + dashak.samasas.length, 0);
  console.log(`saved ${dashaks.length} dashaks and ${totalSamasas} samasas`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
