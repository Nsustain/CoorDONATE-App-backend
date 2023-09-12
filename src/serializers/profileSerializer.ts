import { Profile } from "../entities/user.entity";
import { findUserById } from "../services/user.service";
import Serializer from "./serializer";
import UserSerializer from "./userSerializer";


const userSerializer = new UserSerializer();
export class ProfileSerializer extends Serializer<Profile, any> {

    serialize(instance: Profile) {
        return {
            "name" : instance.name,
            "profilePic" : instance.profilePic,
            "shortBio" : instance.shortBio,
            "ngoDescription" : instance.ngoDescription,
            "numberOfParticipants" : instance.numberOfParticipants,
            "previousWork" : instance.previousWork,
            "goals" : instance.goals,
            "targetAudience" : instance.targetAudience,
            "location" : instance.location,
            "organizationType" : instance.organizationType,
            "user" : userSerializer.serialize(instance.user),
        }
    }

    deserialize(data: any): Profile {
        throw new Error("Method not implemented.");
    }

    async deserializePromise(data: any): Promise<Profile> {
        const profile = new Profile();

        const {name, profilePic, shortBio, ngoDescription, numberOfParticipants, previousWork, goals, targetAudience, location, organizationType, user} = data
        
        // set fields
        profile.name = name;
        profile.profilePic = profilePic;
        profile.shortBio = shortBio;
        profile.ngoDescription = ngoDescription;
        profile.numberOfParticipants = numberOfParticipants;
        profile.previousWork = previousWork;
        profile.goals = goals;
        profile.targetAudience = targetAudience;
        profile.location = location;
        profile.organizationType = organizationType;
        
        return profile;
    }
}