import React, {useContext, useEffect, useState} from 'react';
import { Container, Row, Col, Form, Button, Nav, Tab, Card, InputGroup } from 'react-bootstrap';
import { BoxArrowRight, Pencil, X, Check, Eye, EyeSlash } from 'react-bootstrap-icons';
import img from '../static/background.png';
import CreateBrand from "../components/modals/CreateBrand";
import CreateDevice from "../components/modals/CreateDevice";
import CreateType from "../components/modals/CreateType";
import {Context} from "../index";
import {SHOP_ROUTE} from "../utils/consts";
import {useNavigate} from "react-router-dom";
import {check} from "../components/http/userAPI";

const Account = () => {
    const {user} = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({
        firstName: 'Гость',
        phone: '+7 (XXX) XXX XX-XX',
        email: '',
        password: '********',
        admin: false
    });

    // Загружаем данные пользователя при монтировании компонента
    useEffect(() => {
        const loadUser = async () => {
            try {
                if (user.isAuth) {
                    const data = await check(); // Получаем актуальные данные из БД

                    setUserData({
                        firstName: data.username || 'Гость',
                        phone: data.phone || '+7 (XXX) XXX XX-XX',
                        email: data.email || '',
                        password: '********',
                        admin: data.role === 'ADMIN'
                    });
                }
            } catch (e) {
                console.error('Ошибка при загрузке пользователя:', e);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [user.isAuth]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        user.setUser({});
        user.setIsAuth(false);
        navigate(SHOP_ROUTE);
    };

    const [brandVisible, setBrandVisible] = useState(false)
    const [typeVisible, setTypeVisible] = useState(false)
    const [deviceVisible, setDeviceVisible] = useState(false)

    const [activeTab, setActiveTab] = useState('personal');
    const [editingField, setEditingField] = useState(null);
    const [tempValues, setTempValues] = useState({...userData});
    const [showPassword, setShowPassword] = useState(false);

    const handleEditClick = (fieldName) => {
        setEditingField(fieldName);
        setTempValues(prev => ({...prev, [fieldName]: userData[fieldName]}));
    };
    const handleSaveClick = (fieldName) => {
        setUserData(prev => ({...prev, [fieldName]: tempValues[fieldName]}));
        setEditingField(null);
    };
    const handleCancelClick = () => {
        setEditingField(null);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempValues(prev => ({...prev, [name]: value}));
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            padding: '20px 0'
        }}>
            <Container className="py-5" style={{ maxWidth: '1200px' }}> {/* Увеличена максимальная ширина */}
                <Row className="justify-content-center">
                    <Col xl={10}> {/* Увеличена ширина колонки */}
                        {/* Шапка профиля */}
                        <Row className="mb-4">
                            <Col className="text-start">
                                <h2 style={{ color: '#000', fontSize: '1.8rem' }}>{userData.firstName}</h2>
                                <p className="mb-0" style={{ color: '#000', fontWeight: '600', fontSize: '1.1rem' }}>{userData.email}</p>
                            </Col>
                            <Col xs="auto" className="align-self-center">
                                <Button variant="dark" size="sm" onClick={handleLogout}>
                                    <BoxArrowRight className="me-1" /> Выход
                                </Button>
                            </Col>
                        </Row>

                        {/* Навигация - теперь все вкладки помещаются в один ряд */}
                        <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab} className="mb-4 flex-nowrap">
                            <Nav.Item>
                                <Nav.Link
                                    eventKey="personal"
                                    style={{
                                        backgroundColor: activeTab === 'personal' ? '#000' : '#fff',
                                        color: activeTab === 'personal' ? '#fff' : '#000',
                                        fontSize: '1rem',
                                        whiteSpace: 'nowrap',
                                        padding: '0.5rem 1rem',
                                        border: '1px solid #dee2e6',
                                        borderBottom: activeTab === 'personal' ? '2px solid #000' : '1px solid transparent',
                                        marginBottom: activeTab === 'personal' ? '-1px' : '0'
                                    }}
                                >
                                    Личные данные
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                    eventKey="orders"
                                    style={{
                                        backgroundColor: activeTab === 'orders' ? '#000' : '#fff',
                                        color: activeTab === 'orders' ? '#fff' : '#000',
                                        fontSize: '1rem',
                                        whiteSpace: 'nowrap',
                                        padding: '0.5rem 1rem',
                                        border: '1px solid #dee2e6',
                                        borderBottom: activeTab === 'orders' ? '1px solid #000' : 'none'
                                    }}
                                >
                                    История заказов
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                    eventKey="loyalty"
                                    style={{
                                        backgroundColor: activeTab === 'loyalty' ? '#000' : '#fff',
                                        color: activeTab === 'loyalty' ? '#fff' : '#000',
                                        fontSize: '1rem',
                                        whiteSpace: 'nowrap',
                                        padding: '0.5rem 1rem',
                                        border: '1px solid #dee2e6',
                                        borderBottom: activeTab === 'loyalty' ? '1px solid #000' : 'none'
                                    }}
                                >
                                    Программа лояльности
                                </Nav.Link>
                            </Nav.Item>
                            {userData.admin && (
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="admin"
                                        style={{
                                            backgroundColor: activeTab === 'admin' ? '#000' : '#fff',
                                            color: activeTab === 'admin' ? '#fff' : '#000',
                                            fontSize: '1rem',
                                            whiteSpace: 'nowrap',
                                            padding: '0.5rem 1rem',
                                            border: '1px solid #dee2e6',
                                            borderBottom: activeTab === 'admin' ? '1px solid #000' : 'none'
                                        }}
                                    >
                                        Админ панель
                                    </Nav.Link>
                                </Nav.Item>
                            )}
                        </Nav>


                        {/* Контент вкладок */}
                        <Tab.Content>
                            <Tab.Pane eventKey="personal" active={activeTab === 'personal'}>
                                <Card className="p-4" style={{ backgroundColor: '#fff' }}>
                                    <Card.Body>
                                        {/* Первый ряд - Имя и Пароль */}
                                        <Row className="mb-4">
                                            <Col md={6} className="pe-md-3">
                                                <Form.Group>
                                                    <Form.Label style={{ fontSize: '1.05rem' }}>Имя</Form.Label>
                                                    <InputGroup>
                                                        {editingField === 'firstName' ? (
                                                            <>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="firstName"
                                                                    value={tempValues.firstName}
                                                                    onChange={handleInputChange}
                                                                    autoFocus
                                                                    style={{ fontSize: '1.05rem' }}
                                                                />
                                                                <Button variant="outline-success" onClick={() => handleSaveClick('firstName')}>
                                                                    <Check />
                                                                </Button>
                                                                <Button variant="outline-danger" onClick={handleCancelClick}>
                                                                    <X />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={userData.firstName}
                                                                    readOnly
                                                                    style={{ fontSize: '1.05rem' }}
                                                                />
                                                                <Button variant="outline-secondary" onClick={() => handleEditClick('firstName')}>
                                                                    <Pencil />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </InputGroup>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="ps-md-3">
                                                <Form.Group>
                                                    <Form.Label style={{ fontSize: '1.05rem' }}>Пароль</Form.Label>
                                                    <InputGroup>
                                                        {editingField === 'password' ? (
                                                            <>
                                                                <Form.Control
                                                                    type={showPassword ? "text" : "password"}
                                                                    name="password"
                                                                    value={tempValues.password}
                                                                    onChange={handleInputChange}
                                                                    style={{ fontSize: '1.05rem' }}
                                                                />
                                                                <Button
                                                                    variant="outline-secondary"
                                                                    onClick={togglePasswordVisibility}
                                                                    title={showPassword ? "Скрыть пароль" : "Показать пароль"}
                                                                >
                                                                    {showPassword ? <EyeSlash /> : <Eye />}
                                                                </Button>
                                                                <Button variant="outline-success" onClick={() => handleSaveClick('password')}>
                                                                    <Check />
                                                                </Button>
                                                                <Button variant="outline-danger" onClick={handleCancelClick}>
                                                                    <X />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Form.Control
                                                                    type="password"
                                                                    value="••••••••"
                                                                    readOnly
                                                                    style={{ fontSize: '1.05rem' }}
                                                                />
                                                                <Button variant="outline-secondary" onClick={() => handleEditClick('password')}>
                                                                    <Pencil />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </InputGroup>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {/* Второй ряд - Телефон и Email */}
                                        <Row>
                                            <Col md={6} className="pe-md-3">
                                                <Form.Group>
                                                    <Form.Label style={{ fontSize: '1.05rem' }}>Телефон</Form.Label>
                                                    <Form.Control
                                                        type="tel"
                                                        value={userData.phone}
                                                        readOnly
                                                        style={{ fontSize: '1.05rem' }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="ps-md-3">
                                                <Form.Group>
                                                    <Form.Label style={{ fontSize: '1.05rem' }}>Email</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        value={userData.email}
                                                        readOnly
                                                        style={{ fontSize: '1.05rem' }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* Остальные вкладки */}
                            <Tab.Pane eventKey="orders" active={activeTab === 'orders'}>
                                <Card className="p-4" style={{ backgroundColor: '#fff' }}>
                                    <Card.Body className="text-center">
                                        <h5 style={{ fontSize: '1.3rem' }}>История заказов</h5>
                                        <p className="text-muted" style={{ fontSize: '1.05rem' }}>Здесь будет отображаться история ваших заказов</p>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            <Tab.Pane eventKey="loyalty" active={activeTab === 'loyalty'}>
                                <Card className="p-4" style={{ backgroundColor: '#fff' }}>
                                    <Card.Body className="text-center">
                                        <h5 style={{ fontSize: '1.3rem' }}>Программа лояльности</h5>
                                        <p className="text-muted" style={{ fontSize: '1.05rem' }}>Информация о программе лояльности</p>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* Админ панель */}
                            {userData.admin && (
                                <Tab.Pane eventKey="admin" active={activeTab === 'admin'}>
                                    <Card className="p-4" style={{ backgroundColor: '#fff' }}>
                                        <Card.Body className="text-center">
                                            <h5 style={{ fontSize: '1.3rem' }}>Админ панель</h5>
                                            <div className="d-grid gap-3 mt-4">
                                                <Button
                                                    variant="dark"
                                                    size="lg"
                                                    onClick={() => setBrandVisible(true)}
                                                    style={{ color: '#fff' }}
                                                >
                                                    Добавить бренд
                                                </Button>
                                                <Button
                                                    variant="dark"
                                                    size="lg"
                                                    onClick={() => setTypeVisible(true)}
                                                    style={{ color: '#fff' }}
                                                >
                                                    Добавить тип
                                                </Button>
                                                <Button
                                                    variant="dark"
                                                    size="lg"
                                                    onClick={() => setDeviceVisible(true)}
                                                    style={{ color: '#fff' }}
                                                >
                                                    Добавить товар
                                                </Button>
                                                <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)}/>
                                                <CreateDevice show={deviceVisible} onHide={() => setDeviceVisible(false)}/>
                                                <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                            )}
                        </Tab.Content>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};


export default Account;