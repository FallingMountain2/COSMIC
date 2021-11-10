//Classes will go up here, if I make any.

//Your save file! If you need to save and somehow I broke the Export button, copy the game variable.
var game = {
	money: new Decimal(0),
	rocket:{
		active:false,
		fuel: new Decimal(25),
		maxFuel: new Decimal(25),
		speed: new Decimal(0.001),
		exchangeRate: new Decimal(1000),
		coolDown: new Decimal(4),
		cdActive: false,
		upgrade: [0,0,0,0],
		cost: [new Decimal(50),new Decimal(50),new Decimal(50),new Decimal(50)],
		costMult: [1.35, 1.2, 1.3, 1.2],
		costMultInc: [0.05, 0.05, 0.1, 0.05],
		heightMax: new Decimal(1),
		launched: new Decimal(0),
		time: new Decimal(0),
	},
	alpha:{
		resets:0,
		shards: new Decimal(0),
		alphonium: new Decimal(0),
		totalAlphonium: new Decimal(0),
		upgrades:[],
		repeatUps:[0, 0, 0, 0],
		cost:[new Decimal(10), new Decimal(10), new Decimal(10), new Decimal(10)],
		costMult:[3, 3, 5, 10],
		launchMult: new Decimal(0),
		time: new Decimal(0),
		boostMac:{
			
		},
		challenges: {
			
			
		},
		assistants: {
			
			
			
		},
	},
	totalMoney:new Decimal(0),
	
}
const scientific = new ADNotations.ScientificNotation();
//A general getElement function.
function ge(x) {
	return document.getElementById(x)
}
//Launching the rocket.
function rocketLaunch() {
	if (game.rocket.active == false && game.rocket.cdActive == false) {
		game.rocket.active = true;
		game.rocket.launched = game.rocket.launched.plus(1);
	}
}
//Getting the rocket's current height.
function getHeight() {
	var height = game.rocket.maxFuel.sub(game.rocket.fuel).times(game.rocket.speed);
	if (height.gte(1)) height = height.minus(1).times(10).pow(3/4).div(10).plus(1);
	if (height.gte(2)) height = height.minus(2).times(20).pow(3/4).div(20).plus(2);
	if (height.gte(game.rocket.heightMax)) height = game.rocket.heightMax;
	return height;
}
//Increases your money.
function incMoney() {
	if (game.rocket.fuel.gt(0)) {
		game.money = game.money.plus(getNetaGain());
		game.totalMoney = game.totalMoney.plus(getNetaGain());
		game.rocket.fuel = game.rocket.fuel.minus(getConsumption());
	}
	if (game.rocket.fuel.lte(0)) {
		game.rocket.fuel = new Decimal(0);
		game.rocket.active = false;
		game.rocket.cdActive = true;
	}
}
//Refuels your rocket after a launch is finished.
function refuel() {
	if (game.rocket.fuel.lt(game.rocket.maxFuel)) {
		game.rocket.fuel = game.rocket.fuel.plus(game.rocket.coolDown/30);
	}
	if (game.rocket.fuel.gte(game.rocket.maxFuel)) {
		game.rocket.cdActive = false;
	}
}

