const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        try {
            console.log('➡️ Получен запрос на регистрацию:', req.body); // Логируем входящие данные

            const { email, password, username, role } = req.body;

            // Проверка наличия обязательных полей
            if (!email || !password) {
                console.log('❌ Отсутствует email или пароль');
                return next(ApiError.badRequest('Некорректный email или пароль'));
            }

            // Проверка формата email (базовая валидация)
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                console.log('❌ Неверный формат email:', email);
                return next(ApiError.badRequest('Некорректный формат email'));
            }

            // Проверка сложности пароля (минимум 6 символов)
            if (password.length < 6) {
                console.log('❌ Слишком короткий пароль');
                return next(ApiError.badRequest('Пароль должен содержать минимум 6 символов'));
            }

            // Поиск существующего пользователя
            console.log('🔍 Поиск пользователя с email:', email);
            const candidate = await User.findOne({ where: { email } });

            if (candidate) {
                console.log('❌ Пользователь уже существует:', email);
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            }

            // Хеширование пароля
            console.log('🔒 Хеширование пароля...');
            const hashPassword = await bcrypt.hash(password, 5);

            // Создание пользователя
            console.log('🔄 Создание пользователя...');
            const user = await User.create({
                email,
                username,
                role: role || 'USER', // По умолчанию роль USER
                password: hashPassword
            });

            // Создание корзины
            console.log('🛒 Создание корзины для пользователя ID:', user.id);
            await Basket.create({ userId: user.id });

            // Генерация токена
            console.log('🔑 Генерация JWT токена...');
            const token = generateJwt(user.id, user.email, user.role);

            console.log('✅ Успешная регистрация. Пользователь:', email);
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role
                }
            });

        } catch (e) {
            console.error('🔥 Ошибка в registration контроллере:', e);
            return next(ApiError.internal('Ошибка при регистрации'));
        }
    }

    async login(req, res, next) {
        try {
            console.log('➡️ Получен запрос на вход:', req.body); // Логируем входящие данные

            const {email, password} = req.body;
            if (!email || !password) {
                console.log('❌ Отсутствует email или пароль');
                return next(ApiError.badRequest('Некорректный email или пароль'));
            }

            const user = await User.findOne({where: {email}});
            if (!user) {
                console.log('❌ Пользователь не найден:', email);
                return next(ApiError.badRequest('Пользователь не найден'));
            }

            console.log('🔍 Найден пользователь:', user.id);

            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                console.log('❌ Неверный пароль для пользователя:', user.id);
                return next(ApiError.badRequest('Неверный пароль'));
            }

            const token = generateJwt(user.id, user.email, user.role);
            console.log('✅ Успешный вход. Сгенерирован токен для:', user.email);

            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role
                }
            });
        } catch (e) {
            console.error('🔥 Ошибка в login контроллере:', e);
            return next(ApiError.internal(e.message));
        }
    }

    async check(req, res, next) {
        try {
            const token = generateJwt(req.user.id, req.user.email, req.user.role);

            // Получаем актуальные данные пользователя из БД
            const user = await User.findOne({
                where: { id: req.user.id },
                attributes: ['id', 'email', 'username', 'role'] // Указываем только нужные поля
            });

            if (!user) {
                return next(ApiError.unauthorized('Пользователь не найден'));
            }

            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role
                }
            });
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new UserController()