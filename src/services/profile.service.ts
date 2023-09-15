import { Repository } from "typeorm";
import AppDataSource from "../config/ormconfig";
import { OrganizeImportsMode } from "typescript";
import { Profile } from "../entities/profile.entity";

class ProfileService {
    private profileRepository: Repository<Profile>;

    constructor () {
        this.profileRepository = AppDataSource.getRepository(Profile);
    }

    // create a profile
    public createProfile = async (profileData: Partial<Profile>) => {
        const profile = this.profileRepository.create(profileData)
        return await this.profileRepository.save(profile) as Profile;
    } 

    public findProfileByUserId = async (userId: string) => {
        return await this.profileRepository.findOne({
            where: {user: {id: userId}}
        })
    }


    // get profile by userId
    public getProfileByUserId = async (userId: string) => {
        return await this.profileRepository.findOne({where: {user: {id: userId}}, relations: ["user"]})
    }

    // update profile
    public updateProfile = async (newProfile: Profile) => {

        const originalProfile : Profile | undefined | null = await this.findProfileByUserId(newProfile.user.id);

        if (!originalProfile) {
            throw new Error("Profile not found!")
        }

        const editableProperties : Array<keyof Profile>  = ['name', 'profilePic', 'shortBio', 'ngoDescription', 'numberOfParticipants', 'organizationType', 'previousWork', 'goals', 'targetAudience', 'location'];

        for (const property of editableProperties) {
            if (property in newProfile && newProfile[property] !== undefined) {
              originalProfile[property] = newProfile[property] as never;
            }
        }

        originalProfile.user = newProfile.user;

        return await this.profileRepository.save(originalProfile);
    }

    public deleteProfile = async (userId: string) => {

        const profile = await this.profileRepository.findOne({where: { user: { id: userId } }});

        if (!profile) {
            throw new Error("Profile not found");
        }

        // Todo: Delete the associated user

        return await this.profileRepository.remove(profile!);
    }
}


export default ProfileService;
