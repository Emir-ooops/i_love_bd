import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Table, Form, Spinner } from 'react-bootstrap';
import { XCircle, ArrowLeft } from 'react-bootstrap-icons';
import { Context } from '../index';
import { fetchBasket, addToBasket, removeFromBasket, updateBasketItem, clearBasket } from '../components/http/basketAPI';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

const Cart = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [basket, setBasket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user.isAuth) {
            fetchBasket().then(data => {
                setBasket(data);
                user.basket.setItems(data.basket_items || []); // Обновляем хранилище
                setLoading(false);
            }).catch(e => {
                setLoading(false);
                console.error(e);
            });
        }
    }, [user.isAuth]);

    const handleRemoveItem = (itemId) => {
        removeFromBasket(itemId).then(data => setBasket(data));
    };

    const handleQuantityChange = (itemId, value) => {
        const quantity = parseInt(value) || 1;
        updateBasketItem(itemId, quantity).then(data => setBasket(data));
    };

    const handleClearBasket = () => {
        clearBasket().then(() => {
            setBasket(null);
        });
    };

    if (!user.isAuth) {
        return (
            <Container className="py-5 text-center">
                <h3>Авторизуйтесь для просмотра корзины</h3>
                <Button variant="dark" onClick={() => navigate('/login')}>
                    Войти
                </Button>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    const subtotal = basket?.basket_items?.reduce((sum, item) => sum + (item.item.price * item.quantity), 0) || 0;

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col lg={10}>
                    <Row className="mb-4">
                        <Col className="text-start">
                            <h2>КОРЗИНА</h2>
                        </Col>
                        <Col xs="auto" className="align-self-center">
                            <Button variant="dark" size="sm" onClick={() => navigate(-1)}>
                                <ArrowLeft className="me-1" /> Назад
                            </Button>
                        </Col>
                    </Row>

                    {!basket?.basket_items?.length ? (
                        <Card className="p-5 text-center">
                            <h4>ВАША КОРЗИНА ПУСТА</h4>
                            <Button
                                variant="dark"
                                className="mt-3"
                                onClick={() => navigate('/')}
                            >
                                ПРОДОЛЖИТЬ ПОКУПКИ
                            </Button>
                        </Card>
                    ) : (
                        <>
                            <Card className="p-4 mb-4">
                                <Table responsive>
                                    <thead>
                                    <tr>
                                        <th>ТОВАР</th>
                                        <th>ЦЕНА</th>
                                        <th>КОЛИЧЕСТВО</th>
                                        <th>ИТОГО</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {basket.basket_items.map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={process.env.REACT_APP_API_URL + item.item.img}
                                                        alt={item.item.name}
                                                        style={{ width: '80px', marginRight: '15px' }}
                                                    />
                                                    <span>{item.item.name}</span>
                                                </div>
                                            </td>
                                            <td>{item.item.price.toLocaleString()} ₽</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.item.id, e.target.value)}
                                                    style={{ width: '70px' }}
                                                />
                                            </td>
                                            <td>{(item.item.price * item.quantity).toLocaleString()} ₽</td>
                                            <td>
                                                <Button
                                                    variant="link"
                                                    onClick={() => handleRemoveItem(item.item.id)}
                                                    className="text-danger"
                                                >
                                                    <XCircle size={20} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </Card>

                            <Row className="justify-content-end">
                                <Col md={5}>
                                    <Card className="p-4">
                                        <h5 className="mb-4">ИТОГО КОРЗИНЫ</h5>
                                        <div className="d-flex justify-content-between mb-3">
                                            <span>Промежуточный итог:</span>
                                            <span>{subtotal.toLocaleString()} ₽</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-4">
                                            <span>Доставка:</span>
                                            <span>Бесплатно</span>
                                        </div>
                                        <div className="d-flex justify-content-between fw-bold mb-4">
                                            <span>Общий итог:</span>
                                            <span>{subtotal.toLocaleString()} ₽</span>
                                        </div>
                                        <Button
                                            variant="dark"
                                            size="lg"
                                            className="w-100 mb-3"
                                            onClick={() => navigate('/checkout')}
                                        >
                                            ОФОРМИТЬ ЗАКАЗ
                                        </Button>
                                        <Button
                                            variant="outline-dark"
                                            size="lg"
                                            className="w-100"
                                            onClick={handleClearBasket}
                                        >
                                            ОЧИСТИТЬ КОРЗИНУ
                                        </Button>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
});

export default Cart;