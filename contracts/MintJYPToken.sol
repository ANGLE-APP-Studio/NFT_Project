// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0; //솔리디티 사용

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";   //ERC721구격 명시

contract MintJYPToken is ERC721Enumerable {
    constructor() ERC721("JYPUser", "HAS") {}

    mapping(uint256 => uint256) public JYPTypes;   //토큰아이디 입력하면 지정한 번호의 jyptypes이 나오는 mapping 작성


    function mintJYPToken() public {
        uint256 JYPTokenId = totalSupply() + 1; //민팅아이디

        uint256 JYPType = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, JYPTokenId))) % 5 + 1;    //nft 랜덤 출력

        JYPTypes[JYPTokenId] = JYPType;

        _mint(msg.sender, JYPTokenId);  //민트시 명령어를 실행한 사람과, JYP토큰ID(nft 증명하는 토큰 id) 가져옴
    }
}