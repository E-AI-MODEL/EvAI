import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
`;

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let connections = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = this.getRandomColor();
      }

      getRandomColor() {
        const colors = [
          'rgba(96, 165, 250, 0.5)',  // Blue
          'rgba(52, 211, 153, 0.5)',  // Green
          'rgba(251, 191, 36, 0.5)',  // Yellow
          'rgba(248, 113, 113, 0.5)', // Red
          'rgba(167, 139, 250, 0.5)'  // Purple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    class Connection {
      constructor(particle1, particle2) {
        this.particle1 = particle1;
        this.particle2 = particle2;
        this.opacity = 0.1;
      }

      draw() {
        const dx = this.particle1.x - this.particle2.x;
        const dy = this.particle1.y - this.particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(this.particle1.x, this.particle1.y);
          ctx.lineTo(this.particle2.x, this.particle2.y);
          ctx.stroke();
        }
      }
    }

    const init = () => {
      particles = [];
      connections = [];
      
      // Create particles
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
      }

      // Create connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          connections.push(new Connection(particles[i], particles[j]));
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      connections.forEach(connection => connection.draw());

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    init();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      init();
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <Canvas ref={canvasRef} />;
};

export default AnimatedBackground; 