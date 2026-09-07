export type WorkStat = { value: string; label: string };

export type WorkItem = {
  index: string;
  year: string;
  tag: string;
  title: string;
  slug: string;
  summary: string;
  image: string;
  stats: WorkStat[];
  caseStudy: {
    role: string;
    timeline: string;
    status: string;
    heroLine: string;
    context: {
      summary: string;
      stats: WorkStat[];
    };
    challenge: string;
    build: { summary: string; bullets: string[] };
    gallery: { label: string; image: string }[];
    results: {
      summary: string;
      stats: WorkStat[];
      quote: string;
    };
  };
};
