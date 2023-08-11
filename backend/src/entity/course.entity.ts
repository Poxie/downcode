import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "./user.entity"

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    ormId: number

    @Column()
    id: string

    @Column()
    authorId: string

    @Column({ default: '' })
    title: string

    @Column({ default: '' })
    description: string

    @Column({ default: 'beginner' })
    skillLevel: 'beginner' | 'intermediate' | 'advanced'

    @Column({ default: 'draft' })
    type: 'draft' | 'course'

    @Column({ default: 'idle' })
    status: 'idle' | 'pending' | 'published'
    
    @OneToOne(type => User)
    @JoinColumn()
    author: User

    @Column({ type: 'bigint' })
    createdAt: string;
    
    @Column({ type: 'bigint', nullable: true, default: null })
    publishedAt: string;
}