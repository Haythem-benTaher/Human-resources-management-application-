import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  FormGroup, 
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from 'reactstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import DemoNavbar from 'components/Navbars/DemoNavbar.js';
import SimpleFooter from 'components/Footers/SimpleFooter.js';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Formuser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',           // First name
    address: '',        // Address
    email: '',          // Email
    phone: '',          // Phone
    competance: '',     // Competence
    birthdate: '',      // Date of Birth
    description: '',    // Description
    password: '',       // Password
    image: null           // Image
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState('');
  const mainRef = useRef(null);

  useEffect(() => {
    if (userId) {
      const fetchedUser = {
        name: 'John',
        address: '123 Main St',
        email: 'john@example.com',
        phone: '123456789',
        description: 'User description',
        birthdate: '1990-01-01',
        competance: 'Expert',
        password: '',
        image: 'https://via.placeholder.com/150'
      };
      setFormData(fetchedUser);
      setImagePreview(fetchedUser.image);
    }
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file,
      });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
      if (name === 'password') {
        evaluatePasswordStrength(value);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    
    // Validation checks
    if (!formData.name.trim()) {
      validationErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Email is not valid';
    }
    if (!formData.phone.trim()) {
      validationErrors.phone = 'Phone is required';
    } else if (formData.phone.length < 8) {
      validationErrors.phone = 'Phone should be at least 8 characters';
    }
    if (!formData.description.trim()) {
      validationErrors.description = 'Description is required';
    }
    if (!formData.birthdate.trim()) {
      validationErrors.birthdate = 'Date of birth is required';
    }
    if (!formData.competance.trim()) {
      validationErrors.competance = 'Competence is required';
    }
    if (!formData.password.trim()) {
      validationErrors.password = 'Password is required';
    }
  
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      try {
        // Form data setup for sending including file handling
        const formPayload = new FormData();
        Object.keys(formData).forEach((key) => {
          formPayload.append(key, formData[key]);
        });
  
        // Make a POST request to the backend API
        const response = await axios.post('http://localhost:5000/user/register', formPayload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        alert('Form submitted successfully');
        const {user} = response.data;
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/');
      } catch (error) {
        console.error('There was an error submitting the form', error);
        alert('There was an error submitting the form');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const evaluatePasswordStrength = (password) => {
    let strength = '';
    if (password.length < 6) {
      strength = 'Weak password';
    } else if (password.length < 10) {
      strength = 'Moderate password';
    } else {
      strength = 'Strong password';
    }
    setPasswordStrength(strength);
  };

  return (
    <>
      <DemoNavbar />
      <main ref={mainRef}>
        <section className="section section-shaped section-lg">
          <div className="shape shape-style-1 bg-gradient-default">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <Container className="pt-lg-7">
            <Row className="justify-content-center">
              <Col lg="6">
                <Card className="bg-secondary shadow border-0">
                  <CardBody className="px-lg-5 py-lg-5">
                    <Form role="form" onSubmit={handleSubmit}>
                      <h3>{userId ? 'Edit User' : 'Sign Up'}</h3>
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
                            placeholder="First name"
                            autoComplete="off"
                            value={formData.name}
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
                            autoComplete="off"
                            value={formData.email}
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
                            autoComplete="off"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </InputGroup>
                        {errors.phone && <span className="text-danger">{errors.phone}</span>}
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-ruler-pencil" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            name="description"
                            placeholder="Description"
                            autoComplete="off"
                            value={formData.description}
                            onChange={handleChange}
                          />
                        </InputGroup>
                        {errors.description && <span className="text-danger">{errors.description}</span>}
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
                            placeholder="Date of Birth"
                            autoComplete="off"
                            value={formData.birthdate}
                            onChange={handleChange}
                          />
                        </InputGroup>
                        {errors.birthdate && <span className="text-danger">{errors.birthdate}</span>}
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
                            placeholder="Competence"
                            autoComplete="off"
                            value={formData.competance}
                            onChange={handleChange}
                          />
                        </InputGroup>
                        {errors.competance && <span className="text-danger">{errors.competance}</span>}
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type={passwordVisible ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            autoComplete="off"
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <InputGroupAddon addonType="append">
                            <InputGroupText onClick={togglePasswordVisibility}>
                              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {passwordStrength && <small className="text-muted">{passwordStrength}</small>}
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-image" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                          />
                        </InputGroup>
                        {imagePreview && <img src={imagePreview} alt="Preview" className="img-fluid mt-3" />}
                      </FormGroup>
                      <div className="text-center">
                        <Button className="mt-4" color="primary" type="submit">
                          {userId ? 'Update User' : 'Create Account'}
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
};

export default Formuser;