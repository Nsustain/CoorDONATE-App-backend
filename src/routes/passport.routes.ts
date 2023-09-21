import express, { Request, Response } from 'express';
import passport from 'passport';

const passportRouter = express.Router();

passportRouter.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}))

passportRouter.get('/failed', (req: Request, res: Response) => {
    res.status(500).json({
        message: "failed"
    })
})

passportRouter.get('/success', (req: Request, res: Response) => {
    res.status(200).json({
        message: `Welcome ${req.user}`
    })
})

passportRouter.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/failed',
    }),
    function (req, res) {
        res.redirect('/success')

})

export default passportRouter;

