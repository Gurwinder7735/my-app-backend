const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const SubCollections = sequelize.define(
    "SubCollections",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      collectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Collections",
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
      material: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      gtin: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(5000),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "SubCollections",
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        // {
        //   name: "collectionId",
        //   using: "BTREE",
        //   fields: [{ name: "collectionId" }],
        // },
      ],
    }
  );

  SubCollections.associate = (models) => {
    SubCollections.belongsTo(models.Collections, {
      foreignKey: "collectionId",
    });
  };
  return SubCollections;
};
