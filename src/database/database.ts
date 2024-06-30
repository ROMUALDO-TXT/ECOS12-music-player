import { Playlist } from '@shared/models/Playlist'
import { Track } from '@shared/models/Track'
import { User } from '@shared/models/User'
import { DataSource } from 'typeorm'

export const database = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5460,
    username: "user",
    password: "pswd",
    database: "ecos12",
    synchronize: true,
    logging: true,
    entities: [Track, User, Playlist],
})
