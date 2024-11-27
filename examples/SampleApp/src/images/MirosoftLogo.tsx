import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function MicrosoftLogo(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <Path d='M7.57898 0H0V7.57898H7.57898V0Z' fill='#F25022' />
      <Path d='M7.57898 8.42108H0V16.0001H7.57898V8.42108Z' fill='#00A4EF' />
      <Path d='M16 0H8.42102V7.57898H16V0Z' fill='#7FBA00' />
      <Path d='M16 8.42108H8.42102V16.0001H16V8.42108Z' fill='#FFB900' />
    </Svg>
  );
}

export default MicrosoftLogo;
