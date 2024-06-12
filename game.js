import {Player, FootballField, Playersteam, AI_team} from './draft.js';
class DraftGame {
    constructor() {
            /*Обработка кнопок с модальными окнами*/
        this.modalBtns = document.querySelectorAll('.modal-btn');
            /*Обработка содержания кнопок с модальными окнами*/
        this.modals = document.querySelectorAll('.modal');
            /*Обработка кнопки Accept*/
        this.AcceptBtns = document.querySelectorAll('.modal-footer2 h3');
            /*Обработка уровня сложности*/
        this.levelSelect = document.getElementById('difficulty');
            /*Обработка кнопки с выбором уровня сложности*/
        this.levelBtn = document.getElementById('myBtn2');
            /*Обработка кнопки с схемой поля*/
        this.schemeBtn = document.getElementById('myBtn');
            /*Обработка содержания контейнера с бюджетом*/
        this.budgetBtn = document.getElementById('myBtn3');
            /*Обработка кнопки с появлением таблицы*/
        this.customBtn = document.querySelector('.custom-btn.btn-2');
            /*Обработка кнопки с содержанием кнопки с рейтингом*/
        this.rateBtn = document.querySelector('.modal-btn2');
            /*Обработка кнопки с содержанием кнопки с коэф. сыгранности*/
        this.coefChemistryBtn = document.getElementById('myBtn5');
            /*Обработка кнопки с содержанием кнопки с коэф. возраста*/
        this.coefAgeBtn = document.getElementById('myBtn6');
            /*Обработка кнопки с модальным окном в случае ошибки пользователя*/
        this.modalAlert = document.querySelector('.alert');
            /*Будущая команда пользователя*/
        this.team = null;
            /*Объект с предоставленными для пользователя игроками на выбор*/
        this.selectedPlayersByPosition = {};
            /*Команда из которой будет собираться команда компьютера*/
        this.selectForAI = []


        /*Создание переменных для заполнения*/
        this.playersData = null;
        this.budgetData = null;
        this.selectedLevel = '';
        this.selectedScheme = '';
        this.schemeDescription = '';

        /*Загружаются данные с игроками, бюджетом, схемами*/
        this.fetchPlayersData();
        this.fetchBudgetData();
        this.fetchFootballFieldSchemes();
        /*Обработка событий кнопок и селекторов*/
        this.addEventListeners();
    }

    fetchPlayersData() {
        fetch('./players.json')
            .then(response => response.json())
            .then(data => {
                /*Сохраняются игроки*/
                this.playersData = data;
            })
            .catch(error => console.error('Error fetching player data:', error));
    }

    fetchFootballFieldSchemes() {
        fetch('./shemes.json')
            .then(response => response.json())
            .then(data => {
                /*Генерируются три рандомные схемы и сохраняются*/
                this.randomSchemes = this.getRandomFootballFieldSchemes(data, 3);
            })
            .catch(error => console.error('Error fetching football field schemes:', error));
    }

    fetchBudgetData() {
        fetch('./budget.json')
            .then(response => response.json())
            .then(data => {
                /*Сохраняется бюджет*/
                this.budgetData = data;
            })
            .catch(error => console.error('Error fetching budget data:', error));
    }

