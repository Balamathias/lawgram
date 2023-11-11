import { Button } from '@/components/ui/button'
import {useCallback, useState} from 'react'
import {FileWithPath, useDropzone} from 'react-dropzone'


function FileUploader({ fieldChange, mediaUrl }: {fieldChange: (FILE: File[]) => void, mediaUrl?: string}) {

    const [file, setFile] = useState<File[]>([])
    const [fileUrl, setFileUrl] = useState(mediaUrl)

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles)
        fieldChange(acceptedFiles)
        setFileUrl(URL.createObjectURL(acceptedFiles[0]))
    }, [file])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {
            "image/*": ['.jpg', '.png', '.jpeg', '.svg']
        }
    })

  return (
    <div {...getRootProps()} className='flex flex-center cursor-pointer rounded-xl gap-2 bg-dark-3'>
      <input {...getInputProps()} className='cursor-pointer' />
      {
        fileUrl ?
          (
            <>
                <div className='flex flex-1 w-full items-center p-5 lg:p-10'>
                    <img
                        src={fileUrl}
                        alt='file'
                        className='file_uploader-img'
                    />
                </div>
                {/* <p className="file_uploader-label">Drag or Click to change uploaded image.</p> */}
            </>
          ): (
            <div className='file_uploader-box'>
                <img
                    src='/assets/icons/file-upload.svg'
                    alt='file-upload'
                    width={96}
                    height={77}
                />
                <h3 className='base-medium text-light-2 m-2'>Drag/Upload files</h3>
                <p className='small-regular mb-6 text-light-4'>SVG, PNG, JPG, JPEG</p>
                <Button className='shad-button_dark_4'>Select from computer</Button>
            </div>
          )
      }
    </div>
  )
}

export default FileUploader