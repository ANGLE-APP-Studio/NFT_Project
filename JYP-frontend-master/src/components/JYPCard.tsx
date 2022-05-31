import React, { FC } from "react";
import { Image } from "@chakra-ui/react";

interface JYPCardProps {
  JYPType: string;
}

const JYPCard: FC<JYPCardProps> = ({ JYPType }) => {
  return (
    <Image w={150} h={150} src={`images/${JYPType}.png`} alt="JYPCard" />
  );
};

export default JYPCard;
