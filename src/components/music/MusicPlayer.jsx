import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, ChevronUp, ChevronDown, SkipForward, Loader2 } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'

// Lo-fi radio streams (free, no autoplay required)
const TRACKS = [
  {
    title: 'Lofi Hip Hop Radio',
    artist: 'Chillhop Music',
    emoji: '🎵',
    // Using a public lo-fi stream URL (Lofi Girl - publicly available)
    url: 'https://play.streamafrica.net/lofiradio',
    color: '#6C63FF',
  },
  {
    title: 'Chill Study Beats',
    artist: 'Lo-Fi Focus',
    emoji: '📚',
    url: 'https://streams.ilovemusic.de/iloveradio17.mp3',
    color: '#00D4B4',
  },
  {
    title: 'Jazz Cafe Vibes',
    artist: 'Smooth Jazz',
    emoji: '🎷',
    url: 'https://streams.ilovemusic.de/iloveradio8.mp3',
    color: '#F5C518',
  },
]

const MusicPlayer = () => {
  const { musicPlaying, setMusicPlaying, musicVolume, setMusicVolume } = useApp()
  const [expanded, setExpanded] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [muted, setMuted] = useState(false)
  const [loading, setLoading] = useState(false)
  const audioRef = useRef(null)

  const currentTrack = TRACKS[trackIndex]

  // Sync play state with audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = muted ? 0 : musicVolume

    if (musicPlaying) {
      setLoading(true)
      audio.play().catch(() => {
        setMusicPlaying(false)
        setLoading(false)
      })
    } else {
      audio.pause()
      setLoading(false)
    }
  }, [musicPlaying, trackIndex])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : musicVolume
    }
  }, [musicVolume, muted])

  const togglePlay = () => {
    setMusicPlaying(!musicPlaying)
  }

  const nextTrack = () => {
    const next = (trackIndex + 1) % TRACKS.length
    setTrackIndex(next)
    if (musicPlaying) {
      const audio = audioRef.current
      if (audio) {
        audio.src = TRACKS[next].url
        audio.play().catch(() => setMusicPlaying(false))
      }
    }
  }

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value)
    setMusicVolume(val)
    if (val > 0) setMuted(false)
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onLoadStart={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onError={() => { setLoading(false); setMusicPlaying(false) }}
        preload="none"
      />

      {/* Music player bar */}
      <div className="music-player">
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="px-5 py-4 border-b border-glass-border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {/* Track list */}
              <p className="text-text-muted text-[10px] uppercase tracking-widest mb-3 font-medium">Pilih Musik</p>
              <div className="space-y-2">
                {TRACKS.map((track, i) => (
                  <motion.button
                    key={i}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all"
                    style={{
                      background: trackIndex === i ? `${track.color}15` : 'var(--surface-1)',
                      border: `1px solid ${trackIndex === i ? `${track.color}30` : 'var(--surface-2)'}`,
                    }}
                    onClick={() => {
                      setTrackIndex(i)
                      if (!musicPlaying) setMusicPlaying(true)
                      const audio = audioRef.current
                      if (audio) {
                        audio.src = track.url
                        audio.play().catch(() => setMusicPlaying(false))
                      }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl">{track.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary text-xs font-medium truncate">{track.title}</p>
                      <p className="text-text-muted text-[10px]">{track.artist}</p>
                    </div>
                    {trackIndex === i && musicPlaying && (
                      <div className="flex gap-0.5 items-end h-4">
                        {[3, 5, 4, 6, 3].map((h, j) => (
                          <motion.div key={j}
                            className="w-1 rounded-full"
                            style={{ background: track.color }}
                            animate={{ height: [h, h + 4, h] }}
                            transition={{ duration: 0.5 + j * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Volume control */}
              <div className="flex items-center gap-3 mt-4">
                <button onClick={() => setMuted(!muted)} className="text-text-secondary hover:text-text-primary">
                  {muted || musicVolume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <input
                  type="range" min="0" max="1" step="0.05"
                  value={muted ? 0 : musicVolume}
                  onChange={handleVolumeChange}
                  className="flex-1"
                  style={{ accentColor: currentTrack.color }}
                />
                <span className="text-text-muted text-xs font-mono w-8 text-right">
                  {Math.round(musicVolume * 100)}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main controls bar */}
        <div className="px-5 py-3 flex items-center gap-4">
          {/* Track info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 relative"
              style={{ background: `${currentTrack.color}20` }}
            >
              <span className="text-base">{currentTrack.emoji}</span>
              {musicPlaying && (
                <div className="absolute inset-0 rounded-lg border-2 border-brand-violet animate-spin-slow opacity-40" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-text-primary text-xs font-medium truncate">{currentTrack.title}</p>
              <p className="text-text-muted text-[10px]">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Music bars when playing */}
          {musicPlaying && !loading && (
            <div className="flex gap-0.5 items-end h-5 flex-shrink-0">
              {[4, 7, 5, 8, 4, 6].map((h, i) => (
                <motion.div key={i}
                  className="w-1 rounded-full"
                  style={{ background: currentTrack.color, minHeight: 2 }}
                  animate={{ height: [h, h + 4, h] }}
                  transition={{ duration: 0.4 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
            </div>
          )}

          {loading && <Loader2 size={16} className="text-text-muted animate-spin flex-shrink-0" />}

          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary transition-colors"
              onClick={nextTrack}
              title="Next track"
            >
              <SkipForward size={14} />
            </button>

            <motion.button
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: musicPlaying
                  ? `linear-gradient(135deg, ${currentTrack.color}, ${currentTrack.color}99)`
                  : 'var(--surface-4)',
              }}
              onClick={togglePlay}
              whileTap={{ scale: 0.9 }}
            >
              {loading
                ? <Loader2 size={14} className={`animate-spin ${musicPlaying ? 'text-white' : 'text-text-primary'}`} />
                : musicPlaying
                  ? <Pause size={14} className="text-white" />
                  : <Play size={14} className="text-text-primary" />}
            </motion.button>

            <button
              className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary transition-colors"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default MusicPlayer