    /*Функция для генерации трех рандомных схем*/
    getRandomFootballFieldSchemes(schemes, count) {
        const randomSchemes = [];
        const schemeNames = Object.keys(schemes);

        /*Добавляем по одной рандомной схеме и потом удаляем ее, чтобы избежать повторений*/
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * schemeNames.length);
            const randomSchemeName = schemeNames[randomIndex];
            const randomScheme = {name: randomSchemeName, description: schemes[randomSchemeName]};
            randomSchemes.push(randomScheme);
            schemeNames.splice(randomIndex, 1);
        }

        return randomSchemes;
    }

    /*Функция для проверки, что все ячейки таблицы заполнены*/
    checkAllCellsFilled() {
        /*Достаем элементы*/
        const table = document.querySelector('.table');
        const cells = table.querySelectorAll('td');
        /*Проверяем*/
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].innerText.trim() === '' || cells[i].innerText.trim() === 'Выбрать игрока') {
                return false;
            }
        }
        return true;
    }

    /*Функция для генерации игроков с определенной позиции*/
    /*Здесь на вход падаются игроки только с одной позиции*/
    getRandomPlayers(players, count) {
        const randomPlayers = [];
        const shuffledPlayers = players.sort(() => 0.5 - Math.random());

        for (let i = 0; i < count; i++) {
            /*Добавляем по одному игроку*/
            randomPlayers.push(shuffledPlayers[i]);
        }
        return randomPlayers;
    }

    /*Закрытие всех модальных окон после выбора уровня сложности и схемы*/
    closeModals() {
        this.modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    showTable() {

        /*Меняем содержимое customBtn на "Начать игру"*/
        this.customBtn.innerText = 'Начать игру';

        /*Создаем экземпляры пользовательской команды*/
        const footballField = new FootballField(this.schemeDescription);
        this.team = new Playersteam(this.budgetData[this.selectedLevel],  footballField);
        /*Записываем переменную бюджет, чтобы изменять его при выборе игрока*/
        var remainingBudget = this.budgetData[this.selectedLevel];
        /*Обрабатываем таблицу, ее появление*/
        const table = document.querySelector('.table');
        table.style.display = 'table';
        setTimeout(() => {
            table.style.opacity = '1';

            const rows = document.querySelectorAll('.iksweb tbody tr');
            /*Объект с игроками, которые генерируются по позицям*/
            /*Массив с выбранными пользователем игроками*/
            const polzovatelPlayers = [];

            /*Создаем кнопку в первых ячейках таблицы и генерируем по 
            три рандомных игрока на каждую позицию в селектор при нажатии на кнопку*/
            rows.forEach((row, index) => {
                const positionCell = row.querySelectorAll('td')[1];
                positionCell.innerText = this.schemeDescription[index];

                const playerCell = row.querySelectorAll('td')[0];
                const button = document.createElement('button');
                button.classList.add('select-player-btn');
                button.innerText = 'Выбрать игрока';

                button.addEventListener('click', () => {
                    const select = document.createElement('select');
                    select.classList.add('player-select');
                    select.innerHTML = '<option value="">Выберите игрока</option>';

                    const position = this.schemeDescription[index];
                    /*Этот if для того, чтобы на одинаковые позиции 
                    пользователю были предоставлены одинаковые игроки*/
                    if (this.selectedPlayersByPosition[position]) {
                        /*То есть, если на определенную позицию уже предоставлялись игроки,
                         то они же предлагаются далее, просто достаем их из selectedPlayersByPosition*/
                        //  console.log(this.selectedPlayersByPosition[position])
                         this.selectedPlayersByPosition[position].forEach(player => {
                            const option = document.createElement('option');
                            option.value = player.name;
                            option.textContent = `${player.name}(${player.age} лет, ${player.nationality},
                                 ${player.position}, ${player.pace} pace, ${player.shooting} shooting, ${player.passing} 
                                 passing, ${player.dribling} dribling, ${player.defending} defending, ${player.physicality}
                                  physicality, cost: ${player.cost})`;
                            select.appendChild(option);

                        });
                    } else {
                        /*Иначе генерируем новые три игрока и сохраняем их в селектор*/
                        const playersOnPosition = this.playersData[position];
                        const randomPlayers = this.getRandomPlayers(playersOnPosition, 3);

                        randomPlayers.forEach(player => {
                            this.selectForAI.push(player)
                            const option = document.createElement('option');
                            option.value = player.name;
                            option.textContent = `${player.name}(${player.age} лет, ${player.nationality}, ${player.position}, ${player.pace} pace, ${player.shooting} shooting, ${player.passing} passing, ${player.dribling} dribling, ${player.defending} defending, ${player.physicality} physicality, cost: ${player.cost})`;
                            select.appendChild(option);
                        });
                        /*Сохраняем генерацию из трех игроков в объект для будущих проверок*/
                        this.selectedPlayersByPosition[position] = randomPlayers;
                    }

                    playerCell.innerHTML = '';
                    /*Добавляем селектор*/
                    playerCell.appendChild(select);

                    select.addEventListener('change', () => {
                        if (select.value !== '') {
                            /*Если пользователь выбирает одного и того же игрока
                             на две одинаковые позиции на поле, то он должен поменять выбор,
                              так как один и тот же игрок не может быть на двух позициях сразу*/
                            if (polzovatelPlayers.includes(select.value)) {
                                this.modalAlert.style.display = "block";
                                setTimeout(() => {
                                    this.modalAlert.style.opacity = '1';
                                }, 100);
                                this.modalAlert.innerHTML = "Вы уже выбрали этого игрока, сделайте другой выбор"
                
                                const hideAlert = (event) => {
                                    if (!this.modalAlert.contains(event.target)) {
                                        this.modalAlert.classList.remove('show');
                                        setTimeout(() => {
                                            this.modalAlert.style.display = 'none';
                                        }, 1);
                                        document.removeEventListener('click', hideAlert);
                                    }
                                };
                    
                                /*Подключаем отключение модального окна при нажатии на любую область вокруг кнопки*/
                                setTimeout(() => {
                                    document.addEventListener('click', hideAlert);
                                }, 100);
                            } else {

                                /*Удаление выбранного игрока из selectedPlayersByPosition, чтобы при повторении позиции, он не попался снова*/
                                const playerNameToRemove = select.value;
                                const position = this.schemeDescription[index];
                                this.selectedPlayersByPosition[position] = this.selectedPlayersByPosition[position].filter(player => player.name !== playerNameToRemove);
                                
                                /*Иначе сохраняем выбранного игрока и блокируем селектор выбора*/
                                polzovatelPlayers.push(select.value);
                                select.disabled = true;
                                /*Здесь обрабатываем тот случай с одинаковыми позициями, т.е если пользователь выбрал игрока, позиция в дльнейшем повторится,
                                то я удаляю всех игроков из playersData(точнее которые были в селекторе) и заново генерирую третьего игрока в selectedPlayersByPosition[position],
                                чтобы не было повторений, тем самым при выборе игрока пользователем и повторении позиции на место выбранного, вместо него будет добавлен
                                новый игрок, чтобы у пользователя по прежнему был выбор из трех игроков, а не из двух*/
                                const selectedPlayer = this.playersData[position].find(player => player.name === select.value);
                                var temp = this.playersData[position];
                                /*Костыль для 7 игроков, у меня на все позиции, которые могут повториться добавлено по 7 игроков, в остальные по 6
                                Этот котсыль можно убрать, он сделано просто, чтобы код не генерировал на все позиции нового игрока вместо выбранного
                                а только на повторяющиеся позиции*/
                                if (this.playersData[position].length == 7){
                                    const playerSecondtoRemove = this.selectedPlayersByPosition[position][0]
                                    const playerThirdtoRemove = this.selectedPlayersByPosition[position][1]

                                    temp = temp.filter(player => player.name !== playerNameToRemove);
                                    temp = temp.filter(player => player.name !== playerSecondtoRemove.name);
                                    temp = temp.filter(player => player.name !== playerThirdtoRemove.name);

                                    const playerOnPosition = temp;
                                    const newPlayer = this.getRandomPlayers(playerOnPosition, 1);
                                    this.selectedPlayersByPosition[position].push(newPlayer[0]);
                                    if (temp.length == 4){
                                        this.selectForAI.push(newPlayer[0]);
                                    }
                                }
                                // console.log(this.selectForAI)
                                /*Показываем новый бюджет*/
                                remainingBudget -= parseInt(selectedPlayer.cost)

                                this.budgetBtn.innerText = 'Ваш бюджет после внесения изменений: ' + remainingBudget;

                                /*Если пользователь вышел за бюджет, то игроки становятся хуже 
                                и показываем соответсвующее модальное окно*/
                                if (remainingBudget < 0){
                                    this.modalAlert.style.display = "block";
                                    setTimeout(() => {
                                        this.modalAlert.style.opacity = '1';
                                    }, 100);
                                    this.modalAlert.innerHTML = `Вы исчерпали бюджет! ${selectedPlayer.name} стал слабее`
                    
                                    const hideAlert = (event) => {
                                        if (!this.modalAlert.contains(event.target)) {
                                            this.modalAlert.classList.remove('show');
                                            setTimeout(() => {
                                                this.modalAlert.style.display = 'none';
                                            }, 1);
                                            document.removeEventListener('click', hideAlert);
                                        }
                                    };
                        
                                    setTimeout(() => {
                                        document.addEventListener('click', hideAlert);
                                    }, 100);

                                    const playerParameters = [
                                        selectedPlayer.name,
                                        selectedPlayer.position,
                                        selectedPlayer.age,
                                        selectedPlayer.nationality,
                                        parseInt(selectedPlayer.pace),
                                        parseInt(selectedPlayer.shooting),
                                        parseInt(selectedPlayer.passing),
                                        parseInt(selectedPlayer.dribling),
                                        parseInt(selectedPlayer.defending),
                                        parseInt(selectedPlayer.physicality),
                                        selectedPlayer.cost
                                        
                                    ];
    
                                    const roundedParameters = playerParameters.map(param => {
                                        /*Если параметр является числом, умножаем его на 0.9 и округляем*/
                                        if (typeof param === 'number') {
                                            return Math.round(param * 0.9);
                                        }
                                        return param;
                                    });
                                    /*Достав все параметры выбранного игрока,
                                     выводим его качества в каждую ячейку соответствующей строки*/
                                    const cells = row.querySelectorAll('td');
                                    cells.forEach((cell, index) => {
                                        cell.innerText = roundedParameters[index];
                                    });
                                } else{
                                    const playerParameters = [
                                        selectedPlayer.name,
                                        selectedPlayer.position,
                                        selectedPlayer.age,
                                        selectedPlayer.nationality,
                                        parseInt(selectedPlayer.pace),
                                        parseInt(selectedPlayer.shooting),
                                        parseInt(selectedPlayer.passing),
                                        parseInt(selectedPlayer.dribling),
                                        parseInt(selectedPlayer.defending),
                                        parseInt(selectedPlayer.physicality),
                                        selectedPlayer.cost
                                        
                                    ];
    
                                    /*Достав все параметры выбранного игрока,
                                     выводим его качества в каждую ячейку соответсвующей строки*/
                                    const cells = row.querySelectorAll('td');
                                    cells.forEach((cell, index) => {
                                        cell.innerText = playerParameters[index];
                                    });
                                }

                                /*Создал экземпляр класса Player и добавлям его в команду*/
                                const fPlayer = new Player(selectedPlayer.name,
                                    selectedPlayer.position,
                                    selectedPlayer.age,
                                    selectedPlayer.nationality,
                                    selectedPlayer.pace,
                                    selectedPlayer.shooting,
                                    selectedPlayer.passing,
                                    selectedPlayer.dribling,
                                    selectedPlayer.defending,
                                    selectedPlayer.physicality,
                                    parseInt(selectedPlayer.cost))
                                
                                this.team.add_player(fPlayer)

                                /*Меняем содержание контейнеров с рейтингами и коэфициентами*/
                                this.rateBtn.innerText = 'Рейтинг команды после добавления игрока: ' + (this.team.calculate_team_rate()).toFixed(2);
                                this.coefChemistryBtn.innerText = 'Коэфициент сыгранности команды: ' + (this.team.calculate_chemistry_coef()).toFixed(2);
                                this.coefAgeBtn.innerText = 'Коэфициент возраста команды: ' + (this.team.calculate_age_coef()).toFixed(2);

                            }
                        }
                    });
                });

                playerCell.appendChild(button);
            });
        }, 100);
    }

    addEventListeners() {
        /*Обрабатываем клик на кнопки с модальными окнами*/
        this.modalBtns.forEach((btn, index) => {
            btn.onclick = () => {
                this.modals[index].style.display = 'block';
            }
        });

        this.customBtn.onclick = () => {
            /*Проверка выбора уровня сложности и схемы поля*/
            if (this.selectedLevel && this.selectedScheme) {
                const allCellsFilled = this.checkAllCellsFilled();
                /*Проверяем, что все ячейки таблицы заполнены*/
                if (!allCellsFilled && this.customBtn.innerHTML == 'Выбор игроков') {
                    /*Отображение таблицы*/
                    this.showTable();
                } else if (!allCellsFilled){
                    /*Если не все ячейки заполнены вызываем соответсвующее модальное окно с ошибкой*/
                    this.modalAlert.style.display = "block";
                    setTimeout(() => {
                        this.modalAlert.style.opacity = '1';
                    }, 100);
                    this.modalAlert.innerHTML = "Чтобы начать игру, заполните все ячейки таблицы."
    
                    const hideAlert = (event) => {
                        if (!this.modalAlert.contains(event.target)) {
                            this.modalAlert.classList.remove('show');
                            setTimeout(() => {
                                this.modalAlert.style.display = 'none';
                            }, 1);
                            document.removeEventListener('click', hideAlert);
                        }
                    };
        
                    setTimeout(() => {
                        document.addEventListener('click', hideAlert);
                    }, 100);
                } else {
                    /*Если все условия выполнены, то закрываем окно с выбором и показываем итоговый контейнер*/
                    /*Скрываем контейнер .header*/
                    var Header = document.querySelector('.header');
                    Header.style.opacity = '0';
                    setTimeout(function() {
                        Header.style.display = 'none';
                        /* Показываем контейнеры с рейтингом и коэффициентами */
                        var fBtns2 = document.querySelectorAll('.f_header');
                        fBtns2.forEach(function(btn) {
                            btn.style.display = 'block';
                            setTimeout(function() {
                                btn.style.opacity = '1';
                            }, 100);
                        });
                    }, 100);
                }

                /*Показываем контейнеры с рейтингом и коэфициентами*/
                var modalBtns2 = document.querySelectorAll('.modal-btn2');
                modalBtns2.forEach(function(btn) {
                    btn.style.display = 'block';
                    setTimeout(function() {
                        btn.style.opacity = '1';
                    }, 100);
                });

                /*Блокируем изменение схемы и уровня сложности*/
                this.modalBtns.forEach(btn => {
                    btn.disabled = true;
                });

            } else {
                this.modalAlert.style.display = "block";
                setTimeout(() => {
                    this.modalAlert.style.opacity = '1';
                }, 100);
                this.modalAlert.innerHTML = "Сначала выберите уровень сложности и схему поля."

                const hideAlert = (event) => {
                    if (!this.modalAlert.contains(event.target)) {
                        this.modalAlert.classList.remove('show');
                        setTimeout(() => {
                            this.modalAlert.style.display = 'none';
                        }, 1);
                        document.removeEventListener('click', hideAlert);
                    }
                };
    
                setTimeout(() => {
                    document.addEventListener('click', hideAlert);
                }, 100);

            }
        };
        /*Сохраняем выбранный уровень сложности в инициализированную переменную*/
        this.levelSelect.addEventListener('change', () => {
            this.selectedLevel = this.levelSelect.value;
        });

        this.AcceptBtns.forEach(btn => {
            btn.onclick = () => {
                this.closeModals();
                /*Обновление текста кнопки после выбора уровня сложности и/или схемы*/
                if (this.selectedLevel && !this.selectedScheme) {
                    this.levelBtn.innerText = 'Уровень сложности: ' + this.selectedLevel;
                } else if (this.selectedLevel && this.selectedScheme) {
                    this.schemeBtn.innerText = 'Схема: ' + this.selectedScheme;
                    this.levelBtn.innerText = 'Уровень сложности: ' + this.selectedLevel;
                } else if (!this.selectedLevel && this.selectedScheme) {
                    this.schemeBtn.innerText = 'Схема: ' + this.selectedScheme;
                }

                /*Отображение бюджета после нажатия кнопки Accept в зависимости от уровня сложности*/
                if (this.selectedLevel) {
                    this.budgetBtn.innerText = 'Ваш бюджет после внесения изменений: ' + this.budgetData[this.selectedLevel];
                }
            }
        });

        this.modalBtns[0].onclick = () => {
            /*Отображение выбранных схем в селекторе модального окна*/
            const modalHeader = this.modals[0].querySelector('.modal-body');

            /*Создаем селектор с тремя схемами*/
            let selectHTML = '<select id="fieldScheme" name="fieldScheme">';
            selectHTML += `<option value="${this.randomSchemes[0].name}">Пока не решил...</option>`;

            this.randomSchemes.forEach(scheme => {
                selectHTML += `<option value="${scheme.name}"> Расстановка: ${scheme.name} Позиции: ${scheme.description}</option>`;
            });
            selectHTML += '</select>';

            modalHeader.innerHTML = selectHTML;

            /*Отображение модального окна*/
            this.modals[0].style.display = 'block';

            /*Сохраняем выбранную схему*/
            const schemeSelect = document.getElementById('fieldScheme');
            schemeSelect.addEventListener('change', () => {
                this.selectedScheme = schemeSelect.value;
                /*Сохраняем расстановку позиций по выбранной схеме для дальнейшего использования*/
                this.schemeDescription = this.randomSchemes.find(scheme => scheme.name === schemeSelect.value).description;
            });
        };
    }
}



