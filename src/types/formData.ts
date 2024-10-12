export default interface FormData{
    name: string;
    email: string;
    mobile: string;
    whatsapp: string;
    currentLocation: {locality: number|string, state_id: number, country_id: number};
    jobTitle: string;
    organization: string;
    linkedin: string;
    instagram: string;
    batch: number;
    dept_id: number;
    id: number;
    profile_pic: string;
};