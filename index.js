const fs = require('fs');
const readline = require('readline');
const beginNewLine = require('os').EOL;

const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
});

const cards = [
    [{name: 'hearts_2', value: 2}, {name: 'hearts_3', value: 3}, {name: 'hearts_4', value: 4}, {name: 'hearts_5', value: 5}, {name: 'hearts_6', value: 6}, {name: 'hearts_7', value: 7}, {name: 'hearts_8', value: 8}, {name: 'hearts_9', value: 9}, {name: 'hearts_10', value: 10}, {name: 'hearts_J', value: 10}, {name: 'hearts_Q', value: 10}, {name: 'hearts_K', value: 10}, {name: 'hearts_A', value: 11}],
    [{name: 'diamond_2', value: 2}, {name: 'diamond_3', value: 3}, {name: 'diamond_4', value: 4}, {name: 'diamond_5', value: 5}, {name: 'diamond_6', value: 6}, {name: 'diamond_7', value: 7}, {name: 'diamond_8', value: 8}, {name: 'diamond_9', value: 9}, {name: 'diamond_10', value: 10}, {name: 'diamond_J', value: 10}, {name: 'diamond_Q', value: 10}, {name: 'diamond_K', value: 10}, {name: 'diamond_A', value: 11}],
    [{name: 'club_2', value: 2}, {name: 'club_3', value: 3}, {name: 'club_4', value: 4}, {name: 'club_5', value: 5}, {name: 'club_6', value: 6}, {name: 'club_7', value: 7}, {name: 'club_8', value: 8}, {name: 'club_9', value: 9}, {name: 'club_10', value: 10}, {name: 'club_J', value: 10}, {name: 'club_Q', value: 10}, {name: 'club_K', value: 10}, {name: 'club_A', value: 11}],
    [{name: 'spade_2', value: 2}, {name: 'spade_3', value: 3}, {name: 'spade_4', value: 4}, {name: 'spade_5', value: 5}, {name: 'spade_6', value: 6}, {name: 'spade_7', value: 7}, {name: 'spade_8', value: 8}, {name: 'spade_9', value: 9}, {name: 'spade_10', value: 10}, {name: 'spade_J', value: 10}, {name: 'spade_Q', value: 10}, {name: 'spade_K', value: 10}, {name: 'spade_A', value: 11}]
];
// const cards = [
//     [{name: 'hearts_10', value: 10}, {name: 'hearts_J', value: 10}, {name: 'hearts_Q', value: 10}, {name: 'hearts_K', value: 10}, {name: 'hearts_A', value: 11}],
//     [{name: 'diamond_2', value: 2}, {name: 'diamond_3', value: 3}, {name: 'diamond_4', value: 4},],
//     [{name: 'club_2', value: 2}, {name: 'club_3', value: 3}],
//     [{name: 'spade_2', value: 2}, {name: 'spade_3', value: 3}, {name: 'spade_4', value: 4}]
// ];
// const cards = [
//     [{name: 'hearts_A', value: 11}],
//     [{name: 'diamond_A', value: 11}],
//     [{name: 'club_A', value: 11}],
//     [{name: 'spade_A', value: 11}]
// ];

const randomNumber = (length) => {
    return Math.floor(Math.random() * length);
};
const randomCard = () => {
    while(true) {
        let lengthSuites = cards.length;
        let numberSuite = randomNumber(lengthSuites);
        // console.log('cards[numberSuite].length', cards[numberSuite].length);
        let lengthItems = cards[numberSuite].length;
        let numberItem = randomNumber( lengthItems );
        // вырезает объект карты из массива масти
        let card = cards[ numberSuite ].splice( numberItem, 1);
        // проверяем наличие карт в масти, если их нет, то удаяем масть
        if( !cards[ numberSuite ].length ) {
            cards.splice(numberSuite, 1);
        }
        if(card) {
            return card;
        }
    }
};
const namesCards = (arr) => arr.map(item => item.name);

const sumCards = (arr) => {
    const tempSumCards = (arr) => {
        const arrValue = arr.map(item => item.value);
        return arrValue.reduce( (sum, current) => sum + current, 0);
    };

    // проверяем сумму, если она больше 21, то присваиваем тузу значение 1
    if(tempSumCards(arr) > 21) {
        const ace = arr.find(
            // ищем первый туз, у которого value 11
            item => { if( (item.name === 'hearts_A' || item.name === 'diamond_A' || item.name === 'club_A' || item.name === 'spade_A') && (item.value === 11) ) {
                    return true;
                }
            });
        // если туз, у которго value равно 11, найден, то заменяем его значение на 1
        if(ace) {
            arr.find(item => {
                if(item.name === ace.name) {
                    item.value = 1;
                };
            });

        }
    };
    return tempSumCards(arr);
};

console.log('===> Новая игра <==== Управление игрой: new - начать новую игру; more - еще карту; pass - пас; res - вывод результатов из лога.');

let gameOver = false;
let initGame = true;
let dilerCards = [];
let hideDilerCards = [];
let myCards = [];
let countGame = 1;
let countStep = 1;