class FinalGame {
    constructor(draftGame) {

        this.draftGame = draftGame;
            /*Обработка кнопок с показом результата пользователя*/
        this.f_modalBtn = document.getElementById('f_myBtn');

        this.f_mybtn2 = document.getElementById('f_myBtn2')

        this.f_mybtn3 = document.getElementById('f_myBtn3')

        /*Обработка кнопок с рейтингом команд, коэфициентами сфгранности и возраста*/
        this.f_rateBtn = document.getElementById('f_myBtn4');

        this.f_coefChemistryBtn = document.getElementById('f_myBtn5');

        this.f_coefAgeBtn = document.getElementById('f_myBtn6');

        this.modalBudget = document.querySelector('.f_alert');

        this.addEventListeners();
    }

    /*Чтобы каждый игрок был экземпляром класса PLayer для команды ИИ*/
    makePlayersNew(players) {
        const mass = [];
        players.forEach((player) => {
            mass.push(new Player(player.name,
                player.position,
                player.age,
                player.nationality,
                player.pace,
                player.shooting,
                player.passing,
                player.dribling,
                player.defending,
                player.physicality,
                parseInt(player.cost)))
        });
        return mass;
    }

    showTable() {   
        var bdg = 0;
        const field = new FootballField(this.draftGame.schemeDescription);
        const aiTeam = new AI_team(this.draftGame.selectedLevel, field, this.draftGame.budgetData[this.draftGame.selectedLevel])
        const playersForAI = this.makePlayersNew(this.draftGame.selectForAI)
        const madeAITeam = aiTeam.chooseLevel(playersForAI)

        /*По аналогии с Draftgame*/     
        /*Обрабатываем таблицу, ее появление*/
        const table = document.querySelector('.f_table');
        table.style.display = 'table';
        const playersAI = [];
        setTimeout(() => {
            table.style.opacity = '1';
            const rows = document.querySelectorAll('.f_iksweb tbody tr');
            rows.forEach((row, index) => {
                playersAI.push(madeAITeam[index].name);
                const playerParameters = [
                this.draftGame.team.players[index].name,
                this.draftGame.team.players[index].position,
                this.draftGame.team.players[index].age,
                this.draftGame.team.players[index].nationality,
                parseInt(this.draftGame.team.players[index].pace),
                parseInt(this.draftGame.team.players[index].shooting),
                parseInt(this.draftGame.team.players[index].passing),
                parseInt(this.draftGame.team.players[index].dribling),
                parseInt(this.draftGame.team.players[index].defending),
                parseInt(this.draftGame.team.players[index].physicality),
                parseInt(this.draftGame.team.players[index].cost)];

                bdg += parseInt(this.draftGame.team.players[index].cost);
                console.log(bdg)
                    /*Достав все параметры выбранного игрока,
                выводим его качества в каждую ячейку соответсвующей строки*/
                const cells = row.querySelectorAll('td');
                if (this.draftGame.team.calculate_team_rate() > aiTeam.calculateTeamRating(madeAITeam)){
                    cells.forEach((cell, i) => {
                        cell.innerText = playerParameters[i];
                            cell.style.backgroundColor = 'green'; 
                        });
                }
                else{
                cells.forEach((cell, i) => {
                    cell.innerText = playerParameters[i];
                    if (playersAI.includes(playerParameters[0])){
                        cell.style.backgroundColor = 'green'; 
                    }
                    });
                }
                });
            this.modalBudget.style.display = "block";
            setTimeout(() => {
                this.modalBudget.style.opacity = '1';
            }, 100);
            this.modalBudget.innerHTML = 'Стоимость команды: ' + bdg;
        }, 100);
    };

