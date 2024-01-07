const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const Collections = sequelize.define(
    "Collections",
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
          onDelete: "CASCADE",
        },
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Collections",
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

  Collections.associate = (models) => {
    // Collections.belongsTo(models.BrandDetails, {
    //   foreignKey: "userId",
    //   as: "brandDetails",
    // });
    // Notifications.belongsTo(models.Users, {
    //   foreignKey: "receiverId",
    //   as: "receiver",
    // });
    // Notifications.belongsTo(models.TransferRequests, {
    //   foreignKey: "requestId",
    //   as: "request",
    // });
  };

  return Collections;
};
