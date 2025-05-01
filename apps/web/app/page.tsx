'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import Orb from '@/components/Orb';

const Landing: React.FC = () => {
  const duckRef = useRef<HTMLDivElement | null>(null);
  const [, setShowButton] = useState(true);
  const radius = 200;
  const initialTransform = 'translate(-50%, -50%) rotate(30deg)';

  const scrollToSection = () => {
    const section = document.getElementById('whyus');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Duck movement logic remains the same
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (duckRef.current) {
        const duck = duckRef.current;
        const duckRect = duck.getBoundingClientRect();
        const duckCenterX = duckRect.left + duckRect.width / 2;
        const duckCenterY = duckRect.top + duckRect.height / 2;

        const dx = event.clientX - duckCenterX;
        const dy = event.clientY - duckCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
          const moveX = (dx / distance) * 30;
          const moveY = (dy / distance) * 30;
          duck.style.transform = `translate(-50%, -50%) translate(${-moveX}px, ${-moveY}px) rotate(30deg)`;
        } else {
          duck.style.transform = initialTransform;
        }
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowButton(false);
      } else {
        setShowButton(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <section className="bg-black overflow-hidden h-screen flex flex-col">
        <div className="h-[60vh] relative flex flex-col items-center">
          <h1 className="text-white text-[8vw] font-bold text-center pt-12 relative z-20">
            Graphy
          </h1>
          
          {/* Orb positioned between texts */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-10">
            <Orb
              hoverIntensity={0.5}
              rotateOnHover={true}
              hue={0}
              forceHoverState={false}
            />
          </div>
          
          {/* Centered duck */}
          <div
            ref={duckRef}
            className="absolute top-1/2 left-1/2 w-[15vw] h-[15vw] min-w-[200px] min-h-[200px] pointer-events-none transition-transform duration-200 ease-in-out z-20"
            style={{
              backgroundImage: 'url(/prismduck.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transform: initialTransform,
            }}
          />
          
          <h2 className="text-white text-[6vw] font-bold text-center mt-auto relative z-20">
            Your second brain
          </h2>
        </div>

        <div className="h-[40vh] flex justify-center items-center">
          <Button
            onClick={scrollToSection}
            className="min-w-[120px] bg-white text-black hover:bg-gray-100 font-bold rounded-full z-20"
          >
            Why Us?
          </Button>
        </div>
      </section>

      <section id="whyus" className="h-screen bg-black text-white flex flex-col gap-4 p-8">
        <h2 className="text-[4vw] font-bold">Features</h2>

        <Card className="bg-transparent border-white/10">
          <CardContent className="p-6">
            <p className="text-[3vw] font-medium">
              Learn faster with Socrates Method
            </p>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-white/10">
          <CardContent className="p-6">
            <p className="text-[3vw] font-medium">
              Proof Of Learning with Badgepa.cc
            </p>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-white/10">
          <CardContent className="p-6">
            <p className="text-[3vw] font-medium">
              Get hired faster with contests and bounties
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default Landing;