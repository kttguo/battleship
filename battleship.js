function getlocation(event) {
  // model.fire(event.id);
  // console.log(event.id);
  controller.processGuess(event.id);
};
// 负责界面展示，击中，未击中
var view = {
  // 这个方法将一个字符串作为参数，并在消息区域中显示
  displayMeaasge: function(msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  // 获取一个<td>元素，并将其class特性设置为hit或miss。用来显示图像
  displayHit: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  displayMiss: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

// 模拟战舰以及战舰行为
var model = {
  // 游戏网格板大小，游戏包含的战舰数，每艘战舰占据多少单元格，已被击沉的战舰数目
  boardSize: 7,
  numships: 3,
  shipLength: 3,
  shipSunk: 0,
  // 战舰所处位置以及被击中的部位
  // 将每艘战舰分别用一个对象表示。locations表示战舰所处位置，
  // hits表示战舰各个部位是否被击中，若击中，对应元素显示为hit
  ships: [{
      locations: [0, 0, 0],
      hits: ["", "", ""]
    },
    {
      locations: [0, 0, 0],
      hits: ["", "", ""]
    },
    {
      locations: [0, 0, 0],
      hits: ["", "", ""]
    }
  ],
  // 处理玩家向战舰开火的方法，判断玩家是否击中战舰，如果击中了，将战舰的相应部位标记为被击中
  fire: function(guess) {
    for (var i = 0; i < this.numships; i++) {
      var ship = this.ships[i];
      locations = ship.locations;
      var index = locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMeaasge("HIT!");
        if (this.isSunk(ship)) {
          view.displayMeaasge("You sank my battleship");
          this.shipSunk++;
          console.log("the sunk ship number is"+ this.shipSunk);
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMeaasge("you missed");
    return false;
  },

  isSunk: function(ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },
// 创建游戏需要的战舰
  generateShipLocations: function() {
    var locations;
    for (var i = 0; i < this.numships; i++) {
      do {
        locations = this.generateShip();
      } while (this.collosion(locations));
      this.ships[i].locations = locations;
    }
  },
  // 创建一艘战舰
  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    if (direction == 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newshipLocations = [];
    for (i = 0; i < this.shipLength; i++) {
      if (direction == 1) {
        newshipLocations.push(row + "" + (col + i));
      } else {
        newshipLocations.push((row + i) + "" + col);
      }
    }
    return newshipLocations;
  },
// 避免碰撞
  collosion: function(locations) {
    for (i = 0; i < this.numships; i++) {
      var ships = this.ships[i];
      for (j = 0; j < locations.Length; j++) {
        if (ships.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }

    }
    return false;
  }

};

//获取并处理玩家输入的猜测，检查输入是否有效，将字母转化为数字，检查数字是否有效
function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if (guess === null || guess.length !== 2) {
      alert("Oops,please enter a letter and number on the board");
    } else {
      // 获取第一个字符，将第一个字符转化为数字，在获取第二个数字
      firstChar = guess.charAt(0);
      var row = alphabet.indexOf(firstChar);
      var column = guess.charAt(1);
      // 查看第一个第二个是不是都是数字，确认这些数字是不是在0-6之间
      if (isNaN(row) || isNaN(column)) {
        alert("Oops,	that isn't on the board");
      } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
        alert("Oops,That's off the board");
      } else {
        return row + column;
      }
    }
    return null;
  }

  // 控制器获取和处理猜测，并将其交给模型，从而将各个部分整 合起来
var controller = {
  guesses: 0,

  processGuess: function(location) {
    // var location=parseGuess(guess);
    if (location) {
      this.guesses++;
      // console.log(this.guesses);
      var hit = model.fire(location);
      if (hit &&  (model.shipSunk === model.numships)) {
        view.displayMeaasge("You sank all my battleships,in" + this.guesses + "guessess");
        // console.log(model.shipSunk);
        document.getElementById("board").style.background="url(youwin.jpg) no-repeat top ";
      }
    }
  }
}

function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations();
}

function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value.toUpperCase();
  var location=parseGuess(guess);
  controller.processGuess(location);
  guessInput.value = "";

}

function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  e = e || window.event;
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}
window.onload = init;

console.log(model.generateShipLocations());

// 游戏设计逻辑
// view对象负责更新界面
// model 模拟战舰，处理玩家开火后，击中
// controller将各个部分整合起来，用户处理用户输入，实现游戏逻辑冰哦按段游戏是否结束

// 用于存储游戏的状态，通常还包含一些有关如何修改状态的逻辑。在这个游戏中，状态包括战舰的位置、战舰的哪些部位被击中
// 以及有多少艘战舰已被击沉。就目前而言，需要实现的唯一逻辑是：判断玩家是否击中了战舰；如果击中了，将战舰的相应部位标记为
// 数组有一个indexof方法，它类似于字符串的indexof方法。数组的indexOf方法将一个值作为参数，并
// 返回这个值在数组中的索引；如果这个值不包含在数组中，就返 回-1
