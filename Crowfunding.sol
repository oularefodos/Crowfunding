
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

    struct Giver {
        address giverAddr;
        uint256 amount;
    }

    event ProjectEvent(string _name, address _owner, string _imageLink, string _description, uint256 _Amount, uint256 _earn, uint256 _deadline);

// list des projets
    Project[] public projects;
    mapping (address => Giver[]) public givers;

    constructor() {

    }
// function pour la creation des projects
    function createProject(
        string memory _name,
        string memory _imageLink, 
        string memory _description, 
        uint256 _Amount, 
        uint256 _deadline)
        public 
        {
            require (!ProjectValidator(msg.sender), "impossible de creer plusieur Project");
            Project memory newProject = Project(_name, msg.sender, _imageLink, _description, _Amount, block.timestamp + (_deadline * 1 days));
            projects.push(newProject);
            emit ProjectEvent(_name , msg.sender, _imageLink, _description, _Amount, 0, _deadline);
        }
    
    function ProjectValidator(address _owner) private view returns(bool) {
        for (uint i = 0; i < projects.length; i++)
            if (projects[i].owner == _owner && block.timestamp < projects[i].deadline)
                return (true);
        return (false);
    }
// function Donateur
    function makeFunding(uint _value, address _ProjectOwer) public {
        require (ProjectValidator(_ProjectOwer), "delai expirer");
        require (msg.sender != _ProjectOwer, "Transaction impossible");
        require (_value > 0, "la somme doit est superieur a zero");
        givers[_ProjectOwer].push(Giver(msg.sender, _value));
    }
}