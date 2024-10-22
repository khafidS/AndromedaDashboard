import React from "react";
import UsePanel from "./UserPanel";
import OrderStatus from "./OrderStatus";
import Notifications from "./Notifications";
import SocialSource from "./SocialSource";
import OverView from "./OverView";
import RevenueByLocation from "./RevenueByLocation";
import LatestTransation from "./LatestTransation";
import axios from "axios";
import { useEffect, useState } from "react";

import { Row, Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const Dashboard = () => {
  document.title = "Dashboard | VisionAnalytics.AI";

  const [responseProject, setResponseProject] = useState([]);
  const [responseCollections, setResponseCollections] = useState([]);
  const [responseDocuments, setResponseDocuments] = useState([]);
  const [projectIds, setProjectIds] = useState([]);
  const [collectionIds, setCollectionIds] = useState([]);
  const [documentIds, setDocumentIds] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalCollections, setTotalCollections] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [documentDetails, setDocumentDetails] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.jp-tok.discovery.watson.cloud.ibm.com/instances/8bbebb41-0767-4f62-9c03-12624208fea5/v2/projects?version=2023-03-31",
          {
            auth: {
              username: "apikey",
              password: "0-SQ0M0BwfrdTZjW2JPzh2l7hkVMdBDq3vLaDtR99Pv9",
            },
          }
        );
        setResponseProject(response.projects);
        setTotalProjects(response.projects.length);
        if (response.projects.length > 0) {
          console.log(response.projects);
          const collectionsPromises = response.projects.map(
            async (project) => {
              const collections = await getCollections(project.project_id);
              return collections.map((collection) => ({
                ...collection,
                project_id: project.project_id,
              }));
            }
          );
          const collections = await Promise.all(collectionsPromises);
          setResponseCollections(collections.flat());
          setTotalCollections(collections.flat().length);
          if (collections.flat().length > 0) {
            console.log("collections",collections)
            const documentsPromises = collections.flat().map(
              (collection) => getDocuments(collection.project_id, collection.collection_id)
            );
            const documents = await Promise.all(documentsPromises);
            console.log("documents", documents)
            setResponseDocuments(documents.flat());
            setTotalDocuments(documents.flat().length);
            if (documents.flat().length > 0) {
              const documentsDetailsPromises = documents.map(
                async (document) => getDocumentDetails(document.project_id, document.collection_id, document.document_id)
              );
              const documentsDetails = await Promise.all(documentsDetailsPromises);
              console.log("documentsDetails", documentsDetails)
              // setDocumentDetails((prevDetails) => {
              //   const newDetails = { ...prevDetails };
              //   documentsDetails.forEach((details) => {
              //     newDetails[details.document_id] = details;
              //   });
              //   return newDetails;
              // });
            }
          }
        }
        
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
          "https://api.jp-tok.discovery.watson.cloud.ibm.com/instances/8bbebb41-0767-4f62-9c03-12624208fea5/v2/projects/"+ projectId +"/collections?version=2023-03-31",
          {
            auth: {
              username: "apikey",
              password: "0-SQ0M0BwfrdTZjW2JPzh2l7hkVMdBDq3vLaDtR99Pv9",
            },
          }
        );
        return response.collections;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDocuments = async (projectId, collectionId) => {
    try {
      if (projectId !== null || collectionId !== null) {
        const response = await axios.get(
          "https://api.jp-tok.discovery.watson.cloud.ibm.com/instances/8bbebb41-0767-4f62-9c03-12624208fea5/v2/projects/"+ projectId +"/collections/"+ collectionId +"/documents?status=available&version=2023-03-31",
          {
            auth: {
              username: "apikey",
              password: "0-SQ0M0BwfrdTZjW2JPzh2l7hkVMdBDq3vLaDtR99Pv9",
            },
          }
        );
        return response.documents;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDocumentDetails = async (projectId, collectionId, documentId) => {
  try {
    if (projectId && collectionId && documentId) {
      const detailsResponse = await axios.get(
        `https://api.jp-tok.discovery.watson.cloud.ibm.com/instances/8bbebb41-0767-4f62-9c03-12624208fea5/v2/projects/${projectId}/collections/${collectionId}/documents/${documentId}?version=2023-03-31`,
        {
          auth: {
            username: "apikey",
            password: "0-SQ0M0BwfrdTZjW2JPzh2l7hkVMdBDq3vLaDtR99Pv9",
          },
        }
      );
      const details = detailsResponse.data;
      setDocumentDetails((prevDetails) => ({
        ...prevDetails,
        [documentId]: details,
      }));
      console.log(details);
      return detailsResponse.data
    }
  } catch (error) {
    console.error('Error fetching document details:', error);
  }
};
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="VisionAnalytics.AI" breadcrumbItem="Executive Dashboard" />
          {/* User Panel Charts */}
          <UsePanel totalProjects={totalProjects} totalCollections={totalCollections} totalDocuments={totalDocuments}/>

          <Row>
            {/* Overview Chart */}
            <OverView />
            {/* Social Source Chart */}
            <SocialSource />
          </Row>

          <Row>
            {/* Order Stats */}
            {/* <OrderStatus /> */}
            {/* Notifications */}
            {/* <Notifications /> */}
            {/* Revenue by Location Vector Map */}
            {/* <RevenueByLocation /> */}
          </Row>

          {/* Latest Transaction Table */}
          {/* <LatestTransation /> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
