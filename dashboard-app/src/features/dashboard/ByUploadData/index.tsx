import React, { useEffect, useState, FunctionComponent, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-flexbox-grid';

import { H1 } from '../../../lib/ui/components/Headings';
import { Paragraph } from '../../../lib/ui/components/Typography';


import { TitlesCopy } from '../copy/titles';
import { DashboardContext } from '../context';

import {Files} from '../../../lib/api';

const Container = styled(Grid)`
`;

/**
 * Component
 */
const ByUploadData: FunctionComponent<RouteComponentProps> = () => {
  const { unit } = useContext(DashboardContext);

  const [filename, setFilename] = useState("Upload File Here")
  const [uploadedFile, setUploadedFile] = useState(new File([""], "filename"));

  const select = () => {
        if(document.getElementById('file-input'))
            document.getElementById('file-input')!.click();
  }

  const handleUpload = (e: any) => {
        setUploadedFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
        
  }

  const confirmUpload = () => {
        if(filename != "Upload File Here"){
            console.log(uploadedFile);
            Files.upload(uploadedFile);
      }
  }

  // set and clear errors on response
  const [error, setError] = useState("");

  //something about the upload state

  return (
    <Container>
      <Row center="xs">
        <Col>
          <H1>{TitlesCopy.Upload.title}</H1>
          <Paragraph>
              Download the template for uploading your past logs.
          </Paragraph>
          <a href={"/downloads/upload_data_template"} download>
                <img
                    src={require('../../../assets/downloadbutton.png')}
                />
          </a>
          <Paragraph>
              Fill in the tables for both Volunteers and Logs.
              Then upload them below.
          </Paragraph>
        <div>
          <p>{filename}</p>
          <button onClick={select}>Select</button>
          <input id="file-input" type="file" name="name" style={{display: 'none'}}
                onChange={e=>handleUpload(e)}
          />
          </div>
          <img
              src={require('../../../assets/uploadbutton.png')}
              onClick={confirmUpload}
          />
        </Col>
      </Row>
      
    </Container>
  );
};

export default withRouter(ByUploadData);
