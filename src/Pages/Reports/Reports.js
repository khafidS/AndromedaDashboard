import React, { useState } from 'react';
import { Container, Row, Col, FormGroup, Label, Input } from 'reactstrap';

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

// Import images
import int_conf_img from "../../assets/images/reports/international_conflict.png";
import news_stat_img from "../../assets/images/reports/news_statistics.png";

const Reports = () => {
    document.title = "Reports | VisionAnalytics.AI";

    // State to manage filter selections
    const [fildate, setFilDate] = useState('');
    const [filtype, setFilType] = useState('');

    // Handler functions for filter changes
    const handleFilDateChange = (e) => setFilDate(e.target.value);
    const handleFilTypeChange = (e) => setFilType(e.target.value);

    const today = new Date().toISOString().split('T')[0];

    // Determine the image to display based on the selected filter type
    const getImageSrc = () => {
        switch (filtype) {
            case 'optionA':
                return int_conf_img;
            case 'optionB':
                return news_stat_img;
            default:
                return ""; // Return empty string for no selection
        }
    };

    const imageSrc = getImageSrc(); // Get the image source based on the filter type

    // Check if both filters are set
    const isReportVisible = fildate && filtype;

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="VisionAnalytics.AI" breadcrumbItem="Reports" />
                    <Row>
                        <Col md="3">
                            <FormGroup>
                                <Label for="fildate">Filter by Date</Label>
                                <Input
                                    type="date"
                                    id="fildate"
                                    value={fildate}
                                    onChange={handleFilDateChange}
                                    max={today}
                                />
                            </FormGroup>
                        </Col>
                        <Col md="3">
                            <FormGroup>
                                <Label for="filtype">Filter by Type</Label>
                                <Input type="select" id="filtype" value={filtype} onChange={handleFilTypeChange}>
                                    <option value="">Select Option</option>
                                    <option value="optionA">International Conflict</option>
                                    <option value="optionB">News Statistics</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="report-container" style={{
                                textAlign: 'center',
                                marginTop: '5px',
                                marginBottom: '10px',
                                padding: '5px',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#f9f9f9'
                            }}>
                                {isReportVisible ? (
                                    <>
                                        <div style={{ marginTop: '5px', marginBottom: '5px', fontSize: '16px', fontWeight: 'bold' }}>
                                            {filtype === 'optionA' ? 'International Conflict Report' : 'News Statistics Report'}
                                        </div>
                                        <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                                            Date: {new Date(fildate).toLocaleDateString()}
                                        </div>
                                        {imageSrc ? (
                                            <img
                                                src={imageSrc}
                                                alt="Filtered content"
                                                style={{ maxWidth: '70%', height: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}
                                            />
                                        ) : null} {/* Only render the image if a valid source exists */}
                                    </>
                                ) : (
                                    <div style={{ marginTop: '10px', marginBottom: '10px', fontSize: '16px' }}>
                                        Please select both a report type and a date to view the report.
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Reports;
