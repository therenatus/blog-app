export interface CreatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId?: string;
}
