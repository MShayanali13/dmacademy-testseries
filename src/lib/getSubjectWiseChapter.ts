

export type SubjectWithChaptersType = {
  _id: string;
  subject: string;
  chapter: string;
};

/** Extracts a unique list of subjects */
export function getUniqueSubjects(data: SubjectWithChaptersType[]): string[] {
  const subjectsSet = new Set<string>(data.map(item => item.subject));
  return Array.from(subjectsSet);
}

/** Returns all chapters for a given subject */
export function getChaptersBySubject(
  data: SubjectWithChaptersType[],
  subject: string
): string[] {
  return data
    .filter(item => item.subject === subject)
    .map(item => item.chapter);
}
