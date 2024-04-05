import { Container, Navbar } from "react-bootstrap";

function NavbarBottom() {
    return (
        <Navbar fixed="bottom" bg="dark" data-bs-theme="dark">
            <Container className="d-flex justify-content-center">
                Made with ❤️ by &nbsp;<a href="mailto:flint.million@mnsu.edu">Flint Million, PhD</a>
            </Container>
        </Navbar>
    )
}

export default NavbarBottom;