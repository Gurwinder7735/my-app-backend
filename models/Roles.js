const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const Roles = sequelize.define(
    "Roles",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      roleName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Roles",
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );

  // Roles.associate = (models) => {
  //   Roles.belongsTo(models.UserRoles, {
  //     foreignKey: "userId",
  //   });
  // };

  return Roles;
};
