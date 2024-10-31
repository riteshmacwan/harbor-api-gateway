import { Model, Column, Table, DataType,HasMany } from "sequelize-typescript";
import { UserRole} from "./user_role"
/**
 * Represents a therapeutic area.
 */
@Table({
    tableName: "AspNetRoles",
    schema: "dbo",
    timestamps : false,
    indexes: [
        {
            name: "PK_AspNetRoles",
            unique: true,
            fields: [{ name: "Id" }],
        },
    ],
})
export class Role extends Model {
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
    Name: string | null;

    @HasMany(() => UserRole)
    userRole: UserRole[];
}
