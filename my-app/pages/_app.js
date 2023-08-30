import React from 'react';
import PropTypes from 'prop-types';
import Script from 'next/script';
import { useEffect } from 'react';


export default function App({ Component, pageProps }) {
  useEffect(() => {
    window.OneSignal = window.OneSignal || [];
  OneSignal.push(function() {
    OneSignal.init({
      appId: "016ffeea-943d-48c4-ac55-d391d4165570",
      safari_web_id: "web.onesignal.auto.3d5e9a66-9429-4fce-a7e3-61aa58d6c253",
      notifyButton: {
        enable: true,
      },
      allowLocalhostAsSecureOrigin: true,
    });
  });

    return () => {
        window.OneSignal = undefined;
    };
}, []);
  return (
    <>
    {/* <Script
          src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
          async=""
        /> */}
    <Script src="https://kit.fontawesome.com/e82babc1cf.js" crossorigin="anonymous"/>
      <Component {...pageProps} />
      {/* <Navbar /> */}
    </>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
