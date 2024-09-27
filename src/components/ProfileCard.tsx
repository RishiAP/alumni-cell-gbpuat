import { User } from '@/types/user';
import { Card } from 'flowbite-react';
import { FaGraduationCap, FaInstagram, FaLinkedin, FaPhone, FaRegEnvelope, FaWhatsapp } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';

const ProfileCard = (props:{user:User}) => {
    const socials=JSON.parse(props.user.socials);
    console.log(props.user)
  return (
    <div className="max-w-4xl w-full mx-auto p-4">
      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          {/* Profile Picture */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            <img
              className="rounded-full w-48 h-48 object-cover"
              src={props.user.profile_pic}
              alt="Profile"
            />
          </div>

          {/* Profile Info */}
          <div className="w-full md:w-2/3 mt-6 sm:mt-0 md:ml-6">
            {/* Name */}
            <div className="flex flex-col">

            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {props.user.name} {`(${props.user.id})`}
            </h5>
            {
                props.user.job_title!=null || props.user.current_org!=null? <p className="text-xl font-semibold text-gray-700 mt-1">{props.user.job_title} at {props.user.current_org}</p>:null
            }
            </div>
            <h6 className='text-lg flex items-center gap-2'> <FaGraduationCap className='text-xl text-gray-600 dark:text-gray-200'/> {props.user.dept_name}, {props.user.batch}</h6>
            {/* Job Title */}
            

            <p className="text-gray-700 flex items-center gap-2">
              <FaLocationDot className="text-red-600" /> <span className='mt-1'>{props.user.city_name} {props.user.city}, {props.user.state}, {props.user.country} {props.user.emoji}</span>
            </p>
            <p className="text-gray-700 flex items-center gap-2">
                <FaPhone className="text-green-600" /> <span className='mt-1'>{props.user.mobile_no}</span> {props.user.whatsapp_no!=null && <><FaWhatsapp className="text-green-600" /><span className='mt-1'>{props.user.whatsapp_no}</span></>}
            </p>
            <p className="text-gray-700 flex items-center gap-2 mt-1">
                <FaRegEnvelope className="text-blue-600" /> {props.user.email}
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-4">
              {

                socials.linkedin!="" && <a
                    href={`https://linkedin.com/in/${socials.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaLinkedin className="text-blue-600 text-2xl" />
                </a>
              }
              {
                  socials.instagram!="" && <a
                  href={`https://instagram.com/${socials.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className="text-pink-500 text-2xl" />
                </a>
              }
              
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileCard;
