"use client";
import HomePageCarousel from "@/components/HomePageCarousel";
import { AppBar } from "@/components/Navbar";
import ProfileCard from "@/components/ProfileCard";
import { City } from "@/types/city";
import { Country } from "@/types/country";
import { Department } from "@/types/department";
import { State } from "@/types/state";
import { User } from "@/types/user";
import axios from "axios";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [country, setCountry] = useState(0);
  const [state, setState] = useState(0);
  const [city, setCity] = useState<string|number>(0);
  const [batch, setBatch] = useState(0);
  const [branch, setBranch] = useState(0);
  const[departments,setDepartments] = useState<Department[]>([]);
  const[countries,setCountries] = useState<Country[]>([]);
  const[states,setStates] = useState<State[]>([]);
  const [users,setUsers]=useState<User[]>([]);
  const [cities, setCities] = useState<City[]>([]);
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
  useEffect(() => {
    axios.get("/api/departments").then((res) => {
        setDepartments(res.data);
    });
    axios.get("/api/countries").then((res) => {
        setCountries(res.data);
    });
    axios.get("/api/members").then((res) => {
      console.log(res.data);
      setUsers(res.data);
    }).catch((err) => {
      console.log(err);
    });
  },[]);

  function handleSearch(e:FormEvent){
    e.preventDefault();
    axios.get(`/api/search?country=${country}&state=${state}&city=${city}&batch=${batch}&branch=${branch}`).then((res) => {
      setUsers(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }
  const current_year = new Date().getFullYear();
  useEffect(()=>{
    axios.get(`/api/states?country_id=${country}`).then((res) => {
      setStates(res.data);
    }).catch((err) => {
      console.log(err);
    });
  },[country])
  useEffect(()=>{
    axios.get(`/api/cities?state_id=${state}`).then((res) => {
    setCities(res.data);
    }).catch((err) => {
      console.log(err);
    });
  },[state])

  return (
    <>
      <AppBar />
      <HomePageCarousel />
      <form onSubmit={handleSearch} className="flex flex-wrap max-w-7xl justify-center gap-4 mx-auto p-4 bg-white shadow-md rounded-md">
      <div>
        <Label htmlFor="country">Country</Label>
        <Select id="country" value={country} onInput={(e) => setCountry(parseInt(e.currentTarget.value))}>
          <option value="0">Any</option>
          {
            countries.sort((a:Country,b:Country)=> a.name.localeCompare(b.name)).map((country) => <option key={country.id} value={country.id}>{country.name}</option>)
          }
          {/* Add more options as needed */}
        </Select>
      </div>

      <div>
        <Label htmlFor="state">State</Label>
        <Select id="state" onInput={(e) => setState(parseInt(e.currentTarget.value))}>
          <option value="">Any</option>
          {
            states.sort((a:State,b:State)=> a.name.localeCompare(b.name)).map((state) => <option key={state.id} value={state.id}>{state.name}</option>)
          }
          {/* Add more options as needed */}
        </Select>
      </div>

      <div>
      <div className="mb-0 block">
          <Label htmlFor="city" value="City" />
        </div>
        <TextInput list="cities" id="city" type="text" placeholder="City/Locality" value={city!=0?getCityFromCode(city):""} onInput={(e) => setCity(getCity(e.currentTarget.value))}  />
          <datalist id="cities">
            {
              cities.sort((a:City,b:City)=> a.name.localeCompare(b.name)).map((city) => <option key={city.id} value={city.name}></option>)
            }
          </datalist>
      </div>

      <div>
              <Label htmlFor="batch">Batch</Label>
        <Select id="batch" onInput={(e) => setBatch(parseInt(e.currentTarget.value))}>
          <option value="0">Any</option>
          {
            Array.from({length: current_year-1960-4}, (_, i) => i + 1960).map((year) => <option key={year}>{year}</option>)
          }
          {/* Add more options as needed */}
        </Select>
      </div>

      <div>
          <Label htmlFor="branch">Branch</Label>
        <Select id="branch" value={branch} onInput={(e) => setBranch(parseInt(e.currentTarget.value))}>
          <option value="0">Any</option>
          {
            departments.map((dept) => <option key={dept.dept_id} value={dept.dept_id}>{dept.dept_name}</option>)
          }
          {/* Add more options as needed */}
        </Select>
      </div>

      <Button type="submit" style={{height:"40px",marginTop:"auto",marginBottom:"2px"}}>Search</Button>
      <Button type="reset" style={{height:"40px",marginTop:"auto",marginBottom:"2px"}}>Reset</Button>
    </form>
      <div className="flex flex-col">
      {
        users.map((user) => <ProfileCard key={user.id} user={user} />)
      }
      </div>
    </>
  );
}
