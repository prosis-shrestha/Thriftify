import axios, { Axios, AxiosProgressEvent } from "axios";


const cloudName = "dxl5wyou5";
const presetKey="thrift"

type Callback = (progress:number,url:string )=>void;


export const useUploadImage = () => {
  const upload = async (file:File,cb?:Callback) => {

    const formData = new FormData()
    formData.append("file",file);
    formData.append("upload_preset",presetKey)

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        },
        onUploadProgress:(e:AxiosProgressEvent)=>{
        if(e.total){
          let loaded = Math.round((e.loaded/e.total)*100)
           if(cb){

             cb(loaded,"")
            }
        }
        }
      })

      if(cb){
        cb(100,res?.data?.secure_url)
      }

  


      return {success:true,url:res?.data?.secure_url}

    } catch (error) {

      console.log(error)
      return {success:false}
    }
  };


  return {upload }

};

