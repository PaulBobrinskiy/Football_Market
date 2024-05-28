// export {Player, FootballField, Playersteam}
//Создается класс футболиста и задаются соответствующие параметры
export class Player {
    constructor (name, position, age, nationality, pace, shooting, passing, dribling, defending, physicality, cost) {
        this.name = name;
        this.position = position;
        this.age = age
        this.nationality = nationality;
        this.pace = pace;
        this.shooting = shooting;
        this.passing = passing;
        this.dribling = dribling;
        this.defending = defending;
        this.physicality = physicality;
        this.cost = cost;
    }

// Подсчитывается средний рейтинг игрока 
    calculate_player_rate () {
        return (this.pace + this.shooting + this.passing + this.dribling + this.defending + this.physicality) / 6;
    }
}

//  Класс футбольное поле создает два массива из позицияй в схеме, выбранное пользователем. В positions хранятся все позиции, а в 
// occupied_positions те, которые остались.
export class FootballField {
    constructor(positions) {
        this.positions = positions.slice(); // копия positions
    }

// Проверка, что позиция игрока, выбранного пользователем существует и не занята другим игроком
    available_position(position) {
        return this.positions.includes(position);
    }

// Добавление игрока на позицию
    occupy_position(position) {
        const index = this.positions.indexOf(position);
        this.positions.splice(index, 1); // Удаляем позицию из массива occupied_positions(первое вхождение, чтобы повторные позиции не удалялись)
    }
}

// Класс команды пользователя 
export class Playersteam{
    constructor(budget, footballField) {
        this.players = [];
        this.budget = budget;
        this.footballField = footballField
    }

// Возвращается бюджет команды
    get_budget() {
        return this.budget;
    }

    get_players() {
        console.log(this.players)
        return true;
    }

/* 
*  Происходит добавления игрока в команду, проверяя соотвествие его позиции, выбранной схеме поля
*  Если позиция не соответ  свует, то качества игрока ухудшаются на 10%
*  Проверяется возможность покупки игрока, основываясь на оставшемся бюджете
*/ 

    add_player(player) {
        if (this.budget - player.cost < 0) {
            player.shooting *= 0.9; 
            player.passing *= 0.9;
            player.dribling *= 0.9; 
            player.defending *= 0.9;
            player.physicality *= 0.9; 
            player.pace *= 0.9;
        }

        // this.footballField.occupy_position(player.position);

        this.players.push(player);
        // if (player.type_transfer == "loan"){
        //     this.budget -= 0.05 * player.cost; //Если игрок взят в аренду, то платим 5 % его стоимости
        // }
        // else{
        //     
        // }
        this.budget -= player.cost;
        return this.players;
    }

    // setplayers(players){
    //     this.players = players
    //     return this.players
    // }

    // setField(foo){
    //     state.setField(foo)
    //     return true;
    // }

/*
* Подсчитывается рейтинг команды(просто суммируются средние качества игроков)
* Подсчитывается коэфициент сыгранности, основывая на нациях игроков (chemistry)
* Подсчитывается влияние возраста на качества всей команды (total_age_coef)
* Подсчитывается эффект трансфера на качество команды (transfer_Effect)
* Возвращаем итоговый рейтинг, основываясь на данных коэфициентах
*/ 

