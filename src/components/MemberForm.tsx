"use client";

import { City } from "@/types/city";
import { Country } from "@/types/country";
import { Department } from "@/types/department";
import FormData from "@/types/formData";
import { State } from "@/types/state";
import axios from "axios";
import { Button, FloatingLabel, Select, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import {FaInstagram, FaLinkedin} from "react-icons/fa";
import { ImageCropper } from "./ImageCropper";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { setSignInModal } from "@/store/signinModalSlice";
import { CurrentUser } from "@/types/CurrentUser";
import { get } from "http";
import { setUser } from "@/store/currentUserSlice";
import { useRouter } from "next/navigation";

export function MemberForm(props:{data:boolean}) {
    const current_year = new Date().getFullYear();
    const dispatch=useDispatch();
    const router=useRouter();
    const currentUser=useSelector((state:any)=>state.currentUser.value);
    const initialFormData:FormData = {name:"",email:"",mobile:"",whatsapp:"",currentLocation:{locality:"",state_id:0,country_id:0},jobTitle:"",organization:"",linkedin:"",instagram:"",batch:0,dept_id:0,id:0,profile_pic:""};
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const[departments,setDepartments] = useState<Department[]>([]);
    const[countries,setCountries] = useState<Country[]>([]);
    const[states,setStates] = useState<State[]>([]);
    const [countryValid, setCountryValid] = useState<boolean|null>(null);
    const [stateValid, setStateValid] = useState<boolean|null>(null);
    const [branchValid, setBranchValid] = useState<boolean|null>(null);
    const [batchValid, setBatchValid] = useState<boolean|null>(null);
    const [picValid, setPicValid] = useState<boolean|null>(null);
    const [cities, setCities] = useState<City[]>([]);
    const [loading,setLoading]=useState(false);
    useEffect(() => {
        axios.get("/api/departments").then((res) => {
            setDepartments(res.data);
        });
        axios.get("/api/countries").then((res) => {
            setCountries(res.data);
        });
        }, []);
        function setProfilePic(pic:string){
            setFormData({...formData,profile_pic:pic});
        }
        useEffect(() => {
            console.log(formData);
        },[formData]);
        function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault();
        if(formData.profile_pic===""){
            setPicValid(false);
            return;
        }
        else{
            setPicValid(true);
        }
        if(formData.batch===0){
            setBatchValid(false);
            return;
        }
        else{
            setBatchValid(true);
        }
        if(formData.dept_id===0){
            setBranchValid(false);
            return;
        }
        else{
            setBranchValid(true);
        }
        if(formData.currentLocation.country_id===0){
            setCountryValid(false);
            return;
        }
        else{
            setCountryValid(true);
        }
        if(formData.currentLocation.state_id===0){
            setStateValid(false);
            return;
        }
        else{
            setStateValid(true);
        }
        setLoading(true);
        axios({method:`${props.data?"PUT":"POST"}`,url:`/api/${props.data?"user":"members"}`,data:{...formData,linkedin:formData.linkedin.split("/in/").pop(),instagram:formData.instagram.split("instagram.com/").pop()}}).then((res) => {
            toast.dismiss();
            if(props.data){
                toast.success('Submitted successfully.',{theme:document.querySelector('html')!.getAttribute('data-theme')=='light'?'light':'dark'});
            }
            else{
                toast.success('Submitted successfully. Redirecting to profile page.',{theme:document.querySelector('html')!.getAttribute('data-theme')=='light'?'light':'dark'});
                setTimeout(() => {
                    router.push("/profile");
                },5000);
            }
        }).catch(error=>{
            console.log(error);
            let message="Something went wrong!";
            if(error.response.data.cause!=null){
                if(error.response.data.cause.code==="ER_DUP_ENTRY"){
                    if(error.response.data.cause.sqlMessage.includes("users.PRIMARY")){
                        message="ID No. already exists!";
                    }
                    else if(error.response.data.cause.sqlMessage.includes("users.email")){
                        message="Email already exists!";
                    }
                    else if(error.response.data.cause.sqlMessage.includes("users.mobile_no")){
                        message="Mobile No. already exists!";
                    }
                    else if(error.response.data.cause.sqlMessage.includes("users.whatsapp_no")){
                        message="WhatsApp No. already exists!";
                    }
                }
            }
            toast.dismiss();
            toast.error(message,{theme:document.querySelector('html')!.getAttribute('data-theme')=='light'?'light':'dark'});
        }).finally(()=>{
            setLoading(false);
        });
    }
    useEffect(() => {
        console.log(formData);
    },[formData]);
    useEffect(() => {
        setStates([]);
        setFormData({...formData,currentLocation:{...formData.currentLocation,state_id:0,locality:""}});
        if(formData.currentLocation.country_id===0)
            return;
        axios.get(`/api/states?country_id=${formData.currentLocation.country_id}`).then((res) => {
            setStates(res.data);
        }).catch((err) => {
            console.log(err);
        });
    },[formData.currentLocation.country_id]);
    useEffect(() => {
        if(formData.currentLocation.state_id===0 || states.length==0)
            return;
        axios.get(`/api/cities?state_id=${formData.currentLocation.state_id}`).then((res) => {
            setCities(res.data);
            if(typeof formData.currentLocation.locality==="number"){
                setFormData({...formData,currentLocation:{...formData.currentLocation,locality:res.data.find((c:City)=>c.id===formData.currentLocation.locality)?.name||""}});
            }
        }).catch((err) => {
            console.log(err);
        });
    },[formData.currentLocation.state_id,states]);
    useEffect(() => {
        if(currentUser!==null && currentUser!="guest" && !currentUser.profile){
            setFormData({...initialFormData,name:currentUser.name,email:currentUser.email,profile_pic:currentUser.profile_pic.split("/")[2].includes("googleusercontent.com")?currentUser.profile_pic.split("96-c")[0]+"196-c":currentUser.profile_pic||""});
        }
        else if(currentUser==null || currentUser=="guest"){
            setFormData(initialFormData);
        }
        else{
            axios.get("/api/user").then((res) => {
                const socials:{instagram:string,linkedin:string}=JSON.parse(res.data.socials);
                setFormData({...initialFormData,name:res.data.name,email:res.data.email,mobile:res.data.mobile_no,whatsapp:res.data.whatsapp_no,dept_id:res.data.dept_id,batch:res.data.batch,linkedin:socials.linkedin||"",instagram:socials.instagram||"",profile_pic:res.data.profile_pic.endsWith("96-c")?res.data.profile_pic.replace("96-c","196-c"):res.data.profile_pic,id:res.data.id,jobTitle:res.data.job_title||"",organization:res.data.current_org||"",currentLocation:{locality:res.data.city_id==null? res.data.city_name:res.data.city_id,state_id:res.data.state_id,country_id:res.data.country_id}});
            }).catch((err) => {
                console.log(err);
            });
        }
    },[currentUser]);
    function getCity(city:string):string|number{
        const cityObject=cities.find((c)=>c.name.toLowerCase()===city.toLowerCase());
        if(cityObject===undefined){
            return city;
        }
        return cityObject.id;
    }
    function getCityFromCode(city:number|string):string{
        if(typeof city==="number"){
            const cityObject=cities.find((c)=>c.id===city);
            if(cityObject===undefined){
                if(typeof city=="string")
                    return city;
                else
                return "";
            }
            return cityObject.name;
        }
        return city;
    }
  return (
    <form onSubmit={handleSubmit}>
        <h1 className="text-center text-xl">{props.data?"Profile":"Be a member"}</h1>
        <fieldset className="flex max-w-5xl p-4 flex-col gap-4 w-full m-auto" disabled={loading}>
        <ImageCropper setProfilePic={setProfilePic} picValid={picValid} setPicValid={setPicValid} defaultPic={formData.profile_pic} />        
      <div className="sm:grid sm:grid-flow-col sm:justify-stretch sm:space-x-10 flex flex-col gap-4">
        <FloatingLabel variant="standard" label="Name *" type="text" className="sm:min-w-80 min-w-64" value={formData.name} onInput={(e)=>{setFormData({...formData,name:e.currentTarget.value})}} required />
        <div className="grid grid-flow-col justify-stretch space-x-10">
          <FloatingLabel variant="standard" label="ID No. *" type="number" value={formData.id==0?"":formData.id} onInput={(e)=>{setFormData({...formData,id:parseInt(e.currentTarget.value)})}} required />
          <div>
            <Select id="batch" color={batchValid==false?"failure":"gray"} value={formData.batch.toString()} onInput={(e)=>{
                setFormData({...formData,batch:parseInt(e.currentTarget.value)})
                setBatchValid(true);
                }} required>4
              <option value={"0"} disabled>Batch *</option>
              {
                Array.from({length: current_year-1960-4}, (_, i) => i + 1960).map((year) => <option key={year}>{year}</option>)
              }
            </Select>
          </div>
        </div>
      </div>
      <div className="md:grid md:grid-flow-col md:justify-stretch md:space-x-7 flex flex-col gap-4">
            <Select id="branch" color={branchValid==false?"failure":"gray"} value={formData.dept_id.toString()} onInput={(e)=>{
                setFormData({...formData,dept_id:parseInt(e.currentTarget.value)})
                setBranchValid(true);
                }} required>
              <option value={"0"} disabled>Branch *</option>
              {
                departments.map((dept) => <option key={dept.dept_id} value={dept.dept_id}>{dept.dept_name}</option>)
              }
            </Select>
            <FloatingLabel variant="standard" label="Email *" type="email" className="sm:min-w-80 min-w-64 disableable-email" value={formData.email} onInput={(e)=>{setFormData({...formData,email:e.currentTarget.value})}} required disabled={formData.email!=""} />
        </div>
      <div className="grid grid-flow-col justify-stretch sm:space-x-10 space-x-5">
            <FloatingLabel variant="standard" label="Mobile No. *" type="tel" value={formData.mobile} onInput={(e)=>{setFormData({...formData,mobile:e.currentTarget.value})}} required />
            <FloatingLabel variant="standard" label="WhatsApp No." type="tel" value={formData.whatsapp} onInput={(e)=>{setFormData({...formData,whatsapp:e.currentTarget.value})}} />
        </div>
        <div className="md:grid md:grid-flow-col md:justify-stretch md:space-x-7 flex flex-col gap-4">
            
                  <Select id="country" color={countryValid==false?"failure":"gray"} value={formData.currentLocation.country_id.toString()} onInput={(e)=>{
                      setFormData({...formData,currentLocation:{...formData.currentLocation,...{country_id:parseInt(e.currentTarget.value),state_id:0}}});
                      setCountryValid(true);
                  }} required>
                    <option value={"0"} disabled>Residence Country *</option>
                    {
                        countries.sort((a:Country,b:Country)=>a.name.localeCompare(b.name)).map((country) => <option key={country.id} value={country.id}>{country.name}</option>)
                      }
                  </Select>
            <Select id="state" color={stateValid==false?"failure":"gray"} value={formData.currentLocation.state_id.toString()} disabled={states.length==0} onInput={(e)=>{
                setCities([]);
                setFormData({...formData,currentLocation:{...formData.currentLocation,locality:"",state_id:parseInt(e.currentTarget.value)}});
                setStateValid(true);
                }} required>
              <option value={"0"} disabled>Residence State *</option>
              {
                states.sort((a:State,b:State)=>a.name.localeCompare(b.name)).map((state) => <option key={state.id} value={state.id}>{state.name}</option>)
              }
            </Select>
            <FloatingLabel variant="standard" label="Residence City/Locality *" list="cities" className="sm:min-w-80 min-w-64" type="text" value={getCityFromCode(formData.currentLocation.locality)} onInput={(e)=>{setFormData({...formData,currentLocation:{...formData.currentLocation,locality:getCity(e.currentTarget.value)}})}} required />

            <datalist id="cities">
                {
                    cities.sort((a:City,b:City)=>a.name.localeCompare(b.name)).map((city) => <option key={city.id} value={city.name}></option>)
                }
                </datalist>

        </div>
        <div className="sm:grid sm:grid-flow-col sm:justify-stretch sm:space-x-7 flex flex-col gap-4">
        <FloatingLabel variant="standard" label="Current Job Title" type="text" value={formData.jobTitle} onInput={(e)=>{setFormData({...formData,jobTitle:e.currentTarget.value})}} />
        <FloatingLabel variant="standard" label="Current Organization" type="text" value={formData.organization} onInput={(e)=>{setFormData({...formData,organization:e.currentTarget.value})}} />
        </div>
        <div className="grid grid-flow-col justify-stretch sm:space-x-7 space-x-3">
      <TextInput id="username3" placeholder="Username/Link" icon={FaLinkedin} value={formData.linkedin} onInput={(e)=>{setFormData({...formData,linkedin:e.currentTarget.value})}} />
      <TextInput id="username3" placeholder="Username/Link" icon={FaInstagram} value={formData.instagram} onInput={(e)=>{setFormData({...formData,instagram:e.currentTarget.value})}} />
        </div>
      
      {currentUser!=null && currentUser=="guest"?<Button type="button" onClick={()=>dispatch(setSignInModal(true))}>Signin to submit</Button>:
        <Button type="submit" disabled={loading || currentUser==null}>{loading?<>{props.data?"Updating...":"Submitting"}... <Spinner aria-label="Spinner button example" size="sm" /></>:props.data?"Update":"Submit"}</Button>
      }
        </fieldset>
    </form>
  );
}
