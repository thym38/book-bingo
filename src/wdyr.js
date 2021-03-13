// https://www.npmjs.com/package/@welldone-software/why-did-you-render#tracking-components

import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  console.log("hello why did u render");
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}