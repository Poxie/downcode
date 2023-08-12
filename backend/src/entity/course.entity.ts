import { Entity, Column, OneToOne, JoinColumn, ManyToMany, JoinTable, PrimaryColumn } from "typeorm"
import { User } from "./user.entity"

@Entity()
export class Course {
    @PrimaryColumn()
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
    
    @OneToOne(() => User)
    @JoinColumn({ foreignKeyConstraintName: 'authorId' })
    author: User

    @Column({ type: 'bigint' })
    createdAt: string;
    
    @Column({ type: 'bigint', nullable: true, default: null })
    publishedAt: string;
}