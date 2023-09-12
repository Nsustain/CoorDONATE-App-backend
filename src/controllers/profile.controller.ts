import { NextFunction, Request, Response } from 'express';
import { Repository } from "typeorm";
import { ProfileSerializer } from "../serializers/profileSerializer";
import { Profile } from "../entities/user.entity";
import AppDataSource from "../config/ormconfig";
import { findUserById } from "../services/user.service";
import { createProfile } from '../services/profile.service';


class ProfileController {

    private serializer = new ProfileSerializer();
    private repository: Repository<Profile> = AppDataSource.getRepository(Profile);

    public createProfile = async (req: Request, res: Response, next: NextFunction) => {
        
        try {
            const user = await findUserById(res.locals.user.id);

            if (user && user.profile) {
                return res.status(400).json({ message: 'User already has a profile' });
            }

            const profile = await this.serializer.deserializePromise(req.body);

            profile.user = user!;

            const savedProfile = await createProfile(profile);

            res.status(201).json(this.serializer.serialize(savedProfile));

        }catch(err) {
            next(err)
        }
    }



}


export const profileController = new ProfileController();