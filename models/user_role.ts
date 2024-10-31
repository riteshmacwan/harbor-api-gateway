import { Model, Column, Table, DataType,ForeignKey, BelongsTo } from "sequelize-typescript";
import { Role } from "./role";

/**
 * Represents a therapeutic area.
 */
@Table({
    tableName: "AspNetUserRoles",
    schema: "dbo",
    timestamps : false,
})
export class UserRole extends Model {
    /**
     * Unique identifier for the therapeutic area.
     */
    @Column({
        type: DataType.STRING,
    })
    UserId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    Id: number;

    @ForeignKey(() => Role)
    @Column
    RoleId: string;;

    @BelongsTo(() => Role)
    role: Role;
}
