import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Image, Row, Form, Spinner, Alert, Card, Modal } from "react-bootstrap";
import { SmallDeviceItem } from "../components/SmallDeviceItem";
import { Context } from "../index";
import { fetchDevices, fetchOneDevice, addToBasket } from "../components/http/deviceAPI";
import { observer } from "mobx-react-lite";
import img from '../static/background.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DevicePage = observer(() => {
    const { device, user } = useContext(Context);
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentDevice, setCurrentDevice] = useState(null);
    const [recommendedDevices, setRecommendedDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const deviceData = await fetchOneDevice(id);
                setCurrentDevice(deviceData);

                const featuredResponse = await fetchDevices(null, null, 1, 4, true);
                const featured = featuredResponse.rows || featuredResponse;
                setRecommendedDevices(featured.filter(d => d.id !== parseInt(id)));
            } catch (err) {
                setError(err.message);
                console.error("Ошибка загрузки данных:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) {
        return (
            <div style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                minHeight: '100vh',
                padding: '20px 0'
            }}>
                <Container className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Загрузка данных...</p>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                minHeight: '100vh',
                padding: '20px 0'
            }}>
                <Container className="py-5">
                    <Alert variant="danger">
                        <Alert.Heading>Ошибка!</Alert.Heading>
                        <p>{error}</p>
                        <Button variant="primary" onClick={() => window.location.reload()}>
                            Попробовать снова
                        </Button>
                    </Alert>
                </Container>
            </div>
        );
    }

    if (!currentDevice) {
        return (
            <div style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                minHeight: '100vh',
                padding: '20px 0'
            }}>
                <Container className="py-5 text-center">
                    <p>Товар не найден</p>
                    <Button variant="primary" href="/">
                        Вернуться в магазин
                    </Button>
                </Container>
            </div>
        );
    }

    const displayedFeaturedDevices = recommendedDevices.slice(0, 4);

    const InfoBlock = observer(() => {
        const [quantity, setQuantity] = useState(1);
        const [showAuthModal, setShowAuthModal] = useState(false);

        const handleAddToBasket = async () => {
            if (!user.isAuth) {
                setShowAuthModal(true);
                return;
            }

            try {
                await addToBasket(currentDevice.id, quantity);
                toast.success('Товар добавлен в корзину', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } catch (e) {
                toast.error('Ошибка при добавлении в корзину', {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        };

        return (
            <Card className="p-3" style={{ backgroundColor: '#fff', height: '100%' }}>
                <Card.Body>
                    <h3 className="fw-bold mb-2">{currentDevice.name}</h3>
                    <div className="fs-4 mb-2">{currentDevice.price.toLocaleString()} ₽</div>
                    <div className="d-flex align-items-center mb-3">
                        <Form.Control
                            type="number"
                            value={quantity}
                            min="1"
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                setQuantity(Math.max(1, value));
                            }}
                            className="me-2"
                            style={{ width: '70px' }}
                        />
                        <Button
                            variant="primary"
                            className="flex-grow-1"
                            onClick={handleAddToBasket}
                        >
                            Добавить в корзину
                        </Button>
                    </div>

                    <Modal show={showAuthModal} onHide={() => setShowAuthModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Требуется авторизация</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Для добавления товаров в корзину необходимо авторизоваться</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowAuthModal(false)}>
                                Отмена
                            </Button>
                            <Button variant="primary" onClick={() => navigate('/login')}>
                                Войти
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <h6>Описание</h6>
                    <p className="text-muted">{currentDevice.description || 'Описание отсутствует'}</p>

                    {currentDevice.info && currentDevice.info.length > 0 && (
                        <>
                            <h6 className="mt-4">Характеристики</h6>
                            <ul className="text-muted">
                                {currentDevice.info.map((spec, index) => (
                                    <li key={index}>
                                        <strong>{spec.title}:</strong> {spec.description}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </Card.Body>
            </Card>
        );
    });

    return (
        <div style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            padding: '20px 0'
        }}>
            <Container className="py-5" style={{ maxWidth: '1200px' }}>
                <Row className="justify-content-center">
                    <Col xl={10}>
                        <Row className="d-none d-lg-flex mb-4">
                            <Col lg={8} className="pe-4">
                                <div className="d-flex" style={{ gap: '15px' }}>
                                    <div style={{ width: '45%' }}>
                                        <Image
                                            src={process.env.REACT_APP_API_URL + currentDevice.img}
                                            fluid
                                            style={{ width: '100%' }}
                                            thumbnail
                                        />
                                    </div>
                                    <div style={{ width: '45%' }}>
                                        <Image
                                            src={process.env.REACT_APP_API_URL + currentDevice.img}
                                            fluid
                                            style={{ width: '100%' }}
                                            thumbnail
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col lg={4} className="pe-2">
                                <InfoBlock />
                            </Col>
                        </Row>

                        <div className="mt-5">
                            <h4 className="mb-4 text-center">Рекомендуем</h4>

                            {displayedFeaturedDevices.length > 0 ? (
                                <>
                                    <Row className="d-none d-lg-flex justify-content-center">
                                        {displayedFeaturedDevices.map(device => (
                                            <Col lg={3} key={device.id} className="mb-4 d-flex justify-content-center">
                                                <SmallDeviceItem device={device} />
                                            </Col>
                                        ))}
                                    </Row>

                                    <Row className="d-lg-none">
                                        <Row className="justify-content-center mb-3">
                                            {displayedFeaturedDevices.slice(0, 2).map(device => (
                                                <Col sm={6} key={device.id} className="d-flex justify-content-center">
                                                    <SmallDeviceItem device={device} />
                                                </Col>
                                            ))}
                                        </Row>
                                        <Row className="justify-content-center">
                                            {displayedFeaturedDevices.slice(2, 4).map(device => (
                                                <Col sm={6} key={device.id} className="d-flex justify-content-center">
                                                    <SmallDeviceItem device={device} />
                                                </Col>
                                            ))}
                                        </Row>
                                    </Row>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <p>Нет рекомендуемых товаров</p>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
});

export default DevicePage;