export interface IPost {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
}

export interface ICreatePost {
  blogName: string;
  createdAt: Date;
  blogId: string;
  id: string;
}
