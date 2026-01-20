import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { searchService } from "@/backend"

const SearchBar = ({ initialQuery = "" }) => {
  const [query, setQuery] = useState(initialQuery)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const navigate = useNavigate()
  const debounceRef = useRef(null)
  const containerRef = useRef(null)

  const handleSearch = (q = query) => {
    const value = q.trim()
    if (!value) return
    setShowSuggestions(false)
    navigate(`/search?q=${encodeURIComponent(value)}`)
  }

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    if (value.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchService.searchSuggestions(value)
        setSuggestions(data)
        setShowSuggestions(true)
      } catch (err) {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* SEARCH INPUT */}
      <div className="flex items-center bg-white rounded-full shadow-md border border-gray-300 overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          className={`flex-1 px-4 py-2 text-gray-800 focus:outline-none 
          focus:ring-2 focus:ring-zinc-800 ${query ? 'max-w-48' : ''}`
          }
        />
        {query && ( 
          <button 
            onClick={() => {
              setQuery("")
              setSuggestions([])
              setShowSuggestions(false)
            }}
            className="p-2 text-gray-500 hover:text-gray-800 transition-colors" 
            aria-label="Clear search" 
          > 
            <svg 
              xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" 
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
            > 
              <line x1="18" y1="6" x2="6" y2="18" /> 
              <line x1="6" y1="6" x2="18" y2="18" /> 
            </svg> 
          </button> 
        )}
        
        <button 
          onClick={() => handleSearch()} 
          className="bg-zinc-800 hover:bg-zinc-900 p-2 flex items-center justify-center 
          transition-colors rounded-r-full cursor-pointer" 
          aria-label="Search" 
        > 
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" 
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" 
          > 
            <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" /> 
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" strokeLinejoin="round" /> 
          </svg> 
        </button>
      </div>

      {/* SUGGESTIONS DROPDOWN */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-xl mt-2 z-50 overflow-hidden">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2 flex items-center gap-2 hover:bg-zinc-100 cursor-pointer"
              onClick={() => handleSearch(item.text)}
            >
              <span className="text-zinc-500">
                {item.type === "channel" ? "👤" : "🎬"}
              </span>
              <span className="text-sm text-zinc-800">
                {item.text}
              </span>
              {item.label && (
                <span className="text-xs text-zinc-500">
                  ({item.label})
                </span>
              )}
              {item.description && (
                <span className="text-xs text-zinc-500 line-clamp-1">
                  ({item.description})
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
