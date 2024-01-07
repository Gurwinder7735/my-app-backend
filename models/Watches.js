const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const Watches = sequelize.define(
    "Watches",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      subCollectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "SubCollections",
          key: "id",
          onDelete: "CASCADE",
        },
      },
      verifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
          onDelete: "CASCADE",
        },
      },
      verificationCode: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      soldBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
          onDelete: "CASCADE",
        },
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
          onDelete: "CASCADE",
        },
      },
      watchId: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "1=> Unverified , 2 => Verified, 3=> Sold",
      },
      lastUpdated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.fn("current_timestamp"),
      },
    },
    {
      sequelize,
      tableName: "Watches",
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
          name: "subCollectionId",
          using: "BTREE",
          fields: [{ name: "subCollectionId" }],
        },
      ],
    }
  );

  Watches.associate = (models) => {
    Watches.belongsTo(models.SubCollections, {
      foreignKey: "subCollectionId",
    });
    Watches.belongsTo(models.Users, {
      foreignKey: "ownerId",
      as: "owner",
      onDelete: "CASCADE",
    });
  };

  return Watches;
};
