import { Model, Column, Table, DataType } from "sequelize-typescript";
/**
 * Represents a therapeutic area.
 */
@Table({
    tableName: "AspNetUsers",
    schema: "dbo",
    timestamps: false,
    indexes: [
        {
            name: "PK_AspNetUsers",
            unique: true,
            fields: [{ name: "Id" }],
        },
    ],
})
export class User extends Model {
    /**
     * Unique identifier for the therapeutic area.
     */
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    Id: number;


    /**
     * Email of Recruiters.
     */
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    Email: string | null;
}
