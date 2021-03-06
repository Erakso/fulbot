var FSM = require('../lib/fsm');
var AI = require('./ai');
var Dice = require('./dice');



function MonsterGenerator() {
  this.Character =require('./entity').Character;
  this.pre = ['Gr', 'Kr', 'Gu', 'Ar', 'Ug', 'Bu', 'Co', 'Lo', 'Af', 'Robin', 'Ulla', 'Le'];
  this.mid = ['og', 'ib', 'is', 'id', 'ad', 'ed', 'ro', 'fn', 'sxe', 'lele'];
  this.end = ['oth', 'ork', 'ith', 'eth', 'ath', 'ir', 'id', 'ed', 'eng', 'sson', 'zor', 'zorzor', 'lele'];
}

MonsterGenerator.prototype.stat = function(level, pool) {
	if(pool <= 0) {
		return [0, 0];
	}
	
	var s= (level *2) + Dice.DX(4);
	
	pool -= s;
	
	if(pool <= 0) {
		return [s+pool, pool];
	}
	
	return [s, pool];
}

MonsterGenerator.prototype.generate = function(num, maxlevel) {
  var ret=[];

  var level = Dice.DX(maxlevel);
    
	//Todo: centralize constants
  var pool = level * 5;
  
  for(var i = 0, l = num; i < l; i++) {

    var name = this.pre[Dice.DX(this.pre.length)-1] +
            this.mid[Dice.DX(this.mid.length)-1] +
          this.end[Dice.DX(this.end.length)-1];


    var monster = new this.Character({ Name : name});

	var s1 = this.stat(level, pool);
	
	monster.STRbase = s1[0];
	
	

	var s2 = this.stat(level, s1[1]);
	
	
	monster.DEXbase = s2[0];
	
	var s3 = this.stat(level, s2[1]);

	
	monster.MINDbase = s3[0];
	monster.Level = level;
	monster.Update();
	monster.Reset();

	//console.log(monster);
   monster.AI = new FSM(AI.Protective, 'Foo', 'Protective');
    ret.push(monster);

  }

  return ret;

};

exports.MonsterGenerator = MonsterGenerator;

//TOdo fixed affixes
var affixes = {
  'eating' : { STR : 4 },
  'cowards' : { DEX : 4},
  'heroes'  : { MIND : 4}
};

function WeaponGenerator() {
  this.Item = require('./entity').Item;
  this.prefix = ['Broken', 'Worn', 'Regular', 'Good', 'Fine', 'Better', 'Pristine', 'Extraordinary', 'Epix', 'Legendary'];
  this.type = ['spoon', 'knife', 'shiv', 'fork', 'toothpick', 'sword', 'shotgun', 'hammer', 'dildo', 'narwhal horn'];
  this.affix = ['eating', 'cowards', 'heroes', 'wrath', 'agony', 'sogeti', 'hax', 'nerfzor'];

}

WeaponGenerator.prototype.generate = function(lvl, cap) {
  var prefixWeight = Dice.DX(this.prefix.length)-1;
  if(prefixWeight > cap) prefixWeight = cap;

  var prefix = this.prefix[prefixWeight];
  var type = this.type[Dice.DX(this.type.length)-1];
  var affixWeight = Dice.DX(this.affix.length)-1;
  var affix = this.affix[affixWeight];

  var name = '{0} {1} of {2}'.format(prefix, type, affix);

  var modweight = Math.floor((prefixWeight+affixWeight) * 0.7);
  var numstats = Math.floor(modweight/3)+1;

  if(numstats > 6) numstats = 6;

  //DRoll HRoll STR DEX MIND AC
  var stats = ['DRoll', 'HRoll', 'STR', 'DEX', 'MIND', 'AC'];

  var pickedstats = [];

  function pick() {
    return Dice.DX(stats.length);
  }

  function len() {
    return pickedstats.length;
  }

  while(len() < numstats) {
    var p = pick();
    if(pickedstats.indexOf(p) < 0) {
      pickedstats.push(p-1);
      console.log(pickedstats, p, len(), numstats-1);
    }
  }

  //Assign stats.
  var item = new this.Item({ Name : name, Type : 'Weapon' });
  item.Level = lvl;

  for(var i = 0; i < pickedstats.length; i++) {
    item[stats[pickedstats[i]]] = Math.floor((modweight/2) + Dice.DX(2) * lvl * 0.5)+prefixWeight;
  }
  return item;
};


exports.WeaponGenerator = WeaponGenerator;



