import express, {Express} from "express";
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import router from "./controller";
import {MongoClient} from "mongodb";
import {IBlog} from "./types/blog.interface";
import {IPost} from "./types/post.interface";
import {UserDBType} from './types/user.types';
import {IComment} from "./types/comment.interface";
import cookieParser from "cookie-parser";

dotenv.config()
if (!process.env.PORT) {
  console.log(`Error to get ports`);
  process.exit(1);
}
const PORT: number = parseInt(process.env.PORT);
const app: Express = express();
const mongoURI = process.env.MONGO_URI;
if(!mongoURI){
  throw new Error('MONGO URI IS INVALID')
}

const client = new MongoClient(mongoURI);
const blogDB = client.db('blogs');
const postDB = client.db('posts');
const userDB = client.db('users');
const tokenDB = client.db('token');
const commentDB = client.db('comment');

export const blogCollection = blogDB.collection<IBlog>('blogs');
export const postCollection = postDB.collection<IPost>("posts");
export const userCollection = userDB.collection<UserDBType>('users');
export const commentCollection = commentDB.collection<IComment>("comment");
export const tokenCollection = tokenDB.collection<{token: string}>("token");

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api', router);

const start = async() => {
  await client.connect();
  app.listen(PORT || 3333, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

start();
