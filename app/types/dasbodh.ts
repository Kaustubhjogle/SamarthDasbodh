export type Ovi = {
  id: string;
  marathi: string;
  english: string;
};

export type Samasa = {
  id: string;
  number: number;
  title: string;
  content: string;
  ovis: Ovi[];
};

export type Dashak = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  sourceUrl: string;
  samasas: Samasa[];
};

export type SelectedSamasaContext = {
  dashakId: string;
  dashakTitle: string;
  dashakSubtitle: string;
  samasa: Samasa;
};
