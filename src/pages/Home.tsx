import React, { useEffect, useRef } from 'react'
import VideoStream from '../utils/VideoStream'
import { useImageDataStore } from '../store'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const canvasRef = useRef<VideoStream | null>(null)
  const { setData } = useImageDataStore()

  const handleCapture = () => {
    const data = canvasRef.current?.captureImage()
    if (data) {
      setData(data)
      navigate('/verification')
    }
  }

  useEffect(() => {
    if (!containerRef.current) return
    canvasRef.current = new VideoStream(containerRef.current)
  }, [])

  return (
    <div ref={containerRef} className="p-12 bg-white ">
      <h2 className="text-3xl text-center text-blue-400 font-semibold mb-3">
        Take Selfie{' '}
      </h2>
      <video width={400} height={400} style={{ display: 'none' }} />

      <canvas />
      <div className="w-full flex justify-center">
        <button
          className="bg-orange-400 px-12  py-2  font-bold text-xl text-white mt-4 uppercase"
          onClick={handleCapture}
        >
          continue
        </button>
      </div>
    </div>
  )
}

export default Home
