//Rocket class. For making new rockets, and all the base requirements with them.
class rocket {
	//There are a lot of variables for each rocket.
	constructor(active, fuel, maxFuel, speed, exchangeRate, coolDown, coolDownActive, upgrade, cost, heightExponent, launchesLeft, totalLaunches) {
		this.active = active;
		this.fuel = new Decimal(fuel);
		this.maxFuel = new Decimal(maxFuel);
		this.speed = new Decimal(speed);
		this.exchangeRate = new Decimal(exchangeRate);
		this.coolDown = new Decimal(coolDown);
		this.coolDownActive = coolDownActive;
		this.upgrade = upgrade;
		this.cost = new Decimal(cost);
		this.heightExponent = heightExponent;
		this.launchesLeft = launchesLeft;
		this.totalLaunches = totalLaunches;
	}
	//Launches a rocket.
	launch() {
		
		if (this.active == false && this.coolDownActive == false) {
			this.launchesLeft = this.totalLaunches;
			this.active = true;
		} else if (this.active == true && this.coolDownActive == false) {
			this.active = false;
			this.coolDownActive = true;
			this.launchesLeft = 0;
		}
		
	}
	//Finds the height of a rocket.
	getHeight() {
		return this.maxFuel.sub(this.fuel).times(this.speed).pow(this.heightExponent);
	}
	//If else statements are supposed to be hogged by YandereDev, but i've got some too.
	//Increases money.
	moneyPlus() {
		if (this.active == true && this.fuel.gt(0)) {
			game.money = game.money.plus(this.getHeight().div(15).times(this.exchangeRate));
			game.totalMoney = game.totalMoney.plus(this.getHeight().div(15).times(this.exchangeRate));
			this.fuel = this.fuel.minus(1/10);
			if (game.workers.rocket1x1.type == 1 || game.workers.rocket1x1.type == 2) game.workers.rocket1x1.exp = game.workers.rocket1x1.exp.plus(game.expGain);
		} else if (this.active == true && this.fuel.lte(0)) {
			this.active = false;
			this.coolDownActive = true;
			this.launchesLeft -= 1;
		}
		//Refuels the rocket after launch.
		if (this.coolDownActive == true && this.fuel.lte(this.maxFuel)) {
			this.fuel = this.fuel.plus(this.coolDown/15);
		} else if (this.coolDownActive == true && this.fuel.gt(this.maxFuel) && this.launchesLeft < 1) {
			this.coolDownActive = false;
			this.fuel = this.maxFuel;
		} else if (this.coolDownActive == true && this.fuel.gt(this.maxFuel) && this.launchesLeft >= 1) {
			this.active = true;
			this.coolDownActive = false;
		}
		this.launchesLeft = Math.round(this.launchesLeft);
		//Make sure to use good indentation strategies!
	}
}

class worker {
	//There are all sorts of workers you can have.
	/* Types (Originally classes but of course that doesn't work)
		1: Engineer
		2: Scientist
		3: Errand Runner
	*/
	constructor(type, level, exp, toNext, rocket) {
		this.type = type;
		this.level = level;
		this.exp = exp;
		this.toNext = toNext;
		this.rocket = rocket;
	}
	updateExp() {
		this.toNext=new Decimal(1.5).pow(this.level).plus(this.level*150).plus(100).round();
		if (this.exp.gte(this.toNext)) {
			this.level++;
			this.exp = new Decimal(0);
		}
	}
};

//Your save file! If you need to save and somehow I broke the Export button, copy the game variable.
var game = {
	money: new Decimal(0),
	rockets:{
		normal: new rocket(false, new Decimal(50), new Decimal(50), new Decimal(1), new Decimal(0.1), new Decimal(10), false, 0, new Decimal(50), 1.5, 0, 1),
		research:{
			active:false,
			fuel:10,
			maxFuel:10,
			speed:1,
			exchangeRate:0.3,
			coolDown:10,
			upgrade:0,
			cost:10000,
		}
	},
	alpha:{
		resets:0,
		resets:0,
		shards: new Decimal(0),
		alphonium: new Decimal(0),
		upgrades: {
			a11:false,
			a12:false,
			a13:false,
		},
		totalAlphonium: new Decimal(0),
		
		
	},
	workers:{
		rocket1x1: new worker(0,0, new Decimal(0), 0, 1),
		
	},
	totalMoney:new Decimal(0),
	expGain:new Decimal(1),
	
}
const scientific = new ADNotations.ScientificNotation();
//A general getElement function.
function ge(x) {
	return document.getElementById(x)
}
//Launching the rocket.
function rocketLaunch() {
	game.rockets.normal.launch();
}
//Height calcs. Money gained per tick is based off height, as sqrt((your maximum fuel - your current fuel)*speed)^1.5.

