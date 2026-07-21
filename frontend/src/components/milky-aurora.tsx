"use client"

import { useEffect, useRef } from "react"
import { useMotionValue, useSpring } from "framer-motion"

export function MilkyAurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Cursor tracking for the subtle spotlight
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    
    // Canvas dimensions
    let width = window.innerWidth
    let height = window.innerHeight

    // Mouse state
    let mouse = { x: -1000, y: -1000 }

    const init = () => {
      canvas.width = width
      canvas.height = height
      particles = []
      // Number of particles depends on screen size to maintain density
      const numParticles = Math.floor((width * height) / 15000)
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle())
      }
    }

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.radius = Math.random() * 1.5 + 0.5
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1
        if (this.y < 0 || this.y > height) this.vy *= -1
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(10, 10, 10, 0.1)" // Very faint dark dots
        ctx.fill()
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      
      // Update and draw particles
      particles.forEach((p) => {
        p.update()
        p.draw()
      })

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Connect particles to each other if close
          if (distance < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(10, 10, 10, ${0.05 - distance / 120 * 0.05})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }

        // Connect particles to mouse if close (Interactive 3D feel)
        const dxMouse = particles[i].x - mouse.x
        const dyMouse = particles[i].y - mouse.y
        const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)

        if (distanceMouse < 180) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(10, 10, 10, ${0.15 - distanceMouse / 180 * 0.15})`
          ctx.lineWidth = 1
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      init()
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    init()
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mouseX, mouseY])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-background">
      {/* Interactive Network Graph Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
      />
      
      {/* Subtle Gradient Overlays to keep it looking like a fresh web page, not a raw canvas */}
      <div className="absolute top-0 inset-x-0 h-[50vh] bg-gradient-to-b from-background to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-[50vh] bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}