    calculate_team_rate() {
        let rate = (this.players.reduce((accumulator, player) => accumulator + player.calculate_player_rate(), 0)) / this.players.length;
        // console.log("Рейтинг команды", rate);
        const chemistry = this.calculate_chemistry_coef();
        // console.log("Сыгранность по нациям:", chemistry);
        const total_age_coef = this.calculate_age_coef()
        // console.log("Посчитал коэфициент возраста", total_age_coef);
        // const transfer_Effect = this.calculate_transfer_type_effect()
        // console.log("Эффект трансфера:", transfer_Effect);  
        return rate * total_age_coef * chemistry;
    }

// Подсчитывается коэфициент возраста
    calculate_age_coef() {
        let total_age_coef = 0
        this.players.forEach(player => {
            const age_coef = 1 + (player.age / 100); //К единице прибавляется отношение возраста к 100
            total_age_coef += age_coef // Суммируются коэфициенты
        })
        return total_age_coef / this.players.length //Считается средний коэфициент по команде
    }

// Подсчитывается коэфициент сыгрнанности по нациям
    calculate_chemistry_coef() {
        const nations = this.players.map(player => player.nationality); // Список из всех наций игроков
        // console.log("Сколько наций:", nations);
        const uniqueNations = new Set(nations); // Set из наций
        // console.log("Уникальные нации:", uniqueNations);
        const numberOfNations = uniqueNations.size;
        const maxCoefficient = 1.5; 
        const coefficientStep = 0.05; 
/*
* Чем больше наций тем меньше коэфициент
* Коэфициент будет от 1 до 1.5
*/ 
        let chemistryCoefficient = maxCoefficient - (numberOfNations - 1) * coefficientStep;
        return chemistryCoefficient;                                              
    }     

// // Подсчитывается эффект трансфера/аренды игрока
//     calculate_transfer_type_effect() {
//         const loanEffect = 0.2; 
//         const trasferEffect = 1.1; 

//         const totalEffect = this.players.reduce((accumulator, player) => {
//             if (player.type_transfer === 'Loan') {
//                 return accumulator + loanEffect; // К общему эффекту прибавляется 0.2, если игрок в аренду
//             } else if (player.type_transfer === 'Transfer') {
//                 return accumulator + trasferEffect; // К общему эффекту прибавляется 1.1, если произошел трансфер игрока
//             }             
//         }, 0);
        
//         return totalEffect / this.players.length; // Средний эффект по всей команде
//     }
}

export class AI_team {
    constructor(difficultyLevel, footballField, budget) {
        this.difficultyLevel = difficultyLevel;
        this.footballField = footballField.positions;
        this.budget = budget;
        this.players = {};
    }

    // Возвращается бюджет команды
    get_budget() {
        return this.budget;
    }

    /* 
    *  Создаем объект из списка игроков, чьи позиции есть в footballField.
    *  В ключах будут позиции, в значениях игроки
    */

    makePlayersForPositions(fullMassOfPlayers){ 
        const ChoosenPlayers = fullMassOfPlayers.filter(player => this.footballField.includes(player.position)); //игроки с позициями из footballfield
        // Создаем объект из игроков, разбивая их по позициям

        const playersForPositions = ChoosenPlayers.reduce((accumulator, player) => {
                if (!accumulator[player.position]) { //Если позиция еще не добавлена в объект, создаем пустой массив для нее
                    accumulator[player.position] = []; 
                }
                accumulator[player.position].push(player); //Добавляем игрока к ключу соответствующей
            return accumulator;
        }, {}); // указываем чему равняется playersForPositions изначально, а именно объекту

        return playersForPositions;
    }

    // Выбор игроков для команды компьютера в зависимости от уровня сложности
    chooseLevel(playersForPositions) {
        switch (this.difficultyLevel) { // Выбираем уровень сложности, по которому будет составляться команда ИИ
            case 'easy':
                return this.chooseEasyPlayers(playersForPositions);
                break;
            case 'medium':
                return this.chooseMediumPlayers(playersForPositions);
                break;
            case 'hard':
                return this.chooseHardPlayers(playersForPositions);
                break;
        }
    }

    // Выбор случайных игроков для каждой позиции
    chooseEasyPlayers(playersForPositions) {
        playersForPositions = this.makePlayersForPositions(playersForPositions)
        console.log(playersForPositions)

        const allPlayers = []; // Создаем вложенные списки из игроков по позициям и объединяем в один массив
        for (const position in playersForPositions) {
            allPlayers.push(...playersForPositions[position]);// "..." чтобы не было вложенных списков
        } 
        
        let bestCombination = [];

        // Функция рекурсионного перебора игроков в команду ИИ
        const generate = (index, currentCombination) => {
            if (index === 11) { // Если индекс дошел до 11 до добавляем комбинацию игроков и продолжаем рекурсию с другими игроками
                if (this.isBudgetValid(currentCombination)){ // выбираем команду с наивысшим рейтингом и сохраняем
                    bestCombination = currentCombination.slice();
                }
                return;
            }

            // Чтобы все игроки были на своих позициях будем рекурсионно проходиться по блокам игроков с определенных позиций
            // Это сделано, чтобы, к примеру, вратарь не оказался на позиции нападающего и т.п

            const currentPosition = this.footballField[index];
            const currentPlayers = allPlayers.filter(player => player.position === currentPosition);

            //Пробегаемся по выделенному нам блоку игроков

            for (const player of currentPlayers) {
                //Проверяем, что игрока еще нет в нашей комбинации
                if (currentCombination.indexOf(player) === -1) {
                    currentCombination.push(player); // Добавляем игрока в компбинацию
                    generate(index + 1, currentCombination); //Вырываем функцию от индекса следующей позиции на поле
                    if (bestCombination.length === 11){ // Если мы собрали команду и она прошла проверку бюджета, то полнустью выходим из рекурсивной функции
                        return;
                    }
                    currentCombination.pop(); // После завершения определенной комбинации удаляем послежнего игрока и
                                              // либо делаем далее перебор на позиции удаленного игрока либо начинаем заново
                }
            }
        };

        generate(0, []);
        this.players = bestCombination
        // console.log(this.players)
        return this.players
        }

