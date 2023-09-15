import { NextFunction, Request, Response } from 'express';
import { Repository } from "typeorm";
import { ProfileSerializer } from "../serializers/profileSerializer";
import AppDataSource from "../config/ormconfig";
import { findUserById } from "../services/user.service";
import ProfileService from '../services/profile.service';
import AppError from '../utils/appError';
import requireUser from '../middleware/requireUser';


class ProfileController {

    private serializer = new ProfileSerializer();
    private profileService = new ProfileService();

    public createProfile = async (req: Request, res: Response, next: NextFunction) => {
        
        try {
            
            const existingProfile = await this.profileService.findProfileByUserId(res.locals.user.id);
            
            if (existingProfile) {
                return next(new AppError(400, "User already has a profile"));
            }
            
            const user = await findUserById(res.locals.user.id);
            const profile = await this.serializer.deserializePromise(req.body);

            profile.user = user!;

            const savedProfile = await this.profileService.createProfile(profile);

            res.status(201).json(this.serializer.serialize(savedProfile));

        }catch(err) {
            next(err)
        }
    }


    public getProfile = async (req: Request, res: Response, next: NextFunction) => {
        
        try {
            
            const {userId} = req.params;

            const user = await findUserById(userId);

            if (!user) {
                return next(new AppError(404, "user not found!"))
            }
            

            const profile = await this.profileService.getProfileByUserId(userId);

            if(!profile) {
                return next(new AppError(400, "No profile set for this user!"))
            }

            res.status(200).json(this.serializer.serialize(profile!))
            

        }catch(err) {
            next(err)
        }
    }


    public editProfile = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const { userId } = req.params;
            
            if (userId !== res.locals.user.id.toString()) {
                return next(new AppError(403, "You aren't authorized to update this profile."))
            }
            
            const user = await findUserById(res.locals.user.id);

            const profile = await this.serializer.deserializePromise(req.body);
            profile.user = user!;

            // Update profile data
            
            const updatedProfile = await this.profileService.updateProfile(profile);
            
            return res.status(200).json(this.serializer.serialize(updatedProfile));

        }catch (err) {
            next(err);
        }
    }

    public deleteProfile = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const { userId } = req.params;

            if (userId !== res.locals.user.id.toString()) {
                return next(new AppError(403, "You aren't authorized to update this profile."))
            }

            const profile = this.profileService.findProfileByUserId(userId);

            if (!profile) {
                return next(new AppError(400, "User has no profile."))
            }
            
            await this.profileService.deleteProfile(userId);

            res.status(204).json();

        } catch (err) {
            next(err);
        }
    }

}


export const profileController = new ProfileController();