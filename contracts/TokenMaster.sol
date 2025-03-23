// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenMaster is ERC721 {

    address public owner;
    uint256 public totalevents;
    uint256 public totalSupply;
    
    struct Occasion {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    mapping (uint => Occasion) occasions;
    mapping(uint256 => mapping(uint256=> address)) public seatTaken;
    mapping (uint256=>uint256 []) seatsTaken;
    mapping(uint256 => mapping(address => bool)) public hasBought;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    modifier onlyOwner () {
        require(msg.sender == owner , "Only Owner can create Event");
        _;
    }

    function list (
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location) public onlyOwner
    {
        totalevents++;
        occasions[totalevents] = Occasion(totalevents,_name,_cost,_maxTickets,_maxTickets,_date,_time,_location);

    }

    function mint (uint256 _id , uint256 _seat ) public payable {
        require(_id !=0 );

        require(_id<= totalevents);

        require(msg.value >= occasions[_id].cost);

        require(seatTaken[_id][_seat] == address(0));
        require(_seat <= occasions[_id].maxTickets);

        occasions[_id].tickets-= 1;
        hasBought[_id][msg.sender] = true;
        seatTaken[_id][_seat] = msg.sender;
        seatsTaken[_id].push(_seat);
        totalSupply ++;

        _safeMint(msg.sender , totalSupply);
    }

    function getSeatsTaken (uint _id) public view returns (uint256[] memory) {
        return seatsTaken[_id];
    }

    function getOccasion (uint _id) public view returns (Occasion memory) {
        return occasions[_id];
    }

    function withdraw () public onlyOwner {
        (bool success ,) = owner.call {value: address(this).balance}("");
        require(success);
    }

    


}
