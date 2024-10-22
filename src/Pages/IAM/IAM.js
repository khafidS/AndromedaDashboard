import React from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { useState } from "react";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Link } from 'react-router-dom';

import { Container } from 'reactstrap';

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";


const IAM = () => {
    document.title = "Identity Access Management | VisionAnalytics.AI";
    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal(!modal);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="VisionAnalytics.AI" breadcrumbItem="Identity Access Management" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <CardTitle className="h4">List View User</CardTitle>
                                        <Button color="primary" onClick={toggle}>
                                            <i className="mdi mdi-plus-circle-outline mr-1"></i> Register
                                        </Button>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-striped mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Profile</th>
                                                    <th>Username</th>
                                                    <th>Email</th>
                                                    <th>Role</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>
                                                        <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="profile" className="rounded-circle mr-2" height="30" width="30" />
                                                    </td>
                                                    <td>admin</td>
                                                    <td>admin@gmail.com</td>
                                                    <td>Admin</td>
                                                    <td>
                                                        <Link to="#" className="text-success">
                                                            <i className="mdi mdi-pencil font-size-16"></i>
                                                        </Link>
                                                        <Link to="#" className="text-danger">
                                                            <i className="mdi mdi-trash-can font-size-16"></i>
                                                        </Link>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>2</td>
                                                    <td>
                                                        <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="profile" className="rounded-circle mr-2" height="30" width="30" />
                                                    </td>
                                                    <td>user1</td>
                                                    <td>user1@gmail.com</td>
                                                    <td>User</td>
                                                    <td>
                                                        <Link to="#" className="text-success">
                                                            <i className="mdi mdi-pencil font-size-16"></i>
                                                        </Link>
                                                        <Link to="#" className="text-danger">
                                                            <i className="mdi mdi-trash-can font-size-16"></i>
                                                        </Link>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>3</td>
                                                    <td>
                                                        <img src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="profile" className="rounded-circle mr-2" height="30" width="30" />
                                                    </td>
                                                    <td>user2</td>
                                                    <td>user2@gmail.com</td>
                                                    <td>User</td>
                                                    <td>
                                                        <Link to="#" className="text-success">
                                                            <i className="mdi mdi-pencil font-size-16"></i>
                                                        </Link>
                                                        <Link to="#" className="text-danger">
                                                            <i className="mdi mdi-trash-can font-size-16"></i>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle} className="bg-primary text-white">Register User</ModalHeader>
                        <ModalBody>
                            <Form>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                            <Label for="username">Username</Label>
                                            <Input type="text" id="username" placeholder="Username" />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <Label for="email">Email</Label>
                                            <Input type="email" id="email" placeholder="Email" />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                            <Label for="password">Password</Label>
                                            <Input type="password" id="password" placeholder="Password" />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <Label for="confirmpassword">Confirm Password</Label>
                                            <Input type="password" id="confirmpassword" placeholder="Confirm Password" />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup>
                                    <Label for="role">Role</Label>
                                    <Input type="select" id="role">
                                        <option value="">Select Role</option>
                                        <option value="1">Admin</option>
                                        <option value="2">User</option>
                                    </Input>
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={toggle}>Register</Button>{' '}
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default IAM;