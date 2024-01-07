const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const UserRoles = sequelize.define(
    "UserRoles",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Roles",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "UserRoles",
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "roleId",
          using: "BTREE",
          fields: [{ name: "roleId" }],
        },
        {
          name: "userId",
          using: "BTREE",
          fields: [{ name: "userId" }],
        },
      ],
    }
  );

  UserRoles.associate = (models) => {
    UserRoles.belongsTo(models.Roles, {
      foreignKey: "roleId",
    });
  };

  return UserRoles;
};
