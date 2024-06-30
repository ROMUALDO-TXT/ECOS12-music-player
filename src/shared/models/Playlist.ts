// models/Playlist.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { User } from './User';
import { Track } from './Track';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => Track, track => track.playlists)
  @JoinTable()
  tracks!: Track[];

  @ManyToOne(() => User, user => user.playlists)
  owner!: User;
}