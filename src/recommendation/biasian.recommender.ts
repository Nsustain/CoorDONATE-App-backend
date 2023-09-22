import { Post } from "../entities/post.entity";
import { User } from "../entities/user.entity";
import { getRandomPosts, getUnseenPosts } from "../services/post.service";
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


    public async recommendPosts(unusedUserId: string): Promise<Post[]> {

        try{
            this.randomUsers = await getRandomUsers(this.randomUserAmount);
        
            await this.buildInteractionGrid();
            // posts the current user hasn't posted yet
            const unseenPosts: Post[] = await getUnseenPosts(this.currUserId, this.unseenPostAmount);
            
            if (this.interactionGrid[this.currUserId].seenPostIds.size === 0){
                return await getRandomPosts(10)
            }
                        
            for(const post of unseenPosts){
                let total = 0
                for (const user of this.randomUsers){
                    total += this.compareUsers(this.currUserId, user.id, post.id)
                }
                const average = total / this.randomUserAmount
                this.post_probability.set(post.id, average);
            }
            
            // return top ranked posts
            const sortedEntries = Array.from(this.post_probability.entries()).sort((a, b) => b[1] - a[1]);
            const recommendedPosts = sortedEntries.map(([postId]) => unseenPosts.find((post) => post.id === postId)!);

            return recommendedPosts ? recommendedPosts : [];
        }catch(err) {
            throw new Error(`Can't get recommendations ${err}`)
        }

    }

    public recommendAccounts(user: User, accounts: User): User[] {
        throw Error("unimplemented method")
    }

    private async buildInteractionGrid() {
        // build interaction for the current user
        const currUser = new User();
        currUser.id = this.currUserId;
        for (const user of [...this.randomUsers, currUser]){
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
    private compareUsers (currUserId: string, userId: string, currPostId: string): number {
        // Todo: handle case if the user has no interactions

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
        // calculate interaction of B with post A has liked on
        for (let postId of this.interactionGrid[currUserId].likedPostIds){
            if (this.interactionGrid[userId].likedPostIds.has(postId)){
                totalInteractionB_A += InteractionWeights.like
            }

            if (this.interactionGrid[userId].commentedPostIds.has(postId)){
                totalInteractionB_A += InteractionWeights.comment
            }
        }

        // calculate interaction of B with post A has commented on
        for (let postId of this.interactionGrid[currUserId].commentedPostIds){
            if (this.interactionGrid[userId].likedPostIds.has(postId)){
                totalInteractionB_A += InteractionWeights.like
            }

            if (this.interactionGrid[userId].commentedPostIds.has(postId)){
                totalInteractionB_A += InteractionWeights.comment
            }
        }
        // P(B|A)
        let probabilityB_A = totalInteractionB_A / (InteractionWeights.total * mergedSeenIds.size)
        
        // add the interaction of the current post
        let currentPostInteraction =  0;
        if (this.interactionGrid[userId].likedPostIds.has(currPostId)){
            currentPostInteraction += InteractionWeights.like;
        }
        if (this.interactionGrid[userId].commentedPostIds.has(currPostId)){
            currentPostInteraction += InteractionWeights.comment;
        }
        
        currentPostInteraction = currentPostInteraction / InteractionWeights.total;

        probabilityB_A *= currentPostInteraction;

        const probabilityA_B = (probabilityB_A * probabilityA) / probabilityB

        return probabilityA_B;
    }
}


export default BiasianRecommender;
