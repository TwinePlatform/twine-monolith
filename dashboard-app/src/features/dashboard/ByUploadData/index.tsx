import React, { useState, FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-flexbox-grid';

import { H1 } from '../../../lib/ui/components/Headings';
import { Paragraph } from '../../../lib/ui/components/Typography';


import { TitlesCopy } from '../copy/titles';

import {Files, CommunityBusinesses} from '../../../lib/api';

const Container = styled(Grid)`
`;

/**
 * Component
 */
const ByUploadData: FunctionComponent<RouteComponentProps> = () => {
  const [filename, setFilename] = useState("Upload File Here")
  const [uploadedFile, setUploadedFile] = useState(new File([""], "filename"));
  const [errorText, setErrorText] = useState("");
  const [uploadState, setUploadState] = useState("unselected");

  const select = () => {
        if(document.getElementById('file-input'))
            document.getElementById('file-input')!.click();
  }

  const reset = () => {
    setUploadedFile((new File([""], "filename")));

    if(document.getElementById("file-input")){
      const input: HTMLInputElement|null = document.getElementById("file-input") as HTMLInputElement;
      input!.value = "";
    }

    setFilename("Upload File Here")
      
  }

  const handleUpload = (e: any) => {
        setUploadedFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
        setUploadState("selected");
  }

  const confirmUpload = async () => {
      setUploadState("validating");

      const {data: {result: {id}}} = await CommunityBusinesses.get();

      const result = await Files.upload(uploadedFile, id);
        
      console.log(result);
      
      if(result.state === "success")
          setUploadState("success");
      if(result.state === "error"){
        setUploadState("error");
        reset();
        setErrorText(result.data.response.data.error.message);
        if(result.data.response.data.error.statusCode === 500)
          setErrorText("A server error occured. This is most likely due to one of the logs having the same time as a previous log.");
      }
  }

  // set and clear errors on response
  
  let uploadSection = null;
  
  if(uploadState === "selected")
  uploadSection = 
        <div>
            <img
              src={require('../../../assets/uploadbutton.png')}
              onClick={confirmUpload}
              alt={"Upload Data"}
              style={{cursor: 'pointer'}}
            />
      </div>

  if(uploadState === "validating")
  uploadSection =
    <div>
      <Paragraph>Processing and checking the csv for errors...</Paragraph>
    </div>

  if(uploadState === "error")
  uploadSection = 
    <div>
      <Paragraph>{errorText}</Paragraph>
      <button onClick={()=>setUploadState("unselected")}>try again</button>
    </div>

  if(uploadState === "success")
  uploadSection = 
  <div>
    <Paragraph>Well done, your data has been uploaded</Paragraph>
    <button onClick={()=>setUploadState("unselected")}>upload more past data</button>
  </div>

  return (
    <Container>
      <Row center="xs">
        <Col>
          <H1>{TitlesCopy.Upload.title}</H1>
          <Paragraph>
              Download the template for uploading your past logs.
          </Paragraph>
          <a href={"/downloads/upload_data_template.csv"} download>
            <img
              src={require('../../../assets/downloadbutton.png')}
              alt="download the template"
            />
          </a>
          <Paragraph>
            Fill in the tables for both Volunteers and Logs.
            Then upload them below.
          </Paragraph>
          <div>
            <Paragraph>{filename}</Paragraph>
            <button onClick={select}>Select</button>
            <input id="file-input" type="file" name="name" style={{display: 'none'}}
                onChange={e=>handleUpload(e)}
            />
          </div>
          {uploadSection}
        </Col>
      </Row> 
    </Container>
  );
};

export default withRouter(ByUploadData);
