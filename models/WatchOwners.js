const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('WatchOwners', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    watchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Watches',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'WatchOwners',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "userId",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "watchId",
        using: "BTREE",
        fields: [
          { name: "watchId" },
        ]
      },
    ]
  });
};
