export type Project = {
  id: string;
  backgroundImage: string | { ipfs_cid: string };
  category: string;
  description: string;
  image: string | { ipfs_cid: string };
  status: string;
  submitted_ms: number;
  review_notes: string;
  linktree: {
    github?: string;
    telegram?: string;
    twitter?: string;
    website?: string;
  };
  name: string;
  tags: Record<string, string>;
  team: Record<string, string>;
};
