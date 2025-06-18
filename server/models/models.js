const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false, unique: false},
    role: {type: DataTypes.STRING, allowNull: false, defaultValue: 'user'},
})

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
})

const Basket_item = sequelize.define('basket_item', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
})

const Item = sequelize.define('item', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
    price: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    img: {type: DataTypes.STRING, allowNull: false},
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
})

const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
})

const Item_info = sequelize.define('item_info', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

const TypeBrand = sequelize.define('type_brand', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
})

User.hasOne(Basket)
Basket.belongsTo(User)

Basket.hasMany(Basket_item)
Basket_item.belongsTo(Basket)

Type.hasMany(Item)
Item.belongsTo(Type)

Brand.hasMany(Item)
Item.belongsTo(Brand)

Item.hasMany(Basket_item)
Basket_item.belongsTo(Item)

Item.hasMany(Item_info, {as: 'info'})
Item_info.belongsTo(Item)

Type.belongsToMany(Brand, {through:TypeBrand})
Brand.belongsToMany(Type, {through:TypeBrand})

module.exports = {
    User,
    Basket,
    Basket_item,
    Type,
    Item,
    Brand,
    TypeBrand,
    Item_info,
};