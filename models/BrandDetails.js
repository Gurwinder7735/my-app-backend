const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "BrandDetails",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      brandName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      legalBusinessName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      contactPerson: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      jobTitle: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      contactPersonEmail: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false, //1=> Pending, 2=> Approved, 3=> Rejected
        defaultValue: 1,
      },
    },
    {
      sequelize,
      tableName: "BrandDetails",
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
          name: "userId",
          using: "BTREE",
          fields: [{ name: "userId" }],
        },
      ],
    }
  );
};
