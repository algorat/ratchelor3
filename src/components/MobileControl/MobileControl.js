import "./MobileControl.css";

import React, { useState, useEffect } from "react";

export function MobileControl(props) {
  const [mobileMode, setMobileMode] = useState(false);

  useEffect(() => {
    const watchMobile = window.matchMedia("only screen and (hover: none)");
    setMobileMode(watchMobile.matches);
  }, []);

  console.log(mobileMode, props);

  if (!mobileMode && !props.show) {
    return <>{props.children}</>;
  } else if (mobileMode && props.show) {
    return (
      <div className="mobile-container">
        {(props.header || props.children) && (
          <div className="mobile-control">
            {props.header && (
              <div className="mobile-control-header">{props.header}</div>
            )}
            {props.children && (
              <div className="mobile-control-content">{props.children}</div>
            )}
          </div>
        )}
        <div className="mobile-cta-container">{props.ctaButton}</div>
      </div>
    );
  }
}