//Upgrading the rocket. The upgrading is simple, but it starts to get difficult later.
function upgrade(rocket) {
	if (rocket === 1 && game.money.gte(game.rockets.normal.cost) && game.rockets.normal.active == false) {
		game.money = game.money.minus(game.rockets.normal.cost);
		game.rockets.normal.upgrade++;
	}
	initUpgrades();
	game.rockets.normal.fuel = game.rockets.normal.maxFuel;
}
//Initializes the upgrades.
function initUpgrades() {
	initSpeed();
	initFuel();
	initExchangeRate();
	initHeightExponent();
	initExpGain();
	if (game.rockets.normal.upgrade > 5) {
		game.rockets.normal.coolDown = 20
	}

}
//Initialize speed
function initSpeed() {
	game.rockets.normal.speed = new Decimal(1).plus(new Decimal(2).plus(game.rockets.normal.upgrade).div(3).floor().div(1.5));
	if(game.workers.rocket1x1.type == 1) {
		game.rockets.normal.speed = game.rockets.normal.speed.times(new Decimal(1.2).pow(game.workers.rocket1x1.level));
	}
	if (game.alpha.upgrades.a13 == true) game.rockets.normal.speed = game.rockets.normal.speed.times(new Decimal(game.alpha.resets).pow(1.7).div(10).plus(1))
	if (game.alpha.totalAlphonium.gte(0)) game.rockets.normal.speed = game.rockets.normal.speed.times(Decimal.pow(1.5, game.alpha.totalAlphonium))
}
//Init Fuel
function initFuel() {
	game.rockets.normal.maxFuel = new Decimal(50).plus(Decimal.min(new Decimal(1).plus(game.rockets.normal.upgrade).div(4).floor().times(15),100));
	game.rockets.normal.maxFuel = new Decimal(game.rockets.normal.maxFuel).times(new Decimal(1.10).pow(game.rockets.normal.totalLaunches - game.rockets.normal.totalLaunches));
}
//Init Exchange Rate
function initExchangeRate() {
	game.rockets.normal.exchangeRate = new Decimal(0.1).plus(new Decimal(1).plus(game.rockets.normal.upgrade).div(3).floor().times(0.15));
	game.rockets.normal.exchangeRate = game.rockets.normal.exchangeRate.times(game.alpha.shards.pow(1.4).plus(1));
	if (game.alpha.upgrades.a12 == true) game.rockets.normal.exchangeRate = game.rockets.normal.exchangeRate.times(game.alpha.shards.times(game.alpha.resets).div(10).pow(0.4).plus(1));
	if (game.alpha.upgrades.a13 == true) game.rockets.normal.exchangeRate = game.rockets.normal.exchangeRate.times(new Decimal(game.alpha.resets).pow(1.7).div(10).plus(1))
}
//Init Height Exponent
function initHeightExponent() {
	game.rockets.normal.heightExponent = new Decimal(1).plus(Decimal.min(Math.floor(game.rockets.normal.upgrade/5)*0.075, 1))
	game.rockets.normal.heightExponent = game.rockets.normal.heightExponent.plus(Decimal.min(Decimal.floor(Decimal.max(game.rockets.normal.upgrade - 50, 0)/5)/20, game.alpha.totalAlphonium.div(4)))
}
//Init Exp Gain
function initExpGain() {
	game.expGain = new Decimal(1).times(game.alpha.shards.pow(1/3).plus(1))
	if (game.alpha.upgrades.a12 == true) game.expGain = game.expGain.times(new Decimal(1).times(game.alpha.shards.times(game.alpha.resets).div(10).pow(0.4).plus(1)))
	game.expGain = game.expGain.times(new Decimal(1).plus(Decimal.max(1, new Decimal(game.rockets.normal.upgrade - 20).div(4).floor())));
	if (game.alpha.upgrades.a11 == true) game.expGain = game.expGain.times(new Decimal(game.alpha.resets).pow(1.4).div(10).plus(1));
}
//The first reset tier! Alphatic Reset.
function alphaReset() {
	if (game.money.gte("1e10")) {
		game.alpha.resets += 1
		game.alpha.shards = game.alpha.shards.plus(game.money.pow(1/10).times(0.1+game.workers.rocket1x1.level/10));
		game.money = new Decimal(0);
		game.rockets.normal =  new rocket(false, new Decimal(50), new Decimal(50), new Decimal(1), new Decimal(0.1), new Decimal(10), false, 0, new Decimal(50), 1.5, 0, 1),
		game.workers.rocket1x1.level = 0;
		game.workers.rocket1x1.exp = new Decimal(0);
	}
}
//Alphatic Shards convert into Alphonium.
function alphoniumPurchase() {
	if (game.alpha.shards.gte(new Decimal(250).times(new Decimal(5).pow(game.alpha.totalAlphonium)))) {
		
		game.alpha.shards = game.alpha.shards.minus(new Decimal(250).times(new Decimal(5).pow(game.alpha.totalAlphonium)));
		game.alpha.alphonium = game.alpha.alphonium.plus(1);
		game.alpha.totalAlphonium = game.alpha.totalAlphonium.plus(1);
	}
}
//It wouldn't be an incremental without tons of upgrades.
//Also my old upgrade code is broken for some reason, so we're going to be inefficient.
function alphaUpgrade(row, column) {
	switch(row) {
		//row 1
		case 1:
		if (game.alpha.alphonium.gte(1)) {
		switch(column) {
			case 1:
			if (game.alpha.upgrades.a11 == false) game.alpha.upgrades.a11 = true;
			break
			case 2:
			if (game.alpha.upgrades.a12 == false) game.alpha.upgrades.a12 = true;
			break
			case 3:
			if (game.alpha.upgrades.a13 == false) game.alpha.upgrades.a13 = true;
			break
		}
		game.alpha.alphonium = game.alpha.alphonium.minus(1);
		}
		break
		
	}
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
	rockets:{
		normal: new rocket(false, new Decimal(50), new Decimal(50), new Decimal(1), new Decimal(0.1), new Decimal(10), false, 0, new Decimal(50), 1.5, 0, 1),
		research:{
			active:false,
			fuel:10,
			maxFuel:10,
			speed:1,
			exchangeRate:0.3,
			coolDown:10,
			upgrade:0,
			cost:10000,
		}
	},
	alpha:{
		resets:0,
		shards: new Decimal(0),
		alphonium: new Decimal(0),
		totalAlphonium: new Decimal(0),
		upgrades: {
			a11:false,
			a12:false,
			a13:false,
		}
		
		
	},
	workers:{
		rocket1x1:"default"
		
	},
	totalMoney:new Decimal(0),
	expGain:new Decimal(1),
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
	//Altways initialize, every tick, just because of ExP changes
	initUpgrades();
	
	//Classes are so good to use :)
	game.rockets.normal.moneyPlus();
	
	//Upgrades need to display if they're affordable or not.
	if (game.money.gte(game.rockets.normal.cost) && game.rockets.normal.active == false) {
		ge("normalRocketUpButton").className = "upgradeYes"
	} else ge("normalRocketUpButton").className = "upgradeNo";
	//Upgrades also need a cost.
	game.rockets.normal.cost = new Decimal(1.509).pow(game.rockets.normal.upgrade).times(50);
	//Displaying current money and Tech Points.
	ge("money").innerHTML = scientific.format(game.money, 2, 2);
	//Stats for the normal rocket.
	ge("normalRocketFuel").innerHTML = scientific.format(game.rockets.normal.fuel, 2, 2);
	ge("normalRocketMaxFuel").innerHTML = scientific.format(game.rockets.normal.maxFuel, 2, 2);
	ge("normalRocketHeight").innerHTML = scientific.format(game.rockets.normal.getHeight(), 2, 2);
	ge("normalRocketUpgrade").innerHTML = scientific.format(game.rockets.normal.cost, 2, 2)
	//Extra stats are locked behind the 5th, 10th, and 25th upgrade.
	if (game.rockets.normal.upgrade >= 5) {
		ge("normalRocketSpeed").innerHTML = "Speed: "+scientific.format(game.rockets.normal.speed, 2, 2)+" m/s.<br>"
	}
	if (game.rockets.normal.upgrade >= 10) {
		ge("normalRocketRate").innerHTML = "Exchange rate: "+scientific.format(game.rockets.normal.exchangeRate, 2, 2)+" ƞ/m.<br>"
	}
	//Class detection and your first Crew Member.
	if(game.workers.rocket1x1.type == 0 && game.totalMoney.gte("1e6")) {
		ge("chooseWork0").style.display = ""
		ge("chooseWork1").style.display = ""
		ge("chooseWork2").style.display = ""
	} else {
		ge("chooseWork0").style.display = "none"
		ge("chooseWork1").style.display = "none"
		ge("chooseWork2").style.display = "none"
	}
	//Crew Member stats
	if (game.workers.rocket1x1.type == 1) {
		ge("classInfo1").style.display = ""
		ge("classInfo2").innerHTML = "Engineer"
		ge("classInfo3").innerHTML = game.workers.rocket1x1.level + " (" + scientific.format(game.workers.rocket1x1.exp, 2, 2) + "/" + scientific.format(game.workers.rocket1x1.toNext, 2, 2) + " ";
		ge("classInfo4").innerHTML = "+" + scientific.format(new Decimal(1.2).pow(game.workers.rocket1x1.level).minus(1).times(100), 2, 2) + "% speed"
		game.workers.rocket1x1.updateExp();	
	} else ge("classInfo1").style.display = "none"
	//Showing stuff post- and during Alphatic resets.
	if (game.money.lt("1e10")) {
		ge("alphaResetButton").innerHTML = "Get to 1e10 ƞeta to perform an αlpha reset."
	} else ge("alphaResetButton").innerHTML = "Reset your ƞeta, level, and rocket and gain " + scientific.format(game.money.pow(1/10).times(0.1+game.workers.rocket1x1.level/10),2 ,2) + " αlphonium shards";
	if (game.alpha.resets > 0) {
		ge("alphaDisplay").style.display = "";
		ge("alphaShards").innerHTML = scientific.format(game.alpha.shards, 2, 2)
		ge("alphonium").innerHTML = scientific.format(game.alpha.alphonium, 2, 2)
		ge("alphaBonus").innerHTML = "Your " + scientific.format(game.alpha.shards, 2, 2) + " alphatic shards give a " + scientific.format(game.alpha.shards.pow(1.4).plus(1), 2, 2) + "x bonus to neta gain and a " + scientific.format(game.alpha.shards.pow(1/3).plus(1)) + "x bonus to exp gain."
		ge("alphoniumConversion").style.display = "";
		if (game.alpha.shards.gte(new Decimal(250).times(new Decimal(5).pow(game.alpha.totalAlphonium)))){
			ge("alphoniumConversion").className = "alphaMiniUpYes";
		} else ge("alphoniumConversion").className = "upgradeNo";
		ge("alphoniumCost").innerHTML = scientific.format(new Decimal(250).times(new Decimal(5).pow(game.alpha.totalAlphonium)), 2, 2);
	}
	//Alphonium upgrades are hidden until you get 1 Alphonium.
	if (game.alpha.alphonium.gte(1) || game.alpha.upgrades.a11 == true || game.alpha.upgrades.a12 == true || game.alpha.upgrades.a13 == true) {
	ge("alphoniumBonus").innerHTML = "Smelting " + scientific.format(game.alpha.totalAlphonium, 2, 2) + " Alphonium adds +" + scientific.format(game.alpha.totalAlphonium.div(4),2,2) + " to your Height Exponent cap. <br>"
		ge("alphaRow1").style.display = "";
		ge("a11Bonus").innerHTML = scientific.format(new Decimal(game.alpha.resets).pow(1.4).div(10).plus(1), 2, 2);
		ge("a12Bonus").innerHTML = scientific.format(new Decimal(game.alpha.resets).div(10).pow(0.4).plus(1), 2, 2);
		ge("a13Bonus").innerHTML = scientific.format(new Decimal(game.alpha.resets).pow(1.7).div(10).plus(1), 2, 2);
	}
	if (game.alpha.alphonium.gte(1)) {
		ge("a11").className = "alphaUpYes"
		ge("a12").className = "alphaUpYes"
		ge("a13").className = "alphaUpYes"
	} else {
		ge("a11").className = "alphaUpNo"
		ge("a12").className = "alphaUpNo"
		ge("a13").className = "alphaUpNo"
	}
	if (game.alpha.upgrades.a11 == true) ge("a11").className = "alphaUpBought"
	if (game.alpha.upgrades.a12 == true) ge("a12").className = "alphaUpBought"
	if (game.alpha.upgrades.a13 == true) ge("a13").className = "alphaUpBought"
	
}, 33);
