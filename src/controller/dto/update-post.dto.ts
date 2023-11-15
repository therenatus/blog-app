import { CreatePostDto } from "./create-post.dto";

export type UpdatePostDto = Omit<CreatePostDto, "blogId">;
