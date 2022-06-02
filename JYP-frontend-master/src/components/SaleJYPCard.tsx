import { Box, Button, Text } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import {
  mintJYPTokenContract,
  saleJYPTokenContract,
  web3,
} from "../web3Config";
import JYPCard from "./JYPCard";
import axios from 'axios';

interface SaleJYPCardProps {
  JYPType: string;
  JYPPrice: string;
  JYPTokenId: string;
  account: string;
  getOnSaleJYPTokens: () => Promise<void>;
}

const SaleJYPCard: FC<SaleJYPCardProps> = ({
  JYPType,
  JYPPrice,
  JYPTokenId,
  account,
  getOnSaleJYPTokens,
}) => {
  const [isBuyable, setIsBuyable] = useState<boolean>(false);

  const getJYPTokenOnwer = async () => {
    try {
      const response = await mintJYPTokenContract.methods
        .ownerOf(JYPTokenId)
        .call();

      setIsBuyable(
        response.toLocaleLowerCase() === account.toLocaleLowerCase()
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onClickBuy = async () => {
    try {
      if (!account) return;

      const response = await saleJYPTokenContract.methods
        .purchaseJYPToken(JYPTokenId)
        .send({ from: account, value: JYPPrice });

      if (response.status) {
        getOnSaleJYPTokens();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getJYPTokenOnwer();
  }, []);

  return (
    <Box textAlign="center" w={150}>
      <JYPCard JYPType={JYPType} />
      <Box>
        <Text d="inline-block">{web3.utils.fromWei(JYPPrice)} Matic</Text>
        <Button
          size="sm"
          colorScheme="green"
          m={2}
          disabled={isBuyable}
          onClick={onClickBuy}
        >
          Buy
        </Button>
      </Box>
    </Box>
  );
};

export default SaleJYPCard;
