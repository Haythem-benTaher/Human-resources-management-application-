import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Headroom from "headroom.js";
import NotificationsPage from "../../views/NotificationsPage.js";
import {
  Button,
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

import LogoImage from "../../assets/img/brand/logo.jpg";

class DemoNavbar extends React.Component {
  state = {
    collapseClasses: "",
    collapseOpen: false,
    role: null, // Add role to state
  };

  componentDidMount() {
    let headroom = new Headroom(document.getElementById("navbar-main"));
    headroom.init();

    // Retrieve user data from localStorage (assuming you store it there)
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.setState({ role: user.role });
    }
  }

  handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    this.setState({ role: null }); // Reset role to null on logout
    this.props.navigate("/"); // Redirect to home page
  };

  render() {
    const { role } = this.state;

    const navbarStyle = {
      backgroundColor: "#5e72e4", // Blue background color
      color: "#5e72e4",
      position: "fixed", // Fix the navbar at the top
      width: "100%", // Full width
      top: 0,
      display: "flex",
      justifyContent: "center", // Center the content horizontally
     // alignItems: "center", // Align the items vertically
      width: "100%",
      left: 0,
      zIndex: 9999, // Ensure it stays above other content
      //padding: "5px 0", // Reduce top and bottom padding to reduce height
    };

    const navLinkStyle = {
      color: "#ffffff",
     // padding: "8px 12px", // Adjust padding to make the navbar more compact
      fontSize: "14px", // Reduce font size slightly if needed
    };

    return (
      <>
        <header className="header-global">
          <Navbar
            className="navbar-main headroom"
            expand="lg"
            id="navbar-main"
            style={navbarStyle}
          >
            <Container>
              <UncontrolledCollapse
                toggler="#navbar_global"
                navbar
                className={this.state.collapseClasses}
                onExiting={this.onExiting}
                onExited={this.onExited}
              >
                <div className="navbar-collapse-header">
                  <Row>
                    <Col className="collapse-brand" xs="6">
                      <Link to="/">
                        <img
                          alt="Logo"
                          src={LogoImage}
                          style={{ width: "100px" }} // Adjust size if needed
                        />
                      </Link>
                    </Col>
                    <Col className="collapse-close" xs="6">
                      <button className="navbar-toggler" id="navbar_global">
                        <span />
                        <span />
                      </button>
                    </Col>
                  </Row>
                </div>
                <Nav
                  className="navbar-nav-hover align-items-lg-center"
                  navbar
                  style={navbarStyle}
                >
                  {role === null && (
                    <>
                      {/* Unauthenticated Navbar */}
                      <NavItem>
                        <NavLink to="/" tag={Link} style={navLinkStyle}>
                          Home
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          to="/#about-section"
                          tag={Link}
                          style={navLinkStyle}
                          onClick={() => {
                            const aboutSection = document.getElementById("about-section");
                            if (aboutSection) {
                              aboutSection.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                        >
                          About
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink href="/contact" style={navLinkStyle}>
                          Contact
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          to="/#offres-section"
                          tag={Link}
                          style={navLinkStyle}
                          onClick={() => {
                            const offresSection = document.getElementById("offres-section");
                            if (offresSection) {
                              offresSection.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                        >
                          Our Offers
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink to="/formuser-page" tag={Link} style={navLinkStyle}>
                          Sign Up
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink to="/login-page" tag={Link} style={navLinkStyle}>
                          Sign In
                        </NavLink>
                      </NavItem>
                    </>
                  )}

                  {role === "candidat" && (
                    <>
                      {/* Candidat Navbar */}
                      <NavItem>
                        <NavLink
                          tag={Link}
                          to="/Offres-page"
                          className="nav-link-inner--text"
                          style={navLinkStyle}
                        >
                          Offres
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          tag={Link}
                          to="/List-Entretien"
                          className="nav-link-inner--text"
                          style={navLinkStyle}
                        >
                          Entretient
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          tag={Link}
                          to="/mytask"
                          className="nav-link-inner--text"
                          style={navLinkStyle}
                        >
                          Task
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          tag={Link}
                          to="/list-candida"
                          className="nav-link-inner--text"
                          style={navLinkStyle}
                        >
                          Applications
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          tag={Link}
                          to="/chat"
                          className="nav-link-inner--text"
                          style={navLinkStyle}
                        >
                          messages
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NotificationsPage />
                      </NavItem>
                      <NavItem>
                        <Button
                          className="btn-neutral"
                          color="default"
                          onClick={this.handleLogout}
                        >
                          Logout
                        </Button>
                      </NavItem>
                    </>
                  )}

                  {role === "admin" && (
                    <>
                      {/* Admin Navbar */}
                      <NavItem>
                        <NavLink
                          tag={Link}
                          to="/"
                          className="nav-link-inner--text"
                          style={navLinkStyle}
                        >
                          Home
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          tag={Link}
                          to="/offres-page"
                          className="nav-link-inner--text"
                          style={navLinkStyle}
                        >
                          Offres
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          tag={Link}
                          to="/entretien"
                          className="nav-link-inner--text"
                          style={navLinkStyle}
                        >
                          Entretient
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          tag={Link}
                          to="/list-task"
                          className="nav-link-inner--text"
                          style={navLinkStyle}
                        >
                          Task
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          tag={Link}
                          to="/chat"
                          className="nav-link-inner--text"
                          style={navLinkStyle}
                        >
                          messages
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NotificationsPage />
                      </NavItem>
                     
                      <NavItem>
                        <Button
                          className="btn-neutral"
                          color="default"
                          onClick={this.handleLogout}
                         // style={navLinkStyle}
                        >
                          Logout
                        </Button>
                      </NavItem>
                    </>
                  )}
                </Nav>
              </UncontrolledCollapse>
            </Container>
          </Navbar>
        </header>
      </>
    );
  }
}

// Wrapper component to use useNavigate
function DemoNavbarWrapper() {
  const navigate = useNavigate();
  return <DemoNavbar navigate={navigate} />;
}

export default DemoNavbarWrapper;
