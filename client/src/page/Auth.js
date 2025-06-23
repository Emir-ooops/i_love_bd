import React, {useContext} from 'react';
import { Card, Container, Form, Button, FormCheck, Row, Col } from "react-bootstrap";
import img from "../static/auth_img.png";
import loginIcon from "../static/Right.svg";
import {registration} from "../components/http/userAPI";
import {login} from "../components/http/userAPI";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {ACCOUNT_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../utils/consts";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const Auth = observer(({ isLogin, onClose, switchToRegister, switchToLogin }) => {
    const {user} =useContext(Context)
    const navigate = useNavigate();
    const log = async() => {
        try {
            const userData = await login(email, password);
            user.setUser(userData);
            user.setIsAuth(true);
            navigate(ACCOUNT_ROUTE); // Переход на страницу профиля
            onClose?.(); // Закрываем модальное окно, если оно есть
        } catch (e) {
            alert(e.response?.data?.message || 'Ошибка входа');
        }
    }

    const reg = async() => {
        try {
            const data = await registration(email, password, username);
            user.setUser(data);
            user.setIsAuth(true);
            navigate(ACCOUNT_ROUTE); // Переход на страницу профиля
            onClose?.(); // Закрываем модальное окно, если оно есть
        } catch (e) {
            alert(e.response?.data?.message || 'Ошибка регистрации');
        }
    }

    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [username, setUsername] = React.useState('')
    return (
        <Card style={{
            width: '100%',
            height: 'auto',
            overflow: 'hidden',
            border: '0.1px solid #000',
            padding: 0 // Добавляем это свойство
        }}>
            <Row className="g-0" style={{ margin: 0 }}> {/* Убираем маргины у Row */}
                <Col md={6} className="d-none d-md-block" style={{
                    minHeight: '100%',
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: 0 // Убираем внутренние отступы
                }} />

                <Col xs={12} md={6} className="p-4 p-md-5" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    {isLogin ? (
                        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
                            <Button
                                variant="link"
                                onClick={onClose}
                                className="position-absolute top-0 end-0 m-3 p-2"
                                title="Закрыть"
                            >
                                <img src={loginIcon} alt="Закрыть" style={{ width: '24px', height: '24px' }} />
                            </Button>

                            <h2 className="text-center mb-4">Вход в "ВЕТРА"</h2>
                            <Row className="justify-content-center text-center mb-4">
                                <Col>Нет аккаунта? <Button variant="link" onClick={switchToRegister}>Зарегистрируйся!</Button></Col>
                            </Row>

                            <Form>
                                <Form.Control
                                    className="mb-3 p-3"
                                    placeholder="Email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}

                                />
                                <Form.Control
                                    className="mb-3 p-3"
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <FormCheck type="checkbox" label="Запомнить меня" className="mb-3" />
                                <Button variant="primary" className="py-3 w-100" onClick={log}>Войти</Button>
                            </Form>
                        </div>
                    ) : (
                        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
                            <h2 className="text-center mb-4">Регистрация</h2>
                            <Row className="justify-content-center text-center mb-4">
                                <Col>Уже есть аккаунт? <Button variant="link" onClick={switchToLogin}>Войти</Button></Col>
                            </Row>

                            <Form>

                                <Form.Control className="mb-1 p-3" placeholder="Почта " onChange={e => setEmail(e.target.value)}/>
                                <Form.Control className="mb-4 p-3" placeholder="Имя пользователя" onChange={e => setUsername(e.target.value)} />
                                <Form.Control className="mb-1 p-3" placeholder="Пароль" type="password" />
                                <Form.Control className="mb-3 p-3" placeholder="Повторить пароль" type="password" onChange={e => setPassword(e.target.value)}/>
                                <FormCheck type="checkbox" label="Запомнить пароль" className="mb-4" />
                                <Button variant="primary" className="py-3 w-100" onClick={reg}>Зарегистрироваться</Button>
                            </Form>
                        </div>
                    )}
                </Col>
            </Row>
        </Card>
    );
});

export default Auth;