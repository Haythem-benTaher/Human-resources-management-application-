import React from 'react';
import { Button, Card, Container, Row, Col, Pagination, PaginationItem, PaginationLink, Spinner } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import DemoNavbar from 'components/Navbars/DemoNavbar.js';
import SimpleFooter from 'components/Footers/SimpleFooter.js';

// Import the images
import team1 from 'assets/img/theme/team-1-800x800.jpg';

const GetCandidature = () => {
  const { id: offreId } = useParams(); // Get offreId from route parameters
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(3);
  const [people, setPeople] = React.useState([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userID=storedUser._id;
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;

    fetchData(); // Fetch all candidatures
  }, [currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all candidatures
      const response = await fetch('http://localhost:5000/candidatures');
      const data = await response.json();

      // Filter candidatures based on offreId
      const filteredData = data.filter(candidature => candidature.offreId === offreId);

      // Fetch user data for each filtered candidature and add it to the candidature data
      const peopleWithUserData = await Promise.all(
        filteredData.map(async (person) => {
          const userData = await fetchUserById(person.userId);
          return { ...person, userData };
        })
      );

      setPeople(peopleWithUserData);
      setTotalItems(peopleWithUserData.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (userId) => {
    try {
      const response = await fetch('http://localhost:5000/user/consulter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserID: userId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error(`Error fetching user data for userId ${userId}:`, error);
      return null;
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = people.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (loading) return <Spinner color="primary" />;

  return (
    <>
      <DemoNavbar />
      <main>
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
                  <h2 className="display-3">Meet the Candidates</h2>
                </Col>
              </Row>
              {totalItems === 0 ? (
                <Row className="justify-content-center">
                  <Col lg="8" className="text-center">
                    <Card className="h-100">
                      <div className="card-body text-center">
                        <p>No applications found.</p>
                      </div>
                    </Card>
                  </Col>
                </Row>
              ) : (
                <>
                  <Row className="row-cols-1 row-cols-md-3 g-4">
                    {currentItems.map((person) => (
                      <Col key={person._id} className="mb-4">
                        <Card className="h-100">
                          <div className="card-body text-center">
                            <img
                              alt={person.name}
                              className="rounded-circle img-center img-fluid shadow shadow-lg--hover"
                              src={team1} // Replace with dynamic image source if available
                              style={{ width: "150px", height: "150px" }}
                            />
                            <h5 className="card-title mt-3 mb-3">{person.name}</h5>
                            <p className="card-text"><strong>Description:</strong> {person.userData?.response.description}</p>
                            <p className="card-text"><strong>Submission Date:</strong> {person.dateSoumission}</p>
                            <p className="card-text"><strong>Availability:</strong> {person.disponibilite}</p>
                            <p className="card-text"><strong>Skills:</strong></p>
                            <div>
                              {person.userData?.response.competance ? person.userData?.response.competance.split(' ').map((comp, i) => (
                                <span
                                  key={i}
                                  className="badge mr-1"
                                  style={{ backgroundColor: ['#BEE5B4', '#91DAF0', '#F26A77', '#F9A936'][i % 4] }}
                                >
                                  {comp}
                                </span>
                              )) : 'No skills listed'}
                            </div>
                            <p className="card-text mt-3">
                              <a href={`http://localhost:5000/candidatures/${person._id}/download/cv`} className="btn btn-warning" download>Download CV</a>
                            </p>
                            <p className="card-text mt-3">
                              <a href={`http://localhost:5000/candidatures/${person._id}/download/lettreDeMotivation`} className="btn btn-info" download>Download Motivation Letter</a>
                            </p>
                            <hr />
                            <p className="card-text"><strong>Email:</strong> {person.userData?.response.email}</p>
                            <p className="card-text">
                              <strong>Status:</strong> 
                              <span
                                className={`badge ${person.etat === 'Accepted' ? 'bg-success' : person.etat === 'Not Processed' ? 'bg-warning' : 'bg-danger'}`}
                                style={{ backgroundColor: person.etat === 'Accepted' ? '#28a745' : person.etat === 'Not Processed' ? '#ffc107' : '#dc3545' }}
                              >
                                {person.etat}
                              </span>
                            </p>
                            {person.userId === userID && (
                              <Link to={`/modify-candidature/${person._id}`} className="btn btn-primary mt-3">
                                Modify
                              </Link>
                            )}
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  {/* Pagination Controls */}
                  <Row className="justify-content-center mt-4">
                    <Col lg="8">
                      <nav aria-label="Page navigation">
                        <Pagination>
                          <PaginationItem disabled={currentPage === 1}>
                            <PaginationLink
                              previous
                              href="#pablo"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(currentPage - 1);
                              }}
                            />
                          </PaginationItem>
                          {[...Array(totalPages).keys()].map((pageNumber) => (
                            <PaginationItem
                              key={pageNumber + 1}
                              active={pageNumber + 1 === currentPage}
                            >
                              <PaginationLink
                                href="#pablo"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(pageNumber + 1);
                                }}
                              >
                                {pageNumber + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem disabled={currentPage === totalPages}>
                            <PaginationLink
                              next
                              href="#pablo"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(currentPage + 1);
                              }}
                            />
                          </PaginationItem>
                        </Pagination>
                      </nav>
                    </Col>
                  </Row>
                </>
              )}
            </Container>
          </section>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
};

export default GetCandidature;
