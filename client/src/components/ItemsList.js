import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Row} from "react-bootstrap";
import DeviceItem from "./DeviceItem";
import {Context} from "../index";

const ItemsList = observer(() => {
    const {device} = useContext(Context);
    return (
        <Row>
            {device.devices.map(device =>
                <DeviceItem key={device.id} device={device} />
            )}
        </Row>
    );
});

export default ItemsList;

