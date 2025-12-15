import { useNavigate } from "react-router-dom"
import { timeAgo } from "@/utils/time"

const SearchVideoCard = ({ video }) => {
  const navigate = useNavigate()
  const { id, title, description, views, createdAt, thumbnailUrl, owner } = video

  return (
    <div 
        className="flex flex-row gap-4 sm:gap-6 hover:bg-zinc-100 rounded-xl
        transition cursor-pointer"
        onClick={() => navigate(`/${id}/0`)}
    >
      {/* Thumbnail */}
      <div className="w-[50vw] sm:w-[360px] md:w-[480px] h-[150px] sm:h-[220px] md:h-[275px] flex-shrink-0">
        <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover rounded-xl"/>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 justify-start flex-1">
        {/* Title */}
        <h3 className="text-base sm:text-xl font-semibold leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Meta */}
        <p className="text-sm text-zinc-500">
          {views.toLocaleString()} views • {timeAgo(createdAt)}
        </p>

        {/* Channel */}
        <div
          className="flex items-center gap-3 md:mt-1"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/channel/${owner.id}`)
          }}
        >
          <img
            src={owner.avatarUrl}
            alt={owner.fullName}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-zinc-600">
            {owner.fullName}
          </span>
        </div>

        {/* Description (hidden on small screens like YouTube) */}
        <div className="max-h-[3rem] overflow-hidden">
            <p className="text-sm text-zinc-600 line-clamp-1">
                {description}
            </p>
        </div>
      </div>
    </div>
  )
}

export default SearchVideoCard