    // Выбор игроков для каждой позиции с учетом максимизации рейтинга команды
    chooseMediumPlayers(playersForPositions) {
        playersForPositions = this.makePlayersForPositions(playersForPositions)

        const allPlayers = []; // Создаем массив из всех игроков
        for (const position in playersForPositions) {
            allPlayers.push(...playersForPositions[position]);
        } 

        const allPositions = [];
        for (const position in playersForPositions) {
            for(let i = 0; i < 11; i++){ // На одной позиции может быть несколько игроков, поэтому идет "for", чтобы добавить все позиции
                if (this.footballField[i] === position){
                    allPositions.push(position);
                }
            }
        } 


        // Первые пять позиций
        const firstFivePositions = []; 
        for (let i = 0; i < 5; i++) {
            firstFivePositions.push(allPositions[i]);
        } 
        
        const combinatedPlayers = allPlayers.filter(player => firstFivePositions.includes(player.position)); //игроки с первых четырех позиций
        const bestFiveCombination = this.generateCombinationsForFirstFive(firstFivePositions, combinatedPlayers)

        // Оставшиеся позиции
        const remainingPositions = []; 
        for (let i = 5; i < 11; i++) {
            remainingPositions.push(allPositions[i]);
        } 
        
        const remainingPlayers = allPlayers.filter(player => remainingPositions.includes(player.position)); //игроки с оставшихся позиций

        const remainingCombinatedplayers = this.generateCombinations(remainingPositions, remainingPlayers); // Сохраняем комбинации их оставшихся игроков


        let combination = [];
        for (let i = 0; i < remainingCombinatedplayers.length; i++) {
            combination = bestFiveCombination.concat(remainingCombinatedplayers[i]); // Объединяем первые пять игроков с текущей комбинацией
            if (!this.isBudgetValid(combination)) { //Если не прошла команда по бюджету, то берем следующую рандомную генерацию оставшихся 6 игроков
                combination = [];
            } else {
                break;
            }
        }

        this.players = combination;
        return this.players
    }

    generateCombinationsForFirstFive(firstFivePositions, combinatedPlayers) {
    let bestCombination = [];
    let maxRating = -Infinity;
    let temporaryRate = 0

    // Функция рекурсионного перебора игроков в команду ИИ
        const generate = (index, currentCombination) => {
        if (!firstFivePositions.includes(this.footballField[index])) { // Если на footballField перестали поялвяться выбранные позиции, то заканчиваем
            temporaryRate = this.calculateTeamRating(currentCombination)
            if (temporaryRate > maxRating){ // выбираем команду с наивысшим рейтингом и сохраняем
                bestCombination = currentCombination.slice();
                maxRating = temporaryRate;
            }
            return;
        }

        // Чтобы все игроки были на своих позициях будем рекурсионно проходиться по блокам игроков с определенных позиций
        // Это сделано, чтобы, к примеру, вратарь не оказался на позиции нападающего и т.п

        const currentPosition = this.footballField[index];
        const currentPlayers = combinatedPlayers.filter(player => player.position === currentPosition);

        //Пробегаемся по выделенному нам блоку игроков

        for (const player of currentPlayers) {
            //Проверяем, что игрока еще нет в нашей комбинации
            if (currentCombination.indexOf(player) === -1) {
                currentCombination.push(player); // Добавляем игрока в компбинацию
                generate(index + 1, currentCombination); //Вырываем функцию от индекса следующей позиции на поле
                currentCombination.pop(); // После завершения определенной комбинации удаляем послежнего игрока и
                                            // либо делаем далее перебор на позиции удаленного игрока либо начинаем заново
            }
        }
    };

    generate(0, []);
    return bestCombination

    }

