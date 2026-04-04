"use client";

import {
  Card,
  CardContent,
  Chip,
  Input,
} from "@heroui/react";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

const chapterData = Array.from({ length: 20 }, (_, chapterIndex) => {
  const chapterNumber = chapterIndex + 1;

  return {
    id: chapterNumber,
    title: `Dashak ${chapterNumber}`,
    subChapters: Array.from(
      { length: 10 },
      (_, subChapterIndex) => `Samas ${chapterNumber}.${subChapterIndex + 1}`
    ),
  };
});

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const filteredChapters = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return chapterData;
    }

    return chapterData
      .map((chapter) => {
        const matchingSubChapters = chapter.subChapters.filter((subChapter) =>
          subChapter.toLowerCase().includes(query)
        );
        const chapterMatches = chapter.title.toLowerCase().includes(query);

        if (!chapterMatches && matchingSubChapters.length === 0) {
          return null;
        }

        return {
          ...chapter,
          subChapters: chapterMatches ? chapter.subChapters : matchingSubChapters,
        };
      })
      .filter((chapter) => chapter !== null);
  }, [searchValue]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 px-4 py-10">
      <main className="mx-auto w-full max-w-4xl space-y-6">
        <Card className="border border-amber-200/60 bg-white/90 shadow-lg">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <div className="space-y-2">
              <p className="font-[family-name:var(--font-space-grotesk)] text-sm uppercase tracking-[0.2em] text-amber-700">
                srimath dasbodh
              </p>
              <h1 className="font-[family-name:var(--font-instrument-serif)] text-4xl text-zinc-900 sm:text-5xl">
                chapters and sub-chapters
              </h1>
            </div>

            <Input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              aria-label="search chapters"
              placeholder="find a dashak or samas..."
              className="font-[family-name:var(--font-manrope)]"
            />

            <div className="flex items-center gap-3">
              <Chip color="warning" variant="soft" className="font-medium">
                {filteredChapters.length} Dashaks
              </Chip>
              <Chip color="accent" variant="soft" className="font-medium">
                {filteredChapters.reduce(
                  (total, chapter) => total + chapter.subChapters.length,
                  0
                )}{" "}
                Samas
              </Chip>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-amber-200/60 bg-white/90 shadow-lg">
          <CardContent className="p-3 sm:p-6">
            <div className="space-y-4">
              {filteredChapters.map((chapter) => (
                <Card
                  key={chapter.id}
                  className="border border-amber-100 bg-amber-50/30 shadow-sm"
                >
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg font-semibold text-zinc-900">
                        {chapter.title}
                      </h2>
                      <Chip color="default" variant="secondary">
                        {chapter.subChapters.length} sub-chapters
                      </Chip>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {chapter.subChapters.map((subChapter) => (
                        <Card key={subChapter} className="bg-white/80 shadow-none">
                          <CardContent className="py-2 text-zinc-800">
                            {subChapter}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
