const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const Notifications = sequelize.define(
    "Notifications",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
          onDelete: "CASCADE",
        },
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
          onDelete: "CASCADE",
        },
      },
      requestId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "TransferRequests",
          key: "id",
          onDelete: "CASCADE",
        },
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: "",
      },
      message: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: "",
      },
      isRead: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "Notifications",
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
          name: "senderId",
          using: "BTREE",
          fields: [{ name: "senderId" }],
        },
        {
          name: "receiverId",
          using: "BTREE",
          fields: [{ name: "receiverId" }],
        },
      ],
    }
  );

  Notifications.associate = (models) => {
    Notifications.belongsTo(models.Users, {
      foreignKey: "senderId",
      as: "sender",
    });
    Notifications.belongsTo(models.Users, {
      foreignKey: "receiverId",
      as: "receiver",
    });
    Notifications.belongsTo(models.TransferRequests, {
      foreignKey: "requestId",
      as: "request",
    });
  };

  return Notifications;
};
