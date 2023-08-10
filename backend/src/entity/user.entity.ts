import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    ormId: number

    @Column()
    id: string

    @Column()
    username: string

    @Column()
    password: string

    @Column({ nullable: true, default: null })
    displayName: string

    @Column({ nullable: true, default: null })
    avatar: string

    @Column({ default: false })
    isStaff: boolean

    @Column({ type: 'bigint' })
    createdAt: string;
}