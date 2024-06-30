import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Playlist } from './Playlist';

@Entity()
export class Track {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    artist!: string;

    @ManyToMany(() => Playlist, playlist => playlist.tracks)
    playlists!: Playlist[];
    
    @Column()
    filename!: string;

    @Column()
    mimetype!: string;

    @Column()
    filePath!: string; 
}