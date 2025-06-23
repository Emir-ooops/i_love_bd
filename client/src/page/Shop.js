import React, {useContext, useEffect} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import TypeBar from "../components/TypeBar";
import BrendBar from "../components/BrendBar";
import ItemsList from "../components/ItemsList";
import {observer} from "mobx-react-lite";
import {fetchBrands, fetchDevices, fetchTypes} from "../components/http/deviceAPI";
import {Context} from "../index";

const Shop = observer(() => {
    const {device} = useContext(Context);
    useEffect(() => {
        fetchTypes().then(data => device.setTypes(data))
        fetchBrands().then(data => device.setBrands(data))
        fetchDevices().then(data => device.setDevices(data.rows))
    }, []);
    return (
        <Container>
            <Row className="mt-2">
                <Col md={3}>
                    <TypeBar />
                </Col>
                <Col md={9}>
                    <BrendBar/>
                    <ItemsList/>
                </Col>
            </Row>
        </Container>
    );
});

export default Shop;