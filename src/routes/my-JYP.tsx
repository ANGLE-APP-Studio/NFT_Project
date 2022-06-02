import { Flex, Button, Grid, Text } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import MyJYPCard, { IMyJYPCard } from "../components/MyJYPCard";
import {
  mintJYPTokenContract,
  saleJYPTokenAddress,
  saleJYPTokenContract,
} from "../web3Config";
import axios from 'axios';

interface MyJYPProps {
  account: string;
}

const MyJYP: FC<MyJYPProps> = ({ account }) => {
  const [JYPCardArray, setJYPCardArray] = useState<IMyJYPCard[]>();
  const [saleStatus, setSaleStatus] = useState<boolean>(false);

  const getJYPTokens = async () => {
    try {
      const balanceLength = await mintJYPTokenContract.methods
        .balanceOf(account)
        .call();

      if (balanceLength === "0") return;

      const tempJYPCardArray: IMyJYPCard[] = [];

      const response = await mintJYPTokenContract.methods
        .getJYPTokens(account)
        .call();

      response.map((v: IMyJYPCard) => {
        tempJYPCardArray.push({
          JYPTokenId: v.JYPTokenId,
          JYPType: v.JYPType,
          JYPPrice: v.JYPPrice,
        });
      });

      setJYPCardArray(tempJYPCardArray);
    } catch (error) {
      console.error(error);
    }
  };
  const getIsApprovedForAll = async () => {
    try {
      const response = await mintJYPTokenContract.methods
        .isApprovedForAll(account, saleJYPTokenAddress)
        .call();

      if (response) {
        setSaleStatus(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onClickApproveToggle = async () => {
    try {
      if (!account) return;

      const response = await mintJYPTokenContract.methods
        .setApprovalForAll(saleJYPTokenAddress, !saleStatus)
        .send({ from: account });

      if (response.status) {
        setSaleStatus(!saleStatus);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!account) return;

    getIsApprovedForAll();
    getJYPTokens();
  }, [account]);

  return (
    <>
      <Flex alignItems="center">
        <Text display="inline-block">
          Sale Status : {saleStatus ? "True" : "False"}
        </Text>
        <Button
          size="xs"
          ml={2}
          colorScheme={saleStatus ? "red" : "blue"}
          onClick={onClickApproveToggle}
        >
          {saleStatus ? "Cancel" : "Approve"}
        </Button>
      </Flex>
      <Grid templateColumns="repeat(4, 1fr)" gap={8} mt={4}>
        {JYPCardArray &&
          JYPCardArray.map((v, i) => {
            return (
              <MyJYPCard
                key={i}
                JYPTokenId={v.JYPTokenId}
                JYPType={v.JYPType}
                JYPPrice={v.JYPPrice}
                saleStatus={saleStatus}
                account={account}
              />
            );
          })}
      </Grid>
    </>
  );
};

export default MyJYP;
