import React from 'react';

import { Container } from 'reactstrap';

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";


const NewsAnalytics = () => {
    document.title = "News Analytics | VisionAnalytics.AI";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="VisionAnalytics.AI" breadcrumbItem="News Analytics" />
                    <div style={{width: '100%', height: '100vh'}}>
                        <iframe src="
                        http://useast.services.cloud.techzone.ibm.com:47741/bi/?perspective=dashboard&amp;pathRef=.my_folders%2FMultipolar%2FModified%2BEnglish%2FCombined%2BUse%2Bcase%2B2%2B%2526%2B3%2FNews%2BAnalytics%2BDashboard%2BEnglish&amp;closeWindowOnLastView=true&amp;ui_appbar=false&amp;ui_navbar=false&amp;shareMode=embedded&amp;action=view&amp;mode=dashboard&amp;subView=model000001926669fd34_00000000" 
                        width="100%" height="100%" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen=""></iframe>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default NewsAnalytics;