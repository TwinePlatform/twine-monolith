import React, { useState } from 'react';
import styled from 'styled-components';
import { CommunityBusiness, Files } from '../../api';
import NavHeader from '../../shared/components/NavHeader';

const Paragraph = styled('p')`
  margin: 1rem 0rem;
`;

const TabOption = styled.p`
    display: inline;
    margin: 0rem 2rem;
    text-decoration: ${props => (props.active ? 
        'underline 5px #ffbf00' 
    : 
        'none')};
`

const UploadContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6rem;
`

const SelectButton = styled.button`
    background: #F8F8F8 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000029;
    border: 1px solid #707070;
    border-radius: 5px;
    &:hover{
        opacity: 0.75;
        cursor: pointer;
    }
`

const DownloadButton = styled('button')`
    background: #707070 0% 0% no-repeat padding-box;
    color: white;
    box-shadow: 0px 3px 6px #00000029;
    border: 1px solid #707070;
    border-radius: 5px;
    &:hover{
        opacity: 0.75;
        cursor: pointer;
    }
`

const LineContainer = styled('div')`
    display: flex;
    margin-top: 2px;
`

const Circle = styled('span')`
    height: 7px;
    width: 7px;
    background-color: #ffbf00;
    border-radius: 50%;
    margin-top: -2px;
`

const Line = styled('span')`
    width: 100%;
    height: 2px;
    background-color: #ffbf00;
`

const TwineLogo = styled('img')`
    position: absolute;
    left: 47%;
    bottom: 10%;
    width: 6%;
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
        setUploadState("unselected");
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
      
        if(result.state === "success"){
            setUploadState("success");
            setFilename("")
        }
        if(result.state === "error"){
            setUploadState("error");
            const errorText = result.data.response.data.error.message.replaceAll("\n","\n")
            setErrorText(errorText);
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
        display = <>
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
        display = <>
            <img
                src={require('../assets/icons/uploadbutton.png')}
                alt="upload the completed template"
                style={{height: '100px', width: '100px'}}
            />
            <Paragraph>Processing and checking the csv for errors...</Paragraph>
        </>

    if(uploadState === "error")
        display = <>
            <img
                src={require('../assets/icons/uploadbutton.png')}
                alt="upload the completed template"
                style={{height: '100px', width: '100px'}}
            />
            <Paragraph>{errorText}</Paragraph>
            <button onClick={reset}>try again</button>
        </>

    if(uploadState === "success")
        display = <>
            <img
                src={require('../assets/icons/upload_complete.png')}
                alt="completed upload"
                style={{height: '100px', width: '100px'}}
            />
            <Paragraph>Your data has been uploaded</Paragraph>
            <SelectButton onClick={()=>{setUploadState("unselected");reset()}}>upload more past data</SelectButton>
        </>


    return (
        <UploadContainer>
            <Paragraph>{filename}</Paragraph>
            {display}
        </UploadContainer>
    )
}

const DownloadTab = () => {
    return (
        <UploadContainer>
            <Paragraph>Download the template for uploading your past visits</Paragraph>
            <img alt="download template" src={require('../assets/icons/downloadbutton.png')}/>
            <a href={"/downloads/past_visits_template.csv"} download>
                <DownloadButton>Download</DownloadButton>
            </a>
            <Paragraph>
                1. Please ensure that you are filling in the table for visits and logs
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
        </UploadContainer>
    )
}
    

const Upload = () => {
    const [selected, setSelected] = useState("download");

    return (
        <div>
            <NavHeader
          leftTo="/admin"
          leftContent="Back to dashboard"
          centerContent="Upload Data"
        />
        <div>
            <TabOption 
                onClick={()=>setSelected("download")}
                active={selected === "download"}
            >Download</TabOption>
            <TabOption 
                onClick={()=>setSelected("upload")}
                active={selected === "upload"}
            >Upload</TabOption>
            <Niceline/>
        </div>
        {selected === "upload"?
            <UploadTab/>
        :
            <DownloadTab/>
        }
        <TwineLogo alt="twine logo" src={require('../assets/icons/logo_image.svg')}/>
        </div>
    )
}

export default Upload;