import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { searchService } from "@/backend"
import { SearchChannelCard, SearchVideoCard, Loader } from "@/components"

const SearchResult = () => {
  const location = useLocation()
  const query = new URLSearchParams(location.search).get("q")

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) return

    const fetchResults = async () => {
      try {
        setLoading(true)
        const results = await searchService.search(query)
        setResults(results)
      } catch (err) {
        console.error("Search failed", err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [query])

  if (!query) {
    return (
      <div className="mt-[64px] w-full rounded-sm bg-gray-50 min-h-screen">
        <div className="p-6 text-center text-zinc-500">
          Start typing to search videos and channels
        </div>
      </div>
    )
  }

  if (loading) {
    return <Loader />
  }

  if (!results.length) {
    return (
      <div className="mt-[64px] w-full rounded-sm bg-gray-50 min-h-screen">
        <div className="p-6 text-center text-zinc-500">
          No results found for <b>{query}</b>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-[64px] w-full rounded-sm bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 flex flex-col gap-2">
        {results.map(item => {
          if (item.type === "channel") {
            return (
              <SearchChannelCard
                key={`channel-${item.data.id}`}
                channel={item.data}
              />
            )
          }

          if (item.type === "video") {
            return (
              <SearchVideoCard
                key={`video-${item.data.id}`}
                video={item.data}
              />
            )
          }
          return null
        })}
      </div>
    </div>
  )
}

export default SearchResult
