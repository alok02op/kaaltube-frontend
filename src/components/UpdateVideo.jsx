import { useState, useEffect } from "react";
import { 
  AlertPopup,
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter,
  Textarea,
  Input,
  Button,
  Confirm
} from "@/components";
import { Loader2, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { cloudService, videoService } from "@/backend";
import { updateVideo } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const VideoUploadForm = () => {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [fileInfo, setFileInfo] = useState({
    thumbnailId: '',
    thumbnailUploaded: false,
    uploadingThumbnail: false,
    loading: false
  })
  const navigate = useNavigate();
  const { videoId } = useParams();
  const video = useSelector(state => (state.userVideo.videos.find((video) => (video.id === videoId))));
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
  const showAlert = (type, message) => setAlert({show: true, type, message})
  const closeAlert = () => setAlert({...alert, show: false})


  useEffect(() => {
    if (video) {
      reset({
        title: video.title,
        description: video.description
      });
    }
  }, [video, reset]);

  const thumbnailFile = watch('thumbnailFile');

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
      id: videoId,
      title: data?.title || '',
      description: data?.description || '',
      thumbnail: fileInfo?.thumbnailId || ''
    }
    try {
      const response = await videoService.updateVideo(videoDetails)
      dispatch(updateVideo(response.data))
      showAlert('success', response.message || 'Video updated')
      navigate('/channel');
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setFileInfo(info => ({ ...info, loading: false }))
      setShowConfirm(false);
    }
  }
  const handleUpdateClick = () => {
    setShowConfirm(true);
  };

  return (
    <div className="w-full min-h-screen rounded-sm flex justify-center items-center px-4 pb-8">
      <Card className="w-full max-w-lg shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Update Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            {/* Top-level error */}
            {error && (
              <p className="text-red-600 text-center font-medium">{error}</p>
            )}

            {/* Thumbnail File */}
            <div>
              <label className="block font-medium mb-1">Thumbnail Image *</label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  {...register('thumbnailFile') }
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
                defaultValue={video?.title}
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
                defaultValue={video?.description}
                {...register('description', {required: 'Description is required'})}
              />
              {errors.description && (
                <p className="text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                onClick={handleUpdateClick}
                className="w-40 flex items-center justify-center bg-blue-600 hover:bg-blue-700 cursor-pointer"
                disabled={ fileInfo.loading }
              >
                {fileInfo.loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" /> Update
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
          {showConfirm && (
            <Confirm
              headingText="Do you want to update?"
              handleConfirm={handleSubmit(SubmitForm)}
              onCancel={() => setShowConfirm(false)}
            />
          )}
      </CardFooter>
    </div>
  );
};

export default VideoUploadForm;
