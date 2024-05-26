function fun() {
    let modal = document.getElementById('modal');
    modal.style.display = 'flex';
    let audio = document.getElementById('audio');
    audio.play();

    level = 0;
    gameStartClick();
}

function generatePath(map, iHead, jHead) {
    
    let checkSideResult = checkSide(map, iHead, jHead);

    map[iHead][jHead] = 3;

    while (checkSideResult['top'] === true
            || checkSideResult['right']  === true
            || checkSideResult['bottom'] === true
            || checkSideResult['left'] === true) {

        let nextStep = roulette(map,iHead,jHead);

        switch (nextStep) {
            case 'top' :
                //right
                if (map[iHead][jHead+1] === 0) {
                    map[iHead][jHead+1] = 2;
                }
                //bottom
                if (map[iHead+1][jHead] === 0) {
                    map[iHead+1][jHead] = 2;
                }
                //left
                if (map[iHead][jHead-1] === 0) {
                    map[iHead][jHead-1] = 2;
                }
                
                map[iHead-1][jHead] = 1;
                iHead = iHead - 1;
                jHead = jHead;

                break;
            case 'right' :
                //top
                if (map[iHead-1][jHead] === 0) {
                    map[iHead-1][jHead] = 2;
                }
                //bottom
                if (map[iHead+1][jHead] === 0) {
                    map[iHead+1][jHead] = 2;
                }
                //left
                if (map[iHead][jHead-1] === 0) {
                    map[iHead][jHead-1] = 2;
                }

                map[iHead][jHead+1] = 1;
                iHead = iHead;
                jHead = jHead + 1;
                break;
            case 'bottom' :
                //top
                if (map[iHead-1][jHead] === 0) {
                    map[iHead-1][jHead] = 2;
                }
                //right
                if (map[iHead][jHead+1] === 0) {
                    map[iHead][jHead+1] = 2;
                }
                //left
                if (map[iHead][jHead-1] === 0) {
                    map[iHead][jHead-1] = 2;
                }

                map[iHead+1][jHead] = 1;
                iHead = iHead + 1;
                jHead = jHead;
                break;
            case 'left' :
                //top
                if (map[iHead-1][jHead] === 0) {
                    map[iHead-1][jHead] = 2;
                }
                //right
                if (map[iHead][jHead+1] === 0) {
                    map[iHead][jHead+1] = 2;
                }
                //bottom
                if (map[iHead+1][jHead] === 0) {
                    map[iHead+1][jHead] = 2;
                }
                map[iHead][jHead-1] = 1;
                iHead = iHead;
                jHead = jHead - 1;
                break;
        }
        checkSideResult = checkSide(map,iHead,jHead);
    }
    
    map[iHead][jHead] = 3
}

function roulette(map,i,j) {
    let result = '';
    let rand = Math.floor(Math.random() * 4) + 1; //1,2,3,4
    let side = ['top', 'right', 'bottom', 'left'];
    let pathWays = checkSide(map,i,j); //{ top: false, right: true, bottom: true, left: false }
    
    let sideCounter = 0;
    let countPathAvail = 0;

    while (countPathAvail < rand) {
        result = side[sideCounter];
        if (pathWays[side[sideCounter]] === true) {
            sideCounter += 1;
            countPathAvail += 1;
        } else {
            sideCounter += 1;
        }

        if (sideCounter === 4) {
            sideCounter = 0;
        }
    }
    return result;
}

function checkSide(map, i,j) {
    let isTopOpen = (map[i-1][j] === 0 ? true : false)
    let isRightOpen = (map[i][j+1] === 0 ? true : false)
    let isBottomOpen = (map[i+1][j] === 0 ? true : false)
    let isLeftOpen = (map[i][j-1] === 0 ? true : false)
    
    return {
        top : isTopOpen,
        right : isRightOpen,
        bottom : isBottomOpen,
        left : isLeftOpen
    }
}

