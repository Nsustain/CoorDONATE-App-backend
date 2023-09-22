import { Post } from "../entities/post.entity";
import { User } from "../entities/user.entity";


export default abstract class RecommendationSystem {

// abstract function: recommendPosts(user, post[]) -> rankedPosts[]
    abstract recommendPosts(userId: string): Promise<Post[]>;

// abstract function: recommendAccounts(user, accounts[]) -> rankedAccounts[]
    abstract recommendAccounts(user: User, accounts: User): User[];
}