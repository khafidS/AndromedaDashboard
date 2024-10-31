import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Toast,
  ToastBody,
  ToastHeader
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import BootstrapTheme from "@fullcalendar/bootstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import {
  addNewEvent as onAddNewEvent,
  deleteEvent as onDeleteEvent,
  getCategories as onGetCategories,
  getEvents as onGetEvents,
  updateEvent as onUpdateEvent,
  resetCalendar
} from "../../store/actions";

import DeleteModal from "./DeleteModal";

//css
// import "@fullcalendar/bootstrap/main.css";

//redux
import { useSelector, useDispatch } from "react-redux";

const Calender = (props) => {
  const dispatch = useDispatch();

  const [event, setEvent] = useState({});

  // events validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      title: (event && event.title) || "",
      category: (event && event.category) || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Your Event Name"),
      category: Yup.string().required("Please Select Your Category"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateEvent = {
          id: event.id,
          title: values.title,
          classNames: values.category + " text-white",
          start: event.start,
        };
        // update event
        dispatch(onUpdateEvent(updateEvent));
        validation.resetForm();
      } else {
        const newEvent = {
          id: Math.floor(Math.random() * 100),
          title: values["title"],
          start: selectedDay ? selectedDay.date : new Date(),
          className: values.category + " text-white",
        };
        // save new event
        dispatch(onAddNewEvent(newEvent));
        validation.resetForm();
      }
      setSelectedDay(null);
      toggle();
    },
  });

  // category validation
  const categoryValidation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      title: (event && event.title) || "",
      category: (event && event.category) || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Your Order Id"),
      category: Yup.string().required("Please Enter Your Billing Name"),
    }),
    onSubmit: (values) => {


      const newEvent = {
        id: Math.floor(Math.random() * 100),
        title: values["title"],
        start: selectedDay ? selectedDay.date : new Date(),
        className: values.category + " text-white"

      };
      // save new event

      dispatch(onAddNewEvent(newEvent));
      categoryValidation.resetForm();
      toggleCategory();
    },
  });

  const { events, categories, isEventUpdated } = useSelector((state) => ({
    events: state.calendar.events,
    categories: state.calendar.categories,
    isEventUpdated: state.calendar.isEventUpdated
  }));

  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [modalcategory, setModalcategory] = useState(false);
  const [modalccollection, setModalccolection] = useState(false);
  const [responseProject, setResponseProject] = useState([]);
  const [responseCollection, setResponseCollection] = useState([]);
  const [responseDocument, setResponseDocument] = useState([]);
  const [documentDetails, setDocumentDetails] = useState([]);
  const [projectIds, setProjectIds] = useState(null);

  const [selectedDay, setSelectedDay] = useState(0);
  const [isEdit, setIsEdit] = useState(false);

  const [projects, setProjects] = useState([]);
  const [collections, setCollections] = useState([]);
  const [cproject, setCProject] = useState(null);
  const [ccollection, setCCollection] = useState(null);
  const [files, setFiles] = useState([]);
  // const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);

  useEffect(() => {
    dispatch(onGetCategories());
    dispatch(onGetEvents());
    // new Draggable(document.getElementById("external-events"), {
    //   itemSelector: ".external-event",
    // });
  }, [dispatch]);

  useEffect(() => {
    if (isEventUpdated) {
      setIsEdit(false);
      setEvent({});
      setTimeout(() => {
        dispatch(resetCalendar("isEventUpdated", false));
      }, 500);
    }
  }, [dispatch, isEventUpdated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.us-south.discovery.watson.cloud.ibm.com/instances/d2597f84-6531-46f4-b891-9df3a3b6833b/v2/projects?version=2023-03-31",
          {
            auth: {
              username: "apikey",
              password: "vVWuqHBVfbLxuHCwpY-oV-Ho3jzciOA4U0J7aMoJTc7t",
            },
          }
        );
        setResponseProject(response.projects);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const getCollections = async (projectId) => {
    try {
      if(projectId !== null) {
        setProjectIds(projectId);
        const response = await axios.get(
          "https://api.us-south.discovery.watson.cloud.ibm.com/instances/d2597f84-6531-46f4-b891-9df3a3b6833b/v2/projects/"+ projectId +"/collections?version=2023-03-31",
          {
            auth: {
              username: "apikey",
              password: "vVWuqHBVfbLxuHCwpY-oV-Ho3jzciOA4U0J7aMoJTc7t",
            },
          }
        );
        setResponseCollection(response.collections);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDocuments = async (projectId, collectionId) => {
    try {
      if (projectId !== null || collectionId !== null) {
        const response = await axios.get(
          "https://api.us-south.discovery.watson.cloud.ibm.com/instances/d2597f84-6531-46f4-b891-9df3a3b6833b/v2/projects/"+ projectId +"/collections/"+ collectionId +"/documents?status=available&version=2023-03-31",
          {
            auth: {
              username: "apikey",
              password: "vVWuqHBVfbLxuHCwpY-oV-Ho3jzciOA4U0J7aMoJTc7t",
            },
          }
        );
        const detailsPromises = response.documents.map(async (document) => {
          try {
            const detailsResponse = await axios.get(
              `https://api.us-south.discovery.watson.cloud.ibm.com/instances/d2597f84-6531-46f4-b891-9df3a3b6833b/v2/projects/${projectId}/collections/${collectionId}/documents/${document.document_id}?version=2023-03-31`,
              {
                auth: {
                  username: "apikey",
                  password: "vVWuqHBVfbLxuHCwpY-oV-Ho3jzciOA4U0J7aMoJTc7t",
                },
              }
            );
            const details = await detailsResponse;
            return { [document.document_id]: details }; // Return details object with document ID as key
          } catch (error) {
            console.error('Error fetching document details:', error);
            return {};
          }
        });
        const details = await Promise.all(detailsPromises); // Wait for all details to be fetched
        setResponseDocument(response.documents);
        setDocumentDetails(Object.assign({},...details));
        console.log(documentDetails);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Handle click

  

  /**
   * Handling the modal state
   */
  const toggle = () => {
    if (modal) {
      setModal(false);
      setEvent(null);
      setIsEdit(false);
    } else {
      setModal(true);
    }
  };

  const toggleCategory = async () => {
    setModalcategory(!modalcategory);
    setCollections([]);
    try {
      const response = await axios.get(
        "https://api.us-south.discovery.watson.cloud.ibm.com/instances/d2597f84-6531-46f4-b891-9df3a3b6833b/v2/projects?version=2023-03-31",
        {
          auth: {
            username: "apikey",
            password: "vVWuqHBVfbLxuHCwpY-oV-Ho3jzciOA4U0J7aMoJTc7t",
          },
        }
      );
      setProjects(response.projects);
      console.log(response.projects);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleCollections = async (projectId) => {
      try {
        if(projectId !== null) {
          setProjectIds(projectId);
          const response = await axios.get(
            "https://api.us-south.discovery.watson.cloud.ibm.com/instances/d2597f84-6531-46f4-b891-9df3a3b6833b/v2/projects/"+ projectId +"/collections?version=2023-03-31",
            {
              auth: {
                username: "apikey",
                password: "vVWuqHBVfbLxuHCwpY-oV-Ho3jzciOA4U0J7aMoJTc7t",
              },
            }
          );
          setCollections(response.collections);
          console.log(response.collections);
        }
      } catch (error) {
        console.error(error);
      }
  };

  const toggleCreateCollection = async () => {
    setModalccolection(!modalccollection);
    setCCollection(null);
    try {
      const response = await axios.get(
        "https://api.us-south.discovery.watson.cloud.ibm.com/instances/d2597f84-6531-46f4-b891-9df3a3b6833b/v2/projects?version=2023-03-31",
        {
          auth: {
            username: "apikey",
            password: "vVWuqHBVfbLxuHCwpY-oV-Ho3jzciOA4U0J7aMoJTc7t",
          },
        }
      );
      setProjects(response.projects);
      console.log(response.projects);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadFile = async (event) => {
    console.log("upload file",files);
    if(!files){
      return;
    }
    const selectedFile = files;
    const formData = new FormData();
    formData.append("file", selectedFile);
    const projectValue = document.querySelector('select[name="project"]').value;
    const collectionValue = document.querySelector('select[name="collection"]').value;
    console.log(projectValue, collectionValue);
    try {
      const response = await axios.post(
        "https://api.us-south.discovery.watson.cloud.ibm.com/instances/d2597f84-6531-46f4-b891-9df3a3b6833b/v2/projects/"+ projectValue +"/collections/"+ collectionValue +"/documents?version=2023-03-31",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Basic ${btoa('apikey:vVWuqHBVfbLxuHCwpY-oV-Ho3jzciOA4U0J7aMoJTc7t')}`,
          },
        }
      );
      if (response.status === 'pending') {
        toggleCategory();
        setToastMessage('Uploading file...');
        setTimeout(() => {
          setToastMessage('');
        }, 2000);
      }
      console.log("upload file",response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCollection = async (event) => {
    console.log("create collection",ccollection);
    if(!ccollection){
      return;
    }
    const collectionName = ccollection;
    const formData = new FormData();
    formData.append("name", collectionName);
    const projectValue = document.querySelector('select[name="project"]').value;
    console.log(projectValue);
    try {
      const response = await axios.post(
        "https://api.us-south.discovery.watson.cloud.ibm.com/instances/d2597f84-6531-46f4-b891-9df3a3b6833b/v2/projects/"+ projectValue +"/collections?version=2023-03-31",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa('apikey:vVWuqHBVfbLxuHCwpY-oV-Ho3jzciOA4U0J7aMoJTc7t')}`,
          },
        }
      );
      console.log("response status",response.status)
      if (response.status = 201) {
        toggleCreateCollection();
        setToastMessage(`Collection ${collectionName} is created`);
        setTimeout(() => {
          setToastMessage('');
        }, 2000);
      }
      console.log("upload file",response);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Handling date click on calendar
   */
  const handleDateClick = (arg) => {
    const date = arg["date"];
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const currectDate = new Date();
    const currentHour = currectDate.getHours();
    const currentMin = currectDate.getMinutes();
    const currentSec = currectDate.getSeconds();
    const modifiedDate = new Date(
      year,
      month,
      day,
      currentHour,
      currentMin,
      currentSec
    );
    const modifiedData = { ...arg, date: modifiedDate };

    setSelectedDay(modifiedData);
    toggle();
  };

  // Handle project and collection button click
  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId);
    getCollections(projectId);
    setDocumentDetails([]);
    setResponseDocument([]);
  };

  const handleCollectionClick = (collectionId) => {
    setSelectedCollectionId(collectionId);
      if(projectIds !== null) {
        getDocuments(projectIds,collectionId);
      }
    }

  /**
   * Handling click on event on calendar
   */
  const handleEventClick = (arg) => {
    const event = arg.event;
    setEvent({
      id: event.id,
      title: event.title,
      title_category: event.title_category,
      start: event.start,
      className: event.classNames,
      category: event.classNames[0],
    });
    setIsEdit(true);
    toggle();
  };

  /**
   * On delete event
   */
  const handleDeleteEvent = () => {
    dispatch(onDeleteEvent(event));
    setDeleteModal(false);
    toggle();
  };

  /**
   * On category darg event
   */
  const onDrag = (event) => {
    event.preventDefault();
  };

  /**
   * On calendar drop event
   */
  const onDrop = (event) => {
    const date = event["date"];
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const currectDate = new Date();
    const currentHour = currectDate.getHours();
    const currentMin = currectDate.getMinutes();
    const currentSec = currectDate.getSeconds();
    const modifiedDate = new Date(
      year,
      month,
      day,
      currentHour,
      currentMin,
      currentSec
    );

    const draggedEl = event.draggedEl;
    const draggedElclass = draggedEl.className;
    // if (draggedEl.classList.contains('external-event') && draggedElclass.indexOf("fc-event-draggable") === -1) {
    //   const modifiedData = {
    //     id: Math.floor(Math.random() * 100),
    //     title: draggedEl.innerText,
    //     start: modifiedDate,
    //     className: draggedEl.className,
    //   };
    //   dispatch(onAddNewEvent(modifiedData));
    // }
  };

  document.title = "Project Management | VisionAnalytics.AI";
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteEvent}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="VisionAnalytics.AI" breadcrumbItem="Project Management" />
          <Row className="mb-4">
            <Col xl={12}>
              <Card className="mb-0">
                <CardBody>
                  {toastMessage && (
                    <div className="alert alert-warning" role="alert">
                      {toastMessage}
                    </div>
                  )}
                  <Row className="mt-3">
                    <Col sm={12} md={8}>
                      <div className="search-box ms-2">
                        <div className="position-relative">
                          <Input
                            type="text"
                            className="form-control border-0"
                            placeholder="Search Projects..."
                          />
                          <span className="search-box-icon">
                            <i className="bx bx-search-alt search-icon" />
                          </span>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={4} className="text-end">
                      <Row>
                        <Col>
                          <Button
                            color="primary"
                            className="btn font-16 btn-primary waves-effect waves-light w-100"
                            onClick={toggleCreateCollection}
                          >
                            <i className="mdi mdi-plus me-1" /> Create Collection
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            color="info"
                            className="btn font-16 btn-success waves-effect waves-light w-100"
                            onClick={toggleCategory}
                          >
                            <i className="mdi mdi-upload me-1" /> Upload
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col sm={12}>
                      <h4 className="page-title">Projects</h4>
                    </Col>
                  </Row>
                  {responseProject === null ? (
                    <Row className="text-center mt-4">
                      <Col sm={12}>
                        <h4 className="page-title">No Projects Found</h4>
                      </Col>
                    </Row>
                  ) : (
                    <Row> 
                      {responseProject.map((project, index) => (
                        <Col key={index} className="col-xxl-3 col-md-6 col-12 mb-2 mr-2">
                          <Button
                            outline={true}
                            color="light"
                            className={`w-100 d-flex align-items-center text-start`}
                            onClick={() => handleProjectClick(project.project_id)}
                          >
                            <i className="mdi mdi-folder font-size-24 me-2" />
                            <span style={{ fontWeight: selectedProjectId === project.project_id ? 'bold' : 'normal' }}>
                            {project.name}
                            </span>
                          </Button>
                        </Col>                      
                      ))}
                    </Row>
                  )}

                  <Row className="mt-4">
                    <Col sm={12}>
                      <h4 className="page-title">Collections</h4>
                    </Col>
                  </Row>

                  {responseCollection && responseCollection.length === 0 ? (
                    <Row className="text-center mt-4">
                      <Col sm={12}>
                        <p className="page-title">No Collections Found</p>
                      </Col>
                    </Row>
                  ) : (
                    <Row> 
                      {responseCollection.map((collection, index) => (
                        <Col key={index} className="col-xxl-3 col-md-6 col-12 mb-2 mr-2">
                          <Button
                            outline={true}
                            color="light"
                            className="w-100 d-flex align-items-center text-start"
                            onClick={() => handleCollectionClick(collection.collection_id)}
                          >
                            <i className="mdi mdi-folder font-size-24 me-2" />
                            <span style={{ fontWeight: selectedCollectionId === collection.collection_id ? 'bold' : 'normal' }}>
                            {collection.name}
                            </span>
                          </Button>
                        </Col>                      
                      ))}
                    </Row>
                  )}

                  <Row className="mt-4">
                    <Col sm={12}>
                      <h4 className="page-title">Documents</h4>
                    </Col>
                  </Row>
                  {responseDocument && responseDocument.length === 0 ? (
                    <Row className="text-center mt-4">
                      <Col sm={12}>
                        <p className="page-title">No Documents Found</p>
                      </Col>
                    </Row>
                  ) : (
                    <Row> 
                      {responseDocument.map((document, index) => (
                        <Col key={index} className="col-xxl-12 col-md-6 col-12 mb-2 mr-2">
                          <Button
                            outline={true}
                            color="light"
                            className="w-100 d-flex align-items-center text-start"
                          >
                            <i className="mdi mdi-file font-size-24 me-2" />
                            {documentDetails[document.document_id] ? (
                              <span>{documentDetails[document.document_id].filename.length > 100
                                ? `${documentDetails[document.document_id].filename.slice(0, 100)}...`
                                : documentDetails[document.document_id].filename}</span>
                            ) : (
                              <span></span>
                            )}
                            
                          </Button>
                        </Col>                      
                      ))}
                    </Row>
                  )}

                  <Modal isOpen={modal} className={props.className}>
                    <ModalHeader toggle={toggle} tag="h4">
                      {!!isEdit ? "Edit Event" : "Add Event"}
                    </ModalHeader>
                    <ModalBody>
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <Row>
                          <Col className="col-12 mb-3">
                            <Label className="form-label">
                              Event Name
                            </Label>
                            <Input
                              name="title"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.title || ""}
                              invalid={
                                validation.touched.title &&
                                  validation.errors.title
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.title &&
                              validation.errors.title ? (
                              <FormFeedback type="invalid">
                                {validation.errors.title}
                              </FormFeedback>
                            ) : null}
                          </Col>
                          <Col className="col-12 mb-3">
                            <Label className="form-label">
                              Select Category
                            </Label>
                            <Input
                              type="select"
                              name="category"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.category || ""}
                              invalid={
                                validation.touched.category &&
                                  validation.errors.category
                                  ? true
                                  : false
                              }
                            >
                              <option defaultValue> --Select-- </option>
                              <option value="bg-danger">Danger</option>
                              <option value="bg-success">Success</option>
                              <option value="bg-primary">Primary</option>
                              <option value="bg-info">Info</option>
                              <option value="bg-dark">Dark</option>
                              <option value="bg-warning">Warning</option>
                            </Input>
                            {validation.touched.category &&
                              validation.errors.category ? (
                              <FormFeedback type="invalid">
                                {validation.errors.category}
                              </FormFeedback>
                            ) : null}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <div className="text-end">
                              <button
                                type="button"
                                className="btn btn-light me-2"
                                onClick={toggle}
                              >
                                Close
                              </button>
                              {!!isEdit && (
                                <button
                                  type="button"
                                  className="btn btn-danger me-2"
                                  onClick={() => setDeleteModal(true)}
                                >
                                  Delete
                                </button>
                              )}
                              <button
                                type="submit"
                                className="btn btn-success save-event"
                              >
                                Save
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </ModalBody>
                  </Modal>

                  <Modal
                    isOpen={modalcategory}
                    toggle={toggleCategory}
                    className={props.className}
                  >
                  <ModalHeader toggle={toggleCategory} tag="h4">
                    Upload File to Collection
                  </ModalHeader>
                  <ModalBody>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUploadFile(e);
                        return false;
                      }}
                    >
                      <Row form>
                        <Col className="col-12 mb-3">
                          <Label className="form-label">
                            Project
                          </Label>
                          <Input
                            type="select"
                            className="form-control"
                            name="project"
                            onChange={(e) => toggleCollections(e.target.value)}
                          >
                            <option value="">Select Project</option>
                            {projects.map((project) => (
                              <option value={project.project_id}>{project.name}</option>
                            ))}
                          </Input>
                        </Col>
                        <Col className="col-12 mb-3">
                          <Label className="form-label">
                            Collection
                          </Label>
                          <Input
                            type="select"
                            className="form-control"
                            name="collection"
                          >
                            <option value="">Select Collection</option>
                            {collections.map((collection) => (
                              <option value={collection.collection_id}>{collection.name}</option>
                            ))}
                          </Input>
                        </Col>
                        <Col className="col-12 mb-3">
                          <Label className="form-label">
                            Select File
                          </Label>
                          <Input
                            type="file"
                            className="form-control"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setFiles(file);
                            }}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div className="text-end">
                            <button
                              type="button"
                              className="btn btn-light me-2"
                              onClick={toggleCategory}
                            >
                              Close
                            </button>
                            <button
                              type="submit"
                              className="btn btn-success save-event"
                            >
                              Upload
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </ModalBody>
                </Modal>

                <Modal
                    isOpen={modalccollection}
                    toggle={toggleCreateCollection}
                    className={props.className}
                  >
                  <ModalHeader toggle={toggleCreateCollection} tag="h4">
                    Create Collection
                  </ModalHeader>
                  <ModalBody>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateCollection(e);
                        return false;
                      }}
                    >
                      <Row form>
                        <Col className="col-12 mb-3">
                          <Label className="form-label">
                            Project
                          </Label>
                          <Input
                            type="select"
                            className="form-control"
                            name="project"
                            onChange={(e) => toggleCollections(e.target.value)}
                          >
                            <option value="">Select Project</option>
                            {projects.map((project) => (
                              <option value={project.project_id}>{project.name}</option>
                            ))}
                          </Input>
                        </Col>
                        <Col className="col-12 mb-3">
                          <Label className="form-label">
                            Collection
                          </Label>
                          <Input
                            type="text"
                            className="form-control border-1"
                            placeholder="Collection Name"
                            onChange={(e) => setCCollection(e.target.value)}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div className="text-end">
                            <button
                              type="button"
                              className="btn btn-light me-2"
                              onClick={toggleCreateCollection}
                            >
                              Close
                            </button>
                            <button
                              type="submit"
                              className="btn btn-success save-event"
                            >
                              Create
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </ModalBody>
                </Modal>

                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

// Calender.propTypes = {
//   events: PropTypes.array,
//   categories: PropTypes.array,
//   className: PropTypes.string,
//   onGetEvents: PropTypes.func,
//   onAddNewEvent: PropTypes.func,
//   onUpdateEvent: PropTypes.func,
//   onDeleteEvent: PropTypes.func,
//   onGetCategories: PropTypes.func,
// };

export default Calender;
