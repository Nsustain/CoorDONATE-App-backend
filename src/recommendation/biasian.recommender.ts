import { object } from "zod";
import { Post } from "../entities/post.entity";
import { User } from "../entities/user.entity";
import { getUnseenPosts } from "../services/post.service";
import { getAllInteractedPostIds, getRandomUsers } from "../services/user.service";
import RecommendationSystem from "./recommender";

export enum InteractionWeights {
    like = 3.5,
    comment = 6.5,
    share = 0,
    total = 10
} 
interface InteractionValue {
    likedPostIds: Set<string>,
    commentedPostIds: Set<string>,
    seenPostIds: Set<string>,
}

class BiasianRecommender extends RecommendationSystem{

    private randomUserAmount: number = 10;
    private unseenPostAmount: number = 10;
    private post_probability = new Map<string, number>();
    private currUserId: string; 
    private randomUsers: User[] = [];
    private interactionGrid:  Record<string, InteractionValue> = {};

    constructor(userId: string) {
        super();
        this.currUserId = userId
    }


    public async recommendPosts(user: User): Promise<Post[]> {

        this.randomUsers = await getRandomUsers(this.randomUserAmount);
        
        await this.buildInteractionGrid();
        // posts the current user hasn't posted yet
        const unseenPosts: Post[] = await getUnseenPosts(this.currUserId, this.unseenPostAmount);


        for(const post of unseenPosts){
            let total = 0
            for (let userId in this.randomUsers){
                total += this.compareUsers(this.currUserId, userId, post.id)
            }
            const average = total / this.randomUserAmount
            this.post_probability.set(post.id, average);
        }

        // return top ranked posts
        const sortedEntries = Array.from(this.post_probability.entries()).sort((a, b) => b[1] = a[1]);
        const recommendedPostIds = sortedEntries.map(([postId]) => postId);
        const recommendedPosts = unseenPosts.filter((post) => recommendedPostIds.includes(post.id));
        
        return recommendedPosts;
    }

    public recommendAccounts(user: User, accounts: User): User[] {
        throw Error("unimplemented method")
    }

    private async buildInteractionGrid() {
        for (const user of this.randomUsers){
            const {likedPostIds, commentedPostIds, seenPostIds} = await getAllInteractedPostIds(user.id);
            const userInteractionValue: InteractionValue = {
                likedPostIds: likedPostIds,
                commentedPostIds: commentedPostIds,
                seenPostIds: seenPostIds
              };

            this.interactionGrid[user.id] = userInteractionValue;
        }
    }
        /**
     * 
     * @param userId : random user id
     * @returns: P(A|B)
     */
    private compareUsers (currUserId: string, userId: string, postId: string): number {
        
        const totalSeenA = this.interactionGrid[currUserId].seenPostIds.size;
        const totalSeenB = this.interactionGrid[userId].seenPostIds.size; 

        const mergedSeenIds = new Set([...this.interactionGrid[currUserId].seenPostIds, this.interactionGrid[userId].seenPostIds])

        // P(A)
        const totalInteractionOfA = (this.interactionGrid[currUserId].commentedPostIds.size * InteractionWeights.like) + (this.interactionGrid[currUserId].likedPostIds.size * InteractionWeights.comment); 
        const probabilityA = totalInteractionOfA / (InteractionWeights.total * totalSeenA)

        // P(B)
        const totalInteractionOfB = (this.interactionGrid[userId].commentedPostIds.size * InteractionWeights.like) + (this.interactionGrid[userId].likedPostIds.size * InteractionWeights.comment); 
        const probabilityB = totalInteractionOfB / (InteractionWeights.total * totalSeenB)

        // P(B|A): how much did of B interacted with post that A has already interacted with
        let totalInteractionB_A = 0
        for (let postId of this.interactionGrid[currUserId].likedPostIds){
            if (this.interactionGrid[userId].likedPostIds.has(postId)){
                totalInteractionB_A += InteractionWeights.like
            }

            if (this.interactionGrid[userId].commentedPostIds.has(postId)){
                totalInteractionB_A += InteractionWeights.comment
            }
        }

        const probabilityB_A = totalInteractionB_A / (InteractionWeights.total * mergedSeenIds.size)

        const probabilityA_B = (probabilityB_A * probabilityA) / probabilityB

        return probabilityA_B;
    }
}


export default BiasianRecommender;
