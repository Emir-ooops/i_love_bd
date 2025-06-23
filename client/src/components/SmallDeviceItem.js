import React from 'react';
import { Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/consts";
import {observer} from "mobx-react-lite";

export const SmallDeviceItem = observer(({ device }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(DEVICE_ROUTE + '/' + device.id)}
            style={{ marginRight: '15px', minWidth: '200px' }}
        >
            <Card style={{
                width: '180px',
                height: '220px',
                cursor: 'pointer',
                border: 'none'
            }}>
                <Image
                    width={120}
                    height={120}
                    src={device.image}
                    style={{
                        objectFit: 'cover',
                        margin: '0 auto',
                        display: 'block',
                        marginTop: '10px'
                    }}
                />
                <Card.Body className="p-2 text-center">
                    <div className="text-muted small">{device.brand}</div>
                    <div className="fw-bold small">{device.price} ₽</div>
                    <div className="small text-truncate px-2">{device.name}</div>
                </Card.Body>
            </Card>
        </div>
    );
});