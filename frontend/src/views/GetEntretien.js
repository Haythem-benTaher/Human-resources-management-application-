import React from "react";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Link } from 'react-router-dom';
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import team1 from "assets/img/theme/team-1-800x800.jpg";
import team2 from "assets/img/theme/team-2-800x800.jpg";
import team3 from "assets/img/theme/team-3-800x800.jpg";
import team4 from "assets/img/theme/team-4-800x800.jpg";
import './styles.css'; // Ensure the path is correct

class GetCandidature extends React.Component {
  state = {
    currentPage: 1,
    itemsPerPage: 1,
    people: [],
    userId: null,
    searchTerm: "",
    searchFocused: false,
    selectedStatus: 'All',
    dropdownOpen: false
  };

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userID = storedUser ? storedUser._id : null;
    this.setState({ userId: userID });

    fetch("http://localhost:5000/entretiens/get")
      .then(response => response.json())
      .then(data => {
        const fakeCandidates = data.map((entretien, index) => ({
          id: index + 1,
          nom: `Candidate ${index + 1}`,
          img: [team1, team2, team3, team4][index % 4],
          entretiens: [{
            id: entretien._id,
            date: entretien.date,
            titre: entretien.title,
            etat: entretien.status,
            justification: entretien.justification || "",
            location: entretien.location || "",
            editingDate: false,
            newDate: entretien.date, // Initialize with existing date
            userId: entretien.userId
          }]
        }));

        fakeCandidates.sort((a, b) => {
          const dateA = new Date(a.entretiens[0].date);
          const dateB = new Date(b.entretiens[0].date);
          return dateA - dateB;
        });

        this.setState({ people: fakeCandidates });
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  handleEditDate = (personId, entretienIndex) => {
    const people = [...this.state.people];
    const person = people.find(p => p.id === personId);
    if (person) {
      person.entretiens[entretienIndex].editingDate = true;
      this.setState({ people });
    }
  };

  handleDateChange = (personId, entretienIndex, newDate) => {
    const people = [...this.state.people];
    const person = people.find(p => p.id === personId);
    if (person) {
      person.entretiens[entretienIndex].newDate = newDate;
      this.setState({ people });
    }
  };

  handleSaveDate = (personId, entretienIndex) => {
    const people = [...this.state.people];
    const person = people.find(p => p.id === personId);
    if (person) {
      const entretien = person.entretiens[entretienIndex];
      fetch(`http://localhost:5000/entretiens/update/${entretien.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: entretien.newDate,
          status: 'Pending', // Change status to 'Pending'
          justification: entretien.justification,
          location: entretien.location
        }),
      })
        .then(response => response.json())
        .then(updatedEntretien => {
          entretien.date = updatedEntretien.date;
          entretien.etat = 'Pending'; // Update the status in the state
          entretien.editingDate = false;
          this.setState({ people });
        })
        .catch(error => {
          console.error("Error updating date:", error);
        });
    }
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  toggleDropdown = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };

  handleStatusChange = (status) => {
    this.setState({ selectedStatus: status });
    this.toggleDropdown();
  };

  filterPeople = () => {
    const { people, searchTerm, selectedStatus } = this.state;
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    return people.filter(person =>
      person.entretiens.some(entretien => {
        const matchesSearchTerm = (
          entretien.titre.toLowerCase().includes(lowercasedSearchTerm) ||
          entretien.etat.toLowerCase().includes(lowercasedSearchTerm) ||
          entretien.date.toLowerCase().includes(lowercasedSearchTerm) ||
          (entretien.location && entretien.location.toLowerCase().includes(lowercasedSearchTerm)) ||
          (entretien.justification && entretien.justification.toLowerCase().includes(lowercasedSearchTerm))
        );
        
        const matchesStatus = selectedStatus === 'All' || entretien.etat === selectedStatus;

        return matchesSearchTerm && matchesStatus;
      })
    );
  };

  render() {
    const { currentPage, itemsPerPage, searchTerm, searchFocused, selectedStatus, dropdownOpen } = this.state;
    const filteredPeople = this.filterPeople();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPeople.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);

    return (
      <>
        <DemoNavbar />
        <main ref="main">
          <section className="section section-lg section-shaped pb-250">
            <div className="shape shape-style-1 shape-default">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="separator separator-bottom separator-skew zindex-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-white"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
            <section className="section section-lg">
              <Container>
                <Row className="justify-content-center text-center mb-lg">
                  <Col lg="8">
                    <h2 className="display-3">Candidate Interviews</h2>
                    < Card  className="mb-4">
                      <CardBody>
                      <Row className="mb-4 align-items-center">
  <Col className="d-flex justify-content-between align-items-center">
    {/* Button */}
    {JSON.parse(localStorage.getItem('user')).role === 'admin' && (
      <Link to="/create-entretien">
        <Button color="primary" size="sm" className="mr-2">
          Add Interview
        </Button>
      </Link>
    )}

    {/* Search Input */}
    <div className="flex-grow-1 mx-2">
      <InputGroup className={`search-group ${searchFocused ? 'focused' : ''}`}>
        <InputGroupText>
          <i className="ni ni-zoom-split-in" />
        </InputGroupText>
        <Input
          placeholder="Search"
          type="text"
          value={searchTerm}
          onChange={this.handleSearchChange}
          onFocus={() => this.setState({ searchFocused: true })}
          onBlur={() => this.setState({ searchFocused: false })}
        />
      </InputGroup>
    </div>

    {/* Status Dropdown */}
    <Dropdown isOpen={dropdownOpen} toggle={this.toggleDropdown} className="status-dropdown ml-2">
      <DropdownToggle caret size="sm">
        Status: {selectedStatus}
      </DropdownToggle>
      <DropdownMenu aria-labelledby="nav-inner-primary_dropdown_1" end>
        <DropdownItem onClick={() => this.handleStatusChange('All')}>All</DropdownItem>
        <DropdownItem onClick={() => this.handleStatusChange('Pending')}>Pending</DropdownItem>
        <DropdownItem onClick={() => this.handleStatusChange('Accepted')}>Accepted</DropdownItem>
        <DropdownItem onClick={() => this.handleStatusChange('Rejected')}>Rejected</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </Col>
</Row>


<Row className="justify-content-center">
                  {currentItems.map((person) => (
                    <Col lg="6" key={person.id}>
                      <Card className="h-100">
                        <div className="card-body">
                          <div className="text-center">
                            <img
                              alt={person.nom}
                              className="rounded-circle img-center img-fluid shadow shadow-lg--hover"
                              src={person.img}
                              style={{ width: "150px", height: "150px" }}
                            />
                            <h5 className="mt-3 mb-3">{person.nom}</h5>
                            <p className="text-muted">Interviews</p>
                          </div>
                          <hr />
                          {person.entretiens && person.entretiens.length > 0 ? (
                            person.entretiens.map((entretien, index) => (
                              <div key={index} className="mb-3">
                                <p><strong>Title:</strong> {entretien.titre}</p>
                                <p><strong>Date & Time:</strong> {new Date(entretien.date).toLocaleString()}</p>
                                <p><strong>Location:</strong> {entretien.location}</p>
                                <p><strong>Status:</strong> 
                                  <span
                                    className={`badge ${
                                      entretien.etat === 'Accepted'
                                        ? 'bg-success'
                                        : entretien.etat === 'Rejected'
                                        ? 'bg-danger'
                                        : entretien.etat === 'Pending'
                                        ? 'bg-warning'
                                        : 'bg-secondary'
                                    }`}
                                  >
                                    {entretien.etat}
                                  </span>
                                </p>
                                {entretien.etat === 'Rejected' && (
                                  <div>
                                    <p><strong>Justification:</strong> {entretien.justification}</p>
                                    {entretien.editingDate ? (
                                      <div>
                                        <Input
                                          type="datetime-local"
                                          value={entretien.newDate}
                                          onChange={(e) => this.handleDateChange(person.id, index, e.target.value)}
                                          style={{
                                            borderRadius: '0.375rem',
                                            borderColor: '#dee2e6',
                                          }}
                                        />
                                        <Button
                                          color="primary"
                                          onClick={() => this.handleSaveDate(person.id, index)}
                                          className="mt-2"
                                        >
                                          Save
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        color="warning"
                                        onClick={() => this.handleEditDate(person.id, index)}
                                        className="mt-2"
                                      >
                                        Reschedule
                                      </Button>
                                    )}
                                  </div>
                                )}
                                <hr />
                                {entretien.userId === this.state.userId && (
                                  <Link to={`/modify-enretien/${entretien.id}`}>
                                    <Button color="info" className="mt-2">
                                      Modify
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            ))
                          ) : (
                            <p>No interviews scheduled.</p>
                          )}
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Row className="justify-content-center">
                  <Pagination>
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        previous
                        onClick={() => this.handlePageChange(currentPage - 1)}
                      />
                    </PaginationItem>
                    {[...Array(totalPages).keys()].map(page => (
                      <PaginationItem key={page + 1} active={page + 1 === currentPage}>
                        <PaginationLink
                          onClick={() => this.handlePageChange(page + 1)}
                        >
                          {page + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPage === totalPages}>
                      <PaginationLink
                        next
                        onClick={() => this.handlePageChange(currentPage + 1)}
                      />
                    </PaginationItem>
                  </Pagination>
                </Row>

                    </CardBody>
                    </Card>
                  </Col>
                </Row>
                
              </Container>
            </section>
          </section>
        </main>
        <SimpleFooter />
      </>
    );
  }
}

export default GetCandidature;
