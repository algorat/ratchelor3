import "./Credits.css";

import React from "react";
import { MobileControl } from "../MobileControl/MobileControl";

export function Credits(props) {
  const cta = (
    <div className="credits-cta">
      <a
        href="https://www.instagram.com/alg0rat/"
        target="_blank"
        rel="noreferrer"
      >
        <button>Follow our Instagram for updates</button>
      </a>
      <a href="https://ko-fi.com/alg0rat" target="_blank" rel="noreferrer">
        <button>Donate if you enjoyed</button>
      </a>
      <button onClick={props.reset}>Play again?</button>
    </div>
  );

  return (
    <>
      <div className="credits-screen screen">
        <MobileControl show={false} mobileMode={props.mobileMode}>
          <header>{cta}</header>
        </MobileControl>
        <div className="content">
          <h2>Credits</h2>
          <h3 className="heading-medium">Game design, art and programming</h3>
          <p>This game was created by the algorat art collective.</p>
          <ul>
            <li>
              <a href="https://algorat.club" target="_blank" rel="noreferrer">
                Our website
              </a>
            </li>
            <li>
              {"Find us on "}
              <a
                href="https://www.instagram.com/alg0rat/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram @alg0rat
              </a>
              {" or "}
              <a
                href="https://twitter.com/alg0rat"
                target="_blank"
                rel="noreferrer"
              >
                Twitter @alg0rat
              </a>
            </li>
            <li>
              <a
                href="https://www.redbubble.com/people/algorat/shop"
                target="_blank"
                rel="noreferrer"
              >
                We sell Ratchelor stickers!
              </a>
            </li>
            <li>
              Members: Tatyana (
              <a
                href="https://www.instagram.com/poorly_documented/"
                target="_blank"
                rel="noreferrer"
              >
                @poorly_documented
              </a>
              ), Connie (
              <a
                href="https://www.instagram.com/c0n5tants/"
                target="_blank"
                rel="noreferrer"
              >
                @c0n5tants
              </a>
              ), Caroline (
              <a
                href="https://www.tiktok.com/@caromaker/"
                target="_blank"
                rel="noreferrer"
              >
                @caromaker
              </a>
              ), Char (
              <a
                href="https://www.instagram.com/charstiles/"
                target="_blank"
                rel="noreferrer"
              >
                @charstiles
              </a>
              )
            </li>
          </ul>
          <h3 className="heading-medium">Ending art guest artists</h3>
          <ul>
            <li>
              Swalorn -{" "}
              <a
                href="https://www.instagram.com/wombleman/"
                target="_blank"
                rel="noreferrer"
              >
                Jeremy @wombleman
              </a>
            </li>
            <li>
              Oedimb and Hammerton -{" "}
              <a
                href="https://kmchaudoin.com/"
                target="_blank"
                rel="noreferrer"
              >
                Kate Chaudoin kmchaudoin.com
              </a>
            </li>
            <li>
              Pamplemouse and Thundercroft -{" "}
              <a
                href="https://www.instagram.com/lassylaa/"
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                Alyssa @lassylaa
              </a>
            </li>
          </ul>
          <h3 className="heading-medium">Music & Sound Effects</h3>
          <ul>
            <li>
              <a
                href="https://www.youtube.com/c/audiolibrary-channel"
                target="_blank"
                rel="noreferrer"
              >
                Music - Youtube Audio Library
              </a>
            </li>
            <li>
              {"Sound effects - "}
              <a href="https://freesound.org/" target="_blank" rel="noreferrer">
                Freesound
              </a>
              {" and "}
              <a href="https://mixkit.co/" target="_blank" rel="noreferrer">
                Mixkit.co
              </a>
            </li>
          </ul>
        </div>
      </div>
      <MobileControl
        show={true}
        ctaButton={cta}
        mobileMode={props.mobileMode}
      ></MobileControl>
    </>
  );
}
