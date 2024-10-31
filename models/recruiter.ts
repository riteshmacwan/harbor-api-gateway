import { Model, Column, Table, DataType } from "sequelize-typescript";
/**
 * Represents a therapeutic area.
 */
@Table({
    tableName: "Recruiters",
    schema: "dbo",
    timestamps: false,
    indexes: [
        {
            name: "PK_Recruiters",
            unique: true,
            fields: [{ name: "Id" }],
        },
    ],
})
export class Recruiter extends Model {
    /**
     * Unique identifier for the therapeutic area.
     */
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    Id: number;

    @Column({
        type: DataType.STRING,
    })
    FirstName: number;

    @Column({
        type: DataType.STRING,
    })
    LastName: number;


    /**
     * Email of Recruiters.
     */
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    Email: string | null;
}
