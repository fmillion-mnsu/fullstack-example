import { Container, Navbar } from "react-bootstrap";

function NavbarTop() {
    return (
        <Navbar collapseOnSelect fixed="top" bg="dark" data-bs-theme="dark" expand="lg">
            <Container>
                <Navbar.Brand href="#home">Shopping List Demo Application</Navbar.Brand>
           </Container>
        </Navbar>
    )
}

export default NavbarTop;