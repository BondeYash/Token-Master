const { expect } = require("chai")
const { ethers } = require("hardhat")

const NAME = "TokenMaster"
const SYMBOL = "TOM"

const OCCASION_NAME = "ETH India"
const OCCASION_COST = ethers.utils.parseUnits ('1' , 'ether')
const OCCASION_MAX_TICKETS = 100
const OCCASION_DATE = "June 25"
const OCCASION_TIME = "10:00 AM INR"
const OCCASION_LOCATION = "India , Bengaluru"

describe("TokenMaster", () => {

  let tokenMaster;
  let deployer , buyer

  beforeEach (async ()=> {
    // Setup Accounts
    [deployer , buyer] = await ethers.getSigners()


    const TokenMaster = await ethers.getContractFactory("TokenMaster")
    tokenMaster = await TokenMaster.deploy(NAME,SYMBOL)
    const transaction = await tokenMaster.connect(deployer).list(
      OCCASION_NAME,OCCASION_COST,OCCASION_MAX_TICKETS,OCCASION_DATE,OCCASION_TIME,OCCASION_LOCATION
    )
    await transaction.wait()
  })
  
  describe ("Deployment" , ()=>{

    it ("Sets the name" , async()=> {
      let name = await tokenMaster.name()
      expect(name).to.equal("TokenMaster");
    })

    it ("Sets the Symbol" , async ()=> {
      let symbol = await tokenMaster.symbol()
      expect(symbol).to.equal("TOM")
    })

    it ("Sets the Owner" , async ()=> {
      expect (await tokenMaster.owner()).to.equal(deployer.address);
    })

    

  })

  describe ("Occasion" , ()=>{
    it("Updates the Occasion Count" , async ()=> {
      const totalOccasion = await tokenMaster.totalevents()
      expect(totalOccasion).to.equal(1)
    })

    it ("Returns occasions attributes" , async ()=> {
      const occasion = await tokenMaster.getOccasion(1)
      expect(occasion.id).to.equal(1)
      expect (occasion.name).to.equal(OCCASION_NAME)
      expect(occasion.cost).to.equal(OCCASION_COST)
      expect(occasion.time).to.equal (OCCASION_TIME)
      expect(occasion.date).to.equal(OCCASION_DATE)
      expect(occasion.location).to.equal(OCCASION_LOCATION)
      expect(occasion.tickets).to.equal(OCCASION_MAX_TICKETS)
    })

  })

  describe ("Minting" , ()=> {
    const ID  = 1;
    const SEAT = 50
    const AMOUNT = ethers.utils.parseUnits ('1',  'ether')
    beforeEach (async ()=>{

      const transaction = await tokenMaster.connect(buyer).mint(ID,SEAT, {value: AMOUNT});
      await transaction.wait()
      
    })

    it ("Updates the Ticket Count" , async ()=> {
      const occasion = await tokenMaster.getOccasion(1)
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS - 1)
    })

    it ("Updates the Buying Status" , async ()=> {
      const status = await tokenMaster.hasBought(ID,buyer.address)
      expect(status).to.be.equal(true)
    })

    it ("Updates the seat status" , async ()=> {
      const owner = await tokenMaster.seatTaken(ID,SEAT)
      expect(owner).to.be.equal(buyer.address)
    })

    it ("Updates overall Seating Status" , async()=> {
      const seats = await tokenMaster.getSeatsTaken(ID)
      expect(seats.length).to.be.equal(1)
      expect(seats[0]).to.be.equal(SEAT)
    })

    it ("Updates the contract Balance" , async ()=> {
      const balance = await ethers.provider.getBalance(tokenMaster.address)
      expect(balance).to.equal(AMOUNT)
    })
  })
  

  //  Testing for Withdrawing the balance must be done later

})

