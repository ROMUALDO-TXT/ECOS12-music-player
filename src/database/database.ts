import { Playlist } from '@shared/models/Playlist'
import { Track } from '@shared/models/Track'
import { User } from '@shared/models/User'
import { DataSource } from 'typeorm'

export const database = new DataSource({
    type: 'postgres', 
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: true,
    entities: [Track, User, Playlist],
})