    showTable2() {        
        var bdg = 0;
        /*Достаем команду для ИИ*/
       const field = new FootballField(this.draftGame.schemeDescription);
       const aiTeam = new AI_team(this.draftGame.selectedLevel, field, this.draftGame.budgetData[this.draftGame.selectedLevel])
       const playersForAI = this.makePlayersNew(this.draftGame.selectForAI)
       const madeAITeam = aiTeam.chooseLevel(playersForAI)
       console.log(madeAITeam)
       
        /*Обрабатываем таблицу, ее появление*/
        const table = document.querySelector('.f_table');
        table.style.display = 'table';
        
        setTimeout(() => {
            table.style.opacity = '1';
            const rows = document.querySelectorAll('.f_iksweb tbody tr');
            rows.forEach((row, index) => {
                const playerParameters = [
                    madeAITeam[index].name,
                    madeAITeam[index].position,
                    madeAITeam[index].age,
                    madeAITeam[index].nationality,
                parseInt(madeAITeam[index].pace),
                parseInt(madeAITeam[index].shooting),
                parseInt(madeAITeam[index].passing),
                parseInt(madeAITeam[index].dribling),
                parseInt(madeAITeam[index].defending),
                parseInt(madeAITeam[index].physicality),
                madeAITeam[index].cost];
                bdg += parseInt(madeAITeam[index].cost)
                    /*Достав все параметры выбранного игрока,
                выводим его качества в каждую ячейку соответсвующей строки*/
                const cells = row.querySelectorAll('td');
                cells.forEach((cell, i) => {
                    cell.innerText = playerParameters[i];
                    cell.style.backgroundColor = 'grey';
                    });
                });
            this.modalBudget.style.display = "block";
            setTimeout(() => {
                this.modalBudget.style.opacity = '1';
            }, 100);
            this.modalBudget.innerHTML = 'Стоимость команды: ' + bdg;
        }, 100);

        aiTeam.calculateChemistryCoefficient
        this.f_rateBtn.innerText = 'Рейтинг команды после добавления игрока: ' + (aiTeam.calculateTeamRating(madeAITeam)).toFixed(2);
        this.f_coefChemistryBtn.innerText = 'Коэфициент сыгранности команды: ' + (aiTeam.calculateChemistryCoefficient(madeAITeam)).toFixed(2);
        this.f_coefAgeBtn.innerText = 'Коэфициент возраста команды: ' + (aiTeam.calculateAgeCoefficient(madeAITeam)).toFixed(2);
    };

