import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { SignUpType, User } from '../entities/user.entity';
import { CreateAuth0User, signTokens } from '../services/user.service';
import UserSerializer from '../serializers/userSerializer';
import AppError from '../utils/appError';
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../controllers/auth.controller';
import UserSession from '../entities/user.session';
import AppDataSource from '../config/ormconfig';

const userSerializer = new UserSerializer();
const userSessionRepository = AppDataSource.getRepository(UserSession);
const passportRouter = express.Router();

passportRouter.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}))

passportRouter.get('/failed', (req: Request, res: Response) => {
    res.status(500).json({
        message: "failed to signup using google."
    })
})

passportRouter.get('/success', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.user as any;
        const {sub: id, name, email} = userData._json;
        
        // create user
        const user = new User();
        user.auth0_id = id;
        user.name = name;
        user.email = email;
        user.signUpType = SignUpType.GOOGLE;
        
        // save user to db
        const savedUser = await CreateAuth0User(user);
        const { accessToken, refreshToken } = await signTokens(savedUser);

        const session = new UserSession();
        session.userId = savedUser.id;
        session.token = accessToken;
        session.expiresAt = new Date(Date.now());
        session.expiresAt.setMonth(session.expiresAt.getMonth() + 6)
    
        await userSessionRepository.save(userSessionRepository.create(session));
            
        // Add cookies
        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);
        res.cookie('logged_in', true, {
        ...accessTokenCookieOptions,
        httpOnly: false,
        });

        res.status(200).json({
            status: 'success',
            accessToken,
            refreshToken,
            current_user: userSerializer.serialize(savedUser)
        })
        

    }catch(err){
      next(new AppError(500, "signin Failed"))   
    }

})

passportRouter.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/api/auth0/failed',
    }),
    function (req, res) {
        res.redirect('/api/auth0/success')

})

export default passportRouter;

