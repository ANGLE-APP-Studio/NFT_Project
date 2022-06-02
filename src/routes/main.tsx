import React, { FC, useState } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { mintJYPTokenContract } from "../web3Config";
import JYPCard from "../components/JYPCard";
import axios from 'axios';

interface MainProps {
  account: string;
}

const Main: FC<MainProps> = ({ account }) => {
  const [newJYPType, setNewJYPType] = useState<string>();

  const onClickMint = async () => {
    try {
      if (!account) return;

      const response = await mintJYPTokenContract.methods
        .mintJYPToken()
        .send({ from: account });

      if (response.status) {
        const balanceLength = await mintJYPTokenContract.methods
          .balanceOf(account)
          .call();

        const JYPTokenId = await mintJYPTokenContract.methods
          .tokenOfOwnerByIndex(account, parseInt(balanceLength, 10) - 1)
          .call();

        const JYPType = await mintJYPTokenContract.methods
          .JYPTypes(JYPTokenId)
          .call();

        setNewJYPType(JYPType);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex
      w="full"
      h="100vh"
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <Box>
        {newJYPType ? (
          <JYPCard JYPType={newJYPType} />
        ) : (
          <Text>Let's mint JYP Card!!!</Text>
        )}
      </Box>
      <Button mt={4} size="sm" colorScheme="blue" onClick={onClickMint}>
        Mint
      </Button>
    </Flex>
  );
};

export default Main;
