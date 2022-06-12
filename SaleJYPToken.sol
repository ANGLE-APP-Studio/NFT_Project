// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "MintJYPToken.sol";

contract SaleJYPToken {
    MintJYPToken public mintJYPTokenAddress;

    constructor (address _mintJYPTokenAddress) {
        mintJYPTokenAddress = MintJYPToken(_mintJYPTokenAddress);
    }

    mapping(uint256 => uint256) public JYPTokenPrices;

    uint256[] public onSaleJYPTokenArray;

    function setForSaleJYPToken(uint256 _JYPTokenId, uint256 _price) public {
        address JYPTokenOwner = mintJYPTokenAddress.ownerOf(_JYPTokenId);

        require(JYPTokenOwner == msg.sender, "Caller is not JYP Token owner!");
        require(_price > 0,"Price is zero or lower!");
        require(JYPTokenPrices [_JYPTokenId]==0,"This JYP Token is already on sale!");
        require(mintJYPTokenAddress.isApprovedForAll(JYPTokenOwner, address(this)), "JYP Token owner did not approve Token!");

        JYPTokenPrices[_JYPTokenId] = _price;

        onSaleJYPTokenArray.push(_JYPTokenId);
    }

    function purchaseJYPToken(uint256 _JYPTokenId) public payable {
        uint256 price = JYPTokenPrices[_JYPTokenId];
        address JYPTokenOnwer = mintJYPTokenAddress.ownerOf(_JYPTokenId);   //주인의 주소값 불러오기

        require(price > 0, "JYP Token Not sale!");  //0보다 작으면 판매 미등록으로 출력
        require(price <= msg.value, "Caller sent lower than price!");   //msg.value > 보내는 메틱의 양, 보내는게 가격보다 높아야함
        require(JYPTokenOnwer != msg.sender,"Caller is JYP Token owner!");  //토큰 주인이 아니여야 보낼 수 있도록 함

        //구매로직 작성//   
        payable(JYPTokenOnwer).transfer(msg.value); //가격만큼 토큰 메틱이 판매자에게 감
        mintJYPTokenAddress.safeTransferFrom(JYPTokenOnwer, msg.sender, _JYPTokenId);   //nft는 구매한 사람에게 감. 인자는 (보내는 사람, 받는사람, 뭘 보내는지)

        JYPTokenPrices[_JYPTokenId] =0;

        //가격이 0원인 것과 배열 맨 뒤의 것을 교체하고 맨뒤에 있는 것(판매한 것)을 제거//
        for(uint256 i=0; i<onSaleJYPTokenArray.length; i++){
            if(JYPTokenPrices[onSaleJYPTokenArray[i]]==0){      
                onSaleJYPTokenArray[i] = onSaleJYPTokenArray[onSaleJYPTokenArray.length -1];
                onSaleJYPTokenArray.pop();
            }
        }
    }

    //읽기 전용으로 판매중인 토큰의 길이 출력//
    function getOnsaleJYPTokenArrayLength() view public returns(uint256){
        return onSaleJYPTokenArray.length;
    }
}