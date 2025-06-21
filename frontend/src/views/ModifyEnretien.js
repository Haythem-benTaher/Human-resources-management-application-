import React, { useEffect, useState } from "react";
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
} from "reactstrap";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

// Validation schema
const validationSchema = Yup.object().shape({
  date: Yup.date()
    .required('Date is required')
    .min(new Date(), 'Date and time must be in the future'),
  location: Yup.string().required('Location is required'),
  title: Yup.string().required('Title is required'),
  status: Yup.string().default('In Progress'),
});

const ModifyEntretien = () => {
  const { id } = useParams(); // Get ID from the route
  const navigate = useNavigate(); // For navigation
  const { handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
  });
  
  const [interviewData, setInterviewData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // Replace this with your actual method to get the current user ID

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;

    // Fetch existing data
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/entretiens/get/${id}`);
        const data = response.data;
        setInterviewData(data);

        // Convert the date to the correct format for the input
        const formattedDate = new Date(data.date).toISOString().slice(0, 16);

        reset({
          ...data,
          date: formattedDate, // Set the formatted date
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to fetch interview data.', 'error');
      }
    };

    fetchData();

    // Fetch current user info
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users/current'); // Replace with your API endpoint to get current user
        setCurrentUserId(response.data.id);
      } catch (error) {
        console.error('Error fetching current user:', error);
        // Remove the Swal.fire call to not show an error alert
      }
    };

    fetchCurrentUser();
  }, [id, reset]);

  const onSubmit = async data => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to modify this interview?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, modify it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(`http://localhost:5000/entretiens/update/${id}`, data);
          console.log('Update success:', response.data);
          Swal.fire(
            'Modified!',
            'Interview has been modified successfully.',
            'success'
          ).then(() => {
            navigate('/entretien'); // Redirect after modification
          });
        } catch (error) {
          console.error('Error updating interview:', error);
          Swal.fire('Error', 'Failed to update interview.', 'error');
        }
      }
    });
  };

  const handleDelete = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this interview?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:5000/entretiens/delete/${id}`);
          console.log('Delete success:', response.data);
          Swal.fire(
            'Deleted!',
            'Interview has been deleted successfully.',
            'success'
          ).then(() => {
            navigate('/entretien'); // Redirect after deletion
          });
        } catch (error) {
          console.error('Delete error:', error);
          Swal.fire('Error', 'Failed to delete interview.', 'error');
        }
      }
    });
  };

  const handleCancel = () => {
    navigate('/entretien'); // Redirect to the list page
  };

  return (
    <>
      <DemoNavbar />
      <main className="profile-page">
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
                  <h3>Modify Interview</h3>
                </div>
                <div className="mt-5 py-5 border-top text-center">
                  <Row className="justify-content-center">
                    <Col lg="9">
                      <Form role="form" onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">
                              Date and Time
                            </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="date"
                                  control={control}
                                  render={({ field }) => (
                                    <Input {...field} placeholder="" type="datetime-local" />
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
                                    <Input {...field} placeholder="" type="text" />
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
                              Title
                            </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="title"
                                  control={control}
                                  render={({ field }) => (
                                    <Input {...field} placeholder="" type="text" />
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
                              Status
                            </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="status"
                                  control={control}
                                  render={({ field }) => (
                                    <Input {...field} placeholder="" type="text" defaultValue="In Progress" />
                                  )}
                                />
                              </InputGroup>
                              {errors.status && <p className="text-danger">{errors.status.message}</p>}
                            </div>
                          </div>
                        </FormGroup>
                        <div className="text-center">
                          <Button className="mt-4" color="primary" type="submit">
                            Save changes
                          </Button>
                          <Button className="mt-4 ml-3" color="danger" onClick={handleDelete}>
                            Delete
                          </Button>
                          <Button className="mt-4 ml-3" color="secondary" onClick={handleCancel}>
                            Cancel
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

export default ModifyEntretien;