//Upgrading the rocket. The upgrading is simple, but it starts to get difficult later.
function upgrade(id) {
	if (id >= 0 && id <= 3) {
		if (game.money.gte(game.rocket.cost[id]) && game.rocket.active == false) {
			game.money = game.money.minus(game.rocket.cost[id]);
			game.rocket.upgrade[id]++
		}
		initUpgrades();
		if (id == 2) game.rocket.cdActive = true;
	}
	if (id >= 4 && id <= 7) {
		if (game.alpha.alphaShards.gte(game.alpha.cost[id]) && game.rocket.active == false) {
			game.alpha.alphaShards = game.alpha.alphaShards.minus(game.alpha.cost[id-4]);
			game.alpha.repeatUps[id-4]++;
		}
		initUpgrades();
	}
}
function getUpgradeCost(id) {
	var costMult = Decimal.add(game.rocket.costMult[id], Decimal.mul(game.rocket.costMultInc[id], game.rocket.upgrade[id]));
	var cost = Decimal.mul(50, Decimal.pow(costMult, game.rocket.upgrade[id]));
	return cost;
}
function updateCostMults() {
	game.rocket.costMult = [1.2, 1.1, 1.25, 1.35];
	game.rocket.costMultInc = [0.025, 0.03, 0.1, 0.1];
	game.rocket.coolDown = new Decimal(5).plus(game.rocket.upgrade[2]);
	if (game.rocket.upgrade[2] == 15) game.rocket.costMultInc[2] = 0.2;
}
//Get the neta gain. Also the first time I use a while loop in a long time.
function getNetaGain() {
	var moneyTemp  = getHeight().div(30).times(game.rocket.exchangeRate)
	var iterations = 0
	while(Decimal.log10(moneyTemp) > 100) {
		moneyTemp = moneyTemp.div(1e100);
		moneyTemp = moneyTemp.pow(0.8);
		iterations++;
	}
	moneyTemp = moneyTemp.times(Decimal.pow(1e100, iterations));
	return moneyTemp;
}
//Initializes the upgrades.
function initUpgrades() {
	initSpeed();
	initFuel();
	initExchangeRate();
	initMaxHeight();
}
//Initialize speed
function initSpeed() {
	//Buffs
	game.rocket.speed = Decimal.add("1e-3", new Decimal("3e-4").times(game.rocket.upgrade[1]));
	game.rocket.speed = game.rocket.speed.times(Decimal.pow(1.12, game.rocket.upgrade[1]));
}
//Init Fuel
function initFuel() {
	//Buffs
	game.rocket.maxFuel = Decimal.add(25, Decimal.mul(5, game.rocket.upgrade[2]));
}
//Init Exchange Rate
function initExchangeRate() {
	//Multipliers
	game.rocket.exchangeRate = Decimal.add(250, Decimal.mul(75, game.rocket.upgrade[0]));
	game.rocket.exchangeRate = game.rocket.exchangeRate.times(Decimal.pow(1.3, game.rocket.upgrade[0]));
	if (getHeight().gte(2)) game.rocket.exchangeRate = game.rocket.exchangeRate.times(getHeight().minus(2).times(10).pow(1.5).div(10));
	if (game.rocket.maxFuel.gte(100)) game.rocket.exchangeRate = game.rocket.exchangeRate.times(10);
}
//Init Height Exponent
function initMaxHeight() {
	game.rocket.heightMax = Decimal.add(0.5, Decimal.mul(0.1, Decimal.pow(game.rocket.upgrade[3],1.5)));
}
//Get the fuel consumption rate
function getConsumption() {
	return Decimal.mul(0.1, Decimal.pow(0.95, game.alpha.repeatUps[2]));
}


