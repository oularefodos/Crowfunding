
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract Crowfunding {

// information sur la creation du project
    struct Project {
        string name;
        address owner;
        string imageLink;
        string description;
        uint256 Amount;
        uint256 deadline;
    }

// information sur le financier

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract Crowfunding {

// information sur la creation du project
    struct Project {
        string name;
        address payable owner;
        string imageLink;
        string description;
        uint256 Amount;
        uint256 deadline;
        uint256 currentAmount;
    }

// information sur le financier

    struct Giver {
        address payable giverAddr;
        uint256 amount;
    }

    event ProjectEvent(string _name, address _owner, string _imageLink, string _description, uint256 _Amount, uint256 _deadline);
    event currentAmountEvent(uint256 _currentAmount);

// list des projets
    Project[] public projects;
    mapping (address => Project) public StructProject;
    mapping (address => Giver[]) public givers;

    constructor() {
    }

    function get() public view returns(uint256) {
        return address(this).balance;
    }
//function pour la creation des projects
    function createProject(
        string memory _name,
        string memory _imageLink, 
        string memory _description, 
        uint256 _Amount, 
        uint256 _deadline)
        public 
        {
            require (StructProject[msg.sender].owner == address(0), "Imposible de creer deux campagnes a la fois");
            StructProject[msg.sender] = Project(_name, payable(msg.sender), _imageLink, _description, _Amount, block.timestamp + (_deadline * 1 days), 0);
            projects.push(StructProject[msg.sender]);
            emit ProjectEvent(_name , msg.sender, _imageLink, _description, _Amount, _deadline);
            emit currentAmountEvent(0);
        }
    fallback() external payable {

    }
    receive() external payable {

    }
    
  

    function makeFunding(uint _value, address _ProjectOwer) public {
        require (_value > 0, "somme insufisant");
        require (msg.sender != _ProjectOwer, "operation impossible");
        require (block.timestamp < StructProject[_ProjectOwer].deadline, "operation impossible");
        givers[_ProjectOwer].push(Giver(payable(msg.sender), _value));
        StructProject[_ProjectOwer].currentAmount += _value;
        emit currentAmountEvent(StructProject[_ProjectOwer].currentAmount);
    }

function payOwnerProject() external payable {
    require (StructProject[msg.sender].Amount <= StructProject[msg.sender].currentAmount, "objectif non atteint");
    uint payValue= StructProject[msg.sender].currentAmount;
    payable(msg.sender).transfer(payValue * 10**18);
   }
}
