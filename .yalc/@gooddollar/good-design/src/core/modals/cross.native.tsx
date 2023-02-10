import * as React from "react";
import Svg, { Path } from "react-native-svg";

const CrossIcon = () => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
  >
    <Path
      fill="#696D73"
      d="m8.627 10.924-3.32 3.32-1.819-1.82 3.32-3.32L3.32 5.616l1.894-1.894L8.702 7.21l3.32-3.32 1.82 1.82-3.32 3.32 3.488 3.488-1.894 1.894-3.489-3.488z"
    />
  </Svg>
);

export default CrossIcon;
