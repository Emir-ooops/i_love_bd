import React, { useState, useContext } from 'react';
import { Context } from "../../index";
import { Modal, Badge } from "react-bootstrap";
import { Cart } from 'react-bootstrap-icons'; // Импортируем иконку корзины
import styles from "./NavBarStyle.module.css";
import logo from "./assets/skate_1.png";
import profileIcon from "./assets/profile_icon.svg";
import burgerIcon from "./assets/menu_icon.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { ACCOUNT_ROUTE, SHOP_ROUTE, BASKET_ROUTE } from "../../utils/consts";
import { observer } from "mobx-react-lite";
import AuthModalContent from "../../page/Auth";

export const NavBar = observer(() => {
    const { user, basket } = useContext(Context);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleProfileClick = (e) => {
        if (!user.isAuth) {
            e.preventDefault();
            setShowAuthModal(true);
        } else {
            navigate(ACCOUNT_ROUTE);
        }
    };
    const handleBasketClick = (e) => {
        if (!user.isAuth) {
            e.preventDefault();
            setShowAuthModal(true);
        } else {
            navigate(BASKET_ROUTE);
        }
    };

    const switchToRegister = () => setIsLogin(false);
    const switchToLogin = () => setIsLogin(true);

    // Количество товаров в корзине
    const basketItemsCount = basket.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <nav className={styles.navbar}>
                <NavLink to={SHOP_ROUTE} className={styles.logoContainer}>
                    <img src={logo} alt="Логотип" className={styles.logo}/>
                </NavLink>

                <div className={styles.iconsContainer}>
                    <button
                        className={styles.iconButton}
                        onClick={handleBasketClick}
                    >
                        <div style={{ position: 'relative' }}>
                            <Cart
                                size={24}
                                className={styles.icon}
                                style={{ color: 'white' }} // Добавляем белый цвет иконке
                            />
                            {basketItemsCount > 0 && (
                                <Badge
                                    pill
                                    bg="danger"
                                    style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        fontSize: '10px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {basketItemsCount}
                                </Badge>
                            )}
                        </div>
                    </button>

                    <NavLink
                        to={ACCOUNT_ROUTE}
                        className={styles.iconButton}
                        onClick={handleProfileClick}
                    >
                        <img src={profileIcon} alt="Профиль" className={styles.icon}/>
                    </NavLink>

                    <button className={styles.burgerButton}>
                        <img src={burgerIcon} alt="" className={styles.icon}/>
                    </button>
                </div>
            </nav>

            <Modal
                show={showAuthModal}
                onHide={() => setShowAuthModal(false)}
                centered
                size="lg"
                className="auth-modal"
                style={{ border: "none", overflow: "hidden" }}
            >
                <Modal.Body className="p-0">
                    <AuthModalContent
                        isLogin={isLogin}
                        onClose={() => setShowAuthModal(false)}
                        switchToRegister={switchToRegister}
                        switchToLogin={switchToLogin}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
});

export default NavBar;