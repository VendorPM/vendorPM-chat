import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

export function VendorPmLogo(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox='0 0 32 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <Rect width={32} height={32} rx={16} fill='#0B62DF' />
      <Path d='M23 7.5l-7.278 17H13.33L9 14.396h2.365l3.145 7.457L20.603 7.5H23z' fill='#fff' />
    </Svg>
  );
}

export default VendorPmLogo;
