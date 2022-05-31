import React, { FC, useEffect, useState } from "react";
import { Grid } from "@chakra-ui/react";
import { IMyJYPCard } from "../components/MyJYPCard";
import {
  mintJYPTokenContract,
  saleJYPTokenContract,
} from "../web3Config";
import SaleJYPCard from "../components/SaleJYPCard";

interface SaleJYPProps {
  account: string;
}

const SaleJYP: FC<SaleJYPProps> = ({ account }) => {
  const [saleJYPCardArray, setSaleJYPCardArray] = useState<
    IMyJYPCard[]
  >();

  const getOnSaleJYPTokens = async () => {
    try {
      const onSaleJYPTokenArrayLength = await saleJYPTokenContract.methods
        .getOnSaleJYPTokenArrayLength()
        .call();

      const tempOnSaleArray: IMyJYPCard[] = [];

      for (let i = 0; i < parseInt(onSaleJYPTokenArrayLength, 10); i++) {
        const JYPTokenId = await saleJYPTokenContract.methods
          .onSaleJYPTokenArray(i)
          .call();

        const JYPType = await mintJYPTokenContract.methods
          .JYPTypes(JYPTokenId)
          .call();

        const JYPPrice = await saleJYPTokenContract.methods
          .JYPTokenPrices(JYPTokenId)
          .call();

        tempOnSaleArray.push({ JYPTokenId, JYPType, JYPPrice });
      }

      setSaleJYPCardArray(tempOnSaleArray);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOnSaleJYPTokens();
  }, []);

  return (
    <Grid mt={4} templateColumns="repeat(4, 1fr)" gap={8}>
      {saleJYPCardArray &&
        saleJYPCardArray.map((v, i) => {
          return (
            <SaleJYPCard
              key={i}
              JYPType={v.JYPType}
              JYPPrice={v.JYPPrice}
              JYPTokenId={v.JYPTokenId}
              account={account}
              getOnSaleJYPTokens={getOnSaleJYPTokens}
            />
          );
        })}
    </Grid>
  );
};

export default SaleJYP;
