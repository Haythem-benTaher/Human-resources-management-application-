import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import DemoNavbar from 'components/Navbars/DemoNavbar.js';
import SimpleFooter from 'components/Footers/SimpleFooter.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DEFAULT_IMAGE = 'https://via.placeholder.com/150';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(DEFAULT_IMAGE);
  const [loading, setLoading] = useState(true);  // Added loading state
  const navigate = useNavigate();
  const mainRef = useRef(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await axios.post('http://localhost:5000/user/consulter', { UserID: storedUser._id });
        const fetchedUser = response.data.response;

        setUser(fetchedUser);
        setFormData({
          name: fetchedUser.name || '',
          email: fetchedUser.email || '',
          phone: fetchedUser.phone || '',
          competance: fetchedUser.competance || '',
          birthdate: fetchedUser.birthdate || '',
          description: fetchedUser.description || '',
          address: fetchedUser.address || '',
          image: fetchedUser.image || ''
        });
        setImagePreview(fetchedUser.image || DEFAULT_IMAGE);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);  
      }
    };
    
    fetchUserDetails();
  }, [navigate]);

  const handleEditClick = () => setIsEditing(true);

  const handleDeleteClick = async () => {
    try {
      await axios.delete('http://localhost:5000/user/supprimer', { data: { userID: user._id } });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      alert('User deleted successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file' && files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    // Validation logic
    if (!formData.name?.trim()) validationErrors.name = 'Name is required';
    if (!formData.email?.trim()) validationErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) validationErrors.email = 'Email is not valid';
    if (!formData.phone?.trim()) validationErrors.phone = 'Phone is required';
    else if (formData.phone.length < 8) validationErrors.phone = 'Phone should be at least 8 characters';
    if (!formData.description?.trim()) validationErrors.description = 'Description is required';
    if (!formData.birthdate?.trim()) validationErrors.birthdate = 'Birthdate is required';
    if (!formData.competance?.trim()) validationErrors.competance = 'Competance is required';
    if (!formData.address?.trim()) validationErrors.address = 'Address is required';

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser || !storedUser._id) {
                alert('User ID is missing from localStorage');
                return;
            }

            const formPayload = new FormData();
            formPayload.append('UserID', storedUser._id);  // Ensure UserID is appended
            Object.keys(formData).forEach((key) => formPayload.append(key, formData[key]));

            const response = await axios.post('http://localhost:5000/user/modifier', formPayload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const updatedUser = response.data.data;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }
};

  if (loading) {
    return <p>Loading...</p>;  // Display a loading message while fetching data
  }

  if (!user) {
    return <p>User not found</p>;  // Handle the case when user is not found
  }

  return (
    <>
      <DemoNavbar />
      <main className="profile-page" ref={mainRef}>
        <section className="section-profile-cover section-shaped my-0">
          <div className="shape shape-style-1 shape-default alpha-4">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="separator separator-bottom separator-skew">
            <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
              <polygon className="fill-white" points="2560 0 2560 100 0 100" />
            </svg>
          </div>
        </section>
        <section className="section">
          <Container>
            <Card className="card-profile shadow mt--300">
              <div className="px-4">
                <div className="mt-5 py-5 border-top text-center">
                  <Row className="justify-content-center">
                    <Col lg="12">
                      <h3>User Profile</h3>
                      {!isEditing ? (
                        <div className="Form">
                          <img src={imagePreview || DEFAULT_IMAGE} alt="User Profile" style={{ width: '150px', height: 'auto' }} />
                          <p>Name: {user.name}</p>
                          <p>Email: {user.email}</p>
                          <p>Phone: {user.phone}</p>
                          <p>Description: {user.description}</p>
                          <p>Birthdate: {user.birthdate}</p>
                          <p>Competance: {user.competance}</p>
                          <p>Address: {user.address}</p>
                          <Button color="info" onClick={handleEditClick}>Edit</Button>
                          <Button color="danger" onClick={handleDeleteClick}>Delete</Button>
                        </div>
                      ) : (
                        <Form onSubmit={handleSubmit}>
                          <FormGroup>
                            <InputGroup className="input-group-alternative mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="ni ni-hat-3" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name || ''}
                                onChange={handleChange}
                              />
                            </InputGroup>
                            {errors.name && <span className="text-danger">{errors.name}</span>}
                          </FormGroup>
                          <FormGroup>
                            <InputGroup className="input-group-alternative mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="ni ni-email-83" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="email"
                                name="email"
                                placeholder="example@gmail.com"
                                value={formData.email || ''}
                                onChange={handleChange}
                              />
                            </InputGroup>
                            {errors.email && <span className="text-danger">{errors.email}</span>}
                          </FormGroup>
                          <FormGroup>
                            <InputGroup className="input-group-alternative mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="ni ni-mobile-button" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                              />
                            </InputGroup>
                            {errors.phone && <span className="text-danger">{errors.phone}</span>}
                          </FormGroup>
                          <FormGroup>
                            <InputGroup className="input-group-alternative mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="ni ni-briefcase-24" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                name="competance"
                                placeholder="Competance"
                                value={formData.competance || ''}
                                onChange={handleChange}
                              />
                            </InputGroup>
                            {errors.competance && <span className="text-danger">{errors.competance}</span>}
                          </FormGroup>
                          <FormGroup>
                            <InputGroup className="input-group-alternative mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="ni ni-calendar-grid-58" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="date"
                                name="birthdate"
                                placeholder="Birthdate"
                                value={formData.birthdate || ''}
                                onChange={handleChange}
                              />
                            </InputGroup>
                            {errors.birthdate && <span className="text-danger">{errors.birthdate}</span>}
                          </FormGroup>
                          <FormGroup>
                            <InputGroup className="input-group-alternative mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="ni ni-map-big" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                name="address"
                                placeholder="Address"
                                value={formData.address || ''}
                                onChange={handleChange}
                              />
                            </InputGroup>
                            {errors.address && <span className="text-danger">{errors.address}</span>}
                          </FormGroup>
                          <FormGroup>
                            <InputGroup className="input-group-alternative mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="ni ni-image" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="file"
                                name="image"
                                onChange={handleChange}
                              />
                            </InputGroup>
                            {imagePreview && <img src={imagePreview} alt="User Image Preview" style={{ width: '150px', height: 'auto' }} />}
                          </FormGroup>
                          <Button type="submit" color="primary">Save Changes</Button>
                        </Form>
                      )}
                    </Col>
                  </Row>
                </div>
              </div>
            </Card>
          </Container>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
};

export default UserProfile;