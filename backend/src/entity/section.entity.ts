import { Entity, Column, OneToOne, JoinColumn, ManyToMany, JoinTable, PrimaryColumn, ManyToOne } from "typeorm"
import { Course } from "./course.entity"

@Entity()
export class Section {
    @PrimaryColumn()
    id: string

    @ManyToOne(() => Course, course => course.sections)
    @JoinColumn({ name: 'courseId', referencedColumnName: 'id' })
    courseId: string

    @Column({ default: 0 })
    duration: number

    @Column({ default: 'minutes' })
    durationIdentifier: 'minutes' | 'hours'

    @Column({ default: 0 })
    xp: number

    @Column({ default: '' })
    title: string

    @Column({ default: '' })
    description: string

    @Column({ type: 'bigint' })
    createdAt: string;
}