    generateCombinations(positions, players) {
        let bestCombination = [];
        // Функция рекурсионного перебора игроков в команду ИИ
            const generate = (index, currentCombination) => {
            if (!positions.includes(this.footballField[index])) { // Если на footballField перестали поялвяться выбранные позиции, то заканчиваем
                bestCombination.push(currentCombination.slice());
                return;
            }
    
            // Чтобы все игроки были на своих позициях будем рекурсионно проходиться по блокам игроков с определенных позиций
            // Это сделано, чтобы, к примеру, вратарь не оказался на позиции нападающего и т.п
    
            const currentPosition = this.footballField[index];
            const currentPlayers = players.filter(player => player.position === currentPosition);
    
            //Пробегаемся по выделенному нам блоку игроков
    
            for (const player of currentPlayers) {
                //Проверяем, что игрока еще нет в нашей комбинации
                if (currentCombination.indexOf(player) === -1) {
                    currentCombination.push(player); // Добавляем игрока в компбинацию
                    generate(index + 1, currentCombination); //Вырываем функцию от индекса следующей позиции на поле
                    currentCombination.pop(); // После завершения определенной комбинации удаляем послежнего игрока и
                                                // либо делаем далее перебор на позиции удаленного игрока либо начинаем заново
                }
            }
        };
    
        generate(5, []);
        return bestCombination
        }

    // CСоздаем команду ИИ с наивысшим рейтингом
    chooseHardPlayers(playersForPositions) {
        playersForPositions = this.makePlayersForPositions(playersForPositions)
        const allPlayers = []; 
        for (const position in playersForPositions) {
            allPlayers.push(...playersForPositions[position]);
        } 

        let maxRating = -Infinity;
        let temporaryRate = 0
        let bestCombination = [];

        // Функция рекурсионного перебора игроков в команду ИИ
        const generate = (index, currentCombination) => {
            if (index === 11) { // Если индекс дошел до 11 до добавляем комбинацию игроков и продолжаем рекурсию с другими игроками
                temporaryRate = this.calculateTeamRating(currentCombination)
                if (temporaryRate > maxRating && this.isBudgetValid(currentCombination)){ // выбираем команду с наивысшим рейтингом и сохраняем
                    bestCombination = currentCombination.slice();
                    console.log(temporaryRate)
                    maxRating = temporaryRate
                }
                return;
            }

            // Чтобы все игроки были на своих позициях будем рекурсионно проходиться по блокам игроков с определенных позиций
            // Это сделано, чтобы, к примеру, вратарь не оказался на позиции нападающего и т.п

            const currentPosition = this.footballField[index];
            const currentPlayers = allPlayers.filter(player => player.position === currentPosition);

            //Пробегаемся по выделенному нам блоку игроков

            for (const player of currentPlayers) {
                //Проверяем, что игрока еще нет в нашей комбинации
                if (currentCombination.indexOf(player) === -1) {
                    currentCombination.push(player); // Добавляем игрока в компбинацию
                    generate(index + 1, currentCombination); //Вырываем функцию от индекса следующей позиции на поле
                    currentCombination.pop(); // После завершения определенной комбинации удаляем послежнего игрока и
                                              // либо делаем далее перебор на позиции удаленного игрока либо начинаем заново
                }
            }
        };

        generate(0, []);

        this.players = bestCombination
        return this.players
    }

    // Проверка, укладывается ли комбинация игроков в бюджет
    isBudgetValid(total_team) {
        const totalCost = total_team.reduce((total, player) => total + player.cost, 0);
        return totalCost <= this.budget;
    }

    
    /*
    * Подсчет рейтинга команды для определенной комбинации игроков, подсчет такой же, как и у команды пользователя
    * Только не учитывается эффект трансфера, потому что в команде ИИ все игроки как бы "Покупаются"
    */