function createMap(dimension) {

    let result = [];
    
    for (let i = 0 ; i < dimension ; i++) {
        let resultPerRow = [];
        for (let j = 0 ; j < dimension ; j++) {

            let path = 0;
            if (i === 0 || j === 0 || i === dimension-1 || j === dimension-1) {
                path = 2;
            }
            resultPerRow.push(path);
        }
        result.push(resultPerRow);
    }
    return result;
}

function gameStartClick() {

    //start/end button
    let clickedElement = document.getSelection();

    if (clickedElement.anchorNode.getAttribute('class') === 'maze-head') {
        clickedElement.anchorNode.style.backgroundColor = 'white';
        clickedElement.anchorNode.removeEventListener('click', gameStartClick);
        //gamestart toggle
        isGameStart = !isGameStart;

        // wall hover toggle
        let walls = document.getElementsByClassName('maze-wall');
        if (isGameStart) {
            for (let wall in walls) {
                if (typeof walls[wall] === 'object') {
                    walls[wall].addEventListener('mouseover', fun);
                }
            }
        } else {
            for (let wall in walls) {
                if (typeof walls[wall] === 'object') {
                    walls[wall].removeEventListener('mouseover', fun);
                }
            }

            if (level === 15) { //max lv 15
                level = 0;
            }
        }

        if (isGameStart === false) {
            prepareGame();
        }
    }
}

function prepareGame() {
    //0 undefined
    //1 path
    //2 wall
    //3 head/end

    //set level
    level += 1;
    let levelElement = document.getElementById('level');
    levelElement.innerText = `Level : ${level}`;

    let blockCount = Math.ceil(level/10) * 10;
    let blockSize = 80 - ((level) * 5);

    let map = createMap(blockCount);
    let areaSize = blockCount * blockSize;
    let head = [1 , 1];
    // console.log(checkSide(map,1,2));
    // console.log(roulette(map,1,2));
    generatePath(map,head[0],head[1]);

    //set area width & height
    let areaElement = document.getElementById('area');
    if (areaSize > 100) {
        areaElement.style.width = `${areaSize}px`;
        areaElement.style.height = `${areaSize}px`;
    } else {
        areaElement.style.width = `200px`;
        areaElement.style.height = `200px`;
    }

    let mazeDesignElement = document.getElementById('maze-design');
    mazeDesignElement.innerHTML = '';
    mazeDesignElement.style.width = `${areaSize}px`;

    for (let i = 0 ; i < map.length ; i++) {
        for (let j = 0 ; j < map[i].length ; j++) {

            let mazeElement = document.createElement('div');
            if (map[i][j] === 3) {
                //cek dulu apakah maze-head sudah ada?
                mazeElement.setAttribute('class','maze-head');
                mazeElement.style.cssText = `
                    width : ${blockSize}px;
                    height : ${blockSize}px;
                    background-color : red;
                `;
                mazeElement.addEventListener('click', gameStartClick);
                
            } else if (map[i][j] === 1) {
                mazeElement.setAttribute('class','maze-path');
                mazeElement.style.cssText = `
                    width : ${blockSize}px;
                    height : ${blockSize}px;
                    background-color : white;
                `;
            } else {
                mazeElement.setAttribute('class','maze-wall');

                //style
                mazeElement.style.cssText = `
                    width : ${blockSize}px;
                    height : ${blockSize}px;
                `;
                if (i === 0 || j === 0 || i === map.length-1 || j === map.length-1) {
                    mazeElement.style.cssText = mazeElement.style.cssText + `border-radius : 20px;`;
                } else {
                    mazeElement.style.cssText = mazeElement.style.cssText + `background-color : #BFD8AF;`;
                }
            }
            mazeDesignElement.appendChild(mazeElement);

        }
    }

}

//1 - 100
let level = 0;

let closeBtn = document.getElementsByClassName('close')[0];
closeBtn.onclick = function() {
    modal.style.display = "none";
    let audio = document.getElementById('audio');
    audio.load();
}

prepareGame();
let isGameStart = false;

//bug
//ketika ada maze-path bersebrangan, mouse bisa lompat tanpa kena hover

//enhance
//sistem poin & waktu