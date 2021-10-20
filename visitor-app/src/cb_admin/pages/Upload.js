import React, { useState } from 'react';
import styled from 'styled-components';
import { CommunityBusiness, Files } from '../../api';
import NavHeader from '../../shared/components/NavHeader';

const Paragraph = styled('p')`
  text-align: left;
  margin: 1rem 0rem;
`;

const SelectButton = styled('button')`
  background-color: white;
  color: #707070;
  border: solid 1px black;
`

const DownloadButton = styled('button')`
  background-color: grey;
  color: white;
  border: solid 1px black;
`

const LineContainer = styled('div')`
    display: flex;
`

const Circle = styled('span')`
`

const Line = styled('span')`
`

const Niceline = () => 
<LineContainer>
    <Circle/>
    <Line/>
    <Circle/>
</LineContainer>

const UploadTab = () => {
    const [filename, setFilename] = useState("Please select the file that you wish to upload.")
    const [uploadedFile, setUploadedFile] = useState(new File([""], "filename"));
    const [errorText, setErrorText] = useState("");
    const [uploadState, setUploadState] = useState("unselected");

    const select = () => {
        if(document.getElementById('file-input'))
            document.getElementById('file-input').click();
    }

    const reset = () => {
        setUploadedFile((new File([""], "filename")));

        if(document.getElementById("file-input")){
        const input = document.getElementById("file-input");
        input.value = "";
        }

    setFilename("Please select the file that you wish to upload.");
    }

  const handleUpload = (e) => {
        setUploadedFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
        setUploadState("selected");
  }

  const confirmUpload = async () => {
      setUploadState("validating");

      const {data: {result: {id}}} = await CommunityBusiness.get();

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
        if(result.data.response.status === 404)
            setErrorText("Couldn't reach the server.");
        if(result.data.response.data.error.statusCode === 500)
            setErrorText("A server error occured. This is most likely due to one of the visits having the same time as a previous visit.");
      }
  }


let display = <>
<img
              src={require('../assets/icons/uploadbutton.png')}
              alt="upload the completed template"
              style={{height: '100px', width: '100px'}}
          />
<SelectButton onClick={select}>Select</SelectButton>
<input id="file-input" type="file" name="name" style={{display: 'none'}}
    onChange={e=>handleUpload(e)}
/>
</>;

if(uploadState === "selected")
display = 
<>
      <img
              src={require('../assets/icons/uploadbutton.png')}
              alt="upload the completed template"
              style={{height: '100px', width: '100px'}}
          />
        <SelectButton
          onClick={confirmUpload}
        >
          Upload
        </SelectButton>
  </>

if(uploadState === "validating")
display =
<>
  <img
      src={require('../assets/icons/uploadbutton.png')}
      alt="upload the completed template"
      style={{height: '100px', width: '100px'}}
  />
  <Paragraph>Processing and checking the csv for errors...</Paragraph>
</>

if(uploadState === "error")
display = 
<>
  <img
      src={require('../assets/icons/uploadbutton.png')}
      alt="upload the completed template"
      style={{height: '100px', width: '100px'}}
  />
  <Paragraph>{errorText}</Paragraph>
  <button onClick={()=>setUploadState("unselected")}>try again</button>
</>

if(uploadState === "success")
display = 
<>
<img
              src={require('../assets/icons/upload_complete.png')}
              alt="completed upload"
              style={{height: '100px', width: '100px'}}
          />
<Paragraph>Well done, your data has been uploaded</Paragraph>
<SelectButton onClick={()=>{setUploadState("unselected");reset()}}>upload more past data</SelectButton>
</>


    return (<div>
        <Paragraph>{filename}</Paragraph>
            {display}
        </div>
    )
}

const DownloadTab = () => {
    return (<div>
            <Paragraph>Download the template for uploading your past visits</Paragraph>
            <img alt="download template" src={require('../assets/icons/downloadbutton.png')}/>
            <DownloadButton>Download</DownloadButton>
        </div>
    )
}
    

const Upload = () => {
    const [selected, setSelected] = useState("upload");



    return (
        <div>
            <NavHeader
          leftTo="/admin"
          leftContent="Back to dashboard"
          centerContent="Upload Data"
        />
        <div>
            <p onClick={()=>setSelected("download")}>download</p>
            <p onClick={()=>setSelected("upload")}>upload</p>
        </div>
        {selected === "upload"?
            <UploadTab/>
        :
            <DownloadTab/>
        }
        <Niceline/>
        <img alt="twine logo" src={require('../assets/icons/logo_image.svg')}/>
        </div>
    )
}

export default Upload;