    calculateTeamRating(players) {
        let rate = (players.reduce((accumulator, player) => accumulator + player.calculate_player_rate(), 0)) / players.length;
        // console.log("Рейтинг команды", rate);
        const chemistry = this.calculateChemistryCoefficient(players);
        // console.log("Сыгранность по нациям:", chemistry);
        const total_age_coef = this.calculateAgeCoefficient(players)
        // console.log("Посчитал коэфициент возраста", total_age_coef);
        return rate * total_age_coef * chemistry;
    }

    // Подсчет коэффициента сыгранности
    calculateChemistryCoefficient(players) {
        const nations = players.map(player => player.nationality); 
        // console.log("Сколько наций:", nations);
        const uniqueNations = new Set(nations); 
        // console.log("Уникальные нации:", uniqueNations);
        const numberOfNations = uniqueNations.size;
        const maxCoefficient = 1.5; 
        const coefficientStep = 0.05; 

        let chemistryCoefficient = maxCoefficient - (numberOfNations - 1) * coefficientStep;
        return chemistryCoefficient; 
    }

    // Подсчет коэффициента возраста
    calculateAgeCoefficient(players) {
        let total_age_coef = 0
        players.forEach(player => {
            const age_coef = 1 + (player.age / 100); 
            total_age_coef += age_coef 
        })
        return total_age_coef / players.length 
    }

    get_budget(){
        return this.budget;
    }

}
// const footballField = new FootballField(["st", "lw", "rw", "lm", "rm", "cam", "cm", "cd", "cd", "ld", "rd", "gk"]);


// const team = new Playersteam(1000000, footballField);
// const player1 = new Player("Player 1", "cd", 25, "Brazil", 90, 85, 80, 85, 85, 75, 10000);
// const player2 = new Player("Player 2", "cd", 28, "Argentina", 88, 82, 75, 90, 80, 78, 15000);
// const player3 = new Player("Player 1", "lw", 25, "Brazil", 90, 85, 80, 85, 85, 75, 10000);
// const player4 = new Player("Player 2", "rm", 28, "Argentina", 88, 82, 75, 90, 80, 78, 15000);
// const player5 = new Player("Player 1", "cm", 25, "Brazil", 90, 85, 80, 85, 85, 75, 10000);
// const player6 = new Player("Player 2", "cm", 28, "Argentina", 88, 82, 75, 90, 80, 78, 15000);
// const player7 = new Player("Player 1", "st", 25, "Brazil", 90, 85, 80, 85, 85, 75, 10000);
// const player8 = new Player("Player 2", "lfd", 28, "Argentina", 88, 82, 75, 90, 80, 78, 15000);
// const player9 = new Player("Player 1", "rd", 25, "Brazil", 90, 85, 80, 85, 85, 75, 10000);
// const player10 = new Player("Player 2", "cam", 28, "Argentina", 88, 82, 75, 90, 80, 78, 15000);
// const player11 = new Player("Player 1", "gk", 25, "Brazil", 90, 85, 80, 85, 85, 75, 10000);
// team.add_player(player1);
// team.add_player(player2);
// team.add_player(player3);
// console.log('Рейтинг команды:', team.calculate_team_rate());
// team.add_player(player4);
// team.add_player(player5);
// team.add_player(player6);
// team.add_player(player7);
// team.add_player(player8);
// team.add_player(player9);
// team.add_player(player10);
// team.add_player(player11);
// console.log('Бюджет:', team.get_budget());
// console.log('Рейтинг команды:', team.calculate_team_rate());


// const footballField = new FootballField(["gk", "ld", "cd", "cd", "rd", "lm", "cm", "cm", "rm", "fwd", "fwd"]);

// budget = 10000000

// const team = new AI_team('Hard', footballField, budget)

