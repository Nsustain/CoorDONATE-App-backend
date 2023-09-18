// weights: like 3, comment 4, share 3 = 10 : p -> (0 - 1) 


// extends recommender

// implement abstarct functions


// funciton grid(userid, postId):
    // user: interaction 
    // comment = 6.5, like = 3.5

    // list = get all user comments posts 
    // list = get all likes for posts

// function: recommendPosts(user, post[]) -> rankedPosts[]

    // post_probability = {} post: probability
    // get user at random 100
    // current_user

    // grid fuction
    // for post in posts:
        // for user in random_users:
            // total /= compareusers(current_user, user, post)
        // average = tatal / no_users
        // post_probability[post] = average

    // return ranked posts

/**
 * 
 */
// private compareusers(userA, userB, post) ->  p(A|B):

    // totalSeenPostByTwoUsers = 
    // P(A) = total interaction of userA with totalPosts / totalSeenPostByTwoUsers  
    //  P(B) = total interaction of userB with totalPosts / totalSeenPostByTwoUsers
    
    // filter interaction of A with posts

    // p(B|A) = how much did be interact with post that a has interacted with

    //  p(A|B) = (P(B|A) * p(a)) / p(b)

    // return P(A|B)