rl.on('line', (cmd) => {
    if(cmd === 'new' && initGame) {
        for(let i = 0; i < 2; i++) {
            myCards.push( randomCard()[0] );
            dilerCards.push( randomCard()[0] );
        }
        // перемещаем вторую карту дилера в переменную hideDilerCards
        hideDilerCards = dilerCards.splice(1, 1);
    //    --- start --- запись в лог розданных карт
        fs.open('result.txt', 'a+', 777, (err, fd) => {
            const data = `--- Игра №${countGame} ---${beginNewLine}${countStep} Шаг. My cards: ${namesCards(myCards).join(', ')} Сумма: ${sumCards(myCards)}  <=|=> Сумма: ${sumCards(dilerCards)} ${namesCards(dilerCards).join(', ')}, XXX :Dilers cards${beginNewLine}`;
            fs.write(fd, data, (err) => {
                if(err) {
                    console.log('Ошибка при записи первой раздачи!')
                }
                fs.close(fd, () => {
                    gameOver = false;
                    countStep++;
                    initGame = false;
                    console.log(`${data}`);
                });
            });
        } )
    //    --- end ---- запись в лог розданных карт
    } else if(cmd === 'more' && !gameOver) {
        // получить еще карту
        myCards.push( randomCard()[0] );

        //    --- start --- запись в лог розданных карт
        fs.open('result.txt', 'a+', 777, (err, fd) => {
            const data = `${countStep} Шаг. My cards: ${namesCards(myCards).join(', ')} Сумма: ${sumCards(myCards)}  <=|=> Сумма: ${sumCards(dilerCards)} ${namesCards(dilerCards).join(', ')}, XXX :Dilers cards${beginNewLine}`;
            fs.write(fd, data, (err) => {
                if(err) {
                    console.log('Ошибка при записи первой раздачи!')
                }
                fs.close(fd, () => {
                    countStep++;
                    console.log(`${data}`);
                    if( sumCards(myCards) > 21) {
                        console.log('Ты проиграл, выиграл дилер!!!');

                        fs.open('result.txt', 'a+', 777, (err, fd) => {
                            const data = `Ты проиграл, выиграл дилер!!!${beginNewLine}`;
                            fs.write(fd, data, (err) => {
                                if(err) {
                                    console.log('Ошибка при записи первой раздачи!')
                                }
                                fs.close(fd, () => {
                                    gameOver = true;
                                    initGame = true;
                                    dilerCards = [];
                                    hideDilerCards = [];
                                    myCards = [];
                                    countGame++;
                                    countStep = 1;
                                });
                            });
                        } )

                    }
                });
            });
        } )
        //    --- end ---- запись в лог розданных карт
    } else if(cmd === 'more' && gameOver) {
        console.log('Начни новую игру, набрав \'new\', а лучше иди спать)))')
    } else if(cmd === 'pass' && !gameOver) {
        let dilerNotPass = true;
        dilerCards = dilerCards.concat( hideDilerCards );

        fs.open('result.txt', 'a+', 777, (err, fd) => {
            console.log('=======================');
            const data = `${countStep} Шаг. My cards: ${namesCards(myCards).join(', ')} Сумма: ${sumCards(myCards)}  <=|=> Сумма: ${sumCards(dilerCards)} ${namesCards(dilerCards).join(', ')} :Dilers cards${beginNewLine}`;
            fs.write(fd, data, (err) => {
                if(err) {
                    console.log('Ошибка при записи первой раздачи!')
                }
                fs.close(fd, () => {
                    countStep++;
                });
            });
        } );

        while(dilerNotPass) {

            if( sumCards(dilerCards) >= 17 || sumCards(dilerCards) > sumCards(myCards) ) {
                dilerNotPass = false;

                // ---------
                fs.open('result.txt', 'a+', 777, (err, fd) => {
                    const data = `${countStep} Шаг. My cards: ${namesCards(myCards).join(', ')} Сумма: ${sumCards(myCards)}  <=|=> Сумма: ${sumCards(dilerCards)} ${namesCards(dilerCards).join(', ')} :Dilers cards${beginNewLine}`;
                    fs.write(fd, data, (err) => {
                        if(err) {
                            console.log('Ошибка при записи первой раздачи!')
                        }
                        fs.close(fd, () => {
                            countStep++;
                            console.log(`${data}`);

                            if( sumCards(dilerCards) > 21 || ( sumCards(dilerCards) < sumCards(myCards) ) ) {
                                console.log('Дилер проиграл, выиграл ты!!!');

                                fs.open('result.txt', 'a+', 777, (err, fd) => {
                                    const data = `Дилер проиграл, выиграл ты!!!${beginNewLine}`;
                                    fs.write(fd, data, (err) => {
                                        if(err) {
                                            console.log('Ошибка при записи первой раздачи!')
                                        }
                                        fs.close(fd, () => {
                                            dilerNotPass = false;
                                            gameOver = true;
                                            initGame = true;
                                            dilerCards = [];
                                            hideDilerCards = [];
                                            myCards = [];
                                            countGame++;
                                            countStep = 1;
                                        });
                                    });
                                } )
                            } else if( sumCards(dilerCards) >= sumCards(myCards) ) {
                                console.log('Дилер выиграл, ты проиграл!!!');

                                fs.open('result.txt', 'a+', 777, (err, fd) => {
                                    const data = `Дилер выиграл, ты проиграл!!!${beginNewLine}`;
                                    fs.write(fd, data, (err) => {
                                        if(err) {
                                            console.log('Ошибка при записи первой раздачи!')
                                        }
                                        fs.close(fd, () => {
                                            dilerNotPass = false;
                                            gameOver = true;
                                            initGame = true;
                                            dilerCards = [];
                                            hideDilerCards = [];
                                            myCards = [];
                                            countGame++;
                                            countStep = 1;
                                        });
                                    });
                                } )
                            }
                            // ==================
                        });
                    });
                } );
                // ---------
                break;
            }

            dilerCards.push( randomCard()[0] );
        }
    } else if(cmd === 'res') {
        // fs.open('result.txt', 'a+', 777, (err, fd) => {
        //
        // })
        fs.readFile('result.txt', (err, data) => {
            console.log(`${data}`);
            console.log(`${myCards}`);
        })
    }
});