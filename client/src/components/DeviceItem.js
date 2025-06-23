import React from 'react';
import {Card, Col, Image} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {DEVICE_ROUTE} from "../utils/consts";

const DeviceItem = ({device}) => {
    const navigate = useNavigate()
    return (
        <Col md={3} className={"mt-3"} onClick={()=> navigate(DEVICE_ROUTE + '/' + device.id.toString())}>
            <Card style={{width: '150', height: '220', cursor: 'pointer'}} border={"light"}>
                <Image width={150} height={150} src={process.env.REACT_APP_API_URL + device.img} />
                <div className=" justify-content-between align-items-center mt-2">
                    <div className="text-black-50">{device.brand}</div>
                    <div> {device.price} </div>
                </div>
                <div>{device.name}</div>

            </Card>
        </Col>
    );
};

export default DeviceItem;


