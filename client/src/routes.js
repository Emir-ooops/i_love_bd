import {ADMIN_ROUTE, BASKET_ROUTE, DEVICE_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE,ACCOUNT_ROUTE} from "./utils/consts";
import Basket from "./page/Basket";
import DevicePage from "./page/DevicePage";
import Admin from "./page/Admin";
import Shop from "./page/Shop";
import Auth from "./page/Auth";
import Account from "./page/Account";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: BASKET_ROUTE,
        Component: Basket
    },

]

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: DEVICE_ROUTE + '/:id',
        Component: DevicePage
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE ,
        Component: Auth
    },
    {
        path: ACCOUNT_ROUTE,
        Component: Account
    }
]


