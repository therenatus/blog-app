import {IComment, ICommentResponse} from "../types/comment.interface";
import {blogCollection, commentCollection} from "../index";
import {StatusEnum} from "../types/status.enum";

export class CommentRepository {

  async findOne(id: string): Promise<IComment | null> {
    return await commentCollection.findOne({id}, { projection: {_id: 0, postId: 0}});
  }
  async create(body: IComment): Promise<IComment | null> {
    const { insertedId } = await commentCollection.insertOne(body);
    return await commentCollection.findOne({ _id: insertedId}, {projection: {_id: 0, postId: 0}})
  }

  async update(id: string, data: IComment): Promise<boolean> {
    const {matchedCount} = await commentCollection.updateOne({ id: id }, { $set: data });
    if(matchedCount === 0){
      return false
    }
    return true
  }

  async deleteComment(id: string): Promise<boolean>{
    const { deletedCount } = await commentCollection.deleteOne({ id });
    if (deletedCount === 0) {
      return false;
    }
    return true;
  }
}