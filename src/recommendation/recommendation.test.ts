import BiasianRecommender from "./biasian.recommender";

interface InteractionValues {
  likedPostIds: Set<string>;
  commentedPostIds: Set<string>;
  seenPostIds: Set<string>;
}

const interactionValues:  Record<string, InteractionValues> = {
  "user1": {
    likedPostIds: new Set(['post5', 'post7']),
    commentedPostIds: new Set(['post7']),
    seenPostIds: new Set(['post5', 'post7'])
  },
  "user2": generateRandomInteractions(10),
  "user3": generateRandomInteractions(10),
  "user4": generateRandomInteractions(10),
  "user5": generateRandomInteractions(10),
  "user6": generateRandomInteractions(10),
  "user7": generateRandomInteractions(10),
  "user8": generateRandomInteractions(10),
  "user9": generateRandomInteractions(10),
  "user10": generateRandomInteractions(10),
};


console.log("interaction values", interactionValues);

// Mock the getRandomUsers function
jest.mock('../services/user.service', () => ({
    getRandomUsers: jest.fn().mockResolvedValue([
      // { id: 'user1' },
      { id: 'user2' },
      { id: 'user3' },      
      { id: 'user4' },
      { id: 'user5' },
      { id: 'user6' },
      { id: 'user7' },
      { id: 'user8' },
      { id: 'user9' },
      { id: 'user10' },
    ]),

    getAllInteractedPostIds: jest.fn().mockImplementation(async (userId: string) : Promise<InteractionValues> => {

      // Return the interaction values based on the userId
      return interactionValues[userId];
    }),
  }));

  jest.mock('../services/post.service', () => ({

    getUnseenPosts: jest.fn().mockResolvedValue([
      { id: 'post1' },
      { id: 'post2' },
      { id: 'post3' },
      { id: 'post4' },
    ]),

  }))
  
  function generateRandomInteractions(amount: number) {
    const interactions = {
      likedPostIds: new Set<string>(),
      commentedPostIds: new Set<string>(),
      seenPostIds: new Set<string>(),
    };
  
    // Generate random post ids within the range of 1-10
    const postIds = Array.from({ length: 10 }, (_, index) => `post${index + 1}`);
  
    // Randomly assign posts as liked, commented, and seen
    for (let i = 0; i < amount; i++) {
      const randomPostId = postIds[Math.floor(Math.random() * postIds.length)];
      
      const choice = Math.floor(Math.random() * 6);
      if (choice == 0){
      interactions.likedPostIds.add(randomPostId);
      }else if(choice == 1){
        interactions.commentedPostIds.add(randomPostId);
      }else if(choice == 2){
        interactions.seenPostIds.add(randomPostId);
      }else if (choice == 3){
      interactions.likedPostIds.add(randomPostId);
      interactions.seenPostIds.add(randomPostId);
      }else if (choice == 4){
      interactions.commentedPostIds.add(randomPostId);
      interactions.seenPostIds.add(randomPostId);
      }else if (choice == 5){
      interactions.likedPostIds.add(randomPostId);
      interactions.commentedPostIds.add(randomPostId);
      interactions.seenPostIds.add(randomPostId);
      }
    }
  
    return interactions;
  }
  
  
  
  describe('BiasianRecommender', () => {
    it('should recommend posts based on interactions', async () => {
      // Create an instance of BiasianRecommender with a user ID
      const recommender = new BiasianRecommender('user1');
  
      // Call the recommendPosts method
      const recommendedPosts = await recommender.recommendPosts('user1');

      console.log("recommendedPosts", recommendedPosts)

      // Assert that the recommendedPosts is an array
      expect(Array.isArray(recommendedPosts)).toBe(true);
  
    });
  });