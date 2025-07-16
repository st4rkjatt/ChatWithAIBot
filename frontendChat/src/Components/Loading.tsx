import React from "react";

function Loading() {
  return (
    <>
      <style>
        {`
          .loader {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: row;
          }

          .slider {
            overflow: hidden;
            background-color: white;
            margin: 0 15px;
            height: 85px;
            width: 16px;
            border-radius: 15px;
            box-shadow: 15px 15px 20px rgba(0, 0, 0, 0.1), -15px -15px 30px #fff,
                inset -5px -5px 10px rgba(0, 0, 255, 0.1),
                inset 5px 5px 10px rgba(0, 0, 0, 0.1);
            position: relative;
            transform: translateY(-7px);
          }

          .slider::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            height: 25px;
            width: 25px;
            border-radius: 100%;
            box-shadow: inset 0px 0px 0px rgba(0, 0, 0, 0.3), 0px 420px 0 400px #FF6B6B,
                inset 0px 0px 0px rgba(0, 0, 0, 0.1);
            animation: animate-2 2s ease-in-out infinite;
            animation-delay: calc(-1s * var(--i));
          }

          @keyframes animate-2 {
            0% {
              transform: translateY(60px);
              filter: hue-rotate(0deg);
            }

            50% {
              transform: translateY(0);
            }

            100% {
              transform: translateY(60px);
              filter: hue-rotate(360deg);
            }
          }
        `}
      </style>
      <section className="loader">
        <div className="slider" style={{ ["--i" as any]: 0 } as React.CSSProperties}></div>
        <div className="slider" style={{ ["--i" as any]: 1 } as React.CSSProperties}></div>
        <div className="slider" style={{ ["--i" as any]: 2 } as React.CSSProperties}></div>
        <div className="slider" style={{ ["--i" as any]: 3 } as React.CSSProperties}></div>
      </section>
    </>
  );
}

export default Loading;