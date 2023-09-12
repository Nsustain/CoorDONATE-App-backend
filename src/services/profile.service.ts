import AppDataSource from "../config/ormconfig";
import { Profile } from "../entities/user.entity";

const profileRepository = AppDataSource.getRepository(Profile);

// create a profile
export const createProfile = async (profileData: Partial<Profile>) => {
    return await profileRepository.save(profileRepository.create(profileData)) as Profile;
} 


