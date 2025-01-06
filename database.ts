import {DataSource} from 'typeorm'
import { User } from './src/entity/User'
import { Post } from './src/entity/Post'
const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT||"3306"),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User,Post],
    synchronize: true,
    logging: true
})

export default AppDataSource

