import React, { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import SimplexNoise from "simplex-noise";
import "./ChatWithScrollEffect.css";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

const ChatWithScrollEffect = () => {
  useEffect(() => {
    const content = document.querySelector("#content") as HTMLElement;
    const simplex = new SimplexNoise();

    for (let i = 0; i < 500; i++) {
      const div = document.createElement("div");
      div.classList.add("circle");
      const n1 = simplex.noise2D(i * 0.003, i * 0.0033);
      const n2 = simplex.noise2D(i * 0.002, i * 0.001);

      const style = {
        transform: `translate(${n2 * 200}px) rotate(${n2 * 270}deg) scale(${3 + n1 * 2}, ${3 + n2 * 2})`,
        boxShadow: `0 0 0 .2px hsla(${Math.floor(i * 0.3)}, 70%, 70%, .6)`
      };
      Object.assign(div.style, style);
      content?.appendChild(div);
    }

    const circles = document.querySelectorAll(".circle");

    ScrollSmoother.create({
      content: "#content",
      wrapper: "#wrapper",
      smooth: 1.2,
      effects: true
    });


    const main = gsap.timeline({
      scrollTrigger: {
        scrub: 0.7,
        start: "top 25%",
        end: "bottom bottom"
      }
    });


    circles.forEach((circle) => {
      main.to(circle, {
        opacity: 1
      });
    });

    main.to(circles, {
      opacity: 1,
      x: `+=${Math.random() * 200 - 100}`,
      y: `+=${Math.random() * 200 - 100}`,
      duration: 1,
      ease: "power2.out"
    });
  }, []);

  return (
    <div id="wrapper">
      <div id="content">
        <div className="chat-box">
          {[...Array(50)].map((_, i) => (
            <div className="chat-message" key={i}>
              <strong>User:</strong> This is message {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatWithScrollEffect;
