import React, { useState, FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-flexbox-grid';

import { H1 } from '../../../lib/ui/components/Headings';
import { Paragraph as P } from '../../../lib/ui/components/Typography';
import { TabGroup } from '../components/Tabs';

import { TitlesCopy } from '../copy/titles';

import {Files, CommunityBusinesses} from '../../../lib/api';
import {SecondaryButton} from '../../../lib/ui/components/Buttons';
import {Fonts} from '../../../lib/ui/design_system/fonts';

const Container = styled(Grid)`
`;

const Paragraph = styled(P)`
  text-align: left;
  font-size: ${Fonts.size.emphasis};
  margin: 1rem 0rem;
`;

const SelectButton = styled(SecondaryButton)`
  background-color: white;
  color: #707070;
  border: solid 1px black;
`

/**
 * Component
 */
const ByUploadData: FunctionComponent<RouteComponentProps> = () => {
  const [filename, setFilename] = useState("Please select the file that you wish to upload.")
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

    setFilename("Please select the file that you wish to upload.");
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
      
      if(result.state === "success"){
        setUploadState("success");
        setFilename("")
      }
      if(result.state === "error"){
        setUploadState("error");
        reset();
        setErrorText(result.data.response.data.error.message);
        if(result.data.response.data.error.statusCode === 500)
          setErrorText("A server error occured. This is most likely due to one of the logs having the same time as a previous log.");
      }
  }

  // set and clear errors on response
  
  let uploadSection = <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <img
                  src={require('../../../assets/uploadbutton.png')}
                  alt="upload the completed template"
                  style={{height: '100px', width: '100px'}}
              />
    <SelectButton onClick={select}>Select</SelectButton>
    <input id="file-input" type="file" name="name" style={{display: 'none'}}
        onChange={e=>handleUpload(e)}
    />
  </div>;
  
  if(uploadState === "selected")
  uploadSection = 
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img
                  src={require('../../../assets/uploadbutton.png')}
                  alt="upload the completed template"
                  style={{height: '100px', width: '100px'}}
              />
            <SelectButton
              onClick={confirmUpload}
            >
              Upload
            </SelectButton>
      </div>

  if(uploadState === "validating")
  uploadSection =
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <img
          src={require('../../../assets/uploadbutton.png')}
          alt="upload the completed template"
          style={{height: '100px', width: '100px'}}
      />
      <Paragraph>Processing and checking the csv for errors...</Paragraph>
    </div>

  if(uploadState === "error")
  uploadSection = 
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <img
          src={require('../../../assets/uploadbutton.png')}
          alt="upload the completed template"
          style={{height: '100px', width: '100px'}}
      />
      <Paragraph>{errorText}</Paragraph>
      <button onClick={()=>setUploadState("unselected")}>try again</button>
    </div>

  if(uploadState === "success")
  uploadSection = 
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <img
                  src={require('../../../assets/upload_complete.png')}
                  alt="completed upload"
                  style={{height: '100px', width: '100px'}}
              />
    <Paragraph>Well done, your data has been uploaded</Paragraph>
    <SelectButton onClick={()=>{setUploadState("unselected");reset()}}>upload more past data</SelectButton>
  </div>

  return (
    <Container>
      <Row center="xs">
        <Col>
          <H1>{TitlesCopy.Upload.title}</H1>
          <TabGroup
            titles={['Download','Upload']}
          >
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Paragraph>
                Download the template for uploading your past logs.
              </Paragraph>
              <img
                  src={require('../../../assets/downloadbutton.png')}
                  alt="download the template"
                  style={{height: '100px', width: '100px'}}
              />
              <a href={"/downloads/upload_data_template.csv"} download>
                <SecondaryButton>Download</SecondaryButton>
              </a>
              <div>
              <Paragraph>
                1. Please ensure that you are filling in the table for volunteers and logs
              </Paragraph>
              <Paragraph>
                2. Even if you are only filling in one section of the sheet, leave the other columns intact with empty rows
              </Paragraph>
              <Paragraph>
                3. Please keep the dividing $$$ as symbols
              </Paragraph>
              <Paragraph>
                4. When you're ready, select the upload tab above and select the correct file
              </Paragraph>
              </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Paragraph>{filename}</Paragraph>
            {uploadSection}
            </div>
          </TabGroup>
        </Col>
      </Row> 
    </Container>
  );
};

export default withRouter(ByUploadData);
