import "./MobileControl.css";

import React from "react";

export function MobileControl(props) {
  if (!props.mobileMode && !props.show) {
    return <>{props.children}</>;
  } else if (props.mobileMode && props.show) {
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
