import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Model from './model.entity';
import { User } from './user.entity';


export enum UserTypeEnum {
    LOCAL_NGO = 'Local NGO',
    INTERNATIONAL_NGO = 'International NGO',
    LOCAL_COMMUNITIES = 'Local communities',
    DIASPORA = 'Diaspora' 
  }
  


@Entity('profiles')
export class Profile extends Model {
  @Column()
  name!: string;

  @Column({ nullable: true, default: '' })
  profilePic!: string;

  @Column({ nullable: true })
  shortBio!: string;

  @Column({ nullable: true })
  ngoDescription!: string;

  @Column({ nullable: true })
  numberOfParticipants!: number;

  @Column({ nullable: true, type: 'enum', enum: UserTypeEnum })
  organizationType!: UserTypeEnum;

  @Column({ nullable: true })
  previousWork!: string;

  @Column({ nullable: true })
  goals!: string;

  @Column({ nullable: true })
  targetAudience!: string;

  @Column({ nullable: true })
  location!: string;

  @OneToOne(() => User, (user) => user.profile, { nullable: false })
  @JoinColumn()
  user!: User;
}