// const player1 = new Player("Player 1", "gk", 25, "Brazil", 90, 85, 80, 85, 85, 75, "Transfer", 10000);
// const player2 = new Player("Player 2", "gk", 25, "Brazil", 90, 85, 80, 85, 85, 75, "Transfer", 10000);
// const player3 = new Player("Player 3", "gk", 25, "Brazil", 1000, 1000, 1000, 1000, 1000, 1000, "Transfer", 10000);
// const player4 = new Player("Player 4", "ld", 28, "Argentina", 88, 82, 75, 90, 80, 78, "Loan", 15000);
// const player5 = new Player("Player 5", "ld", 28, "Argentina", 88, 82, 75, 90, 80, 78, "Loan", 15000);
// const player6 = new Player("Player 6", "ld", 28, "Argentina", 1000, 1000, 1000, 1000, 1000, 1000, "Loan", 15000);
// const player7 = new Player("Player 7", "cd", 25, "Brazil", 90, 85, 80, 85, 85, 75, "Transfer", 10000);
// const player8 = new Player("Player 8", "cd", 28, "Argentina", 1000, 1000, 1000, 1000, 1000, 1000, "Transfer", 15000);
// const player9 = new Player("Player 9", "cd", 25, "Brazil", 1000, 1000, 1000, 1000, 1000, 1000, "Transfer", 10000);
// const player10 = new Player("Player 10", "cd", 25, "Brazil", 90, 85, 80, 85, 85, 75, "Transfer", 10000);
// const player11 = new Player("Player 11", "rd", 25, "Brazil", 90, 85, 80, 85, 85, 75, "Transfer", 10000);
// const player12 = new Player("Player 12", "rd", 25, "Brazil", 1000, 1000, 1000, 1000, 1000, 1000, "Transfer", 10000);
// const player13 = new Player("Player 13", "rd", 25, "Brazil", 90, 85, 80, 85, 85, 75, "Transfer", 10000);
// const player14 = new Player("Player 14", "lm", 28, "Argentina", 88, 82, 75, 90, 80, 78, "Transfer", 15000);
// const player15 = new Player("Player 15", "lm", 28, "Argentina", 1000, 1000, 1000, 1000, 1000, 1000, "Transfer", 15000);
// const player16 = new Player("Player 16", "lm", 28, "Argentina", 88, 82, 75, 90, 80, 78, "Transfer", 15000);
// const player17 = new Player("Player 17", "cm", 25, "Brazil", 90, 85, 80, 85, 85, 75, "Transfer", 10000);
// const player18 = new Player("Player 18", "cm", 28, "Argentina", 1000, 1000, 1000, 1000, 1000, 1000, "Loan", 15000);
// const player19 = new Player("Player 19", "cm", 28, "Argentina", 88, 82, 75, 90, 80, 78, "Loan", 15000);
// const player20 = new Player("Player 20", "cm", 28, "Argentina", 1000, 1000, 1000, 1000, 1000, 1000, "Loan", 15000);
// const player21 = new Player("Player 21", "rm", 25, "Brazil", 90, 85, 80, 85, 85, 75, "Transfer", 10000);
// const player22 = new Player("Player 22", "rm", 25, "Brazil", 1000, 1000, 1000, 1000, 1000, 1000, "Transfer", 10000);
// const player23 = new Player("Player 23", "rm", 25, "Brazil", 90, 85, 80, 85, 85, 75, "Transfer", 10000);
// const player24 = new Player("Player 24", "fwd", 28, "Argentina", 88, 82, 75, 90, 80, 78, "Loan", 15000);
// const player25 = new Player("Player 25", "fwd", 25, "Brazil", 90, 85, 80, 85, 85, 75, "Transfer", 10000);
// const player26 = new Player("Player 26", "fwd", 25, "Brazil", 1000, 1000, 1000, 1000, 1000, 1000, "Transfer", 10000);
// const player27 = new Player("Player 27", "fwd", 25, "Brazil", 1000, 1000, 1000, 1000, 1000, 1000, "Transfer", 10000);
// const player28 = new Player("Player 28", "lfd", 25, "Brazil", 90, 85, 80, 85, 85, 75, "Transfer", 10000);

// const massofpl = [player1, player2, player3, player4, player5, player6,
//      player7, player8, player9, player10, player11, player12, player13, 
//      player14, player15, player16, player17, player18, player19, player20,
//       player21, player22, player23, player24, player25, player26, player27, player28]
// console.log(massofpl)
// console.log(team.get_budget())
// console.time("Время выполнения");
// console.log(team.calculateTeamRating(team.chooseLevel(massofpl)));
// console.timeEnd("Время выполнения");
// console.log(team.chooseLevel(massofpl));

// export default {Player, FootballField, Playersteam}