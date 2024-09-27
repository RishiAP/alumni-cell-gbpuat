"use client";
import { Button, Modal } from 'flowbite-react';
import NextImage from 'next/image';
import React, { ReactEventHandler, useEffect, useState } from 'react'
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export const ImageCropper = (props:{setProfilePic:(arg:string)=>void,picValid:boolean|null,setPicValid:React.Dispatch<React.SetStateAction<boolean|null>>}) => {
    const [src,setSrc]=useState<string|null>(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
    const [imageDataAmount, setImageDataAmount] = useState<number | null>(null);
    async function blobToBase64(blob:Blob):Promise<string>{
        return new Promise((resolve,reject)=>{
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(blob);
        });
    }
    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            setSrc(reader.result as string);
            setOpenModal(true);
        });
          reader.readAsDataURL(e.target.files[0]);
        }
      };
    useEffect(()=>{
        console.log(croppedImageUrl);
      },[croppedImageUrl]);
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25
      });
      const onCropComplete=(crop:PixelCrop)=>{
        makeCroppedImage(crop);
      }
      const makeCroppedImage = (crop: PixelCrop) => {
        if (!crop.width || !crop.height || !src) {
          return;
        }
    
        const image = new Image();
        image.src = src;
    
        const canvas = document.createElement('canvas');
        const mainCroppingImage=document.getElementById("mainCroppingImage") as HTMLImageElement;
        const scaleX = mainCroppingImage.naturalWidth / mainCroppingImage.width;
        const scaleY = mainCroppingImage.naturalHeight / mainCroppingImage.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
    
        if (ctx) {
          ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
          );
    
          canvas.toBlob(async (blob) => {
            if (blob) {
                console.log(blob.size);
                setImageDataAmount(Math.ceil(blob.size/1024));
              setCroppedImageUrl(await blobToBase64(blob));
              props.setPicValid(true);
            }
          }, 'image/jpeg');
        }
      };
    const onImageLoaded:ReactEventHandler<HTMLImageElement>=(e)=>{
        const { naturalWidth: width, naturalHeight: height } = e.currentTarget
        const extra=width<800?(200-25/100*width)/width*100:0;
      const crop = centerCrop(
        makeAspectCrop(
          {
            // You don't need to pass a complete crop into
            // makeAspectCrop or centerCrop.
            unit: '%',
            width: 25+extra,
          },
          1,
          width,
          height
        ),
        width,
        height
      )
    
      setCrop(crop);
        }
        ;
    const [openModal, setOpenModal] = useState(false);
  return (
    <>
    <div className="flex justify-center gap-3">

    <label htmlFor="profileImage" className="flex flex-col items-center gap-3">
            <NextImage src={`${croppedImageUrl==null?"/user.svg":croppedImageUrl}`} height={196} width={196} alt={"profilePic"} className={`rounded-full ${props.picValid==false?"border-8 border-flowbite-react-error":""}`}/>
            <p className={`text-red-600 ${props.picValid==false?"":"hidden"}`}>Please choose an image</p>
            <Button type="button" onClick={() => {
                (document.getElementById("profileImage") as HTMLInputElement).click();
            }}>Choose Image</Button>
        </label>
    </div>

            <input type="file" accept="image/*" className="hidden" id="profileImage" onInput={onSelectFile} />
      <Modal show={openModal} size={"7xl"} position={"top-center"} onClose={() => {
        setOpenModal(false);
        setCroppedImageUrl(null);
        setSrc(null);
        props.setProfilePic("");
        (document.getElementById("profileImage") as HTMLInputElement).value="";
        }}>
        <Modal.Header>Crop Image</Modal.Header>
        <Modal.Body className='flex flex-col items-center p-3'>
        {src!=null && (
        <ReactCrop
          crop={crop}
          ruleOfThirds
          onComplete={onCropComplete}
          onChange={(crop:Crop) => setCrop(crop)}
          aspect={1}
          keepSelection={true}
          minHeight={200}
          minWidth={200}
          maxHeight={400}
          maxWidth={400}
          circularCrop={true}
        >
            <img src={src} id="mainCroppingImage" onLoad={onImageLoaded} alt="" className='max-w-full' style={{maxHeight:"calc(100vh - 250px)"}} />
        </ReactCrop>
      )}
      <p className='mt-3'>Image should be maximum of 250 KB</p>
        </Modal.Body>
        <Modal.Footer className='justify-between'>
            <div>

            {
                imageDataAmount!=null && <p>Image size: {imageDataAmount} KB</p>
            }
            </div>
            <div className="flex justify-end">

          <Button color="gray" onClick={() => {
              setOpenModal(false);
              setCroppedImageUrl(null);
            setSrc(null);
            props.setProfilePic("");
        }}>
            Cancel
          </Button>
        <Button onClick={() => {
            if(croppedImageUrl!=null){
                props.setProfilePic(croppedImageUrl);
                props.setPicValid(true);
            }
            setOpenModal(false);
            (document.getElementById("profileImage") as HTMLInputElement).value="";
        }
    }>Crop</Button>
    </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}