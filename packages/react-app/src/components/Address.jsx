import { Skeleton, Typography } from "antd";
import React from "react";
import Blockies from "react-blockies";

const { Text } = Typography;

/** 
  ~ What it does? ~

  Displays an address with a blockie image and option to copy address

  ~ How can I use? ~

  <Address
    address={address}
    fontSize={fontSize}
  />

  ~ Features ~

  - Provide fontSize={fontSize} to change the size of address text
**/

export default function Address(props) {
  const address = props.value || props.address;
  let displayAddress = address?.substr(0, 5) + "..." + address?.substr(-4);

  if (!address) {
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    );
  }

  if (props.minimized) {
    return (
      <span style={{ verticalAlign: "middle" }}>
        <Blockies seed={address.toLowerCase()} size={8} scale={2} />
      </span>
    );
  }

  return (
    <span>
      <span style={{ verticalAlign: "middle" }}>
        <Blockies seed={address.toLowerCase()} size={8} scale={props.fontSize ? props.fontSize / 7 : 4} />
      </span>
      <span style={{ verticalAlign: "middle", paddingLeft: 5, fontSize: props.fontSize ? props.fontSize : 28 }}>
        {props.onChange ? (
          <Text editable={{ onChange: props.onChange }} copyable={{ text: address }}>
            {displayAddress}
          </Text>
        ) : (
          <Text copyable={{ text: address }}>{displayAddress}</Text>
        )}
      </span>
    </span>
  );
}
