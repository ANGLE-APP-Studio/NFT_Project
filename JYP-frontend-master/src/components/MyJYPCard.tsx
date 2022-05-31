import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
} from "@chakra-ui/react";
import React, { ChangeEvent, FC, useState } from "react";
import { saleJYPTokenContract, web3 } from "../web3Config";

import JYPCard from "./JYPCard";

export interface IMyJYPCard {
  JYPTokenId: string;
  JYPType: string;
  JYPPrice: string;
}

interface MyJYPCardProps extends IMyJYPCard {
  saleStatus: boolean;
  account: string;
}

const MyJYPCard: FC<MyJYPCardProps> = ({
  JYPTokenId,
  JYPType,
  JYPPrice,
  saleStatus,
  account,
}) => {
  const [sellPrice, setSellPrice] = useState<string>("");
  const [myJYPPrice, setMyJYPPrice] = useState<string>(JYPPrice);

  const onChangeSellPrice = (e: ChangeEvent<HTMLInputElement>) => {
    setSellPrice(e.target.value);
  };

  const onClickSell = async () => {
    try {
      if (!account || !saleStatus) return;

      const response = await saleJYPTokenContract.methods
        .setForSaleJYPToken(
          JYPTokenId,
          web3.utils.toWei(sellPrice, "ether")
        )
        .send({ from: account });

      if (response.status) {
        setMyJYPPrice(web3.utils.toWei(sellPrice, "ether"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box textAlign="center" w={150}>
      <JYPCard JYPType={JYPType} />
      <Box mt={2}>
        {myJYPPrice === "0" ? (
          <>
            <InputGroup>
              <Input
                type="number"
                value={sellPrice}
                onChange={onChangeSellPrice}
              />
              <InputRightAddon children="Matic" />
            </InputGroup>
            <Button size="sm" colorScheme="green" mt={2} onClick={onClickSell}>
              Sell
            </Button>
          </>
        ) : (
          <Text d="inline-block">
            {web3.utils.fromWei(myJYPPrice)} Matic
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default MyJYPCard;
