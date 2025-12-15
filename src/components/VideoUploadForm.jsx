import { useState } from "react";
import { 
  AlertPopup,
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter,
  Textarea,
  Input,
  Button
} from "@/components";
import { Loader2, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { cloudService, videoService } from "@/backend";
import { addVideo } from "@/store";
import { useDispatch } from "react-redux";

const VideoUploadForm = () => {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [fileInfo, setFileInfo] = useState({
    videoId: '',
    thumbnailId: '',
    videoUploaded: false,
    thumbnailUploaded: false,
    uploadingVideo: false,
    uploadingThumbnail: false,
    loading: false
  })
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
  const showAlert = (type, message) => setAlert({show: true, type, message})
  const closeAlert = () => setAlert({...alert, show: false})

  const thumbnailFile = watch('thumbnailFile');
  const videoFile = watch('videoFile');

  const handleUploadVideo = async () => {
    if (!videoFile || videoFile.length === 0) {
      showAlert('warning', 'Please select video before uploading')
      return '';
    }
    setFileInfo(info => ({ ...info, uploadingVideo: true}))
    try {
        const id = await cloudService.uploadOnCloudinary(videoFile[0], 'video')
        setFileInfo(info => ({ ...info, videoId: id, videoUploaded: true }))
        showAlert('success', 'Video uploaded successfully')
    } catch (err) {
        showAlert('error', err?.message || 'Video upload failed')
    } finally {
        setFileInfo(info => ({ ...info, uploadingVideo: false}))
    }
  };
  const handleUploadThumbnail = async () => {
    if (!thumbnailFile || thumbnailFile.length === 0) {
      showAlert('warning', 'Please select thumbnail before uploading')
      return '';
    }
    setFileInfo(info => ({ ...info, uploadingThumbnail: true}))
    try {
        const id = await cloudService.uploadOnCloudinary(thumbnailFile[0], 'image')
        setFileInfo(info => ({ ...info, thumbnailId: id, thumbnailUploaded: true }))
        showAlert('success', 'Thumbnail uploaded successfully')
    } catch (err) {
        showAlert('error', err?.message || 'Thumbnail upload failed')
    } finally {
        setFileInfo(info => ({ ...info, uploadingThumbnail: false}))
    }
  };
  const SubmitForm = async (data) => {
    setError('')
    setFileInfo(info => ({ ...info, loading: true }))
    const videoDetails = {
      title: data.title,
      description: data.description,
      videoId: fileInfo.videoId,
      thumbnail: fileInfo.thumbnailId
    }
    try {
      const response = await videoService.uploadVideo(videoDetails)
      dispatch(addVideo(response.data))
      showAlert('success', response.message)
      reset();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setFileInfo(info => ({ ...info, loading: false }))
    }
  }

  return (
    <div className="flex justify-center items-center bg-gray-50 px-4 pb-8">
      <Card className="w-full max-w-lg shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Upload New Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(SubmitForm)} className="space-y-5">
            {/* Top-level error */}
            {error && (
              <p className="text-red-600 text-center font-medium">{error}</p>
            )}

            {/* Video File */}
            <div>
              <label className="block font-medium mb-1">Video File *</label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="video/*"
                  {...register('videoFile', {required: 'Video file is required.'}) }
                />
                {videoFile?.length > 0 && !fileInfo.videoUploaded && (
                  <Button
                    type="button"
                    disabled={fileInfo.uploadingVideo}
                    onClick={handleUploadVideo}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                  {fileInfo.uploadingVideo ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                        <Upload className="mr-2 h-4 w-4" /> Upload
                    </>
                  )}
                  </Button>
                )}
              </div>
              {errors.videoFile && (
                <p className="text-red-600 mt-1">{errors.videoFile.message}</p>
              )}
            </div>

            {/* Thumbnail File */}
            <div>
              <label className="block font-medium mb-1">Thumbnail Image *</label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  {...register('thumbnailFile', {required: 'Video file is required.'}) }
                />
                {thumbnailFile?.length > 0 && !fileInfo.thumbnailUploaded && (
                  <Button
                    type="button"
                    disabled={fileInfo.uploadingThumbnail}
                    onClick={handleUploadThumbnail}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                  {fileInfo.uploadingThumbnail ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                        <Upload className="mr-2 h-4 w-4" /> Upload
                    </>
                  )}
                  </Button>
                )}
              </div>
              {errors.thumbnailFile && (
                <p className="text-red-600 mt-1">{errors.thumbnailFile.message}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block font-medium mb-1">Title *</label>
              <Input
                type="text"
                placeholder="Enter video title"
                {...register('title', {required: 'Title is required'})}
              />
              {errors.title && (
                <p className="text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-1">Description</label>
              <Textarea
                rows={3}
                placeholder="Enter video description..."
                {...register('description', {required: 'Description is required'})}
              />
              {errors.description && (
                <p className="text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-40 flex items-center justify-center bg-blue-600 hover:bg-blue-700 cursor-pointer"
                disabled={!fileInfo.videoUploaded || !fileInfo.thumbnailUploaded || fileInfo.loading}
              >
                {fileInfo.loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" /> Submit
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <CardFooter>
          <AlertPopup
              show={alert.show}
              type={alert.type}
              message={alert.message}
              onClose={closeAlert}
          />
      </CardFooter>
    </div>
  );
};

export default VideoUploadForm;
