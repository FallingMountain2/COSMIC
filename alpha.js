//I figure all of the Alpha reset stuff should go into a seperate file, mainly because of the convoluted upgrade code, which I will regret making later.

function alphaReset() {
	if (game.money.gte("1e10")) {
		game.alpha.resets += 1
		game.alpha.shards = game.alpha.shards.plus(getAlphaGain());
		game.money = new Decimal(0);
		game.rocket = {
			active:false,
			fuel: new Decimal(25),
			maxFuel: new Decimal(25),
			speed: new Decimal(0.001),
			exchangeRate: new Decimal(0.01),
			coolDown: new Decimal(2),
			cdActive: false,
			upgrade: [0,0,0,0],
			cost: [new Decimal(50),new Decimal(50),50,50],
			costMult: [1.15, 1.2, 1.05, 1.1],
			costMultInc: [0.02, 0.03, 0.05, 0.05],
			heightMax: new Decimal(1000),
			launched: new Decimal(0),
			time: new Decimal(0),
		}
	}
}
function getAlphaGain() {
	var gain = new Decimal(game.money.pow(1/10));
	gain = gain.minus(game.alpha.alphaShards);
	return gain;
}
//Alphatic Shards convert into Alphonium.
function alphoniumPurchase() {
	if (game.alpha.shards.gte(getSmeltingCost())) {
		game.alpha.shards = game.alpha.shards.minus(getSmeltingCost());
		game.alpha.alphonium = game.alpha.alphonium.plus(1);
		game.alpha.totalAlphonium = game.alpha.totalAlphonium.plus(1);
	}
}
function getSmeltingCost() {
	var cost = Decimal.pow(10, Decimal.add(1, game.alpha.totalAlphonium));
	return cost;
	
}
//It wouldn't be an incremental without tons of upgrades.
//The upgrade code MIGHT be a bit... messy
//First, we verify if upgrades can be bought. 
function verifyAlphaUpgrade(column, row) {
	var cost;
	if (row == 1 || row == 2) cost = 1;
	if (row == 3 || row == 5 || row == 6) cost = 2;
	if (row == 4) cost = 3;
	if (row == 7) cost = 4;
	if (row == 8) cost = 5;
	
	if(!upgIncl(column + row)) {
	switch(column) {
			case "A":
			if (row > 6 || row < 4) return false;
			if (row == 4 && upgIncl("E4") && upgIncl("B4") && game.alpha.alphonium.gte(cost)) return true;
			if (row <= 6 && row >= 5 && game.alpha.upgrades.includes("A" + row-1) && game.alpha.alphonium.gte(cost)) return true;
			break
			case "B":
			if (row == 1 && !upgIncl("E1") && !upgIncl("H1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("E1") && upgIncl("E7") && !upgIncl("H1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("H1") && upgIncl("H7") && !upgIncl("E1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("E1") && upgIncl("E7") && upgIncl("H1") && upgIncl("H7") && game.alpha.alphonium.gte(cost)) return true;
			if (row > 1 && upgIncl("B"+row-1) && game.alpha.alphonium.gte(cost)) return true;
			break
			case "C":
			if (row > 6 || row < 4) return false;
			if (row == 4 && upgIncl("H4") && upgIncl("B4") && game.alpha.alphonium.gte(cost)) return true;
			if (row <= 6 && row >= 5 && game.alpha.upgrades.includes("C" + row-1) && game.alpha.alphonium.gte(cost)) return true;
			break
			case "D":
			if (row > 6 || row < 4) return false;
			if (row == 4 && upgIncl("E4") && upgIncl("B4") && game.alpha.alphonium.gte(cost)) return true;
			if (row <= 6 && row >= 5 && game.alpha.upgrades.includes("D" + row-1) && game.alpha.alphonium.gte(cost)) return true;
			break
			case "E":
			if (row == 1 && !upgIncl("B1") && !upgIncl("H1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("B1") && upgIncl("B7") && !upgIncl("H1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("H1") && upgIncl("H7") && !upgIncl("B1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("B1") && upgIncl("B7") && upgIncl("H1") && upgIncl("H7") && game.alpha.alphonium.gte(cost)) return true;
			if (row > 1 && upgIncl("E"+row-1) && game.alpha.alphonium.gte(cost)) return true;
			break
			case "F":
			if (row > 6 || row < 4) return false;
			if (row == 4 && upgIncl("H4") && upgIncl("E4") && game.alpha.alphonium.gte(cost)) return true;
			if (row <= 6 && row >= 5 && game.alpha.upgrades.includes("F" + row-1) && game.alpha.alphonium.gte(cost)) return true;
			break
			case "G":
			if (row > 6 || row < 4) return false;
			if (row == 4 && upgIncl("H4") && upgIncl("B4") && game.alpha.alphonium.gte(cost)) return true;
			if (row <= 6 && row >= 5 && game.alpha.upgrades.includes("G" + row-1) && game.alpha.alphonium.gte(cost)) return true;
			break
			case "H":
			if (row == 1 && !upgIncl("E1") && !upgIncl("B1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("E1") && upgIncl("E7") && !upgIncl("B1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("B1") && upgIncl("B7") && !upgIncl("E1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("E1") && upgIncl("E7") && upgIncl("B1") && upgIncl("B7") && game.alpha.alphonium.gte(cost)) return true;
			if (row > 1 && upgIncl("H"+row-1) && game.alpha.alphonium.gte(cost)) return true;
			break
			case "I":
			if (row > 6 || row < 4) return false;
			if (row == 4 && upgIncl("H4") && upgIncl("E4") && game.alpha.alphonium.gte(cost)) return true;
			if (row <= 6 && row >= 5 && game.alpha.upgrades.includes("I" + row-1) && game.alpha.alphonium.gte(cost)) return true;
			break
		}
		if (game.alpha.alphonium.lt(cost)) return false;
	}
	else return false;
}

//Second, the code for actually buying the upgrade.
function buyAlphaUpgrade(column, row) {
	var cost;
	if (row == 1 || row == 2) cost = 1;
	if (row == 3 || row == 5 || row == 6) cost = 2;
	if (row == 4) cost = 3;
	if (row == 7) cost = 4;
	if (row == 8) cost = 5;
	if (verifyAlphaUpgrade(column, row)) {
		game.alpha.upgrades.push(column + row);
		game.alpha.alphonium = game.alpha.alphonium.minus(cost);
	}
}

//Third, the code for describing upgrades.
function getDescription(column, row) {
	var desc;
	if (column == "B" && row == 1) {
		desc = "Upgrade B1<br>";
		desc += "Unlocks the Grinder path.<br>";
		desc += "Fuel is consumed twice as fast, and you gain double neta.<br>";
		desc += "Every launch you make counts as two.<br>";
		desc += "Increase neta gain based on launches this Alpha. Currently x" + getUpgradeEffect("B", 1, 0) + "<br>";
		desc += "Increase neta based on time this Alpha. Currently x" + getUpgradeEffect("B", 1, 1) + "<br>";
	}
	ge("alphaEffect").innerHTML = desc;
}

//Fourth, what the upgrade doin
function getUpgradeEffect(column, row, type) {
	var effect;
	switch(column) {
		case "B"
		switch(row) {
			case 1:
			if (type == 0) return game.rocket.launched.pow(1/1.5).div(3).plus(1);
			if (type == 1) return game.rocket.time.times(10).pow(1/2).plus(1);
			break
		}
		
		break
	
	}
	
}

function upgIncl(upg) {
	return game.alpha.upgrades.includes(upg);
}
