
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract Crowfunding {

// information sur la creation du project

    struct Project {
        bool isDone;
        string name;
        uint256 index;
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

// les evenemnts

    event ProjectEvent(
        string _name, 
        address _owner, 
        string _imageLink, 
        string _description, 
        uint256 _Amount, 
        uint256 _deadline);

    event currentAmountEvent(uint256 _currentAmount);

    event isDoneEvent(bool isDone);
    event depositEvent(uint balance);

// list des projets
    Project[] projects;
    address private Owner;
    uint256 n;
    mapping (address => Project) public StructProject;
    mapping (address => Giver[]) public givers;
    mapping (address => uint256) private balance;

    constructor() {
        Owner = msg.sender;
    }

    function getContractBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function getBalance() public view returns(uint256) {
        return balance[msg.sender];
    }

    function getAllCompagn() external view returns (Project[] memory) {
        return projects;
    }

    fallback() external payable {

    }

    receive() external payable {
        balance[msg.sender] += msg.value;
        emit depositEvent(balance[msg.sender]);
    }

    function exist(address _addr) public view returns(bool) {
        if (StructProject[_addr].owner == address(0))
            return (false);
        else
            return (true);
    }

//function pour la creation des projects
    function createCampaign(
        string memory _name,
        string memory _imageLink, 
        string memory _description, 
        uint256 _Amount, 
        uint256 _deadline)
        public 
        {
            require (!exist(msg.sender), "vous avez deja creer un projet");
            StructProject[msg.sender] = Project(false, _name, n, payable(msg.sender), _imageLink, _description, _Amount, block.timestamp + (_deadline * 1 days), 0);
            projects.push(StructProject[msg.sender]);
            n++;
            emit ProjectEvent(_name , msg.sender, _imageLink, _description, _Amount, _deadline);
            emit currentAmountEvent(0);
        }

// check if the project is done

    function ft_isDone(address _projectOwner) internal returns (bool){
        if (block.timestamp >= StructProject[_projectOwner].deadline)
            putDone(_projectOwner);
        return StructProject[_projectOwner].isDone;
    }

// function pour signaler que mette le project a done

    function putDone(address _projectOwner) internal {
          StructProject[_projectOwner].isDone = true;
          projects[StructProject[_projectOwner].index].isDone = true;
          emit isDoneEvent(true);
    }
// faire un don
    function donate(uint _value, address _ProjectOwer) public {
        require (_value > 0, "tranfert impossible");
        require (balance[msg.sender] > _value, "somme insufisant");
        require (msg.sender != _ProjectOwer, "operation impossible");
        require (!ft_isDone(_ProjectOwer), "Delai expirer");
        givers[_ProjectOwer].push(Giver(payable(msg.sender), _value));
        StructProject[_ProjectOwer].currentAmount += _value;
        projects[StructProject[_ProjectOwer].index].currentAmount += _value;
        balance[msg.sender] -= _value;
        if (StructProject[_ProjectOwer].currentAmount >= StructProject[_ProjectOwer].Amount)
            putDone(_ProjectOwer);
        emit currentAmountEvent(StructProject[_ProjectOwer].currentAmount);
        emit depositEvent(balance[msg.sender]);
    }
// faire un virement dans son portfeuil
    function payOwnerProject() external {
        require (StructProject[msg.sender].owner != address(0), "impossible de faire une autre demande");
        require (ft_isDone(msg.sender), "Pas encore fini");
        require (StructProject[msg.sender].currentAmount > 0, "transfert impossible");
        uint256 currentAmount = StructProject[msg.sender].currentAmount;
        StructProject[msg.sender].currentAmount = 0;
        balance[msg.sender] += currentAmount;
        emit depositEvent(balance[msg.sender]);
    }

    function payOut(uint256 _value) external payable {
        require (balance[msg.sender] >= _value, "solde insufisant");
        require (_value > 0, "tranfert impossible");
        balance[msg.sender] -= _value;
        payable(msg.sender).transfer(_value);
        emit depositEvent(balance[msg.sender]);
    }
}
