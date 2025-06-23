import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Card, Row} from "react-bootstrap";
import {Context} from "../index";

const BrendBar = observer(() => {
    const { device } = useContext(Context);
    return (
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {device.brands.map(brand =>
                <Card
                    key={brand.id}
                    className="p-3 d-inline-block m-2"
                    style={{
                        cursor: 'pointer'
                    }}
                    onClick={()=> device.setSelectedBrand(brand)}
                    border = {brand.id === device.selectedBrand.id ? 'info' : 'dark'}
                >
                    {brand.name}
                </Card>
            )}
        </div>
    );
});

export default BrendBar;

