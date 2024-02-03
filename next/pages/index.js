import {useState,useRef,useEffect} from "react";
import { useRouter } from 'next/router'
import { useLocalStorage } from '@rehooks/local-storage';
import axios from 'axios';
import Files from "../components/myfiles";

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

export default function Upload() {
  const router = useRouter()
  const form = useRef(null);
  const [Folder,setFolder] = useState(false);
  const [userName,setuserName] = useState(null);
  const [jwt] = useLocalStorage('jwt');
  useEffect(() => {
    if(jwt != undefined){
      setuserName(parseJwt(jwt)["https://hasura.io/jwt/claims"]["X-Hasura-User-Id"]);
    }else{
      router.push('/register');
    }
  },[])
  
  return (
    <>
      <b>upload Folder ?</b>
      <input type="checkbox" 
        checked={Folder} 
        onChange={(e) => setFolder(e.target.checked)} 
      />
      <form ref={form} onSubmit={(e) => {
        e.preventDefault();
        var bodyFormData = new FormData();
        for (let file of Array.from(e.target.fileList.files)) {
          bodyFormData.append("files",file);
        };
        axios({
          method: "post",
          url: 'http://localhost:5000/upload/'+userName,
          data: bodyFormData,
        })
        form.current.reset();
      }}>
        {Folder ? 
          <input type="file" name="fileList" multiple webkitdirectory="true"></input>:
          <input type="file" name="fileList" multiple></input>
        }
        <button type="submit">Upload</button>
      </form>
      {userName != null && 
        <Files id={userName}/>
      }
    </>
  )
}