    showTable3() {        
        var bdg = 0;
        /*Аналогично достаем команду для ИИ, только ставим "бесконечный бюджет"*/
        const field = new FootballField(this.draftGame.schemeDescription);
        const aiTeam = new AI_team('hard', field, 1000000)
        const playersForAI = this.makePlayersNew(this.draftGame.selectForAI)
        const madeAITeam = aiTeam.chooseLevel(playersForAI)
        console.log(madeAITeam)
            
         /*Обрабатываем таблицу, ее появление*/
         const table = document.querySelector('.f_table');
         table.style.display = 'table';
         
         setTimeout(() => {
             table.style.opacity = '1';
             const rows = document.querySelectorAll('.f_iksweb tbody tr');
             rows.forEach((row, index) => {
                 const playerParameters = [
                     madeAITeam[index].name,
                     madeAITeam[index].position,
                     madeAITeam[index].age,
                     madeAITeam[index].nationality,
                 parseInt(madeAITeam[index].pace),
                 parseInt(madeAITeam[index].shooting),
                 parseInt(madeAITeam[index].passing),
                 parseInt(madeAITeam[index].dribling),
                 parseInt(madeAITeam[index].defending),
                 parseInt(madeAITeam[index].physicality),
                 madeAITeam[index].cost];
                 bdg += parseInt(madeAITeam[index].cost)
                     /*Достав все параметры выбранного игрока,
                 выводим его качества в каждую ячейку соответсвующей строки*/
                 const cells = row.querySelectorAll('td');
                 cells.forEach((cell, i) => {
                     cell.innerText = playerParameters[i];
                     cell.style.backgroundColor = 'grey';
                     });
                 });
            this.modalBudget.style.display = "block";
            setTimeout(() => {
                this.modalBudget.style.opacity = '1';
            }, 100);
            this.modalBudget.innerHTML = 'Стоимость команды: ' + bdg;
         }, 100);
         aiTeam.calculateChemistryCoefficient
         this.f_rateBtn.innerText = 'Рейтинг команды после добавления игрока: ' + (aiTeam.calculateTeamRating(madeAITeam)).toFixed(2);
         this.f_coefChemistryBtn.innerText = 'Коэфициент сыгранности команды: ' + (aiTeam.calculateChemistryCoefficient(madeAITeam)).toFixed(2);
         this.f_coefAgeBtn.innerText = 'Коэфициент возраста команды: ' + (aiTeam.calculateAgeCoefficient(madeAITeam)).toFixed(2);
     };

