/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import type React from "react"

import {IKImage, ImageKitProvider, IKUpload, IKVideo} from "imagekitio-next"
// Import the proper type if available in the library
import {useRef, useState} from "react"
import {cn} from "@/lib/utils"
import {toast} from "sonner"
import config from "@/lib/config"
import {Upload, X} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Progress} from "@/components/ui/progress"

const {
    env: {
        imagekit: {publicKey, urlEndpoint},
    },
} = config

const authenticator = async () => {
    try {
        const response = await fetch(`${config.env.apiEndpoint}/api/imageKit/auth`)

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Authentication failed:", response.status, errorText)
            throw new Error(`Request failed with status ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        console.log("Authentication successful:", data)

        const {signature, expire, token} = data
        return {token, expire, signature}
    } catch (error: unknown) {
        console.error("Authentication error:", error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`Authentication request failed: ${errorMessage}`)
    }
}

interface Props {
    type: "image" | "video"
    accept: string
    placeholder: string
    folder: string
    variant: "dark" | "light"
    onFileChange: (filePath: string) => void
    value?: string
}

// Use the imported types or create compatible interfaces
interface UploadProgressEvent {
    loaded: number;
    total: number;
}

// If the IKUploadResponse is not available as an import, use this compatible interface
interface IKUploadResponse {
    fileId: string;
    filePath: string;
    fileName?: string; // Made optional to match the library's type
    url: string;
    size: number;
    fileType: string;
    height?: number;
    width?: number;
    thumbnailUrl?: string;
    name?: string;
    [key: string]: any; // Add index signature for any additional properties
}

// If the IKUploadError is not available as an import, use this compatible interface
interface IKUploadError {
    message: string;
    help?: string;
    code?: string;
    [key: string]: any; // Add index signature for any additional properties
}

export default function FileUpload({type, accept, placeholder, folder, variant, onFileChange, value}: Props) {
    const ikUploadRef = useRef(null)
    const [file, setFile] = useState<{ filePath: string | null }>({
        filePath: value ?? null,
    })
    const [progress, setProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)

    const onError = (error: IKUploadError) => {
        console.log(error)
        toast.error(error.message)
        setIsUploading(false)
    }

    const onSuccess = (res: IKUploadResponse) => {
        // Create a file object with the filePath property to maintain state consistency
        const fileObject = { filePath: res.filePath || res.url || '' };
        setFile(fileObject);
        onFileChange(fileObject.filePath);
        toast.success(`File uploaded successfully!`);
        setIsUploading(false);
    }

    const onValidate = (file: File): boolean => {
        if (type === "image") {
            if (file.size > 20 * 1024 * 1024) {
                toast.error("Please upload a file that is less than 20MB in size")
                return false
            }
        }
        return true
    }

    const handleClearFile = (e: React.MouseEvent) => {
        e.stopPropagation()
        setFile({filePath: null})
        onFileChange("")
    }

    return (
        <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
            <IKUpload
                ref={ikUploadRef}
                onError={onError}
                onSuccess={onSuccess}
                useUniqueFileName={true}
                validateFile={onValidate}
                onUploadStart={() => {
                    setProgress(0)
                    setIsUploading(true)
                }}
                onUploadProgress={(event: UploadProgressEvent) => {
                    const percent = Math.round((event.loaded / event.total) * 100)
                    setProgress(percent)
                }}
                folder={folder}
                accept={accept}
                className="hidden"
            />

            <div className="space-y-4 w-full">
                {!file?.filePath ? (
                    <div
                        onClick={(e) => {
                            e.preventDefault()
                            if (ikUploadRef.current) {
                                // @ts-expect-error
                                ikUploadRef.current?.click()
                            }
                        }}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-40 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary/50 focus:outline-none",
                            variant === "dark" && "bg-gray-800 border-gray-700 hover:border-primary/70",
                        )}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload
                                className={cn("w-8 h-8 mb-3", variant === "dark" ? "text-gray-400" : "text-gray-500")}/>
                            <p className={cn("mb-2 text-sm font-semibold", variant === "dark" ? "text-gray-300" : "text-gray-500")}>
                                {placeholder}
                            </p>
                            <p className={cn("text-xs", variant === "dark" ? "text-gray-400" : "text-gray-500")}>
                                {type === "image" ? "SVG, PNG, JPG or GIF" : "MP4, WebM or MOV"} (Max 20MB)
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <div
                            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                            {type === "image" ? (
                                <div className="relative aspect-video w-full overflow-hidden">
                                    <IKImage
                                        alt="Uploaded image"
                                        path={file.filePath}
                                        transformation={[{height: 300, width: 500}]}
                                        className="h-full w-full object-cover transition-all group-hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                            ) : (
                                <IKVideo path={file.filePath} controls={true}
                                         className="aspect-video w-full rounded-t-lg"/>
                            )}
                            <div className="p-3 flex justify-between items-center">
                                <div className="truncate text-sm text-gray-700">{file.filePath?.split("/").pop()}</div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"
                                        onClick={handleClearFile}>
                                    <X className="h-4 w-4"/>
                                    <span className="sr-only">Remove file</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {isUploading && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Uploading...</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2"/>
                    </div>
                )}
            </div>
        </ImageKitProvider>
    )
}