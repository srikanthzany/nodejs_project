import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"
@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type:'text'})
    title: string

    @Column({type:'text'})
    description: string

    @Column({type:'simple-json'})
    images: string[]

    @ManyToOne(()=>User,(user)=>user.posts,{onDelete: "CASCADE"})
    @JoinColumn({name:"userId"})
    user: User

    @Column()
    userId: number
}
