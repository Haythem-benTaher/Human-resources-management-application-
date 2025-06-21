import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputGroupText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import DemoNavbar from 'components/Navbars/DemoNavbar.js';

import { useNavigate } from 'react-router-dom';
const Offres = () => {
  const [cards, setCards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCard, setNewCard] = useState({ title: '', description: '', date: '', type: '', userId: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const currentDate = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/offres');
        setCards(response.data);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };
   
    const fetchUser = () => {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        setLoggedInUser(parsedUser);
        setNewCard(prev => ({ ...prev, userId: parsedUser._id }));
      }
    };

    fetchOffers();
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard({ ...newCard, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCard.title) {
      setValidationMessage('Please enter a title');
      return;
    }

    const wordCount = newCard.description.trim().split(/\s+/).length;
    if (wordCount < 5) {
      setValidationMessage('Please fill out the description field with at least 5 words');
      return;
    }

    if (new Date(newCard.date) <= new Date(currentDate)) {
      setValidationMessage('The date must be greater than today\'s date');
      return;
    }

    setValidationMessage('');

    try {
      if (editIndex !== null) {
        await axios.put(`http://localhost:5000/offres/${cards[editIndex]._id}`, newCard);
        setCards(prevCards => {
          const updatedCards = [...prevCards];
          updatedCards[editIndex] = { ...newCard, _id: cards[editIndex]._id };
          return updatedCards;
        });
        setEditIndex(null);
        setSuccessMessage('Offer updated successfully!');
      } else {
        const response = await axios.post('http://localhost:5000/offres', newCard);
        setCards(prevCards => [...prevCards, response.data]);
        setSuccessMessage('Offer added successfully!');
      }
      setNewCard({ title: '', description: '', date: '', type: '', userId: loggedInUser?._id || '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving offer:', error);
    } finally {
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleUpdate = (index) => {
    setNewCard({ ...cards[index] });
 
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/offres/${cards[deleteIndex]._id}`);
      setCards(prevCards => prevCards.filter((_, i) => i !== deleteIndex));
      setSuccessMessage('Offer deleted successfully!');
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting offer:', error);
    } finally {
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowModal(true);
  };

  const getPriority = (type) => {
    const priorityMap = {
      emploi: 1,
      pack: 2,
      formation: 3,
      stage: 4,
    };
    return priorityMap[type] || 5;
  };

  const sortedCards = [...cards].sort((a, b) => {
    const priorityDiff = getPriority(a.type) - getPriority(b.type);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.date) - new Date(b.date);
  });
  

  const filteredCards = sortedCards.filter(card => {
    const title = card.title || ''; // Default to empty string if card.title is undefined
    const matchesTitle = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType ? card.type === selectedType : true;
    return matchesTitle && matchesType;
  });
  

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };
  const handleApply = (id) => {
    navigate(`/create-candidature/${id}`); // Navigate to CreateCandidature with offer ID
  };

  const renderOffers = () => {
    return (
      
      <Row>
        {filteredCards.length === 0 ? (
          <Col className="text-center">
            <p>No offers available.</p>
          </Col>
        ) : (
          filteredCards.map((card, index) => (
            <Col md="6" lg="4" key={card._id} className="mb-4 d-flex">
              <Card className="bg-white shadow-lg border-0 p-4 flex-fill" style={{ minHeight: '350px' }}>
                <CardBody className="d-flex flex-column">
                  <CardTitle tag="h5" className="text-primary">
                    {card.title}
                  </CardTitle>
                  <CardText className="flex-grow-1">{card.description}</CardText>
                  <CardText><small className="text-muted">{card.date}</small></CardText>
                  <div className="d-flex flex-column mt-4">
                    <div className="d-flex mb-2">
                      {loggedInUser && loggedInUser._id === card.userId && (
                        <>
                          <Button
                            color="primary"
                            onClick={() => handleUpdate(index)}
                            className="mr-2"
                          >
                            {editIndex === index ? 'Editing...' : 'Update'}
                          </Button>
                          <Button
                            color="danger"
                            onClick={() => confirmDelete(index)}
                          >
                            Delete 
                          </Button>
                        </>
                      )}
                    </div>
                    {!loggedInUser || (loggedInUser.role && loggedInUser.role !== "admin") ? (
                      <Button
                        color="success"
                        onClick={() => handleApply(card._id)}
                      >
                        Apply
                      </Button>
                    ) : null}
                         { (loggedInUser && loggedInUser._id===card.userId) ? (
                      <Button
                        color="success"
                        onClick={() => navigate(`/list-candidat/${card._id}`)}
                      >
                        Check application
                      </Button>
                    ) : null}
                    </div>
                </CardBody>
              </Card>
            </Col>
          ))
        )}
      </Row>
    );
  };
  

  return (
    <>
      <DemoNavbar />
    
      <main>
        <div className="position-relative">
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
            <div className="separator separator-bottom separator-skew">
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
            
          <Container>
            <Card className="bg-white shadow-lg border-0 p-4">
              <CardBody>
                <Row className="mb-4 align-items-center">
                  <Col md="4">
                  {loggedInUser && loggedInUser.role === "admin" && (
                    <Button
                      color="primary"
                      className="btn-sm"
                      style={{ 
                        width: '200px', // Réduit la longueur du bouton
                        padding: '10px 10px', // Augmente la hauteur du bouton
                        fontSize: '16px', // Ajuste la taille du texte
                      }}
                      onClick={() => {
                        setShowForm(true);
                        setEditIndex(null);
                        setNewCard({ title: '', description: '', date: '', type: '', userId: loggedInUser?._id || '' });
                        setValidationMessage('');
                      }}
                    >
                      Add New Offer
                    </Button>
                  )}
                  </Col>
                  <Col md="4">
                    <InputGroup>
                    <InputGroupText>
                        <i className="ni ni-zoom-split-in" />
                      </InputGroupText>
                      <Input
                        placeholder="Search by title..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                     
                    </InputGroup>
                  </Col>
                  <Col md="4">
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret outline color="primary" block>
                        {selectedType || 'Select Type'}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => handleTypeSelect('emploi')}>Emploi</DropdownItem>
                        <DropdownItem onClick={() => handleTypeSelect('pack')}>Pack</DropdownItem>
                        <DropdownItem onClick={() => handleTypeSelect('formation')}>Formation</DropdownItem>
                        <DropdownItem onClick={() => handleTypeSelect('stage')}>Stage</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </Col>
                </Row>

                {/* Formulaire */}
                {showForm && (
                  <Row className="mb-4">
                    <Col md="12">
                      <Card className="bg-white shadow-lg border-0 p-4">
                        <Form onSubmit={handleSubmit}>
                          <FormGroup>
                            <Label for="title">Title</Label>
                            <Input
                              type="text"
                              name="title"
                              id="title"
                              value={newCard.title}
                              onChange={handleInputChange}
                              placeholder="Enter offer title"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="description">Description</Label>
                            <Input
                              type="textarea"
                              name="description"
                              id="description"
                              value={newCard.description}
                              onChange={handleInputChange}
                              placeholder="Enter offer description"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="date">Date</Label>
                            <Input
                              type="date"
                              name="date"
                              id="date"
                              value={newCard.date}
                              onChange={handleInputChange}
                              min={currentDate}
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="type">Type</Label>
                            <Input
                              type="select"
                              name="type"
                              id="type"
                              value={newCard.type}
                              onChange={handleInputChange}
                            >
                              <option value="">Select type</option>
                              <option value="emploi">Emploi</option>
                              <option value="pack">Pack</option>
                              <option value="formation">Formation</option>
                              <option value="stage">Stage</option>
                            </Input>
                          </FormGroup>
                          <FormGroup>
                            <Button color="primary" type="submit">
                              {editIndex !== null ? 'Update Offer' : 'Add Offer'}
                            </Button>
                          </FormGroup>
                          {validationMessage && (
                            <Alert color="danger">{validationMessage}</Alert>
                          )}
                          {successMessage && (
                            <Alert color="success">{successMessage}</Alert>
                          )}
                        </Form>
                      </Card>
                    </Col>
                  </Row>
                )}

                {/* Render Offers */}
                {renderOffers()}
              </CardBody>
            </Card>
          </Container>
        </section>
         </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showModal} toggle={() => setShowModal(false)}>
        <ModalHeader toggle={() => setShowModal(false)}>Confirm Deletion</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this offer?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Offres;