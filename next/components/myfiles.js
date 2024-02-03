import {useState,useEffect} from "react";
import axios from 'axios';

function Readfiles({jsonData}){
  console.log(jsonData);
  if(jsonData.type == "file"){
    return (
      <li>{jsonData.name}</li>
    );
  }else if(jsonData.type == "directory"){
    return (
      <>
        <b>{jsonData.name}</b>
        <ul>
          {jsonData.children.map((file) => {
            return(
              <Readfiles jsonData={file}/>
            )
          })}
        </ul>
      </>
    )
  }
}

export default function Files({id}) {
  const [Files,setFiles] = useState(undefined);
  async function getFiles(id){
    const resp = await axios.get('http://localhost:5000/files/'+id);
    setFiles(resp.data);
  }
  useEffect(() => {
    getFiles(id);
  },[])
  
  return (
    <>
      <b>Your Files :</b>
      <ul>
        {
          Files != undefined &&
          <Readfiles jsonData={Files}/>
        }
      </ul>
    </>
  )
}
