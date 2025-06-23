const { Sequelize } = require('sequelize');

// Создаем и сразу экспортируем экземпляр Sequelize
const sequelize = new Sequelize({
    host: process.env.DB_HOST || 'db.xxxxxx.supabase.co',
    database: process.env.DB_NAME || 'postgres',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'your-supabase-password',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

// Тест подключения (необязательно, можно вызвать в другом месте)
sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize; // Просто экспортируем экземпляр