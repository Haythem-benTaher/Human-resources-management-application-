import React, { useRef, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Button,
  Card,
  FormGroup,
  Form,
  Input,
  InputGroup,
  Container,
  Row,
  Col,
  Alert
} from "reactstrap";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

// Define the validation schema
const validationSchema = Yup.object().shape({
  date: Yup.date()
    .required('Date is required')
    .min(new Date(new Date().setDate(new Date().getDate() + 1)), 'Date must be in the future'),
  location: Yup.string().required('Location is required'),
  title: Yup.string().required('Title is required'),
  status: Yup.string().default('Pending'),
  candidateEmail: Yup.string().required('Candidate email is required')
});

const storedUser = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
const userID = storedUser ? storedUser._id : ''; // Extract userID

const CreateEntretien = () => {
  const { handleSubmit, control, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      status: 'Pending'  // Default value for status
    }
  });

  const [alertVisible, setAlertVisible] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const mainRef = useRef(null);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }

    // Fetch emails when the component mounts
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user'); // Fetch emails from the endpoint
        const emailsData = response.data.response;
        setCandidates(emailsData);
        console.log(emailsData.response);

      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };

    fetchCandidates();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const isoDate = new Date(data.date).toISOString();

      const formData = {
        date: isoDate,
        location: data.location,
        title: data.title,
        status: data.status,
        userId: userID,
        candidateId: data.candidateEmail // Use the selected candidate email
      };

      console.log('Form data submitted:', formData);

      const response = await axios.post('http://localhost:5000/entretiens/create', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Success:', response.data);
      setAlertVisible(true);  // Show the success alert

      Swal.fire({
        title: 'Created!',
        text: 'Interview created successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/entretien'); // Redirect after successful creation
      });
    } catch (error) {
      if (error.response) {
        console.error('Server response error:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up the request:', error.message);
      }
      console.error('Full error:', error);
    }
  };

  return (
    <>
      <DemoNavbar />
      <main className="profile-page" ref={mainRef}>
        <section className="section-profile-cover section-shaped my-0">
          <div className="shape shape-style-1 shape-default alpha-4"></div>
        </section>
        <section className="section">
          <Container>
            <Card className="card-profile shadow custom-margin">
              <div className="px-4">
                <Row className="justify-content-center">
                  <Col className="order-lg-1" lg="4"></Col>
                </Row>
                <div className="text-center mt-5">
                  <h3>Create an Interview</h3>
                </div>
                <div className="mt-5 py-5 border-top text-center">
                  <Row className="justify-content-center">
                    <Col lg="9">
                      {alertVisible && (
                        <Alert color="success">
                          Interview created successfully!
                        </Alert>
                      )}
                      <Form role="form" onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">
                              Title
                            </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="title"
                                  control={control}
                                  render={({ field }) => (
                                    <Input {...field} placeholder="Enter the title" type="text" />
                                  )}
                                />
                              </InputGroup>
                              {errors.title && <p className="text-danger">{errors.title.message}</p>}
                            </div>
                          </div>
                        </FormGroup>
                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">
                              Date
                            </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="date"
                                  control={control}
                                  render={({ field }) => (
                                    <Input {...field} placeholder="Enter the date and time" type="datetime-local" />
                                  )}
                                />
                              </InputGroup>
                              {errors.date && <p className="text-danger">{errors.date.message}</p>}
                            </div>
                          </div>
                        </FormGroup>
                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">
                              Location
                            </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="location"
                                  control={control}
                                  render={({ field }) => (
                                    <Input {...field} placeholder="Enter the location" type="text" />
                                  )}
                                />
                              </InputGroup>
                              {errors.location && <p className="text-danger">{errors.location.message}</p>}
                            </div>
                          </div>
                        </FormGroup>
                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">
                              Candidate Email
                            </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="candidateEmail"
                                  control={control}
                                  render={({ field }) => (
                                    <Input {...field} type="select">
                                      <option value="">Select a candidate</option>
                                      {candidates.map(candidate => (
                                        <option key={candidate._id} value={candidate._id}>
                                          {candidate.email} {/* Display email address */}
                                        </option>
                                      ))}
                                    </Input>
                                  )}
                                />
                              </InputGroup>
                              {errors.candidateEmail && <p className="text-danger">{errors.candidateEmail.message}</p>}
                            </div>
                          </div>
                        </FormGroup>
                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">
                              Status
                            </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="status"
                                  control={control}
                                  render={({ field }) => (
                                    <Input {...field} placeholder="Status" type="text" />
                                  )}
                                />
                              </InputGroup>
                              {errors.status && <p className="text-danger">{errors.status.message}</p>}
                            </div>
                          </div>
                        </FormGroup>
                        <div className="text-center">
                          <Button className="mt-4" color="primary" type="submit">
                            Create Interview
                          </Button>
                        </div>
                      </Form>
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

export default CreateEntretien;