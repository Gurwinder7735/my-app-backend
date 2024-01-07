const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const Users = sequelize.define(
    "Users",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      brandId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      phoneNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      password: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: "",
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "1",
      },
      firstName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      lastName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      nameVisibility: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      imageVisibility: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
      },
      otp: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      resetToken: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: "",
      },
      notifications: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      deviceType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // 1=> IOS, 2=> ANDROID
      },
      deviceToken: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      sequelize,
      tableName: "Users",
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
          name: "brandId",
          using: "BTREE",
          fields: [{ name: "brandId" }],
        },
      ],
    }
  );

  Users.associate = (models) => {
    Users.hasOne(models.UserRoles, {
      foreignKey: "userId",
    });
    Users.hasOne(models.BrandDetails, {
      foreignKey: "userId",
    });
  };
  return Users;
};
