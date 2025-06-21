import React from "react";
import {
  Button,
  Card,
  CardHeader,
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
} from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import axios from "axios"; // Import Axios for API requests
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorModal from "../popup"; // Import the ErrorModal component

// Define the validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required')
});

const Login = () => {
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, []);

  const onSubmit = async (data) => {
    try {
      // Handle API request
      const response = await axios.post('http://localhost:5000/user/login', data);

      // Handle successful login
      console.log('Login successful', response.data);

      // Store authentication token if provided
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        // Redirect to the desired page, e.g., dashboard
        // navigate('/dashboard');
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Redirect to the desired page, e.g., dashboard
       
      }
      navigate('/');
    } catch (error) {
      // Log error details for debugging
      console.error('Login failed', error.response?.data || error.message);

      // Handle different types of errors
      let message;
      if (error.response) {
        // Server responded with an error
        switch (error.response.status) {
          case 401:
            message = 'Invalid email or password. Please try again.';
            break;
          case 404:
            message = 'User not found. Please check your credentials.';
            break;
          case 400:
            message = 'Bad request. Please check the provided data.';
            break;
          case 500:
            message = 'Internal server error. Please try again later.';
            break;
          default:
            message = error.response.data?.message || 'An error occurred. Please try again.';
            break;
        }
      } else if (error.request) {
        // Request was made but no response received
        message = 'No response from server. Please check your connection.';
      } else {
        // Something else happened
        message = 'An unexpected error occurred. Please try again.';
      }

      // Display error message in modal
      setErrorMessage(message);
      setErrorModalOpen(true);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(prevState => !prevState);
  };

  const handleSignUpRedirect = () => {
    navigate('/formuser-page');
  };

  const toggleErrorModal = () => {
    setErrorModalOpen(!errorModalOpen);
  };

  return (
    <>
      <DemoNavbar />
      <main>
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
              <Col lg="5">
                <Card className="bg-secondary shadow border-0">
                  <CardHeader className="bg-white pb-5">
                    <div className="text-muted text-center mb-3">
                      <small>Sign in</small>
                    </div>
                  </CardHeader>
                  <CardBody className="px-lg-5 py-lg-5">
                    <Form role="form" onSubmit={handleSubmit(onSubmit)}>
                      <FormGroup className="mb-3">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-email-83" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                              <Input
                                placeholder="Email"
                                type="email"
                                {...field}
                              />
                            )}
                          />
                        </InputGroup>
                        {errors.email && (
                          <div className="text-danger">{errors.email.message}</div>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                              <Input
                                placeholder="Password"
                                type={passwordVisible ? "text" : "password"}
                                {...field}
                                autoComplete="off"
                              />
                            )}
                          />
                          <InputGroupAddon addonType="append">
                            <InputGroupText onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {errors.password && (
                          <div className="text-danger">{errors.password.message}</div>
                        )}
                      </FormGroup>
                      <div className="text-center">
                        <Button
                          className="my-4"
                          color="primary"
                          type="submit"
                        >
                          Sign in
                        </Button>
                        <Button
                          className="my-4 ml-2"
                          color="secondary"
                          type="button"
                          onClick={handleSignUpRedirect}
                        >
                          Sign up
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
      <ErrorModal isOpen={errorModalOpen} toggle={toggleErrorModal} message={errorMessage} />
    </>
  );
};

export default Login;