//Saving, loading, and exporting. I stole some code from Superspruce for this.
function objectToDecimal(object) {
    for (let i in object) {
        if (typeof(object[i]) == "string" && new Decimal(object[i]) instanceof Decimal && !(new Decimal(object[i]).sign == 0 && object[i] != "0")) {
          object[i] = new Decimal(object[i]);
        }
        if (typeof(object[i]) == "object") {
            objectToDecimal(object[i]);
        }
    }
}
function merge(base, source) {
    for (let i in base) {
        if (source[i] != undefined) {
            if (typeof(base[i]) == "object" && typeof(source[i]) == "object" && !isDecimal(base[i]) && !isDecimal(source[i])) {
                merge(base[i], source[i]);
            } else {
                if (isDecimal(base[i]) && !isDecimal(source[i])) {
                    base[i] = new Decimal(source[i]);
                } else if (!isDecimal(base[i]) && isDecimal(source[i])) {
                    base[i] = source[i].toNumber();
                } else {
                    base[i] = source[i];
                }
            }
        }
    }
}
function isDecimal(x) {
    if (x.array != undefined && x.plus != undefined) {
        return true;
    } else {
        return false;
    }
}
var savegame;
function save() {
  localStorage.setItem("cosmicI", JSON.stringify(game));
}
function load() {
	if (localStorage.getItem("cosmicI")) {
    savegame = JSON.parse(localStorage.getItem("cosmicI"));
    objectToDecimal(savegame);
    merge(game, savegame);

  }
}
function wipeSave() {
  hardReset();
  save();
  load();
}
function hardReset() {
game = {
	money: new Decimal(0),
	rocket:{
		active:false,
		fuel: new Decimal(25),
		maxFuel: new Decimal(25),
		speed: new Decimal(0.001),
		exchangeRate: new Decimal(1000),
		coolDown: new Decimal(2),
		cdActive: false,
		upgrade: [0,0,0,0],
		cost: [new Decimal(50),new Decimal(50),new Decimal(50),new Decimal(50)],
		costMult: [1.15, 1.2, 1.05, 1.1],
		costMultInc: [0.02, 0.03, 0.1, 0.05],
		heightMax: new Decimal(1),
	},
	alpha:{
		resets:0,
		shards: new Decimal(0),
		totalShards: new Decimal(0),
		alphonium: new Decimal(0),
		totalAlphonium: new Decimal(0),
		upgrades:[],
	},
	totalMoney:new Decimal(0),
	
}
}
function xport() {
	var tempInput = document.createElement("input");
	tempInput.style = "position: absolute; left: -1000px; top: -1000px";
	tempInput.value = btoa(JSON.stringify(game));
	document.body.appendChild(tempInput);
	tempInput.select();
	document.execCommand("copy"); 
	document.body.removeChild(tempInput); 
	alert("Save copied to clipboard"); 
}
function mport() {
	var imp = prompt("Enter save file here");
	if(imp==null) alert("That's not a valid save file.");
	savegame = JSON.parse(atob(imp));
	objectToDecimal(savegame)
	merge(game, savegame);
	save();
}
load();
window.setInterval(function() {save()}, 10000);
//The main game loop
window.setInterval(function() {
	//Altways initialize, every tick, just because of Alpha upgrade changes
	initUpgrades();
	//We increase money only when the rocket is active, and refuel only when the rocket is not.
	if (game.rocket.active == true) incMoney();
	if (game.rocket.cdActive == true) refuel();
	//The upgrade code
	for (var i = 0; i < 4; i++) {
		//Displaying availability of upgrade
		if (game.money.gte(getUpgradeCost(i)) && game.rocket.active == false) ge("upgrade" + i).className = "upgradeYes";
		else ge("upgrade"+i).className = "upgradeNo";
		//Updating costs
		game.rocket.cost[i] = getUpgradeCost(i);
		ge("upgrade"+i+"Cost").innerHTML = scientific.format(getUpgradeCost(i),2,2);
		//Amount of upgrades bought
		ge("upgrade"+i+"Count").innerHTML = game.rocket.upgrade[i];
	}
	updateCostMults();
	//Displaying current money.
	ge("money").innerHTML = scientific.format(game.money, 3, 3);
	//Stats for the rocket.
	ge("fuel").innerHTML = scientific.format(game.rocket.fuel, 3, 3);
	ge("maxFuel").innerHTML = scientific.format(game.rocket.maxFuel, 3, 3);
	ge("height").innerHTML = scientific.format(getHeight(), 3, 3);
	ge("maxHeight").innerHTML = scientific.format(game.rocket.heightMax, 3, 3);
	ge("speed").innerHTML = "Speed: "+scientific.format(game.rocket.speed, 3, 3)+" km/s.<br>"
	ge("exchangeRate").innerHTML = "Exchange rate: "+scientific.format(game.rocket.exchangeRate, 3, 3)+" ƞ/s/km.<br>"
	//Time increases over time, obviously.
	game.rocket.time = game.rocket.time.plus(1/30);
	
	//Showing stuff post- and during Alphatic resets.
	if (game.money.lt("1e10")) {
		ge("alphaResetButton").innerHTML = "Get to 1e10 ƞeta to perform an αlpha reset."
	} else ge("alphaResetButton").innerHTML = "Reset your ƞeta, level, and rocket and gain " + scientific.format(getAlphaGain(),2 ,2) + " αlphonium shards";
	if (game.alpha.resets > 0) {
		ge("alphaDisplay").style.display = "";
		ge("alphaShards").innerHTML = scientific.format(game.alpha.shards, 2, 2)
		ge("alphonium").innerHTML = scientific.format(game.alpha.alphonium, 2, 2)
				ge("alphoniumConversion").style.display = "";
		if (game.alpha.shards.gte(getSmeltingCost())) {
			ge("alphoniumConversion").className = "alphaMiniUpYes";
		} else ge("alphoniumConversion").className = "upgradeNo";
		ge("alphoniumCost").innerHTML = scientific.format(getSmeltingCost(), 2, 2);
	}
	
}, 33);
