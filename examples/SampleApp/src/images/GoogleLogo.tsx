import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function GoogleLogo(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <Path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M15.68 8.1819C15.68 7.61462 15.6291 7.06917 15.5346 6.54553H8.00002V9.64008H12.3055C12.12 10.6401 11.5564 11.4874 10.7091 12.0546V14.0619H13.2946C14.8073 12.6692 15.68 10.6183 15.68 8.1819Z'
        fill='#4285F4'
      />
      <Path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M8.00001 16C10.16 16 11.9709 15.2836 13.2946 14.0618L10.7091 12.0545C9.99274 12.5345 9.07638 12.8181 8.00001 12.8181C5.91638 12.8181 4.15274 11.4109 3.52365 9.51996H0.850922V11.5927C2.16729 14.2072 4.87274 16 8.00001 16Z'
        fill='#34A853'
      />
      <Path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M3.52365 9.52001C3.36365 9.04001 3.27274 8.52729 3.27274 8.00001C3.27274 7.47274 3.36365 6.96001 3.52365 6.48001V4.40729H0.850924C0.309106 5.48729 1.52588e-05 6.70911 1.52588e-05 8.00001C1.52588e-05 9.29092 0.309106 10.5127 0.850924 11.5927L3.52365 9.52001Z'
        fill='#FBBC05'
      />
      <Path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M8.00001 3.18182C9.17456 3.18182 10.2291 3.58545 11.0582 4.37818L13.3527 2.08364C11.9673 0.792727 10.1564 0 8.00001 0C4.87274 0 2.16729 1.79273 0.850922 4.40727L3.52365 6.48C4.15274 4.58909 5.91638 3.18182 8.00001 3.18182Z'
        fill='#EA4335'
      />
    </Svg>
  );
}

export default GoogleLogo;
