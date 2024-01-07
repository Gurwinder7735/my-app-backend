const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const TransferRequests = sequelize.define(
    "TransferRequests",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      watchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      requesterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "1=> Pending, 2=> Approved, 3=> Rejected, 4=>  Expired",
      },
      transferFeesPaid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      transferFeeAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: "",
      },
      orderId: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      sequelize,
      tableName: "TransferRequests",
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

  TransferRequests.associate = (models) => {
    TransferRequests.belongsTo(models.Users, {
      foreignKey: "requesterId",
      as: "requester",
    });
    TransferRequests.belongsTo(models.Users, {
      foreignKey: "ownerId",
      as: "owner",
    });
    TransferRequests.belongsTo(models.Watches, {
      foreignKey: "watchId",
      as: "watch",
    });
  };

  return TransferRequests;
};
