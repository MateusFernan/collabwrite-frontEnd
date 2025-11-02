export interface DocumentDto {
  id: number;
  title: string;
  visibility: Visibility;
  contentDelta?: unknown;
  contentHtml?: string;
  createdAt: string;
  updatedAt: string;
  author?: { id: number; name: string };
}

export type Visibility = 'PRIVATE' | 'SHARED' | 'PUBLIC';
