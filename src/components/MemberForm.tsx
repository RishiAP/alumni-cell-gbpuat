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

export function MemberForm() {
    const current_year = new Date().getFullYear();
    const [formData, setFormData] = useState<FormData>({name:"",email:"",mobile:"",whatsapp:"",currentLocation:{locality:"",state_id:0,country_id:0},jobTitle:"",organization:"",linkedin:"",instagram:"",batch:0,dept_id:0,id:0,profilePic:""});
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
            setFormData({...formData,profilePic:pic});
        }
        useEffect(() => {
            console.log(formData);
        },[formData]);
        function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault();
        if(formData.profilePic===""){
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
        axios.post("/api/members",formData).then(() => {
            toast.success('Submitted successfully',{theme:document.querySelector('html')!.getAttribute('data-theme')=='light'?'light':'dark'});
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
            toast.error(message,{theme:document.querySelector('html')!.getAttribute('data-theme')=='light'?'light':'dark'});
        }).finally(()=>{
            setLoading(false);
        });
    }
    useEffect(() => {
        console.log(formData);
    },[formData]);
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
                return city.toString();
            }
            return cityObject.name;
        }
        return city;
    }
  return (
    <form className="flex max-w-5xl p-4 flex-col gap-4 w-full m-auto" onSubmit={handleSubmit}>
        <ImageCropper setProfilePic={setProfilePic} picValid={picValid} setPicValid={setPicValid} />        
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
            <FloatingLabel variant="standard" label="Email *" type="email" className="sm:min-w-80 min-w-64" value={formData.email} onInput={(e)=>{setFormData({...formData,email:e.currentTarget.value})}} required />
        </div>
      <div className="grid grid-flow-col justify-stretch sm:space-x-10 space-x-5">
            <FloatingLabel variant="standard" label="Mobile No. *" type="tel" value={formData.mobile} onInput={(e)=>{setFormData({...formData,mobile:e.currentTarget.value})}} required />
            <FloatingLabel variant="standard" label="WhatsApp No." type="tel" value={formData.whatsapp} onInput={(e)=>{setFormData({...formData,whatsapp:e.currentTarget.value})}} />
        </div>
        <div className="md:grid md:grid-flow-col md:justify-stretch md:space-x-7 flex flex-col gap-4">
            
                  <Select id="country" color={countryValid==false?"failure":"gray"} value={formData.currentLocation.country_id.toString()} onInput={(e)=>{
                      setFormData({...formData,currentLocation:{...formData.currentLocation,...{country_id:parseInt(e.currentTarget.value),state_id:0}}});
                      setCountryValid(true);
                      setStates([]);
                      axios.get(`/api/states?country_id=${e.currentTarget.value}`).then((res) => {
                          setStates(res.data);
                      }).catch((err) => {
                          console.log(err);
                      });
                  }} required>
                    <option value={"0"} disabled>Residence Country *</option>
                    {
                        countries.sort((a:Country,b:Country)=>a.name.localeCompare(b.name)).map((country) => <option key={country.id} value={country.id}>{country.name}</option>)
                      }
                  </Select>
            <Select id="state" color={stateValid==false?"failure":"gray"} value={formData.currentLocation.state_id.toString()} disabled={states.length==0} onInput={(e)=>{
                setFormData({...formData,currentLocation:{...formData.currentLocation,state_id:parseInt(e.currentTarget.value)}});
                axios.get(`/api/cities?state_id=${e.currentTarget.value}`).then((res) => {
                    setCities(res.data);
                }).catch((err) => { 
                    console.log(err);
                });
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
      
      <Button type="submit">{loading?<>Submitting... <Spinner aria-label="Spinner button example" size="sm" /></>:"Submit"}</Button>
      <ToastContainer draggable={true} draggablePercent={30} position={"top-center"} />
    </form>
  );
}