    addEventListeners() {
        /*Показываем кнопки с выбором команд*/
        this.f_modalBtn.onclick = () => {
            var modalBtns2 = document.querySelectorAll('.f_modal-btn2');
                modalBtns2.forEach(function(btn) {
                    btn.style.display = 'block';
                    setTimeout(function() {
                        btn.style.opacity = '1';
                    }, 100);
                });
            this.showTable()
            /*Меня содержание контейнеров с рейтингами и коэфициентами*/
            this.f_rateBtn.innerText = 'Рейтинг команды после добавления игрока: ' + (this.draftGame.team.calculate_team_rate()).toFixed(2);
            this.f_coefChemistryBtn.innerText = 'Коэфициент сыгранности команды: ' + (this.draftGame.team.calculate_chemistry_coef()).toFixed(2);
            this.f_coefAgeBtn.innerText = 'Коэфициент возраста команды: ' + (this.draftGame.team.calculate_age_coef()).toFixed(2);
        }

        this.f_mybtn2.onclick = () => {
            var modalBtns2 = document.querySelectorAll('.f_modal-btn2');
            modalBtns2.forEach(function(btn) {
                btn.style.display = 'block';
                setTimeout(function() {
                    btn.style.opacity = '1';
                }, 100);
            });
            this.showTable2()
        }

        this.f_mybtn3.onclick = () => {
            var modalBtns2 = document.querySelectorAll('.f_modal-btn2');
            modalBtns2.forEach(function(btn) {
                btn.style.display = 'block';
                setTimeout(function() {
                    btn.style.opacity = '1';
                }, 100);
            });
            this.showTable3()
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    /*Создаем экземпляр класса DraftGame и FinalGame*/
    const draftGame = new DraftGame();
    const finalGame = new FinalGame(draftGame);
});
