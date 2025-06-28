

export type SubjectWithChaptersType = {
  _id: string;
  subject: string;
  chapters: string[];
};

/** Extracts a unique list of subjects */
export function getUniqueSubjects(data: SubjectWithChaptersType[]): string[] {
  const subjectsSet = new Set<string>(data.map(item => item.subject));
  return Array.from(subjectsSet);
}
/** Returns all chapters for a given subject (new grouped structure) */
export function getChaptersBySubject(
  data: SubjectWithChaptersType[],
  subject: string
): string[] {
  const entry = data.find(item => item.subject === subject);
  return entry ? entry.chapters : [];
}
