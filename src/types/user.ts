export interface User{
    id: number;
    name: string;
    batch: number;
    mobile_no: string;
    whatsapp_no: string|null;
    email: string;
    profile_pic: string;
    job_title: string|null;
    current_org: string|null;
    socials: string;
    dept_name: string;
    city_name: null|string;
    city: null|string;
    state: string;
    country: string;
    emoji: string;
  }