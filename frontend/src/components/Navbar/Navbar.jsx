import { memo, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

const NavbarComponent = ({ setActiveComponent }) => {
    const [activeKey, setActiveKey] = useState('dashboard');
    const handleSelect = (eventKey) => {
        setActiveKey(eventKey);
        setActiveComponent(eventKey);
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary navbar">
            <Container>
                <Nav variant="pills" activeKey={activeKey} onSelect={handleSelect} className='nav'>
                    <Nav.Item>
                        <Nav.Link eventKey="dashboard">Transactions Dashboard</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="stats">Transctions Statistics</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="barchart">Transactions Bar-Chart</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>

    );
}

export default memo(NavbarComponent);