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

    @Column({ nullable: true })
    displayName: string

    @Column({ default: false })
    isStaff: boolean
}