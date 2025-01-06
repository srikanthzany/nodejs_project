import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Post } from "./Post"
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type:'varchar',length:256})
    name?: string

    @Column({type:'bigint',unique:true})
    mobilenumber: number

    @Column({type:'text'})
    address: string

    @Column({type:'int',default:0})
    postcount: number

    @OneToMany(()=>Post,(post)=>post.user)
    posts: Post[]
}

