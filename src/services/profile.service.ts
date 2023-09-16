import { In, Like, Repository } from 'typeorm';
import AppDataSource from '../config/ormconfig';
import { OrganizeImportsMode } from 'typescript';
import { Profile, UserTypeEnum } from '../entities/profile.entity';

class ProfileService {
  private profileRepository: Repository<Profile>;

  constructor() {
    this.profileRepository = AppDataSource.getRepository(Profile);
  }

  // create a profile
  public createProfile = async (profileData: Partial<Profile>) => {
    const profile = this.profileRepository.create(profileData);
    return (await this.profileRepository.save(profile)) as Profile;
  };

  public findProfileByUserId = async (userId: string) => {
    return await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });
  };

  // get profile by userId
  public getProfileByUserId = async (userId: string) => {
    return await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  };

  // update profile
  public updateProfile = async (newProfile: Profile) => {
    const originalProfile: Profile | undefined | null =
      await this.findProfileByUserId(newProfile.user.id);

    if (!originalProfile) {
      throw new Error('Profile not found!');
    }

    const editableProperties: Array<keyof Profile> = [
      'name',
      'profilePic',
      'shortBio',
      'ngoDescription',
      'numberOfParticipants',
      'organizationType',
      'previousWork',
      'goals',
      'targetAudience',
      'location',
    ];

    for (const property of editableProperties) {
      if (property in newProfile && newProfile[property] !== undefined) {
        originalProfile[property] = newProfile[property] as never;
      }
    }

    originalProfile.user = newProfile.user;

    return await this.profileRepository.save(originalProfile);
  };

  public deleteProfile = async (userId: string) => {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Todo: Delete the associated user

    return await this.profileRepository.remove(profile!);
  };

  public filterProfilesByQuery = async (
    searchQuery: string,
    page: number,
    limit: number
  ) => {
    const offset = (page - 1) * limit;
    return await this.profileRepository
      .createQueryBuilder('profile')
      .where('profile.name LIKE :searchQuery', {
        searchQuery: `%${searchQuery}%`,
      })
      .take(page)
      .skip(offset)
      .getMany();
  };

  public filterOrganizationProfiles = async (
    searchQuery: string,
    page: number,
    limit: number
  ): Promise<Profile[]> => {
    const offset = (page - 1) * limit;
    const filteredProfiles = await this.profileRepository.find({
      where: {
        organizationType: In([
          UserTypeEnum.LOCAL_NGO,
          UserTypeEnum.INTERNATIONAL_NGO,
        ]),
        name: Like(`%${searchQuery}%`),
      },
      take: page,
      skip: offset,
    });

    return filteredProfiles;
  };
}

export default ProfileService;
